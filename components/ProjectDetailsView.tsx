import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import ProjectBack from '../assets/project-back.svg';
import HealthBadgeIcon from '../assets/project-health-badge.svg';
import CaretDown from '../assets/caret-down-small.svg';
import ChevronRight from '../assets/project-chevron-right.svg';
import ElevatorDisabled from '../assets/project-elevator-disabled.svg';
import ElevatorFilled from '../assets/project-elevator-filled.svg';
import EscalatorDisabled from '../assets/project-escalator-disabled.svg';
import EscalatorFilled from '../assets/project-escalator-filled.svg';
import Info from '../assets/project-info.svg';
import InfoSmall from '../assets/project-info-small.svg';
import DailyTexture from '../assets/project-report-daily.svg';
import MonthlyTexture from '../assets/project-report-monthly.svg';
import WeeklyTexture from '../assets/project-report-weekly.svg';
import AttentionStatus from '../assets/project-status-attention.svg';
import HealthStatus from '../assets/project-status-health.svg';
import RiskStatus from '../assets/project-status-risk.svg';
import UnratedStatus from '../assets/project-status-unrated.svg';
import { colorThemes, typographyTokens } from '../designTokens';

type ProjectDetailsViewProps = {
  onBack: () => void;
  onOpenDeviceDetails: () => void;
  onOpenExportReportSettings: () => void;
  titleRef?: React.Ref<Text>;
};

type DeviceItem = {
  id: string;
  name: string;
  serialNumber: string;
  kind: 'elevator' | 'escalator';
  connected: boolean;
  score?: number;
};

const statusItems = [
  { id: 'healthy', label: '健康', value: 3, backgroundColor: colorThemes.light.projectDetails.statusHealthyBackground, Icon: HealthStatus },
  { id: 'attention', label: '注意', value: 2, backgroundColor: colorThemes.light.projectDetails.statusAttentionBackground, Icon: AttentionStatus },
  { id: 'risk', label: '风险', value: 1, backgroundColor: colorThemes.light.projectDetails.statusRiskBackground, Icon: RiskStatus },
  { id: 'unrated', label: '未统计', value: 0, backgroundColor: colorThemes.light.projectDetails.statusUnratedBackground, Icon: UnratedStatus },
] as const;

const reports = [
  { id: 'daily', label: '日报', backgroundColor: colorThemes.light.projectDetails.dailyReportBackground, Texture: DailyTexture },
  { id: 'weekly', label: '周报', backgroundColor: colorThemes.light.projectDetails.weeklyReportBackground, Texture: WeeklyTexture },
  { id: 'monthly', label: '月报', backgroundColor: colorThemes.light.projectDetails.monthlyReportBackground, Texture: MonthlyTexture },
] as const;

const dimensions = ['安全性', '耐用性', '舒适性', '稳定性', '可用性'] as const;

const devices: readonly DeviceItem[] = [
  { id: 'lift-a', name: 'A-C', serialNumber: '42369783', kind: 'elevator', connected: true, score: 92 },
  { id: 'lift-b', name: 'A-C', serialNumber: '42369783', kind: 'elevator', connected: true, score: 82 },
  { id: 'escalator-a', name: 'A-C', serialNumber: '42369783', kind: 'escalator', connected: true, score: 92 },
  { id: 'lift-c', name: 'A-C', serialNumber: '42369783', kind: 'elevator', connected: true },
  { id: 'lift-offline', name: 'A-C', serialNumber: '42369783', kind: 'elevator', connected: false },
  { id: 'escalator-offline', name: 'A-C', serialNumber: '42369783', kind: 'escalator', connected: false },
];

function SectionHeading({ action, title }: { action?: string; title: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <View accessibilityLabel={action} style={styles.headingAction}>
          <Text style={styles.headingActionText}>{action}</Text>
          <ChevronRight accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={16} height={16} />
        </View>
      ) : null}
    </View>
  );
}

function ProjectOverview() {
  return (
    <View style={styles.overviewCard}>
      <View style={styles.projectSummary}>
        <View style={styles.projectCopy}>
          <Text numberOfLines={1} style={styles.projectName}>皇冠假日酒店</Text>
          <Text numberOfLines={1} style={styles.projectAddress}>漳州市龙文区水仙大街</Text>
        </View>
        <View style={styles.deviceCount}>
          <Text style={styles.deviceCountValue}>46/<Text style={styles.deviceCountTotal}>64</Text></Text>
          <Text style={styles.deviceCountLabel}>云管家/总设备数</Text>
        </View>
      </View>
      <View style={styles.statusRow}>
        {statusItems.map(({ Icon, backgroundColor, id, label, value }) => (
          <View accessibilityLabel={`${label}设备 ${value} 台`} key={id} style={[styles.statusItem, { backgroundColor }]}>
            <Icon accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={14} height={16} />
            <View style={styles.statusCopy}>
              <Text style={styles.statusLabel}>{label}</Text>
              <Text style={styles.statusValue}>{value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ReportSection() {
  return (
    <View style={styles.section}>
      <SectionHeading title="项目报告" />
      <View style={styles.reportRow}>
        {reports.map(({ Texture, backgroundColor, id, label }) => (
          <View key={id} style={[styles.reportCard, { backgroundColor }]}>
            <Texture accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.reportTexture} width={52} height={42} />
            <Text style={styles.reportLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function HealthChart() {
  return (
    <View accessibilityLabel="项目健康综合评分 100 分，状态健康" style={styles.chartFrame}>
      <View style={styles.healthBadge}>
        <HealthBadgeIcon accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={12} height={12} />
        <Text style={styles.healthBadgeText}>健康</Text>
      </View>
      <View style={styles.dimensionNote}>
        <Text style={styles.dimensionNoteText}>五维说明</Text>
        <InfoSmall accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={14} height={14} />
      </View>
      <Text style={[styles.axisLabel, styles.axisSafety]}>安全性</Text>
      <Text style={[styles.axisLabel, styles.axisDurability]}>耐用性</Text>
      <Text style={[styles.axisLabel, styles.axisComfort]}>舒适性</Text>
      <Text style={[styles.axisLabel, styles.axisStability]}>稳定性</Text>
      <Text style={[styles.axisLabel, styles.axisAvailability]}>可用性</Text>
      <Image accessibilityIgnoresInvertColors source={require('../assets/project-health-radar.png')} style={styles.radarImage} />
      <View style={styles.scoreValueRow}>
        <Text style={styles.scoreValue}>100</Text><Text style={styles.scoreUnit}>分</Text>
      </View>
    </View>
  );
}

function HealthSection({ onOpenExportReportSettings }: { onOpenExportReportSettings: () => void }) {
  return (
    <View style={styles.section}>
      <View style={styles.healthHeading}>
        <View style={styles.healthTitleRow}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>项目健康综合评分</Text>
          <Info accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={20} height={20} />
        </View>
        <Pressable
          accessibilityHint="打开导出报告设置"
          accessibilityLabel="导出项目健康报告"
          accessibilityRole="button"
          onPress={onOpenExportReportSettings}
          style={({ pressed }) => [styles.headingAction, pressed && styles.pressed]}
        >
          <Text style={styles.headingActionText}>导出项目健康报告</Text>
          <ChevronRight accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={16} height={16} />
        </Pressable>
      </View>
      <Text style={styles.lastChecked}>最近检查时间：2024年10月23日</Text>
      <View style={styles.healthCard}>
        <HealthChart />
        <View style={styles.healthSummary}>
          <Text style={styles.healthSummaryText}>在检测周期内，项目综合评分健康，设备趋于稳定运行，其中涉及<Text style={styles.healthSummaryStrong}>“稳定性”</Text>的指标存在异常，需重点关注。</Text>
        </View>
        <View style={styles.dimensionList}>
          {dimensions.map((dimension, index) => (
            <React.Fragment key={dimension}>
              <View style={styles.dimensionRow}>
                <Text style={styles.dimensionLabel}>{dimension}</Text>
                <View style={styles.dimensionDevices}>
                  <Text numberOfLines={1} style={styles.dimensionDevicesText}>A-C梯，A-C梯，A-C梯，…</Text>
                  <ChevronRight accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={16} height={16} />
                </View>
              </View>
              {index < dimensions.length - 1 ? <View style={styles.divider} /> : null}
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  const strokeColor = score >= 90 ? colors.success.default : colors.warning.accent;
  return (
    <View accessibilityLabel={`健康评分 ${score} 分`} style={styles.scoreRing}>
      <Svg accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={44} height={44} viewBox="0 0 44 44">
        <Circle cx={22} cy={22} fill="none" r={radius} stroke={colors.background.component} strokeWidth={4} />
        <Circle
          cx={22}
          cy={22}
          fill="none"
          r={radius}
          rotation={-90}
          origin="22, 22"
          stroke={strokeColor}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - score / 100)}
          strokeLinecap="round"
          strokeWidth={4}
        />
      </Svg>
      <Text style={styles.scoreRingText}>{score}</Text>
    </View>
  );
}

function DeviceIcon({ connected, kind }: Pick<DeviceItem, 'connected' | 'kind'>) {
  const Icon = kind === 'elevator'
    ? (connected ? ElevatorFilled : ElevatorDisabled)
    : (connected ? EscalatorFilled : EscalatorDisabled);
  return (
    <View style={[styles.deviceIcon, !connected && styles.deviceIconDisabled]}>
      <Icon accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={24} height={24} />
    </View>
  );
}

function DeviceList({ onOpenDeviceDetails }: { onOpenDeviceDetails: () => void }) {
  return (
    <View style={styles.section}>
      <SectionHeading title="设备列表" />
      <View accessibilityLabel="设备筛选条件" style={styles.filters}>
        {['电梯类型', '是否云设备', '设备健康状态'].map((label) => (
          <View key={label} style={styles.filterItem}>
            <Text style={styles.filterText}>{label}</Text>
            <CaretDown accessibilityElementsHidden color={colors.text.primary} importantForAccessibility="no-hide-descendants" width={16} height={16} />
          </View>
        ))}
      </View>
      <View style={styles.deviceList}>
        {devices.map((device) => (
          <Pressable
            accessibilityHint="进入设备详情"
            accessibilityLabel={`${device.name}，设备编号 ${device.serialNumber}${device.score ? `，健康评分 ${device.score} 分` : ''}`}
            accessibilityRole="button"
            key={device.id}
            onPress={onOpenDeviceDetails}
            style={({ pressed }) => [styles.deviceCell, pressed && styles.pressed]}
          >
            <View style={styles.deviceIdentity}>
              <DeviceIcon connected={device.connected} kind={device.kind} />
              <View style={styles.deviceCopy}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceSerial}>{device.serialNumber}</Text>
              </View>
            </View>
            {device.score ? <ScoreRing score={device.score} /> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function ProjectDetailsView({
  onBack,
  onOpenDeviceDetails,
  onOpenExportReportSettings,
  titleRef,
}: ProjectDetailsViewProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar backgroundColor={colors.background.container} barStyle="dark-content" />
      <View style={styles.navbar}>
        <Pressable
          accessibilityLabel="返回设备视界首页"
          accessibilityRole="button"
          hitSlop={12}
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <ProjectBack
            accessibilityElementsHidden
            height={24}
            importantForAccessibility="no-hide-descendants"
            width={24}
          />
        </Pressable>
        <Text accessibilityRole="header" ref={titleRef} style={styles.navTitle}>项目详情</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.scroll}>
        <ProjectOverview />
        <ReportSection />
        <HealthSection onOpenExportReportSettings={onOpenExportReportSettings} />
        <DeviceList onOpenDeviceDetails={onOpenDeviceDetails} />
      </ScrollView>
    </SafeAreaView>
  );
}

const colors = colorThemes.light;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.container },
  navbar: { height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.container },
  backButton: { position: 'absolute', left: 12, width: 32, height: 40, alignItems: 'flex-start', justifyContent: 'center', zIndex: 1 },
  backButtonPressed: { backgroundColor: colors.background.component },
  navTitle: { color: colors.text.primary, ...typographyTokens.title18Semibold },
  scroll: { flex: 1, backgroundColor: colors.background.page },
  scrollContent: { gap: 16, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 30 },
  overviewCard: { minHeight: 152, gap: 20, padding: 16, borderRadius: 6, backgroundColor: colors.background.container, shadowColor: colors.text.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  projectSummary: { minHeight: 40, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  projectCopy: { minWidth: 0, flex: 1, justifyContent: 'flex-end' },
  projectName: { color: colors.text.primary, ...typographyTokens.title16Semibold, fontWeight: '500' },
  projectAddress: { color: colors.text.secondary, ...typographyTokens.footer12Regular },
  deviceCount: { width: 120, alignItems: 'flex-end' },
  deviceCountValue: { color: colors.text.primary, ...typographyTokens.title16Semibold, fontWeight: '500' },
  deviceCountTotal: { color: colors.text.placeholder },
  deviceCountLabel: { color: colors.text.placeholder, ...typographyTokens.footer12Regular },
  statusRow: { flexDirection: 'row', gap: 8 },
  statusItem: { minWidth: 0, height: 56, flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingHorizontal: 6, paddingVertical: 8, overflow: 'hidden', borderRadius: 6 },
  statusCopy: { minWidth: 0, flex: 1, gap: 4 },
  statusLabel: { color: colors.text.primary, ...typographyTokens.footer12Regular },
  statusValue: { color: colors.text.primary, ...typographyTokens.data16Regular },
  section: { gap: 10 },
  sectionHeading: { height: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: colors.text.primary, ...typographyTokens.title16Semibold, fontWeight: '500' },
  headingAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headingActionText: { color: colors.text.link, ...typographyTokens.footer12Medium },
  reportRow: { height: 60, flexDirection: 'row', gap: 10 },
  reportCard: { minWidth: 0, flex: 1, justifyContent: 'center', padding: 12, overflow: 'hidden', borderRadius: 8 },
  reportTexture: { position: 'absolute', right: -6, top: -4 },
  reportLabel: { color: colors.text.primary, ...typographyTokens.title16Semibold, fontWeight: '500' },
  healthHeading: { height: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  healthTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lastChecked: { marginTop: -8, color: colors.text.placeholder, ...typographyTokens.footer12Medium },
  healthCard: { gap: 16, padding: 16, borderRadius: 6, backgroundColor: colors.background.container },
  chartFrame: { height: 250, overflow: 'hidden', borderWidth: 1, borderColor: colors.background.component, borderRadius: 6, backgroundColor: colors.background.container },
  healthBadge: { position: 'absolute', top: 10, left: 10, zIndex: 2, flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 100, backgroundColor: colors.success.default },
  healthBadgeText: { color: colors.background.container, fontFamily: 'PingFang SC', fontSize: 11, lineHeight: 18, fontWeight: '400' },
  dimensionNote: { position: 'absolute', top: 8, right: 5, zIndex: 2, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2 },
  dimensionNoteText: { color: colors.text.secondary, ...typographyTokens.footer12Regular },
  radarImage: { position: 'absolute', left: '50%', top: 50, width: 170, height: 156, marginLeft: -85, resizeMode: 'contain' },
  axisLabel: { position: 'absolute', color: colors.text.secondary, ...typographyTokens.footer12Regular },
  axisSafety: { top: 26, left: '50%', marginLeft: -18 },
  axisDurability: { top: 99, right: 10 },
  axisComfort: { top: 206, right: 51 },
  axisStability: { top: 206, left: 52 },
  axisAvailability: { top: 99, left: 10 },
  scoreValueRow: { position: 'absolute', top: 118, left: 0, right: 0, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  scoreValue: { color: colors.text.primary, ...typographyTokens.data24Regular },
  scoreUnit: { paddingBottom: 2, color: colors.text.primary, ...typographyTokens.footer12Regular },
  healthSummary: { padding: 10, borderWidth: 1, borderColor: colors.background.component, borderRadius: 6, backgroundColor: colors.projectDetails.scoreCardBackground },
  healthSummaryText: { color: colors.text.secondary, ...typographyTokens.body14Regular },
  healthSummaryStrong: { color: colors.text.primary, fontWeight: '500' },
  dimensionList: { gap: 8 },
  dimensionRow: { minHeight: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dimensionLabel: { color: colors.text.primary, ...typographyTokens.body14Medium },
  dimensionDevices: { minWidth: 0, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  dimensionDevicesText: { maxWidth: 191, color: colors.text.link, textAlign: 'right', ...typographyTokens.body14Medium },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border.componentStroke },
  filters: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filterItem: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  filterText: { color: colors.text.primary, ...typographyTokens.footer12Regular },
  deviceList: { gap: 8 },
  deviceCell: { minHeight: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14, overflow: 'hidden', borderRadius: 6, backgroundColor: colors.background.container },
  deviceIdentity: { minWidth: 0, flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  deviceIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: colors.projectDetails.dailyReportBackground },
  deviceIconDisabled: { backgroundColor: colors.background.component },
  deviceCopy: { minWidth: 0, flex: 1 },
  deviceName: { color: colors.text.primary, ...typographyTokens.title16Semibold },
  deviceSerial: { color: colors.text.secondary, ...typographyTokens.footer12Regular },
  scoreRing: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  scoreRingText: { position: 'absolute', color: colors.text.primary, ...typographyTokens.body14Regular },
  pressed: { opacity: 0.72 },
});
