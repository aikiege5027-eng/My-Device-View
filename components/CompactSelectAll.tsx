import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colorThemes, typographyTokens } from '@kone/mobile-design-system';
import { CheckCircleFilledIcon, MinusCircleFilledIcon } from './icons';

export type CompactSelectAllProps = {
  accessibilityLabel: string;
  allSelected: boolean;
  label?: string;
  onToggle: () => void;
  someSelected: boolean;
};

/**
 * 更小一档的全选控件，用于嵌在分割线里。
 *
 * 设计系统 `Checkbox` 没有 size 轴，最紧凑的 `variant="inline"` 是 24 的 indicator +
 * 14px 文字；这里需要 16 + 12px，因此在页面层单独实现。三种状态的圆保持等直径，
 * 圆环几何按 24→16 的比例换算，颜色仍全部来自主题 token。
 */
export function CompactSelectAll({
  accessibilityLabel,
  allSelected,
  label = '全选',
  onToggle,
  someSelected,
}: CompactSelectAllProps) {
  const indeterminate = someSelected && !allSelected;

  return (
    <Pressable
      accessibilityLabel={
        indeterminate ? `${accessibilityLabel}，已选择部分设备` : accessibilityLabel
      }
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? 'mixed' : allSelected }}
      hitSlop={hitSlop}
      onPress={onToggle}
      style={styles.control}
    >
      <View style={styles.indicator}>
        {indeterminate ? (
          <MinusCircleFilledIcon color={colors.brand.default} size={indicatorSize} />
        ) : allSelected ? (
          <CheckCircleFilledIcon color={colors.brand.default} size={indicatorSize} />
        ) : (
          <View style={styles.uncheckedCircle} />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const colors = colorThemes.light;

/** indicator 槽位尺寸。设计系统的 24 在这里缩到 16。 */
const indicatorSize = 16;
/**
 * 圆的视觉直径。填充态 SVG 在 24 视图框内画的圆直径为 21，缩放到 16 后是 14，
 * 未选中的描边圆必须取同一直径，否则勾选前后会跳变。
 */
const circleDiameter = 14;
/** 描边宽度同样按 24→16 换算：设计系统的 1.5 对应这里的 1。 */
const circleStrokeWidth = 1;

/** 视觉高度只有 16，用 hitSlop 补足触控热区且不改变布局。 */
const hitSlop = { bottom: 8, left: 8, right: 8, top: 8 };

const styles = StyleSheet.create({
  control: {
    minHeight: indicatorSize,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  indicator: {
    width: indicatorSize,
    height: indicatorSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckedCircle: {
    width: circleDiameter,
    height: circleDiameter,
    borderWidth: circleStrokeWidth,
    borderColor: colors.border.componentBorder,
    borderRadius: circleDiameter / 2,
  },
  label: {
    color: colors.text.placeholder,
    ...typographyTokens.footer12Regular,
  },
});
