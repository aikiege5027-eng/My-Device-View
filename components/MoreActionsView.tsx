import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import MoreChevronRight from '../assets/more-chevron-right.svg';
import MoreQuestionCircle from '../assets/more-question-circle.svg';
import MoreServer from '../assets/more-server.svg';
import MoreSetting from '../assets/more-setting.svg';
import {
  colorThemes,
  radiusTokens,
  typographyTokens,
} from '@kone/mobile-design-system';
import { BottomTabBar, type BottomTabId } from './BottomTabBar';
import { PreviewStatusBar, useMobileChromeInsets } from './mobileChrome';

const colors = colorThemes.light;

export type MoreActionId = 'deviceRegistration' | 'helpCenter' | 'faultMessageFilter';

export type MoreActionsViewProps = {
  onSelectAction: (action: MoreActionId) => void;
  onSelectTab?: Partial<Record<BottomTabId, () => void>>;
};

type MoreActionItem = {
  Icon: React.ComponentType<SvgProps>;
  id: MoreActionId;
  label: string;
};

/** Figma 更多操作节点 `19971:8511`：卡片内固定 3 个入口，顺序与文案由设计稿定义。 */
const actionItems: readonly MoreActionItem[] = [
  { Icon: MoreServer, id: 'deviceRegistration', label: '设备注册' },
  { Icon: MoreQuestionCircle, id: 'helpCenter', label: '帮助中心' },
  { Icon: MoreSetting, id: 'faultMessageFilter', label: '故障消息过滤设置' },
];

/** 导航栏高度，Figma `NavBar 导航栏 - mini program小程序`（`19971:8533`）。 */
const NAVBAR_HEIGHT = 48;
const ROW_ICON_SIZE = 20;
const CHEVRON_SIZE = 16;
/**
 * 行文案视觉高度仅 22，按压底色需要一点呼吸空间，因此行自带 5 的上下内边距，
 * 并把卡片内边距与行间距各减 5（16→11、32→22），使行基线与卡片总高仍等于
 * Figma 的 162。剩余热区由 hitSlop 补到平台最小触控尺寸 44。
 */
const ROW_PADDING_VERTICAL = 5;
const ROW_HIT_SLOP = { bottom: 6, top: 6 };

/**
 * 「更多操作」页签（Figma `19971:8511`）。
 *
 * 该页没有返回入口和底部按钮操作区，不符合 Page Template 的模板边界，
 * 因此与首页一样自行组合导航栏 + 内容区 + 共享底部标签栏。
 */
export function MoreActionsView({ onSelectAction, onSelectTab }: MoreActionsViewProps) {
  const { bottomInset, isWebPreview, topInset } = useMobileChromeInsets();

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor={colors.background.container} barStyle="dark-content" />
      <View style={[styles.topChrome, { paddingTop: topInset }]}>
        {isWebPreview ? <PreviewStatusBar /> : null}
        <View style={styles.navbar}>
          <Text accessibilityRole="header" style={styles.navTitle}>更多操作</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.card}>
          {actionItems.map(({ Icon, id, label }) => (
            <Pressable
              accessibilityLabel={label}
              accessibilityRole="button"
              hitSlop={ROW_HIT_SLOP}
              key={id}
              onPress={() => onSelectAction(id)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.rowLeading}>
                <Icon
                  accessibilityElementsHidden
                  height={ROW_ICON_SIZE}
                  importantForAccessibility="no-hide-descendants"
                  width={ROW_ICON_SIZE}
                />
                <Text numberOfLines={1} style={styles.rowLabel}>{label}</Text>
              </View>
              <MoreChevronRight
                accessibilityElementsHidden
                height={CHEVRON_SIZE}
                importantForAccessibility="no-hide-descendants"
                width={CHEVRON_SIZE}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomSafeArea, { paddingBottom: bottomInset }]}>
        <BottomTabBar activeTab="more" onSelectTab={onSelectTab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background.page },
  topChrome: { position: 'relative', backgroundColor: colors.background.container },
  navbar: { height: NAVBAR_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  navTitle: { color: colors.text.primary, ...typographyTokens.title18Semibold },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  card: {
    gap: 32 - 2 * ROW_PADDING_VERTICAL,
    paddingHorizontal: 16,
    paddingVertical: 16 - ROW_PADDING_VERTICAL,
    borderRadius: radiusTokens.medium,
    backgroundColor: colors.background.container,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ROW_PADDING_VERTICAL,
  },
  rowPressed: { backgroundColor: colors.background.component },
  rowLeading: { minWidth: 0, flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  rowLabel: { minWidth: 0, flexShrink: 1, color: colors.text.primary, ...typographyTokens.body14Medium },
  bottomSafeArea: { backgroundColor: colors.background.container },
});
