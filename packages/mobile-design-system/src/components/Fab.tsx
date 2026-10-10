import React, { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import {
  colorThemes,
  componentTokens,
  radiusTokens,
  typographyTokens,
} from '../designTokens';

const colors = colorThemes.light;
const tokens = componentTokens.fab;

export type FabSize = 'large' | 'medium' | 'small' | 'extraSmall';
export type FabTheme = 'primary' | 'light' | 'default' | 'danger';

/** 图标槽收到的当前主题前景色与该尺寸的图标槽尺寸。 */
export type FabIconState = {
  color: string;
  size: number;
};

type FabContent =
  | {
      /** 纯图标形态没有可读文字，必须显式提供可访问名称。 */
      accessibilityLabel: string;
      label?: never;
      /** Figma `text=false`：`circle` 为圆形，`square` 为圆角方形。 */
      shape?: 'circle' | 'square';
    }
  | {
      /** 覆盖默认取自 `label` 的可访问名称。 */
      accessibilityLabel?: string;
      label: string;
      /** Figma `text=true`：`round` 为胶囊，`rectangle` 为圆角矩形。 */
      shape?: 'round' | 'rectangle';
    };

export type FabProps = {
  accessibilityHint?: string;
  onPress: () => void;
  /**
   * 图标槽（Figma 的 `add` 实例是可替换内容，不属于组件本身）。
   * 接收当前主题前景色与该尺寸的图标槽尺寸，调用方不需要自己维护这两张映射表。
   */
  renderIcon: (state: FabIconState) => ReactNode;
  size?: FabSize;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: FabTheme;
} & FabContent;

const themeBackgrounds: Record<FabTheme, string> = {
  danger: colors.error.default,
  default: colors.border.componentStroke,
  light: colors.brand.light,
  primary: colors.brand.default,
};

const themeForegrounds: Record<FabTheme, string> = {
  danger: colors.text.white,
  default: colors.text.primary,
  light: colors.text.brand,
  primary: colors.text.white,
};

/** Figma 按尺寸切换排版：`large` / `medium` 用 H7 16/Semibold，其余用 Body 14/Medium。 */
const sizeTypography: Record<FabSize, TextStyle> = {
  extraSmall: typographyTokens.body14Medium,
  large: typographyTokens.title16Semibold,
  medium: typographyTokens.title16Semibold,
  small: typographyTokens.body14Medium,
};

/**
 * 悬浮按钮（Figma `24385:5234`，组件集 `26616:6104`）。
 *
 * 组件只负责按钮本体，不负责吸附定位：它在页面中的位置、与安全区和底部操作区的
 * 关系由调用方的页面布局决定。
 *
 * 当前节点只定义 `size` × `theme` × `shape` × `text` 四个轴，没有按压、禁用或
 * loading 状态，因此这些状态未开放，避免臆造 token。
 */
export function Fab({
  accessibilityHint,
  accessibilityLabel,
  label,
  onPress,
  renderIcon,
  shape,
  size = 'large',
  style,
  testID,
  theme = 'primary',
}: FabProps) {
  const sizeToken = tokens.sizes[size];
  const hasLabel = label !== undefined;
  const resolvedShape = shape ?? (hasLabel ? 'round' : 'circle');
  const pill = resolvedShape === 'circle' || resolvedShape === 'round';
  const foreground = themeForegrounds[theme];

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.fab,
        { backgroundColor: themeBackgrounds[theme] },
        { borderRadius: pill ? radiusTokens.circle : tokens.squareRadius },
        hasLabel
          ? {
              gap: tokens.contentGap,
              paddingHorizontal: sizeToken.paddingHorizontal,
              paddingVertical: sizeToken.paddingVertical,
            }
          : { width: sizeToken.boxSize, height: sizeToken.boxSize },
        style,
      ]}
      testID={testID}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ width: sizeToken.iconSize, height: sizeToken.iconSize }}
      >
        {renderIcon({ color: foreground, size: sizeToken.iconSize })}
      </View>
      {hasLabel ? (
        <Text style={[sizeTypography[size], { color: foreground }]}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: tokens.shadow.color,
    shadowOffset: { width: 0, height: tokens.shadow.offsetY },
    shadowOpacity: tokens.shadow.opacity,
    shadowRadius: tokens.shadow.radius,
    elevation: tokens.shadow.elevation,
  },
});
