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

import { colorThemes, componentTokens, radiusTokens, typographyTokens } from '../designTokens';
import { Link } from './Link';

export type PickerOptionValue = string | number;

/**
 * `empty` 选项只作为多列数据的视觉对齐占位：不可选、不朗读，
 * 且在类型上无法同时成为选中项（没有 value）。
 */
export type PickerOption<Value extends PickerOptionValue = PickerOptionValue> =
  | { empty?: false; id: string; label: string; value: Value }
  | { empty: true; id: string; label?: never; value?: never };

export type PickerColumn<Value extends PickerOptionValue = PickerOptionValue> = {
  /** 每列需暴露为独立的可调节控件，必须提供可读名称。 */
  accessibilityLabel: string;
  id: string;
  options: readonly PickerOption<Value>[];
};

/** Figma 只定义 1–4 列，用元组联合在类型层排除 0 列与 5 列以上。 */
export type PickerColumns<Value extends PickerOptionValue = PickerOptionValue> =
  | readonly [PickerColumn<Value>]
  | readonly [PickerColumn<Value>, PickerColumn<Value>]
  | readonly [PickerColumn<Value>, PickerColumn<Value>, PickerColumn<Value>]
  | readonly [
      PickerColumn<Value>,
      PickerColumn<Value>,
      PickerColumn<Value>,
      PickerColumn<Value>,
    ];

/** 受控选中值，按稳定的 column id 索引，不依赖数组下标。 */
export type PickerValue<Value extends PickerOptionValue = PickerOptionValue> = Readonly<
  Record<string, Value>
>;

type PickerTitleProps =
  | { accessibilityLabel: string; title?: false; titleText?: never }
  | { accessibilityLabel?: string; title: true; titleText: string };

export type PickerProps<Value extends PickerOptionValue = PickerOptionValue> =
  PickerTitleProps & {
    cancelText?: string;
    columns: PickerColumns<Value>;
    confirmText?: string;
    onCancel: () => void;
    /** 滚动吸附完成后回调，父级负责保存临时选择。 */
    onChange: (next: PickerValue<Value>, changed: { columnId: string; value: Value }) => void;
    /** Confirm 提交当前受控选择，组件自身不持久化业务值。 */
    onConfirm: (values: PickerValue<Value>) => void;
    testID?: string;
    value: PickerValue<Value>;
  };

/**
 * 统一 Picker 面板（Figma `24386:5250`）。
 *
 * 覆盖 1–4 列 × 有/无标题共 8 个变体、option 的 normal / selected / empty 三态、
 * 跨列共用 indicator 与上下渐隐 mask。
 *
 * 面板本体不包含遮罩、弹出动画、安全区与系统返回处理 —— Figma 当前节点未定义，
 * 应由外层 modal / bottom sheet 宿主负责。
 */
export function Picker<Value extends PickerOptionValue = PickerOptionValue>({
  accessibilityLabel,
  cancelText = 'Cancel',
  columns,
  confirmText = 'Confirm',
  onCancel,
  onChange,
  onConfirm,
  testID,
  title = false,
  titleText,
  value,
}: PickerProps<Value>) {
  const fourColumns = columns.length === tokens.maxColumnCount;
  const headerHeight = title
    ? tokens.headerHeight
    : fourColumns
      ? tokens.headerHeightWithoutTitleFourColumns
      : tokens.headerHeight;

  const handleSelect = useCallback(
    (columnId: string, nextValue: Value) => {
      onChange({ ...value, [columnId]: nextValue }, { columnId, value: nextValue });
    },
    [onChange, value],
  );

  return (
    <View
      accessibilityLabel={title ? titleText : accessibilityLabel}
      style={styles.container}
      testID={testID}
    >
      <View style={[styles.header, { height: headerHeight }]}>
        {title ? (
          <Text accessibilityRole="header" numberOfLines={1} style={styles.title}>
            {titleText}
          </Text>
        ) : null}
        <View style={styles.headerStart}>
          <Link accessibilityRole="button" onPress={onCancel} theme="default">
            {cancelText}
          </Link>
        </View>
        <View style={styles.headerEnd}>
          <Link accessibilityRole="button" onPress={() => onConfirm(value)} theme="primary">
            {confirmText}
          </Link>
        </View>
      </View>

      <View style={styles.content}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={[styles.indicator, { top: tokens.indicatorTop - headerHeight }]}
        />
        {columns.map((column) => (
          <PickerWheel
            column={column}
            key={column.id}
            onSelect={handleSelect}
            selectedIndex={selectedIndexOf(column, value[column.id])}
          />
        ))}
        <FadeMask placement="top" />
        <FadeMask placement="bottom" />
      </View>
    </View>
  );
}

type PickerWheelProps<Value extends PickerOptionValue> = {
  column: PickerColumn<Value>;
  onSelect: (columnId: string, value: Value) => void;
  selectedIndex: number;
};

function PickerWheel<Value extends PickerOptionValue>({
  column,
  onSelect,
  selectedIndex,
}: PickerWheelProps<Value>) {
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
      style={styles.column}
    >
      <ScrollView
        contentContainerStyle={styles.wheelContent}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollSettled}
        onScrollEndDrag={handleScrollSettled}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={tokens.snapInterval}
        snapToAlignment="start"
      >
        {column.options.map((option, index) => (
          <PickerOptionRow
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

type PickerOptionRowProps<Value extends PickerOptionValue> = {
  onPress: () => void;
  option: PickerOption<Value>;
  selected: boolean;
};

function PickerOptionRow<Value extends PickerOptionValue>({
  onPress,
  option,
  selected,
}: PickerOptionRowProps<Value>) {
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
function FadeMask({ placement }: { placement: 'bottom' | 'top' }) {
  const gradientId = `picker-fade-${placement}-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const top = placement === 'top';

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={top ? styles.maskTop : styles.maskBottom}
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

function selectedIndexOf<Value extends PickerOptionValue>(
  column: PickerColumn<Value>,
  current: Value | undefined,
) {
  if (current === undefined) return -1;
  return column.options.findIndex((option) => !option.empty && Object.is(option.value, current));
}

/**
 * empty 选项不可选，因此吸附到 empty 位置时回落到最近的可选项。
 * `bias` 决定同距离时的优先方向，用于辅助技术的 increment / decrement。
 */
function nearestSelectableIndex<Value extends PickerOptionValue>(
  options: readonly PickerOption<Value>[],
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
/** 让首/末项也能落到 indicator 中心所需的上下留白。 */
const wheelPadding = (tokens.contentHeight - tokens.snapInterval) / 2;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingBottom: tokens.paddingBottom,
    borderTopLeftRadius: tokens.topRadius,
    borderTopRightRadius: tokens.topRadius,
    backgroundColor: colors.background.container,
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
    height: tokens.contentHeight,
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
    height: tokens.contentHeight,
    overflow: 'hidden',
  },
  wheelContent: {
    paddingVertical: wheelPadding,
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
    height: tokens.maskHeight,
  },
  maskBottom: {
    position: 'absolute',
    bottom: 0,
    left: tokens.contentPaddingHorizontal,
    right: tokens.contentPaddingHorizontal,
    height: tokens.maskHeight,
  },
});
