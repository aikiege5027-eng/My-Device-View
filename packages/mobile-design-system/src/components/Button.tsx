import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';

import { colorThemes, radiusTokens, typographyTokens } from '../designTokens';

export type ButtonProps = Pick<
  PressableProps,
  'accessibilityHint' | 'accessibilityLabel' | 'onPress'
> & {
  block?: boolean;
  children: string;
  disabled?: boolean;
  shape?: 'rectangle' | 'round';
  size?: 'medium';
  theme?: 'light' | 'primary';
  variant?: 'base';
};

/** Shared design-system button for the Figma combinations verified by this project. */
export function Button({
  accessibilityHint,
  accessibilityLabel,
  block = false,
  children,
  disabled = false,
  onPress,
  shape = 'rectangle',
  theme = 'primary',
}: ButtonProps) {
  const light = theme === 'light';

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
        light && styles.lightButton,
        shape === 'round' && styles.round,
        block && styles.block,
        pressed && (light ? styles.lightPressed : styles.primaryPressed),
        disabled && (light ? styles.lightDisabled : styles.primaryDisabled),
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.label,
            light && styles.lightLabel,
            pressed && light && styles.lightPressedLabel,
            disabled && light && styles.lightDisabledLabel,
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const colors = colorThemes.light;

const styles = StyleSheet.create({
  button: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radiusTokens.medium,
    backgroundColor: colors.brand.default,
  },
  lightButton: {
    backgroundColor: colors.brand.light,
  },
  round: {
    borderRadius: radiusTokens.circle,
  },
  block: {
    alignSelf: 'stretch',
  },
  primaryPressed: {
    backgroundColor: colors.brand.active,
  },
  lightPressed: {
    backgroundColor: colors.brand.light,
  },
  lightPressedLabel: {
    color: colors.brand.active,
  },
  primaryDisabled: {
    backgroundColor: colors.brand.disabled,
  },
  lightDisabled: {
    backgroundColor: colors.brand.light,
  },
  label: {
    color: colors.text.white,
    textAlign: 'center',
    ...typographyTokens.title16Semibold,
  },
  lightLabel: {
    color: colors.text.brand,
  },
  lightDisabledLabel: {
    color: colors.brand.disabled,
  },
});
