import React from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colorThemes, componentTokens, radiusTokens, typographyTokens } from '@kone/mobile-design-system';

/**
 * 对应 CheckTag 的尺寸档：`medium` 用在设备事件面板行（24 高），
 * `large` 用在「更多」面板的网格（32 高）。
 */
export type FaultCodePillSize = 'large' | 'medium';

export type FaultCodePillProps = {
  accessibilityHint?: string;
  checked: boolean;
  code: string;
  count: number;
  /** 仅用于父级布局约束的宽度样式，不要用来改配色与内边距。 */
  layoutStyle?: StyleProp<ViewStyle>;
  onToggle: () => void;
  size: FaultCodePillSize;
};

/**
 * 故障代码统计胶囊（兼筛选项）。
 *
 * 几何与配色严格对齐设计系统 CheckTag：尺寸取 `componentTokens.checkTag.sizes`，
 * 圆角取 `radiusTokens.tagRound`，配色等价于 CheckTag 的 `variant=light`：
 *
 * - 未选中（`theme=default`）：`bg-color-component` + `text-color-primary`
 * - 选中（`theme=primary`）：`brand-color-light` 淡蓝底 + `brand-color` 文字
 *
 * 两种状态都没有描边 —— 这正是 CheckTag 组件本体 `variant=light, checked=true` 的
 * 定义（节点 `26841:11318`）；此前那圈品牌描边来自 Figma 页面实例的覆盖，已去掉。
 * 无描边也意味着两种状态内边距完全相同，不需要补偿，高度不会跳变。
 *
 * 之所以没有直接用 `CheckTag` 组件：故障代码需要比次数更粗，而 CheckTag 的 `label`
 * 是单段字符串、排版整套绑定在 `size` 上，无法做两段字重。这是业务侧确认过的对
 * Tag 规范的偏离，需要回到 Figma 补字重轴或确认页面例外。
 */
export function FaultCodePill({
  accessibilityHint,
  checked,
  code,
  count,
  layoutStyle,
  onToggle,
  size,
}: FaultCodePillProps) {
  const tokens = componentTokens.checkTag.sizes[size];
  const typography = typographyBySize[size];

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={`故障代码 ${code}，${count} 次`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={hitSlopBySize[size]}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.pill,
        {
          minHeight: tokens.minHeight,
          paddingHorizontal: tokens.paddingHorizontal,
          paddingVertical: tokens.paddingVertical,
        },
        checked && styles.pillChecked,
        layoutStyle,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[typography.count, checked ? styles.labelChecked : styles.label]}>
        <Text style={typography.code}>{code}</Text>
        {`：${count}次`}
      </Text>
    </Pressable>
  );
}

const colors = colorThemes.light;

/**
 * 故障代码比次数粗一档。排版按 Tag 规范随尺寸切换：`large` 用 `Body 14/22`，
 * `medium` 用 `Foot 12/20`。
 */
const typographyBySize = {
  large: { code: typographyTokens.body14Semibold, count: typographyTokens.body14Regular },
  medium: { code: typographyTokens.footer12Semibold, count: typographyTokens.footer12Regular },
} as const;

/** 视觉高度不等于触控热区；只在纵向扩展，避免压到相邻胶囊的间距。 */
const hitSlopBySize = {
  large: { bottom: 6, left: 0, right: 0, top: 6 },
  medium: { bottom: 10, left: 0, right: 0, top: 10 },
} as const;

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radiusTokens.tagRound,
    backgroundColor: colors.background.component,
  },
  /** `variant=light, theme=primary`：品牌淡蓝底，无描边。 */
  pillChecked: { backgroundColor: colors.brand.light },
  label: { color: colors.text.primary, textAlign: 'center' },
  labelChecked: { color: colors.text.brand, textAlign: 'center' },
  pressed: { opacity: 0.72 },
});
