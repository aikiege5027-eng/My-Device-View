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

import CloseM from '../assets/close-m.svg';
import {
  colorThemes,
  componentTokens,
  radiusTokens,
  typographyTokens,
} from '../designTokens';

export type TagVariant = 'dark' | 'light' | 'outline' | 'lightOutline';
export type TagTheme = 'default' | 'primary' | 'warning' | 'danger' | 'success';
export type TagSize = 'extraLarge' | 'large' | 'medium' | 'small';
export type TagShape = 'square' | 'round' | 'mark';

type TagCloseProps =
  | {
      closable?: false;
      closeAccessibilityLabel?: never;
      onClose?: never;
    }
  | {
      closable: true;
      closeAccessibilityLabel: string;
      onClose: () => void;
    };

export type TagProps = TagCloseProps & {
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  prefixIcon?: ReactNode;
  shape?: TagShape;
  size?: TagSize;
  theme?: TagTheme;
  variant?: TagVariant;
};

/** Read-only design-system tag; only its optional close affordance is interactive. */
export function Tag({
  accessibilityLabel,
  closable = false,
  closeAccessibilityLabel,
  disabled = false,
  label,
  onClose,
  prefixIcon,
  shape = 'square',
  size = 'medium',
  theme = 'default',
  variant = 'light',
}: TagProps) {
  const sizeToken = componentTokens.tag.sizes[size];
  const palette = resolveTagPalette(theme, variant, disabled);
  const containerStyle = getContainerStyle(
    shape,
    sizeToken.radius,
    sizeToken.minHeight,
    sizeToken.paddingHorizontal,
    sizeToken.paddingVertical,
    palette,
  );

  return (
    <View style={containerStyle}>
      <TagContent
        accessibilityLabel={accessibilityLabel}
        color={palette.foreground}
        gap={sizeToken.contentGap}
        label={label}
        prefixIcon={prefixIcon}
        size={size}
        iconSize={sizeToken.iconSize}
      />
      {closable ? (
        <Pressable
          accessibilityLabel={closeAccessibilityLabel}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          hitSlop={{
            top: (44 - sizeToken.iconSize) / 2,
            bottom: (44 - sizeToken.iconSize) / 2,
            left: Math.min(
              sizeToken.closeGap / 2,
              (44 - sizeToken.iconSize) / 2,
            ),
            right: (44 - sizeToken.iconSize) / 2,
          }}
          onPress={onClose}
          style={{ marginLeft: sizeToken.closeGap }}
        >
          <CloseM
            accessibilityElementsHidden
            color={palette.foreground}
            height={sizeToken.iconSize}
            importantForAccessibility="no-hide-descendants"
            width={sizeToken.iconSize}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

export type CheckTagProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  accessibilityRole?: 'checkbox' | 'radio';
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  prefixIcon?: ReactNode;
  shape?: TagShape;
  size?: TagSize;
  testID?: string;
  uncheckedBorder?: 'none' | 'stroke';
  variant?: TagVariant;
};

/** Controlled selectable tag with the fixed brand semantics defined by Figma. */
export function CheckTag({
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole = 'checkbox',
  checked,
  disabled = false,
  label,
  onChange,
  prefixIcon,
  shape = 'square',
  size = 'medium',
  testID,
  uncheckedBorder = 'none',
  variant = 'light',
}: CheckTagProps) {
  const sizeToken = componentTokens.checkTag.sizes[size];
  const resolvedPalette = resolveTagPalette(
    checked ? 'primary' : 'default',
    variant,
    disabled,
  );
  const palette = !checked && uncheckedBorder === 'stroke'
    ? {
        ...resolvedPalette,
        border: colors.border.componentStroke,
        borderWidth: componentTokens.tag.borderWidth,
      }
    : resolvedPalette;
  const containerStyle = getContainerStyle(
    shape,
    sizeToken.radius,
    sizeToken.minHeight,
    sizeToken.paddingHorizontal,
    sizeToken.paddingVertical,
    palette,
  );

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      hitSlop={{
        top: Math.max(0, (44 - sizeToken.minHeight) / 2),
        bottom: Math.max(0, (44 - sizeToken.minHeight) / 2),
        left: 4,
        right: 4,
      }}
      onPress={() => onChange(!checked)}
      style={containerStyle}
      testID={testID}
    >
      <TagContent
        color={palette.foreground}
        gap={sizeToken.contentGap}
        iconSize={sizeToken.iconSize}
        label={label}
        prefixIcon={prefixIcon}
        size={size}
      />
    </Pressable>
  );
}

type TagContentProps = {
  accessibilityLabel?: string;
  color: string;
  gap: number;
  iconSize: number;
  label: string;
  prefixIcon?: ReactNode;
  size: TagSize;
};

function TagContent({
  accessibilityLabel,
  color,
  gap,
  iconSize,
  label,
  prefixIcon,
  size,
}: TagContentProps) {
  return (
    <View style={[styles.content, { gap }]}>
      {prefixIcon ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ width: iconSize, height: iconSize }}
        >
          {prefixIcon}
        </View>
      ) : null}
      <Text
        accessibilityLabel={accessibilityLabel}
        style={[styles.label, typographyBySize[size], { color }]}
      >
        {label}
      </Text>
    </View>
  );
}

type TagPalette = {
  background: string;
  border: string;
  borderWidth: number;
  foreground: string;
};

function resolveTagPalette(
  theme: TagTheme,
  variant: TagVariant,
  disabled: boolean,
): TagPalette {
  const outlined = variant === 'outline' || variant === 'lightOutline';

  if (theme === 'default') {
    const foreground = disabled ? colors.text.disabled : colors.text.primary;
    const border = outlined
      ? colors.border.componentBorder
      : colors.background.transparent;
    const background =
      variant === 'dark'
        ? colors.border.componentStroke
        : variant === 'light' || variant === 'lightOutline'
          ? colors.background.component
          : colors.background.transparent;

    return {
      background,
      border,
      borderWidth: outlined ? componentTokens.tag.borderWidth : 0,
      foreground,
    };
  }

  const themeColors = semanticTagColors[theme];
  const semanticColor = disabled ? themeColors.disabled : themeColors.default;

  if (variant === 'dark') {
    return {
      background: semanticColor,
      border: colors.background.transparent,
      borderWidth: 0,
      foreground: colors.text.white,
    };
  }

  return {
    background:
      variant === 'light' || variant === 'lightOutline'
        ? themeColors.light
        : colors.background.transparent,
    border: outlined ? semanticColor : colors.background.transparent,
    borderWidth: outlined ? componentTokens.tag.borderWidth : 0,
    foreground: semanticColor,
  };
}

function getContainerStyle(
  shape: TagShape,
  squareRadius: number,
  minHeight: number,
  paddingHorizontal: number,
  paddingVertical: number,
  palette: TagPalette,
): StyleProp<ViewStyle> {
  const shapeStyle: ViewStyle =
    shape === 'round'
      ? { borderRadius: radiusTokens.tagRound }
      : shape === 'mark'
        ? {
            borderTopRightRadius: radiusTokens.tagRound,
            borderBottomRightRadius: radiusTokens.tagRound,
          }
        : { borderRadius: squareRadius };

  return [
    styles.container,
    {
      minHeight,
      paddingHorizontal: Math.max(0, paddingHorizontal - palette.borderWidth),
      paddingVertical: Math.max(0, paddingVertical - palette.borderWidth),
      backgroundColor: palette.background,
      borderColor: palette.border,
      borderWidth: palette.borderWidth,
    },
    shapeStyle,
  ];
}

const colors = colorThemes.light;
const semanticTagColors = {
  primary: colors.brand,
  warning: colors.warning,
  danger: colors.error,
  success: colors.success,
} as const;

const typographyBySize: Record<TagSize, TextStyle> = {
  extraLarge: typographyTokens.body14Regular,
  large: typographyTokens.body14Regular,
  medium: typographyTokens.footer12Regular,
  small: typographyTokens.footer10Regular,
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  label: {
    flexShrink: 1,
  },
});
