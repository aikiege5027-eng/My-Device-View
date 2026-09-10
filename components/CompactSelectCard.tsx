import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colorThemes, componentTokens } from '@kone/mobile-design-system';

export type CompactSelectCardProps = {
  accessibilityHint?: string;
  accessibilityLabel: string;
  checked: boolean;
  children: ReactNode;
  onChange: (checked: boolean) => void;
  testID?: string;
};

/**
 * 紧凑版可勾选卡片，用于折叠面板内的设备列表。
 *
 * 设计系统 `Checkbox variant="card"` 的行高 `52` 与上下内边距 `6` 是它的基准值，
 * 本页面在折叠面板这一层需要更紧凑的 `40` / `4`。这属于页面层的定制，因此在 App 内
 * 单独实现，不给设计系统组件加密度轴。除行高与上下内边距外，描边、圆角、左上角勾选
 * 角标的几何与颜色全部沿用 `componentTokens.checkbox.card` 与主题 token。
 */
export function CompactSelectCard({
  accessibilityHint,
  accessibilityLabel,
  checked,
  children,
  onChange,
  testID,
}: CompactSelectCardProps) {
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={[styles.card, checked ? styles.cardSelected : undefined]}
      testID={testID}
    >
      {checked ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.indicatorSlot}
        >
          <CornerCheck />
        </View>
      ) : null}
      <View style={styles.content}>{children}</View>
    </Pressable>
  );
}

/** Figma `checkbox-card-check`：品牌色直角三角形 + 白色对勾。 */
function CornerCheck() {
  return (
    <Svg
      fill="none"
      height={cardTokens.indicatorSize}
      preserveAspectRatio="none"
      viewBox="0 0 28 28"
      width={cardTokens.indicatorSize}
    >
      <Path d="M0 0H28L0 28V0Z" fill={colors.brand.default} />
      <Path
        d="M7.96248 11.0146L13.4073 5.56978L14.2116 6.37412L7.96248 12.6233L4.06054 8.72134L4.86488 7.917L7.96248 11.0146Z"
        fill={colors.text.white}
      />
    </Svg>
  );
}

const colors = colorThemes.light;
const cardTokens = componentTokens.checkbox.card;

/** 页面层的紧凑尺寸，只覆盖行高与上下内边距。 */
const compactMinHeight = 40;
const compactPaddingVertical = 4;

const styles = StyleSheet.create({
  card: {
    minHeight: compactMinHeight,
    flexDirection: 'row',
    alignItems: 'flex-start',
    overflow: 'hidden',
    borderWidth: cardTokens.borderWidth,
    borderColor: colors.border.componentStroke,
    borderRadius: cardTokens.radius,
    backgroundColor: colors.background.container,
  },
  cardSelected: {
    borderColor: colors.brand.default,
  },
  indicatorSlot: {
    position: 'absolute',
    top: -cardTokens.borderWidth,
    left: -cardTokens.borderWidth,
    width: cardTokens.indicatorSize,
    height: cardTokens.indicatorSize,
    zIndex: 1,
  },
  content: {
    minWidth: 0,
    flex: 1,
    minHeight: compactMinHeight - cardTokens.borderWidth * 2,
    justifyContent: 'center',
    paddingLeft: cardTokens.paddingLeft,
    paddingRight: cardTokens.paddingRight,
    paddingVertical: compactPaddingVertical,
  },
});
