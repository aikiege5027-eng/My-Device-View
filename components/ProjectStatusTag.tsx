import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import AttentionIcon from '../assets/project-status-tag-attention.svg';
import HealthIcon from '../assets/project-status-tag-health.svg';
import RiskIcon from '../assets/project-status-tag-risk.svg';
import { colorThemes, componentTokens, typographyTokens } from '../designTokens';

export type ProjectHealthStatus = 'attention' | 'healthy' | 'risk';

type ProjectStatusTagProps = {
  status: ProjectHealthStatus;
};

const colors = colorThemes.light;
const tokens = componentTokens.projectStatusTag;

const statusConfig = {
  attention: {
    endColor: colors.projectDetails.statusAttentionTagEnd,
    Icon: AttentionIcon,
    label: '注意',
    startColor: colors.projectDetails.statusAttentionTagStart,
  },
  healthy: {
    endColor: colors.success.strong,
    Icon: HealthIcon,
    label: '健康',
    startColor: colors.success.default,
  },
  risk: {
    endColor: colors.projectDetails.statusRiskTagEnd,
    Icon: RiskIcon,
    label: '风险',
    startColor: colors.projectDetails.statusRiskTagStart,
  },
} as const;

/** Project health label defined by the My Device View Figma status set. */
export function ProjectStatusTag({ status }: ProjectStatusTagProps) {
  const { endColor, Icon, label, startColor } = statusConfig[status];
  const gradientId = `project-status-${status}`;

  return (
    <View accessibilityLabel={`状态${label}`} style={styles.container}>
      <Svg
        accessibilityElementsHidden
        height={tokens.height}
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={StyleSheet.absoluteFillObject}
        width={tokens.width}
      >
        <Defs>
          <LinearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <Stop offset="0%" stopColor={startColor} />
            <Stop offset="100%" stopColor={endColor} />
          </LinearGradient>
        </Defs>
        <Rect
          fill={`url(#${gradientId})`}
          height={tokens.height}
          rx={tokens.radius}
          width={tokens.width}
          x={0}
          y={0}
        />
      </Svg>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.icon}
      >
        <Icon height={tokens.iconSize} width={tokens.iconSize} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: tokens.width,
    height: tokens.height,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.contentGap,
    paddingHorizontal: tokens.paddingHorizontal,
    paddingVertical: tokens.paddingVertical,
    overflow: 'hidden',
    borderRadius: tokens.radius,
  },
  icon: {
    width: tokens.iconSize,
    height: tokens.iconSize,
  },
  label: {
    color: colors.text.white,
    ...typographyTokens.projectStatus11Regular,
  },
});
