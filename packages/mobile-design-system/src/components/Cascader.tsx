import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colorThemes, componentTokens, typographyTokens } from '../designTokens';
import { ChevronRightIcon, CloseMIcon, RadioLineCheckIcon } from '../icons';

/** Figma `theme` 轴：`step` 为垂直圆点步骤条，`tab` 为顶部选项卡。 */
export type CascaderTheme = 'step' | 'tab';

export type CascaderOptionValue = string | number;

export type CascaderOption<Value extends CascaderOptionValue = CascaderOptionValue> = {
  id: string;
  label: string;
  value: Value;
};

export type CascaderStep = {
  id: string;
  /**
   * 该层级的显示文案。已完成层级显示已选值，当前层级显示待选提示
   * （Figma 示例为 `Please select`）。
   */
  label: string;
  /** 回到该层级。当前层级（数组最后一项）通常不需要该回调。 */
  onPress?: () => void;
};

/** Figma `step` 轴只定义 1–4 层，用元组联合在类型层排除 0 层与 5 层以上。 */
export type CascaderSteps =
  | readonly [CascaderStep]
  | readonly [CascaderStep, CascaderStep]
  | readonly [CascaderStep, CascaderStep, CascaderStep]
  | readonly [CascaderStep, CascaderStep, CascaderStep, CascaderStep];

/**
 * close-M 位于 Title 行内部，Figma 的「无标题级联选择器」是把整个 Title 层隐藏，
 * 因此关闭入口必须与标题同时存在。
 */
type CascaderTitleProps =
  | { closeAccessibilityLabel?: string; onClose?: () => void; title: string }
  | { closeAccessibilityLabel?: never; onClose?: never; title?: never };

export type CascaderProps<Value extends CascaderOptionValue = CascaderOptionValue> =
  CascaderTitleProps & {
    /** 无标题时面板没有可读名称，由宿主或此处提供。 */
    accessibilityLabel?: string;
    /** 当前层级的候选项。 */
    options: readonly CascaderOption<Value>[];
    /** 选中当前层级的某一项。层级推进与数据加载由调用方负责。 */
    onChange: (value: Value, option: CascaderOption<Value>) => void;
    /** Figma `subtitle=true` 的说明行；留空即 `subtitle=false`。 */
    subtitle?: string;
    steps: CascaderSteps;
    style?: StyleProp<ViewStyle>;
    testID?: string;
    theme?: CascaderTheme;
    /** 当前层级的受控选中值；组件自身不持久化业务值。 */
    value?: Value;
  };

/**
 * 统一 Cascader 级联选择器（Figma `24386:5246`，图层名 `Cascader 级联选择器`）。
 *
 * 覆盖 `theme=step|tab`、`step=1..4`、`subtitle`、`close-btn` 四个 variant 轴，
 * 以及 Figma Style 章节的「带标题 / 无标题」（通过是否传入 `title` 表达，
 * Figma 中对应隐藏整个 Title 层而非独立 variant 轴）。
 *
 * 组件只负责渲染「标题 + 层级指示 + 说明 + 当前层级候选项」。层级推进、
 * 下一层数据加载、最终提交由调用方受控；面板的遮罩、弹出动画、安全区与
 * 系统返回由外层 `BottomSheet` 宿主负责 —— Figma 当前节点未定义这些行为。
 */
export function Cascader<Value extends CascaderOptionValue = CascaderOptionValue>({
  accessibilityLabel,
  closeAccessibilityLabel = 'Close',
  onChange,
  onClose,
  options,
  steps,
  style,
  subtitle,
  testID,
  theme = 'step',
  title,
  value,
}: CascaderProps<Value>) {
  return (
    <View
      accessibilityLabel={title ?? accessibilityLabel}
      style={[styles.container, style]}
      testID={testID}
    >
      {title === undefined ? null : (
        <View style={styles.title}>
          <Text numberOfLines={1} style={styles.titleLabel}>
            {title}
          </Text>
          {onClose === undefined ? null : (
            <Pressable
              accessibilityLabel={closeAccessibilityLabel}
              accessibilityRole="button"
              hitSlop={closeHitSlop}
              onPress={onClose}
              style={styles.close}
            >
              <CloseMIcon
                color={colors.text.primary}
                height={tokens.title.closeIconSize}
                width={tokens.title.closeIconSize}
              />
            </Pressable>
          )}
        </View>
      )}

      {theme === 'step' ? (
        <StepIndicator hasTitle={title !== undefined} steps={steps} />
      ) : (
        <TabIndicator steps={steps} />
      )}

      {subtitle === undefined ? null : (
        <View style={styles.subtitle}>
          <Text style={styles.subtitleLabel}>{subtitle}</Text>
        </View>
      )}

      <ScrollView style={styles.optionList}>
        {options.map((option) => {
          const selected = value !== undefined && Object.is(option.value, value);

          return (
            <Pressable
              accessibilityLabel={option.label}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, selected }}
              key={option.id}
              onPress={() => onChange(option.value, option)}
              style={styles.optionRow}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={styles.optionIndicator}
              >
                {selected ? (
                  <RadioLineCheckIcon
                    color={colors.brand.default}
                    height={tokens.option.indicatorSize}
                    width={tokens.option.indicatorSize}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

/**
 * Figma `.master/vertical/dot`：已完成层级为品牌色描边圆点 + 向下连接线 +
 * `Body 14/22 Regular` 文案；当前层级为品牌色实心圆点 + `Body 14/22 Semibold`
 * 品牌色文案，且不渲染后续连接线。
 */
function StepIndicator({ hasTitle, steps }: { hasTitle: boolean; steps: CascaderSteps }) {
  return (
    <View
      style={[
        styles.steps,
        {
          paddingTop: hasTitle
            ? tokens.steps.paddingTopWithTitle
            : tokens.steps.paddingTopWithoutTitle,
        },
      ]}
    >
      {steps.map((step, index) => {
        const current = index === steps.length - 1;

        return (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.stepIconColumn}>
              <View style={styles.stepDotSlot}>
                <View style={[styles.stepDot, current ? styles.stepDotCurrent : styles.stepDotDone]} />
              </View>
              {current ? null : <View style={styles.stepConnector} />}
            </View>
            <Pressable
              accessibilityLabel={step.label}
              accessibilityRole="button"
              accessibilityState={{ disabled: step.onPress === undefined }}
              disabled={step.onPress === undefined}
              onPress={step.onPress}
              style={[styles.stepContent, current ? null : styles.stepContentDone]}
            >
              <Text
                style={[
                  styles.stepLabel,
                  current ? styles.stepLabelCurrent : styles.stepLabelDone,
                ]}
              >
                {step.label}
              </Text>
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <ChevronRightIcon
                  color={colors.text.primary}
                  height={tokens.steps.chevronSize}
                  width={tokens.steps.chevronSize}
                />
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Figma `Tabs 选项卡` / `item/normal-line`：已完成层级为 `Body 14/22 Regular`
 * 主文本色，当前层级为 `Body 14/22 Semibold` 品牌色并在底部居中渲染
 * `16×3` 指示条。
 *
 * Figma 的 `step=4` 变体在容器上使用 `justify-end`，即层级溢出时靠右收拢以保证
 * 当前层级可见；这里改用横向滚动表达同一意图，避免写死 `375` 的行宽。
 */
function TabIndicator({ steps }: { steps: CascaderSteps }) {
  return (
    <View style={styles.tabs}>
      <ScrollView
        contentContainerStyle={styles.tabsContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {steps.map((step, index) => {
          const current = index === steps.length - 1;

          return (
            <Pressable
              accessibilityLabel={step.label}
              accessibilityRole="tab"
              accessibilityState={{ disabled: step.onPress === undefined, selected: current }}
              disabled={step.onPress === undefined}
              key={step.id}
              onPress={step.onPress}
              style={styles.tabItem}
            >
              <Text
                numberOfLines={1}
                style={[styles.tabLabel, current ? styles.tabLabelCurrent : styles.tabLabelDone]}
              >
                {step.label}
              </Text>
              {current ? <View style={styles.tabTrack} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const colors = colorThemes.light;
const tokens = componentTokens.cascader;

/** `24×24` 图形小于 44 的推荐触控尺寸，用 hitSlop 扩展且不改变视觉布局。 */
const closeHitSlop = { bottom: 10, left: 10, right: 10, top: 10 };

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: tokens.panelHeight,
    overflow: 'hidden',
    borderTopLeftRadius: tokens.topRadius,
    borderTopRightRadius: tokens.topRadius,
    backgroundColor: colors.background.container,
  },
  title: {
    alignSelf: 'stretch',
    minHeight: tokens.title.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.title.gap,
    padding: tokens.title.padding,
  },
  titleLabel: {
    minWidth: 0,
    flex: 1,
    color: colors.text.primary,
    textAlign: 'center',
    ...typographyTokens.title18Semibold,
  },
  close: {
    position: 'absolute',
    top: tokens.title.closeTop,
    right: tokens.title.closeRight,
    height: tokens.title.closeIconSize,
    width: tokens.title.closeIconSize,
  },
  steps: {
    alignSelf: 'stretch',
    paddingHorizontal: tokens.steps.paddingHorizontal,
    paddingBottom: tokens.steps.paddingBottom,
    borderBottomColor: colors.border.componentStroke,
    borderBottomWidth: tokens.dividerWidth,
  },
  stepRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.steps.gap,
  },
  stepIconColumn: {
    alignSelf: 'stretch',
    flexShrink: 0,
    alignItems: 'center',
  },
  stepDotSlot: {
    paddingVertical: tokens.steps.dotPaddingVertical,
  },
  stepDot: {
    height: tokens.steps.dotSize,
    width: tokens.steps.dotSize,
    borderRadius: tokens.steps.dotSize / 2,
  },
  /** 已完成层级：品牌色描边空心圆点。 */
  stepDotDone: {
    borderColor: colors.brand.default,
    borderWidth: tokens.steps.dotBorderWidth,
  },
  /** 当前层级：品牌色实心圆点。 */
  stepDotCurrent: {
    backgroundColor: colors.brand.default,
  },
  stepConnector: {
    flex: 1,
    width: tokens.steps.connectorWidth,
    backgroundColor: colors.brand.default,
  },
  stepContent: {
    minWidth: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.steps.titleGap,
  },
  stepContentDone: {
    paddingBottom: tokens.steps.completedPaddingBottom,
  },
  stepLabel: {
    minWidth: 0,
    flex: 1,
  },
  stepLabelDone: {
    color: colors.text.primary,
    ...typographyTokens.body14Regular,
  },
  stepLabelCurrent: {
    color: colors.brand.default,
    ...typographyTokens.body14Semibold,
  },
  tabs: {
    alignSelf: 'stretch',
    height: tokens.tabs.height,
    borderBottomColor: colors.border.componentStroke,
    borderBottomWidth: tokens.dividerWidth,
    backgroundColor: colors.background.container,
  },
  tabsContent: {
    alignItems: 'flex-start',
  },
  tabItem: {
    height: tokens.tabs.height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.tabs.itemPaddingHorizontal,
  },
  tabLabel: {
    textAlign: 'center',
  },
  tabLabelDone: {
    color: colors.text.primary,
    ...typographyTokens.body14Regular,
  },
  tabLabelCurrent: {
    color: colors.brand.default,
    ...typographyTokens.body14Semibold,
  },
  tabTrack: {
    position: 'absolute',
    bottom: 0,
    height: tokens.tabs.trackHeight,
    width: tokens.tabs.trackWidth,
    borderRadius: tokens.tabs.trackRadius,
    backgroundColor: colors.brand.default,
  },
  subtitle: {
    alignSelf: 'stretch',
    minHeight: tokens.subtitle.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.subtitle.paddingHorizontal,
    paddingTop: tokens.subtitle.paddingTop,
    paddingBottom: tokens.subtitle.paddingBottom,
  },
  subtitleLabel: {
    minWidth: 0,
    flex: 1,
    color: colors.text.placeholder,
    ...typographyTokens.body14Regular,
  },
  optionList: {
    alignSelf: 'stretch',
    flex: 1,
  },
  optionRow: {
    alignSelf: 'stretch',
    minHeight: tokens.option.minHeight,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.option.gap,
    paddingLeft: tokens.option.paddingLeft,
    paddingRight: tokens.option.paddingRight,
    backgroundColor: colors.background.container,
  },
  optionContent: {
    minWidth: 0,
    flex: 1,
    paddingVertical: tokens.option.paddingVertical,
  },
  optionLabel: {
    color: colors.text.primary,
    ...typographyTokens.title16Regular,
  },
  optionIndicator: {
    flexShrink: 0,
    height: tokens.option.indicatorSize,
    width: tokens.option.indicatorSize,
    marginTop: tokens.option.paddingVertical,
  },
});
