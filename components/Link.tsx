import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colorThemes, componentTokens, typographyTokens } from '../designTokens';

export type LinkSize = 'medium';
export type LinkTheme = 'default' | 'primary';

export type LinkProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  /**
   * Figma 未定义可访问角色。承载动作（如 Picker 的 Cancel / Confirm）时传入
   * `button`，用于页面跳转时保留默认的 `link`。
   */
  accessibilityRole?: 'button' | 'link';
  children: string;
  onPress?: () => void;
  size?: LinkSize;
  testID?: string;
  theme?: LinkTheme;
};

/**
 * 统一 Link 组件。
 *
 * 只实现当前已从 Figma 读取确认的组合：
 * `size=medium`、`theme=default|primary`、`state=normal`、
 * `prefixIcon=false`、`suffixIcon=false`、`underline=false`、`disabled=false`。
 *
 * 其余尺寸、press/hover 状态、underline、图标槽与 disabled 配色尚未从
 * Link 权威节点读取，故有意未开放，避免臆造 token。
 */
export function Link({
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole = 'link',
  children,
  onPress,
  testID,
  theme = 'default',
}: LinkProps) {
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityRole={accessibilityRole}
      hitSlop={hitSlop}
      onPress={onPress}
      style={styles.link}
      testID={testID}
    >
      <Text style={[styles.label, theme === 'primary' && styles.primaryLabel]}>
        {children}
      </Text>
    </Pressable>
  );
}

const colors = colorThemes.light;
const tokens = componentTokens.link;
const mediumTokens = tokens.sizes.medium;

const hitSlop = {
  bottom: mediumTokens.hitSlopVertical,
  left: mediumTokens.hitSlopHorizontal,
  right: mediumTokens.hitSlopHorizontal,
  top: mediumTokens.hitSlopVertical,
};

const styles = StyleSheet.create({
  link: {
    minHeight: mediumTokens.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: tokens.radius,
  },
  label: {
    color: colors.text.secondary,
    ...typographyTokens.body14Regular,
  },
  primaryLabel: {
    color: colors.brand.default,
  },
});
