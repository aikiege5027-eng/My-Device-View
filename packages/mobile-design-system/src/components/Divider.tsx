import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { colorThemes, componentTokens, typographyTokens } from '../designTokens';

export type DividerAlign = 'left' | 'center' | 'right';
export type DividerLayout = 'horizontal' | 'vertical';

export type DividerProps = {
  /**
   * 带文字分割线的可访问名称。缺省时直接使用 `children`。
   * 纯线条分割线为装饰元素，不读取该值。
   */
  accessibilityLabel?: string;
  /**
   * 文字在分割线中的位置，仅在 `layout=horizontal` 且传入 `children` 时生效。
   * 对应 Figma `align=left|center|right`；`align=none` 即不传 `children` 的形态。
   */
  align?: DividerAlign;
  /**
   * 分割线文字。Figma 只定义了 `layout=horizontal` 的带文字变体，
   * 因此 `layout=vertical` 时该值被忽略，不做臆造实现。
   */
  children?: string;
  /** Figma `dashed` 轴。`true` 使用 `2 2` 虚线样式。 */
  dashed?: boolean;
  /** Figma `layout` 轴。 */
  layout?: DividerLayout;
  /**
   * 垂直分割线线长，仅在 `layout=vertical` 时生效。
   * 默认取 Figma 垂直分割线用例基准 `14`。
   */
  length?: number;
  testID?: string;
};

/**
 * 统一分割线组件。
 *
 * 覆盖 Figma `Divider 分割线` 组件集的全部 variant 组合：
 * `layout=horizontal|vertical` × `dashed=false|true`，
 * 以及 `layout=horizontal` 下 `content=true` 时的 `align=left|center|right`。
 *
 * 线条本身是装饰元素，对辅助技术隐藏；带文字形态保留文字可读性。
 * Figma 未定义 `layout=vertical` 的带文字变体、按压/hover 态与 Dark mode 映射，
 * 因此此处不做补值。
 */
export function Divider({
  accessibilityLabel,
  align = 'center',
  children,
  dashed = false,
  layout = 'horizontal',
  length = tokens.verticalLength,
  testID,
}: DividerProps) {
  if (layout === 'vertical') {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.verticalWrap}
        testID={testID}
      >
        <VerticalLine dashed={dashed} length={length} />
      </View>
    );
  }

  const label = children?.trim() ?? '';

  if (label.length === 0) {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.horizontalWrap}
        testID={testID}
      >
        <HorizontalLine dashed={dashed} sizing="full" />
      </View>
    );
  }

  return (
    <View style={styles.contentRow} testID={testID}>
      <HorizontalLine dashed={dashed} sizing={align === 'left' ? 'short' : 'flex'} />
      <Text accessibilityLabel={accessibilityLabel ?? label} style={styles.label}>
        {label}
      </Text>
      <HorizontalLine dashed={dashed} sizing={align === 'right' ? 'short' : 'flex'} />
    </View>
  );
}

/**
 * 水平线段。`full` 撑满调用方宽度，`flex` 占据带文字行的剩余空间，
 * `short` 是 `align=left|right` 时靠边一侧的固定 `16` 线段。
 */
function HorizontalLine({
  dashed,
  sizing,
}: {
  dashed: boolean;
  sizing: 'full' | 'flex' | 'short';
}) {
  const sizingStyle = horizontalSizingStyles[sizing];

  if (!dashed) {
    return <View style={[sizingStyle, styles.solidHorizontal]} />;
  }

  // 虚线必须保持 Figma 的 0.5 线宽与 2/2 dash，React Native 的
  // `borderStyle: 'dashed'` 无法控制 dash 长度，因此改用 SVG 描边。
  // 不设置 viewBox，用户单位即 pt，`100%` 解析为已布局的画布宽度，
  // dash 长度不会被缩放。
  return (
    <Svg height={tokens.strokeWidth} style={[sizingStyle, styles.dashedHorizontal]}>
      <Line
        stroke={colors.border.componentStroke}
        strokeDasharray={dashPattern}
        strokeWidth={tokens.strokeWidth}
        x1={0}
        x2="100%"
        y1={lineCenter}
        y2={lineCenter}
      />
    </Svg>
  );
}

function VerticalLine({ dashed, length }: { dashed: boolean; length: number }) {
  if (!dashed) {
    return <View style={[styles.solidVertical, { height: length }]} />;
  }

  return (
    <Svg height={length} width={tokens.strokeWidth}>
      <Line
        stroke={colors.border.componentStroke}
        strokeDasharray={dashPattern}
        strokeWidth={tokens.strokeWidth}
        x1={lineCenter}
        x2={lineCenter}
        y1={0}
        y2={length}
      />
    </Svg>
  );
}

const colors = colorThemes.light;
const tokens = componentTokens.divider;
const contentTokens = tokens.content;

const dashPattern = [tokens.dashLength, tokens.dashGap];
const lineCenter = tokens.strokeWidth / 2;

const styles = StyleSheet.create({
  horizontalWrap: {
    width: '100%',
  },
  verticalWrap: {
    width: tokens.strokeWidth,
  },
  contentRow: {
    width: '100%',
    height: contentTokens.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: contentTokens.gap,
    overflow: 'hidden',
  },
  fullLine: {
    width: '100%',
  },
  /** Figma `flex-[1_0_0]`：只增长不收缩，文字过长时由 contentRow 裁切。 */
  flexLine: {
    minWidth: 0,
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 0,
  },
  shortLine: {
    width: contentTokens.shortSegmentLength,
  },
  solidHorizontal: {
    height: tokens.strokeWidth,
    backgroundColor: colors.border.componentStroke,
  },
  dashedHorizontal: {
    height: tokens.strokeWidth,
  },
  solidVertical: {
    width: tokens.strokeWidth,
    backgroundColor: colors.border.componentStroke,
  },
  label: {
    flexShrink: 0,
    color: colors.text.placeholder,
    textAlign: 'center',
    ...typographyTokens.footer12Regular,
  },
});

const horizontalSizingStyles = {
  full: styles.fullLine,
  flex: styles.flexLine,
  short: styles.shortLine,
} as const;
