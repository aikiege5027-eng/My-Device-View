import React, { type PropsWithChildren, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colorThemes, componentTokens, typographyTokens } from '../designTokens';

type DataPanelTitleProps = PropsWithChildren<{
  action?: ReactNode;
}>;

/** Shared card title used by Cloud Data panels and related settings cards. */
export function DataPanelTitle({ action, children }: DataPanelTitleProps) {
  return (
    <View style={styles.row}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.accent}
      />
      <Text accessibilityRole="header" style={styles.title}>{children}</Text>
      {action}
    </View>
  );
}

const colors = colorThemes.light;
const tokens = componentTokens.dataPanel;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.titleGap,
  },
  accent: {
    width: tokens.titleAccentWidth,
    height: tokens.titleAccentHeight,
    borderRadius: tokens.titleAccentRadius,
    backgroundColor: colors.brand.hover,
  },
  title: {
    minWidth: 0,
    flex: 1,
    color: colors.text.primary,
    ...typographyTokens.title16Medium,
  },
});
