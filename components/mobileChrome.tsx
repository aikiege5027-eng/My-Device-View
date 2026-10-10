import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeStatusRight from '../assets/home-status-right.svg';
import { colorThemes, typographyTokens } from '@kone/mobile-design-system';

const colors = colorThemes.light;

/**
 * Figma iOS 基准画布的安全区高度。原生端一律使用平台安全区，这两个值只在 Web
 * 预览（无安全区）时用于还原设计稿的系统区域，便于设计验收。
 */
export const FIGMA_WEB_TOP_SAFE_AREA = 44;
export const FIGMA_WEB_BOTTOM_SAFE_AREA = 34;

export type MobileChromeInsets = {
  bottomInset: number;
  /** 当前运行在 Web 预览（无真实安全区）中，需要自行模拟系统区域。 */
  isWebPreview: boolean;
  topInset: number;
};

/**
 * 页签级页面（设备视界首页、更多操作）共用的安全区解析逻辑。
 *
 * 原生端直接用平台安全区；Web 预览下安全区为 0，回落到 Figma 基准值，
 * 使两个页签在设计验收时的顶部/底部留白保持一致。
 */
export function useMobileChromeInsets(): MobileChromeInsets {
  const insets = useSafeAreaInsets();
  const isWebPreview = Platform.OS === 'web' && insets.top === 0;

  return {
    bottomInset: Platform.OS === 'web' && insets.bottom === 0
      ? FIGMA_WEB_BOTTOM_SAFE_AREA
      : insets.bottom,
    isWebPreview,
    topInset: isWebPreview ? FIGMA_WEB_TOP_SAFE_AREA : insets.top,
  };
}

/**
 * 仅用于 Web 预览的 iOS 状态栏模拟（时间 + 信号/Wi-Fi/电量）。
 *
 * 原生端不得渲染该组件：状态栏属于平台区域，重复绘制会叠在真实系统栏上。
 */
export function PreviewStatusBar() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.previewStatusBar}
    >
      <Text style={styles.previewTime}>9:41</Text>
      <HomeStatusRight height={21} width={67} />
    </View>
  );
}

const styles = StyleSheet.create({
  previewStatusBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: FIGMA_WEB_TOP_SAFE_AREA,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingRight: 15,
    paddingLeft: 28,
  },
  previewTime: {
    marginTop: 4,
    color: colors.home.strongText,
    ...typographyTokens.status15Semibold,
  },
});
