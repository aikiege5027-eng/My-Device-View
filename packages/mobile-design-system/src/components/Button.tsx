import React, { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type TextStyle,
} from 'react-native';

import {
  colorThemes,
  componentTokens,
  radiusTokens,
  typographyTokens,
} from '../designTokens';

export type ButtonShape = 'rectangle' | 'round' | 'square';
export type ButtonSize = 'extraSmall' | 'large' | 'medium';
/**
 * 已读取图标槽尺寸的尺寸档。`large` 的 `shape=square` 图标槽尚未从 Figma 读取，
 * 因此仅图标按钮不开放 `large`。
 */
export type ButtonIconSize = Exclude<ButtonSize, 'large'>;
export type ButtonTheme = 'default' | 'light' | 'primary';

/**
 * 判别联合，按 Figma 约束把内容、形状与尺寸绑定：文本按钮只能用
 * `rectangle` / `round`，仅图标按钮只能用 `square`（`circle` 尚未读取，暂未开放）
 * 且只能用已读取图标槽的尺寸。
 */
type ButtonContentProps =
  | {
      children: string;
      icon?: never;
      shape?: 'rectangle' | 'round';
      size?: ButtonSize;
    }
  | {
      children?: never;
      /**
       * 纯图标按钮（Figma `singleIcon=true`）的图标节点。与 `Tag.prefixIcon` 一致，
       * 由调用方按当前主题的前景色着色；组件只负责按 `iconSize` 约束图标槽。
       */
      icon: ReactNode;
      /** 纯图标按钮没有可读文字，必须显式提供可访问名称。 */
      accessibilityLabel: string;
      shape?: 'square';
      size?: ButtonIconSize;
    };

export type ButtonProps = Pick<
  PressableProps,
  'accessibilityHint' | 'accessibilityLabel' | 'onPress'
> &
  ButtonContentProps & {
    block?: boolean;
    disabled?: boolean;
    theme?: ButtonTheme;
    variant?: 'base';
  };

/**
 * 统一按钮组件。
 *
 * 当前只实现已从 Figma 读取确认的组合：`variant=base`、
 * `size=extraSmall|medium|large`、`theme=default|light|primary`、
 * `shape=rectangle|round|square`，以及 `singleIcon=true` 的纯图标形态。
 *
 * Figma Button 组件集共 2160 个变体；`variant=dashed|ghost|outline|text`、
 * `theme=danger`、`size=small`、`shape=circle`、`large` 的仅图标形态、
 * `prefixIcon` / `suffixIcon` 组合尚未读取权威值，故有意未开放。
 */
export function Button({
  accessibilityHint,
  accessibilityLabel,
  block = false,
  children,
  disabled = false,
  icon,
  onPress,
  shape,
  size = 'medium',
  theme = 'primary',
}: ButtonProps) {
  const sizeToken = componentTokens.button.sizes[size];
  const palette = buttonPalettes[theme];
  const resolvedShape: ButtonShape = shape ?? (icon ? 'square' : 'rectangle');
  /**
   * `large` 没有已确认的图标槽，因此没有 `squareSize` / `iconSize`。
   * props 的判别联合已阻止 `large` + 仅图标的组合，这里只做类型收窄。
   */
  const squareSize = 'squareSize' in sizeToken ? sizeToken.squareSize : undefined;
  const iconSize = 'iconSize' in sizeToken ? sizeToken.iconSize : undefined;

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          minHeight: sizeToken.minHeight,
          paddingHorizontal: sizeToken.paddingHorizontal,
          paddingVertical: sizeToken.paddingVertical,
          borderRadius: sizeToken.radius,
          backgroundColor: palette.background,
        },
        resolvedShape === 'round' && styles.round,
        resolvedShape === 'square' &&
          squareSize !== undefined && {
            width: squareSize,
            height: squareSize,
            paddingHorizontal: 0,
            paddingVertical: 0,
          },
        block && styles.block,
        pressed && !disabled && { backgroundColor: palette.pressedBackground },
        disabled && { backgroundColor: palette.disabledBackground },
      ]}
    >
      {({ pressed }) =>
        icon ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={{ width: iconSize, height: iconSize }}
          >
            {icon}
          </View>
        ) : (
          <Text
            style={[
              styles.label,
              typographyBySize[size],
              {
                color: disabled
                  ? palette.disabledForeground
                  : pressed
                    ? palette.pressedForeground
                    : palette.foreground,
              },
            ]}
          >
            {children}
          </Text>
        )
      }
    </Pressable>
  );
}

const colors = colorThemes.light;

type ButtonPalette = {
  background: string;
  disabledBackground: string;
  disabledForeground: string;
  foreground: string;
  pressedBackground: string;
  pressedForeground: string;
};

const buttonPalettes: Record<ButtonTheme, ButtonPalette> = {
  /**
   * Figma `theme=default`：底色 `Color/grey/bg-color-component`，
   * 按压 `bg-color-component-active`，禁用底色 `bg-color-component-disabled`
   * （与常态同值）而前景降为 `text/text-color-disabled`。
   * 读取于节点 `26544:4027` / `26561:4373` / `26561:4531`。
   */
  default: {
    background: colors.background.component,
    disabledBackground: colors.background.component,
    disabledForeground: colors.text.disabled,
    foreground: colors.text.primary,
    pressedBackground: colors.background.componentActive,
    pressedForeground: colors.text.primary,
  },
  light: {
    background: colors.brand.light,
    disabledBackground: colors.brand.light,
    disabledForeground: colors.brand.disabled,
    foreground: colors.text.brand,
    pressedBackground: colors.brand.light,
    pressedForeground: colors.brand.active,
  },
  primary: {
    background: colors.brand.default,
    disabledBackground: colors.brand.disabled,
    disabledForeground: colors.text.white,
    foreground: colors.text.white,
    pressedBackground: colors.brand.active,
    pressedForeground: colors.text.white,
  },
};

/**
 * Figma 按尺寸切换排版：`large` / `medium` 用 `H7 16/Semibold`，
 * `small` / `extraSmall` 用 `Body 14/Medium`（节点 `26544:4044`）。
 */
const typographyBySize: Record<ButtonSize, TextStyle> = {
  extraSmall: typographyTokens.body14Medium,
  large: typographyTokens.title16Semibold,
  medium: typographyTokens.title16Semibold,
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  round: {
    borderRadius: radiusTokens.circle,
  },
  block: {
    alignSelf: 'stretch',
  },
  label: {
    textAlign: 'center',
  },
});
