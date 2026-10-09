import React from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colorThemes, componentTokens, radiusTokens, typographyTokens } from '@kone/mobile-design-system';

/**
 * 对应 CheckTag 的尺寸档：`medium` 用在设备事件面板行（24 高），
 * `extraLarge` 用在「更多」面板的网格（40 高）。
 */
export type FaultCodePillSize = 'extraLarge' | 'medium';

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
 * 圆角取 `radiusTokens.tagRound`，未选中为 `bg-color-component` + `text-color-primary`，
 * 选中为 `brand-color-light` + `1` 品牌描边 + 品牌文字（后者是 Figma 页面实例对
 * CheckTag 的覆盖，组件本体的 `variant=light, checked=true` 并没有描边）。
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
        /** 描边占的 1 从内边距里扣掉，保证选中前后高度不跳变。 */
        checked && {
          paddingHorizontal: tokens.paddingHorizontal - borderWidth,
          paddingVertical: tokens.paddingVertical - borderWidth,
          borderWidth,
          borderColor: colors.brand.default,
          backgroundColor: colors.brand.light,
        },
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

/** 与设计系统 Tag / CheckTag 的描边宽度一致。 */
const borderWidth = componentTokens.tag.borderWidth;

/** 故障代码比次数粗一档，两档尺寸各用对应的 Footer / Body 排版。 */
const typographyBySize = {
  extraLarge: { code: typographyTokens.body14Semibold, count: typographyTokens.body14Regular },
  medium: { code: typographyTokens.footer12Semibold, count: typographyTokens.footer12Regular },
} as const;

/** 视觉高度不等于触控热区；只在纵向扩展，避免压到相邻胶囊的间距。 */
const hitSlopBySize = {
  extraLarge: { bottom: 2, left: 0, right: 0, top: 2 },
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
  label: { color: colors.text.primary, textAlign: 'center' },
  labelChecked: { color: colors.text.brand, textAlign: 'center' },
  pressed: { opacity: 0.72 },
});
