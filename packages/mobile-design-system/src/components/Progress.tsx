import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  CheckCircleFilledIcon,
  CloseCircleFilledIcon,
  WarningCircleFilledIcon,
} from '../icons';
import {
  colorThemes,
  componentTokens,
  radiusTokens,
  typographyTokens,
} from '../designTokens';

const colors = colorThemes.light;
const tokens = componentTokens.progress.line;

export type ProgressStatus = 'active' | 'success' | 'warning' | 'error';

/** Figma `theme` 共 5 个值，当前只实现已读取确认的 `line`。 */
export type ProgressTheme = 'line';

export type ProgressProps = {
  /** `label=false` 的进度条没有可读文案，调用方应提供可访问名称。 */
  accessibilityLabel?: string;
  /** Figma `label=true`：`active` 显示百分比文案，其余状态显示状态图标。 */
  label?: boolean;
  /** 完成百分比，超出 `0–100` 会被收敛到区间内。 */
  percent: number;
  status?: ProgressStatus;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: ProgressTheme;
};

const statusColors: Record<ProgressStatus, string> = {
  active: colors.brand.default,
  error: colors.error.default,
  success: colors.success.default,
  warning: colors.warning.default,
};

function StatusIcon({ status }: { status: Exclude<ProgressStatus, 'active'> }) {
  const color = statusColors[status];
  const size = tokens.iconSize;

  if (status === 'success') return <CheckCircleFilledIcon color={color} height={size} width={size} />;
  if (status === 'warning') return <WarningCircleFilledIcon color={color} height={size} width={size} />;
  return <CloseCircleFilledIcon color={color} height={size} width={size} />;
}

/**
 * 进度条（Figma `24386:5271`，组件集 `27306:20607`）。
 *
 * 当前只实现 `theme=line`：`status=active|success|warning|error` × `label=true|false`
 * 共 8 个变体。`plump` / `circle` / `micro` / `button` 尚未逐一核实（`plump` 的
 * 「进度 <10% 时文案移到条外」还缺阈值定义，且 Figma mock 里混入了未绑定变量的裸色值），
 * 因此有意未开放，避免臆造 token。
 *
 * Figma 的 `343` 是展示基准宽度，组件填满父容器可用宽度。
 */
export function Progress({
  accessibilityLabel,
  label = true,
  percent,
  status = 'active',
  style,
  testID,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: 100, min: 0, now: Math.round(clamped) }}
      style={[label ? styles.rowWithLabel : styles.row, style]}
      testID={testID}
    >
      <View style={styles.track}>
        <View style={[styles.inner, { backgroundColor: statusColors[status], width: `${clamped}%` }]} />
      </View>
      {label ? (
        status === 'active' ? (
          <Text numberOfLines={1} style={styles.label}>{`${Math.round(clamped)}%`}</Text>
        ) : (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.iconSlot}
          >
            <StatusIcon status={status} />
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: tokens.trackHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.contentGap,
  },
  track: {
    minWidth: 0,
    flex: 1,
    height: tokens.trackHeight,
    overflow: 'hidden',
    borderRadius: radiusTokens.circle,
    backgroundColor: colors.border.componentStroke,
  },
  inner: {
    height: '100%',
    borderRadius: radiusTokens.circle,
  },
  label: {
    width: tokens.labelWidth,
    color: colors.text.primary,
    textAlign: 'right',
    ...typographyTokens.body14Regular,
  },
  iconSlot: {
    width: tokens.labelWidth,
    height: tokens.iconSlotHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
