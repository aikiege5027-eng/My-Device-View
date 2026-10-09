import React, { useCallback, useEffect, useId, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colorThemes, componentTokens, radiusTokens, typographyTokens } from '../../designTokens';
import { Link } from '../Link';

/**
 * Picker（Figma `24386:5250`）与 DateTimePicker（Figma `24386:5248`）共用的滚轮面板。
 *
 * 两个节点的面板几何完全一致：顶部圆角 `12`、header 上下内边距 `16`、
 * 内容区高 `184`、option 高 `24` + 间距 `16`（吸附步距 `40`）、
 * indicator 固定在面板绝对 `y=130`、上下 `48` 渐隐 mask、底部内边距 `16`。
 *
 * 该模块不对外导出，只负责这套几何与滚动吸附；列数约束、mode 推导与
 * 业务取值由各自的公开组件负责。
 */

export type WheelOptionValue = string | number;

/**
 * `empty` 选项只作为多列数据的视觉对齐占位：不可选、不朗读，
 * 且在类型上无法同时成为选中项（没有 value）。
 */
export type WheelOption<Value extends WheelOptionValue = WheelOptionValue> =
  | { empty?: false; id: string; label: string; value: Value }
  | { empty: true; id: string; label?: never; value?: never };

export type WheelColumn<Value extends WheelOptionValue = WheelOptionValue> = {
  /** 每列需暴露为独立的可调节控件，必须提供可读名称。 */
  accessibilityLabel: string;
  id: string;
  options: readonly WheelOption<Value>[];
};

/** 受控选中值，按稳定的 column id 索引，不依赖数组下标。 */
export type WheelValue<Value extends WheelOptionValue = WheelOptionValue> = Readonly<
  Record<string, Value>
>;

export type WheelPanelProps<Value extends WheelOptionValue = WheelOptionValue> = {
  accessibilityLabel?: string;
  /** 仅在 `showActions` 为真时使用。 */
  cancelText?: string;
  columns: readonly WheelColumn<Value>[];
  confirmText?: string;
  /**
   * 滚轮可视高度。Picker / DateTimePicker 为 `184`（5 个 option），
   * Calendar 内嵌的 `timePicker` 为 `104`（3 个 option）。
   */
  contentHeight?: number;
  /**
   * header 高度。Picker 的 `4 columns + title=false` 变体为 `56`，
   * 其余 Picker 变体、全部 DateTimePicker 变体与 Calendar 的 `timePicker` 为 `58`。
   */
  headerHeight: number;
  /**
   * indicator 在面板内的绝对 y。Picker / DateTimePicker 固定 `130`，
   * Calendar 的 `timePicker` 为 `90`。
   */
  indicatorTop?: number;
  /** 上下渐隐 mask 高度，等于 `(contentHeight - 40) / 2`。 */
  maskHeight?: number;
  onCancel?: () => void;
  onChange: (columnId: string, value: Value) => void;
  onConfirm?: () => void;
  /** 面板顶部圆角。内嵌在其他面板中（如 Calendar 的 `timePicker`）时应关闭。 */
  roundedTop?: boolean;
  /**
   * 是否渲染 header 两侧的 Cancel / Confirm。Calendar 的 `timePicker` 只有
   * 居中标题，提交由 Calendar 底部的 Button 负责。
   */
  showActions?: boolean;
  testID?: string;
  titleText?: string;
  value: WheelValue<Value>;
};

export function WheelPanel<Value extends WheelOptionValue = WheelOptionValue>({
  accessibilityLabel,
  cancelText,
  columns,
  confirmText,
  contentHeight = tokens.contentHeight,
  headerHeight,
  indicatorTop = tokens.indicatorTop,
  maskHeight,
  onCancel,
  onChange,
  onConfirm,
  roundedTop = true,
  showActions = true,
  testID,
  titleText,
  value,
}: WheelPanelProps<Value>) {
  /** Figma 的 mask 高度始终等于首/末项进入中央位置所需的留白。 */
  const resolvedMaskHeight = maskHeight ?? (contentHeight - tokens.snapInterval) / 2;

  return (
    <View
      accessibilityLabel={titleText ?? accessibilityLabel}
      style={[styles.container, roundedTop && styles.roundedTop]}
      testID={testID}
    >
      <View style={[styles.header, { height: headerHeight }]}>
        {titleText === undefined ? null : (
          <Text accessibilityRole="header" numberOfLines={1} style={styles.title}>
            {titleText}
          </Text>
        )}
        {showActions ? (
          <>
            <View style={styles.headerStart}>
              <Link accessibilityRole="button" onPress={onCancel} theme="default">
                {cancelText ?? ''}
              </Link>
            </View>
            <View style={styles.headerEnd}>
              <Link accessibilityRole="button" onPress={onConfirm} theme="primary">
                {confirmText ?? ''}
              </Link>
            </View>
          </>
        ) : null}
      </View>

      <View style={[styles.content, { height: contentHeight }]}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={[styles.indicator, { top: indicatorTop - headerHeight }]}
        />
        {columns.map((column) => (
          <Wheel
            column={column}
            contentHeight={contentHeight}
            key={column.id}
            onSelect={onChange}
            selectedIndex={selectedIndexOf(column, value[column.id])}
          />
        ))}
        <FadeMask height={resolvedMaskHeight} placement="top" />
        <FadeMask height={resolvedMaskHeight} placement="bottom" />
      </View>
    </View>
  );
}

type WheelProps<Value extends WheelOptionValue> = {
  column: WheelColumn<Value>;
  contentHeight: number;
  onSelect: (columnId: string, value: Value) => void;
  selectedIndex: number;
};

function Wheel<Value extends WheelOptionValue>({
  column,
  contentHeight,
  onSelect,
  selectedIndex,
}: WheelProps<Value>) {
  const scrollRef = useRef<ScrollView>(null);
  const committedIndex = useRef(selectedIndex);
  const initialized = useRef(false);

  useEffect(() => {
    const firstRun = !initialized.current;
    initialized.current = true;

    if (!firstRun && (selectedIndex < 0 || selectedIndex === committedIndex.current)) return;

    committedIndex.current = selectedIndex;
    if (selectedIndex < 0) return;
    scrollRef.current?.scrollTo({ animated: false, y: selectedIndex * tokens.snapInterval });
  }, [selectedIndex]);

  const settle = useCallback(
    (offsetY: number) => {
      const { options } = column;
      const landed = clamp(Math.round(offsetY / tokens.snapInterval), 0, options.length - 1);
      const index = nearestSelectableIndex(options, landed);
      if (index < 0) return;

      if (index !== landed) {
        scrollRef.current?.scrollTo({ animated: true, y: index * tokens.snapInterval });
      }
      if (index === committedIndex.current) return;

      const option = options[index];
      if (!option || option.empty) return;

      committedIndex.current = index;
      onSelect(column.id, option.value);
    },
    [column, onSelect],
  );

  const handleScrollSettled = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    settle(event.nativeEvent.contentOffset.y);
  };

  const shiftBy = (delta: number) => {
    const { options } = column;
    const from = committedIndex.current < 0 ? 0 : committedIndex.current;
    const target = nearestSelectableIndex(
      options,
      clamp(from + delta, 0, options.length - 1),
      delta >= 0 ? 'forward' : 'backward',
    );
    if (target < 0 || target === committedIndex.current) return;

    const option = options[target];
    if (!option || option.empty) return;

    committedIndex.current = target;
    scrollRef.current?.scrollTo({ animated: true, y: target * tokens.snapInterval });
    onSelect(column.id, option.value);
  };

  const selectedOption = selectedIndex >= 0 ? column.options[selectedIndex] : undefined;

  return (
    <View
      accessible
      accessibilityActions={accessibilityActions}
      accessibilityLabel={column.accessibilityLabel}
      accessibilityRole="adjustable"
      accessibilityValue={{ text: selectedOption?.label ?? '' }}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') shiftBy(1);
        if (event.nativeEvent.actionName === 'decrement') shiftBy(-1);
      }}
      style={[styles.column, { height: contentHeight }]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingVertical: (contentHeight - tokens.snapInterval) / 2,
        }}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollSettled}
        onScrollEndDrag={handleScrollSettled}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={tokens.snapInterval}
        snapToAlignment="start"
      >
        {column.options.map((option, index) => (
          <WheelOptionRow
            key={option.id}
            onPress={() => {
              if (option.empty || index === committedIndex.current) return;
              committedIndex.current = index;
              scrollRef.current?.scrollTo({ animated: true, y: index * tokens.snapInterval });
              onSelect(column.id, option.value);
            }}
            option={option}
            selected={index === selectedIndex}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type WheelOptionRowProps<Value extends WheelOptionValue> = {
  onPress: () => void;
  option: WheelOption<Value>;
  selected: boolean;
};

function WheelOptionRow<Value extends WheelOptionValue>({
  onPress,
  option,
  selected,
}: WheelOptionRowProps<Value>) {
  if (option.empty) {
    return <View style={styles.optionRow} />;
  }

  return (
    <Pressable onPress={onPress} style={styles.optionRow}>
      <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        style={[styles.option, selected && styles.selectedOption]}
      >
        {option.label}
      </Text>
    </Pressable>
  );
}

/** 用容器背景色向透明过渡的渐隐层，仅作视觉收束，不拦截触摸与无障碍事件。 */
function FadeMask({ height, placement }: { height: number; placement: 'bottom' | 'top' }) {
  const gradientId = `wheel-fade-${placement}-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const top = placement === 'top';

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[top ? styles.maskTop : styles.maskBottom, { height }]}
    >
      <Svg height="100%" preserveAspectRatio="none" width="100%">
        <Defs>
          <LinearGradient id={gradientId} x1="0" x2="0" y1={top ? '0' : '1'} y2={top ? '1' : '0'}>
            <Stop offset="0" stopColor={colors.background.container} stopOpacity={1} />
            <Stop offset="1" stopColor={colors.background.container} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect fill={`url(#${gradientId})`} height="100%" width="100%" />
      </Svg>
    </View>
  );
}

function selectedIndexOf<Value extends WheelOptionValue>(
  column: WheelColumn<Value>,
  current: Value | undefined,
) {
  if (current === undefined) return -1;
  return column.options.findIndex((option) => !option.empty && Object.is(option.value, current));
}

/**
 * empty 选项不可选，因此吸附到 empty 位置时回落到最近的可选项。
 * `bias` 决定同距离时的优先方向，用于辅助技术的 increment / decrement。
 */
function nearestSelectableIndex<Value extends WheelOptionValue>(
  options: readonly WheelOption<Value>[],
  index: number,
  bias: 'backward' | 'forward' = 'forward',
) {
  const landed = options[index];
  if (!landed) return -1;
  if (!landed.empty) return index;

  for (let distance = 1; distance < options.length; distance += 1) {
    const forward = index + distance;
    const backward = index - distance;
    const candidates = bias === 'forward' ? [forward, backward] : [backward, forward];

    for (const candidate of candidates) {
      const option = options[candidate];
      if (option && !option.empty) return candidate;
    }
  }

  return -1;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const accessibilityActions = [
  { name: 'decrement' as const },
  { name: 'increment' as const },
];

const colors = colorThemes.light;
const tokens = componentTokens.picker;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingBottom: tokens.paddingBottom,
    backgroundColor: colors.background.container,
  },
  roundedTop: {
    borderTopLeftRadius: tokens.topRadius,
    borderTopRightRadius: tokens.topRadius,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.headerPaddingHorizontal,
    paddingVertical: tokens.headerPaddingVertical,
  },
  title: {
    color: colors.text.primary,
    textAlign: 'center',
    ...typographyTokens.title18Semibold,
  },
  headerStart: {
    position: 'absolute',
    top: '50%',
    left: tokens.headerPaddingHorizontal,
    transform: [{ translateY: -componentTokens.link.sizes.medium.minHeight / 2 }],
  },
  headerEnd: {
    position: 'absolute',
    top: '50%',
    right: tokens.headerPaddingHorizontal,
    transform: [{ translateY: -componentTokens.link.sizes.medium.minHeight / 2 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.contentPaddingHorizontal,
  },
  indicator: {
    position: 'absolute',
    left: tokens.contentPaddingHorizontal,
    right: tokens.contentPaddingHorizontal,
    height: tokens.indicatorHeight,
    borderRadius: radiusTokens.medium,
    backgroundColor: colors.background.component,
  },
  column: {
    minWidth: 0,
    flex: 1,
    overflow: 'hidden',
  },
  optionRow: {
    height: tokens.snapInterval,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.optionPaddingHorizontal,
  },
  option: {
    alignSelf: 'stretch',
    height: tokens.optionHeight,
    color: colors.text.secondary,
    textAlign: 'center',
    ...typographyTokens.title16Regular,
  },
  selectedOption: {
    color: colors.text.primary,
    ...typographyTokens.title16Semibold,
  },
  maskTop: {
    position: 'absolute',
    top: 0,
    left: tokens.contentPaddingHorizontal,
    right: tokens.contentPaddingHorizontal,
  },
  maskBottom: {
    position: 'absolute',
    bottom: 0,
    left: tokens.contentPaddingHorizontal,
    right: tokens.contentPaddingHorizontal,
  },
});
