import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colorThemes, typographyTokens } from '@kone/mobile-design-system';
import { HomeTabIcon, MoreTabIcon, ReportTabIcon, type IconProps } from './icons';

const colors = colorThemes.light;

export type BottomTabId = 'home' | 'report' | 'more';

export type BottomTabBarProps = {
  activeTab: BottomTabId;
  /**
   * 页签目标回调，按页签 id 登记。未登记的页签（当前页签本身，以及尚未实现的
   * 「报告中心」）保持只读展示，不暴露按钮语义，避免朗读出无动作的控件。
   */
  onSelectTab?: Partial<Record<BottomTabId, () => void>>;
};

type BottomTabItem = {
  Icon: React.ComponentType<IconProps>;
  id: BottomTabId;
  label: string;
};

/** Figma TabBar 节点 `19971:8542`：固定 3 个页签，顺序与文案由设计稿定义。 */
const tabItems: readonly BottomTabItem[] = [
  { Icon: HomeTabIcon, id: 'home', label: '首页' },
  { Icon: ReportTabIcon, id: 'report', label: '报告中心' },
  { Icon: MoreTabIcon, id: 'more', label: '更多操作' },
];

const ICON_SIZE = 20;

/**
 * 设备视界的底部标签栏（Figma `19971:8542`）。
 *
 * 首页与「更多操作」共用这一份实现，页签文案、图标与选中态不得在各页面重画。
 * 选中态同时由品牌色和 Semibold 字重表达，不只依赖颜色。
 */
export function BottomTabBar({ activeTab, onSelectTab }: BottomTabBarProps) {
  return (
    <View accessibilityRole="tablist" style={styles.bar}>
      {tabItems.map(({ Icon, id, label }) => {
        const active = id === activeTab;
        const onPress = onSelectTab?.[id];
        const content = (
          <>
            <Icon color={active ? colors.brand.default : colors.text.primary} size={ICON_SIZE} />
            <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
          </>
        );

        if (!onPress) {
          return (
            <View
              accessibilityLabel={label}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              key={id}
              style={styles.tab}
            >
              {content}
            </View>
          );
        }

        return (
          <Pressable
            accessibilityLabel={label}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={id}
            onPress={onPress}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
          >
            {content}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.border.componentStroke,
    backgroundColor: colors.background.container,
  },
  tab: {
    minWidth: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  tabPressed: { backgroundColor: colors.background.component },
  label: { color: colors.text.primary, ...typographyTokens.footer10Regular },
  labelActive: { color: colors.brand.default, ...typographyTokens.footer10Semibold },
});
