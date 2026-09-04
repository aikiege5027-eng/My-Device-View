import React, { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Mask, Rect, Stop } from 'react-native-svg';

import HomeBack from '../assets/home-back.svg';
import HomeChevronDown from '../assets/home-chevron-down.svg';
import HomeChevronRight from '../assets/home-chevron-right.svg';
import HomeContractChevron from '../assets/home-contract-chevron.svg';
import HomeContractSwap from '../assets/home-contract-swap.svg';
import HomeInfo from '../assets/home-info.svg';
import HomeMall from '../assets/home-mall.svg';
import HomeNotification from '../assets/home-notification.svg';
import HomeOnlineRate from '../assets/home-online-rate.svg';
import HomeProtocolWedge from '../assets/home-protocol-wedge.svg';
import HomeRegistrationRate from '../assets/home-registration-rate.svg';
import HomeSearch from '../assets/home-search.svg';
import HomeStar from '../assets/home-star.svg';
import HomeStarFilled from '../assets/home-star-filled.svg';
import HomeStatusRight from '../assets/home-status-right.svg';
import HomeTab from '../assets/home-tab.svg';
import ReportTab from '../assets/report-tab.svg';
import UserTab from '../assets/user-tab.svg';
import { BottomSheet } from './BottomSheet';
import { FilterBar } from './FilterBar';
import { Picker, type PickerColumns } from './Picker';
import { colorThemes, typographyTokens } from '../designTokens';

const colors = colorThemes.light;

type MyDeviceHomeViewProps = {
  onBack: () => void;
};

type ProjectSortId = 'default' | 'score-desc' | 'score-asc' | 'status-priority';
type ProjectSortStatus = 'healthy' | 'unrated';

type ProjectCardData = {
  defaultOrder: number;
  healthScore: number | null;
  id: string;
  isFavorite: boolean;
  hasNotification: boolean;
  status: ProjectSortStatus;
};

type ProjectCardProps = {
  project: ProjectCardData;
};

const DEFAULT_PROJECT_SORT: ProjectSortId = 'default';
const PROJECT_SORT_COLUMN_ID = 'projectSort';

const projectSortOptions: readonly { id: ProjectSortId; label: string }[] = [
  { id: 'default', label: '默认排序' },
  { id: 'score-desc', label: '健康分：高 → 低' },
  { id: 'score-asc', label: '健康分：低 → 高' },
  { id: 'status-priority', label: '状态优先' },
];

const projectSortColumns: PickerColumns<ProjectSortId> = [
  {
    accessibilityLabel: '项目排序方式',
    id: PROJECT_SORT_COLUMN_ID,
    options: projectSortOptions.map(({ id, label }) => ({ id, label, value: id })),
  },
];

function projectSortLabelOf(sort: ProjectSortId) {
  return projectSortOptions.find((option) => option.id === sort)?.label ?? '默认排序';
}

const projects: readonly ProjectCardData[] = [
  {
    defaultOrder: 0,
    healthScore: 98,
    id: 'bio-nano-park-featured',
    isFavorite: true,
    hasNotification: true,
    status: 'healthy',
  },
  {
    defaultOrder: 1,
    healthScore: null,
    id: 'bio-nano-park-standard',
    isFavorite: false,
    hasNotification: false,
    status: 'unrated',
  },
];

const projectStatusPriority: Record<ProjectSortStatus, number> = {
  unrated: 0,
  healthy: 1,
};

type HeroBackgroundProps = {
  height: number;
  startY?: number;
};

const FIGMA_CANVAS_WIDTH = 375;
const FIGMA_HERO_HEIGHT = 294;
const FIGMA_NAVBAR_HEIGHT = 46;
const FIGMA_WEB_TOP_SAFE_AREA = 44;
const FIGMA_WEB_BOTTOM_SAFE_AREA = 34;

function HeroBackground({ height, startY = 0 }: HeroBackgroundProps) {
  if (height <= 0) return null;

  return (
    <View pointerEvents="none" style={[styles.heroBackground, { height }]}>
      <Svg
        height="100%"
        preserveAspectRatio="none"
        viewBox={`0 ${startY} ${FIGMA_CANVAS_WIDTH} ${height}`}
        width="100%"
      >
        <Defs>
          <LinearGradient gradientUnits="userSpaceOnUse" id="homeHeroColor" x1="375" x2="0" y1="0" y2="294">
            <Stop offset="0" stopColor={colors.home.heroGreen} />
            <Stop offset="0.68" stopColor={colors.home.heroGreen} />
            <Stop offset="0.93" stopColor={colors.home.heroPink} />
          </LinearGradient>
          <LinearGradient gradientUnits="userSpaceOnUse" id="homeHeroFade" x1="0" x2="0" y1="0" y2="294">
            <Stop offset="0" stopColor={colors.background.container} stopOpacity="1" />
            <Stop offset="1" stopColor={colors.background.container} stopOpacity="0" />
          </LinearGradient>
          <Mask height="294" id="homeHeroMask" maskUnits="userSpaceOnUse" width="375" x="0" y="0">
            <Rect fill="url(#homeHeroFade)" height="294" width="375" x="0" y="0" />
          </Mask>
        </Defs>
        <Rect fill="url(#homeHeroColor)" height="294" mask="url(#homeHeroMask)" width="375" x="0" y="0" />
      </Svg>
    </View>
  );
}

function ProtocolTabsBackground() {
  return (
    <View pointerEvents="none" style={styles.protocolTabsBackground}>
      <Svg height="100%" preserveAspectRatio="none" viewBox="0 0 311 38" width="100%">
        <Defs>
          <LinearGradient gradientUnits="userSpaceOnUse" id="protocolTabsGradient" x1="155.5" x2="155.5" y1="0" y2="38">
            <Stop offset="0" stopColor={colors.home.contractHeaderBackground} />
            <Stop offset="1" stopColor={colors.brand.light} />
          </LinearGradient>
        </Defs>
        <Rect fill="url(#protocolTabsGradient)" height="38" width="311" />
      </Svg>
    </View>
  );
}

function InfoIcon() {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <HomeInfo height={12} width={12} />
    </View>
  );
}

function RateMetric({
  Icon,
  label,
}: {
  Icon: React.ComponentType<{ height?: number; width?: number }>;
  label: string;
}) {
  return (
    <View style={styles.rateMetric}>
      <View style={styles.rateGraphic}>
        <Icon height={59} width={64} />
        <Text style={styles.rateValue}>95<Text style={styles.rateUnit}>%</Text></Text>
      </View>
      <View style={styles.labelWithInfo}>
        <Text style={styles.metricLabel}>{label}</Text>
        <InfoIcon />
      </View>
    </View>
  );
}

function ValueLink({ value }: { value: string }) {
  return (
    <View style={styles.valueLink}>
      <Text style={styles.metricValue}>{value}</Text>
      <HomeChevronRight accessibilityElementsHidden height={12} importantForAccessibility="no-hide-descendants" width={12} />
    </View>
  );
}

function ProjectCard({ project }: ProjectCardProps) {
  const hasHealthSummary = project.healthScore !== null;

  return (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <Text numberOfLines={1} style={styles.projectName}>生物纳米科技园二期</Text>
        {project.isFavorite ? <HomeStarFilled height={18} width={18} /> : <HomeStar height={18} width={18} />}
        {project.hasNotification ? <HomeNotification height={18} width={18} /> : null}
      </View>
      <Text numberOfLines={1} style={styles.projectAddress}>苏州工业园区星湖街218号苏州工业园区星号</Text>
      {hasHealthSummary ? (
        <View style={styles.healthRow}>
          <Text style={styles.projectScore}>项目健康综合评分：<Text style={styles.projectScoreStrong}>{project.healthScore}</Text> 分</Text>
          <View style={styles.healthTag}>
            <Text style={styles.healthTagText}>健康</Text>
            <HomeChevronRight height={14} width={14} />
          </View>
        </View>
      ) : null}
      <View style={styles.projectDivider} />
      <View style={styles.projectFooter}>
        <View style={styles.projectCounts}>
          <Text style={styles.projectCountLabel}>共计 <Text style={styles.projectCountValue}>88</Text></Text>
          <Text style={styles.projectCountLabel}>直梯 <Text style={styles.projectCountValue}>12</Text></Text>
          <Text style={styles.projectCountLabel}>扶梯 <Text style={styles.projectCountValue}>66</Text></Text>
        </View>
        <View style={styles.expandAction}>
          <Text style={styles.expandText}>展开</Text>
          <HomeChevronDown height={16} width={16} />
        </View>
      </View>
    </View>
  );
}

function BottomTab({
  active = false,
  Icon,
  label,
}: {
  active?: boolean;
  Icon: React.ComponentType<{ height?: number; width?: number }>;
  label: string;
}) {
  return (
    <View accessibilityLabel={label} style={styles.bottomTab}>
      <Icon height={20} width={20} />
      <Text style={[styles.bottomTabLabel, active && styles.bottomTabLabelActive]}>{label}</Text>
    </View>
  );
}

export function MyDeviceHomeView({ onBack }: MyDeviceHomeViewProps) {
  const insets = useSafeAreaInsets();
  const [projectSort, setProjectSort] = useState<ProjectSortId>(DEFAULT_PROJECT_SORT);
  const [sortPickerOpen, setSortPickerOpen] = useState(false);
  const [draftProjectSort, setDraftProjectSort] = useState<ProjectSortId>(DEFAULT_PROJECT_SORT);
  const sortedProjects = useMemo(() => {
    return [...projects].sort((left, right) => {
      let comparison = 0;

      if (projectSort === 'score-desc') {
        comparison = (right.healthScore ?? Number.NEGATIVE_INFINITY)
          - (left.healthScore ?? Number.NEGATIVE_INFINITY);
      } else if (projectSort === 'score-asc') {
        comparison = (left.healthScore ?? Number.NEGATIVE_INFINITY)
          - (right.healthScore ?? Number.NEGATIVE_INFINITY);
      } else if (projectSort === 'status-priority') {
        comparison = projectStatusPriority[left.status]
          - projectStatusPriority[right.status];
      }

      return comparison || left.defaultOrder - right.defaultOrder;
    });
  }, [projectSort]);
  const isWebPreview = Platform.OS === 'web' && insets.top === 0;
  const topInset = isWebPreview ? FIGMA_WEB_TOP_SAFE_AREA : insets.top;
  const bottomInset = Platform.OS === 'web' && insets.bottom === 0
    ? FIGMA_WEB_BOTTOM_SAFE_AREA
    : insets.bottom;
  const topChromeHeight = topInset + FIGMA_NAVBAR_HEIGHT;
  const scrollHeroHeight = Math.max(0, FIGMA_HERO_HEIGHT - topChromeHeight);

  const openSortPicker = () => {
    setDraftProjectSort(projectSort);
    setSortPickerOpen(true);
  };
  const closeSortPicker = () => setSortPickerOpen(false);

  return (
    <View style={styles.safeArea}>
      <StatusBar backgroundColor={colors.home.heroGreen} barStyle="dark-content" />
      <View style={[styles.topChrome, { paddingTop: topInset }]}>
        <HeroBackground height={topChromeHeight} />
        {isWebPreview ? (
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.previewStatusBar}>
            <Text style={styles.previewTime}>9:41</Text>
            <HomeStatusRight height={21} width={67} />
          </View>
        ) : null}
        <View style={styles.navbar}>
          <Pressable
            accessibilityLabel="返回工单明细"
            accessibilityRole="button"
            hitSlop={12}
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <HomeBack accessibilityElementsHidden height={24} importantForAccessibility="no-hide-descendants" width={24} />
          </Pressable>
          <Text accessibilityRole="header" style={styles.navTitle}>设备视界</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <HeroBackground height={scrollHeroHeight} startY={topChromeHeight} />
        <View style={styles.searchSection}>
          <View style={styles.searchField}>
            <HomeSearch accessibilityElementsHidden height={24} importantForAccessibility="no-hide-descendants" width={24} />
            <TextInput
              accessibilityLabel="搜索项目、设备或 ICCID"
              placeholder="搜索项目/设备/ICCID"
              placeholderTextColor={colors.text.placeholder}
              style={styles.searchInput}
            />
          </View>
        </View>

        <View style={styles.contentColumn}>
          <View style={styles.overviewGroup}>
            <View style={styles.organizationRow}>
          <HomeMall accessibilityElementsHidden height={22} importantForAccessibility="no-hide-descendants" width={22} />
          <Text style={styles.organizationName}>通力</Text>
              <HomeChevronDown accessibilityElementsHidden height={16} importantForAccessibility="no-hide-descendants" width={16} />
            </View>

            <View style={styles.summaryGroup}>
              <View style={styles.overviewCard}>
          <View style={styles.overviewHeading}>
            <View>
              <Text accessibilityRole="header" style={styles.sectionTitle}>设备总览</Text>
              <Text style={styles.updatedAt}>数据更新于今日4:00</Text>
            </View>
            <View style={styles.overviewActions}>
              <Text style={styles.overviewActionText}>指标详情</Text>
              <View style={styles.verticalDivider} />
              <Text style={styles.overviewActionText}>筛选</Text>
            </View>
          </View>
          <View style={styles.overviewMetrics}>
            <View style={styles.totalMetric}>
              <Text style={styles.totalValue}>10,888</Text>
              <View style={styles.labelWithInfo}>
                <Text style={styles.metricLabel}>在保总台量</Text>
                <InfoIcon />
              </View>
            </View>
            <View style={styles.rateMetrics}>
              <RateMetric Icon={HomeRegistrationRate} label="设备注册率" />
              <RateMetric Icon={HomeOnlineRate} label="真实在线率" />
            </View>
          </View>
        </View>

        <View style={styles.contractCard}>
          <View style={styles.contractHeader}>
            <View style={styles.contractHeaderSummary}>
              <Text style={styles.contractHeaderLabel}>维保合同有效</Text>
              <Text style={styles.contractHeaderValue}>10,238</Text>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.contractHeaderIcon}>
                <HomeContractChevron height={16} width={16} />
              </View>
            </View>
            <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.contractHeaderIcon}>
              <HomeContractSwap height={16} width={16} />
            </View>
          </View>
          <View style={styles.contractBody}>
            <View style={styles.protocolTabs}>
              <ProtocolTabsBackground />
              <View style={styles.protocolTabActive}>
                <Text style={styles.protocolTabLabel}>有云管家协议</Text>
                <Text style={styles.protocolCount}>888</Text>
                <HomeChevronRight accessibilityElementsHidden height={12} importantForAccessibility="no-hide-descendants" width={12} />
              </View>
              <HomeProtocolWedge
                accessibilityElementsHidden
                height={38}
                importantForAccessibility="no-hide-descendants"
                style={styles.protocolWedge}
                width={32}
              />
              <View style={styles.protocolTabInactive}>
                <Text style={styles.protocolTabLabel}>无云管家协议</Text>
              </View>
            </View>
            <View style={styles.registrationRow}>
              <View style={styles.registrationPrimary}>
                <ValueLink value="32,238" />
                <Text style={styles.metricLabel}>已注册</Text>
              </View>
              <View style={styles.verticalDividerTall} />
              <View style={styles.registrationMetric}>
                <ValueLink value="1,168" />
                <Text style={styles.metricLabel}>在线</Text>
              </View>
              <View style={styles.registrationMetric}>
                <ValueLink value="170" />
                <Text style={styles.metricLabel}>异常</Text>
              </View>
            </View>
            <View style={styles.unregisteredRow}>
              <Text style={styles.metricLabel}>未注册　<Text style={styles.protocolCount}>888</Text></Text>
              <HomeChevronRight height={12} width={12} />
            </View>
          </View>
        </View>

        <View style={styles.expiringCard}>
          <View>
            <ValueLink value="12,238" />
            <View style={styles.labelWithInfo}>
              <Text style={styles.metricLabel}>合同临期(云管家设备)</Text>
              <InfoIcon />
            </View>
          </View>
          <View style={styles.verticalDividerTall} />
          <View style={styles.expiringMetric}>
            <ValueLink value="68" />
            <View style={styles.labelWithInfo}>
              <Text style={styles.metricLabel}>通力物权</Text>
              <InfoIcon />
            </View>
          </View>
          <View style={styles.expiringMetric}>
            <ValueLink value="170" />
            <View style={styles.labelWithInfo}>
              <Text style={styles.metricLabel}>客户物权</Text>
              <InfoIcon />
            </View>
          </View>
        </View>

              <View style={styles.pagination}>
                <View style={styles.paginationActive} />
                <View style={styles.paginationDot} />
                <View style={styles.paginationDot} />
              </View>
            </View>
          </View>

          <View style={styles.projectGroup}>
            <View style={styles.projectTabs}>
              <View style={styles.projectTabActive}><Text style={styles.projectTabActiveText}>项目 (2)</Text></View>
              <Text style={styles.projectTabText}>重点关注项目 (8)</Text>
              <Text style={styles.projectTabText}>区域 (5)</Text>
            </View>
            <FilterBar
              accessibilityLabel="项目筛选条件"
              items={[
                {
                  accessibilityHint: '选择项目排序方式',
                  accessibilityLabel: `排序方式：${projectSortLabelOf(projectSort)}`,
                  expanded: sortPickerOpen,
                  id: 'project-sort',
                  label: projectSortLabelOf(projectSort),
                  onPress: openSortPicker,
                  testID: 'project-sort-filter',
                },
              ]}
            />
            {sortedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomSafeArea, { paddingBottom: bottomInset }]}>
        <View style={styles.bottomBar}>
          <BottomTab active Icon={HomeTab} label="首页" />
          <BottomTab Icon={ReportTab} label="报告中心" />
          <BottomTab Icon={UserTab} label="我的" />
        </View>
      </View>

      {/* Picker 面板不含遮罩、动画与安全区，由 BottomSheet 宿主负责。 */}
      <BottomSheet
        dismissAccessibilityLabel="关闭排序方式选择"
        onRequestClose={closeSortPicker}
        visible={sortPickerOpen}
      >
        <View style={{ paddingBottom: bottomInset }}>
          <Picker<ProjectSortId>
            cancelText="取消"
            columns={projectSortColumns}
            confirmText="确定"
            onCancel={closeSortPicker}
            onChange={(next) => {
              setDraftProjectSort(next[PROJECT_SORT_COLUMN_ID] ?? DEFAULT_PROJECT_SORT);
            }}
            onConfirm={(values) => {
              setProjectSort(values[PROJECT_SORT_COLUMN_ID] ?? DEFAULT_PROJECT_SORT);
              closeSortPicker();
            }}
            testID="project-sort-picker"
            title
            titleText="排序方式"
            value={{ [PROJECT_SORT_COLUMN_ID]: draftProjectSort }}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.home.pageBackground },
  topChrome: { position: 'relative', overflow: 'hidden', backgroundColor: colors.home.pageBackground },
  heroBackground: { position: 'absolute', top: 0, left: 0, right: 0 },
  previewStatusBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 44, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 8, paddingRight: 15, paddingLeft: 28 },
  previewTime: { marginTop: 4, color: colors.home.strongText, ...typographyTokens.status15Semibold },
  navbar: { height: FIGMA_NAVBAR_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', left: 12, width: 40, height: FIGMA_NAVBAR_HEIGHT, alignItems: 'flex-start', justifyContent: 'center', borderRadius: 4, zIndex: 2 },
  navTitle: { color: colors.text.primary, ...typographyTokens.title18Semibold },
  pressed: { backgroundColor: colors.background.component },
  searchSection: { height: 56, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 8, zIndex: 1 },
  searchField: { height: 40, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, borderRadius: 999, backgroundColor: colors.background.container },
  searchInput: { minWidth: 0, flex: 1, paddingVertical: 0, color: colors.text.primary, ...typographyTokens.title16Regular },
  scroll: { flex: 1, backgroundColor: colors.home.pageBackground },
  scrollContent: { position: 'relative', paddingBottom: 24, backgroundColor: colors.home.pageBackground },
  contentColumn: { gap: 16, paddingHorizontal: 16, paddingTop: 10, zIndex: 1 },
  overviewGroup: { gap: 8 },
  summaryGroup: { gap: 16 },
  projectGroup: { gap: 16 },
  organizationRow: { height: 24, flexDirection: 'row', alignItems: 'center', gap: 8 },
  organizationName: { color: colors.home.organizationText, ...typographyTokens.paragraph13Semibold, fontWeight: '500' },
  overviewCard: { gap: 8, padding: 16, borderWidth: 1, borderColor: colors.background.container, borderRadius: 8, backgroundColor: colors.background.container },
  overviewHeading: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  sectionTitle: { color: colors.text.primary, ...typographyTokens.title16Semibold },
  updatedAt: { color: colors.text.secondary, ...typographyTokens.footer12Regular },
  overviewActions: { height: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  overviewActionText: { color: colors.text.primary, ...typographyTokens.body14Regular },
  verticalDivider: { width: 1, height: 22, backgroundColor: colors.border.componentStroke },
  overviewMetrics: { minHeight: 80, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  totalMetric: { justifyContent: 'flex-end' },
  totalValue: { color: colors.text.primary, ...typographyTokens.title30Medium },
  labelWithInfo: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  metricLabel: { color: colors.text.secondary, ...typographyTokens.footer12Regular },
  metricValue: { color: colors.text.primary, ...typographyTokens.title16Medium },
  rateMetrics: { flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  rateMetric: { alignItems: 'center', gap: 4 },
  rateGraphic: { width: 64, height: 56, alignItems: 'center', justifyContent: 'center' },
  rateValue: { position: 'absolute', color: colors.text.secondary, ...typographyTokens.title18Semibold },
  rateUnit: { ...typographyTokens.footer10Semibold },
  contractCard: { gap: 16, overflow: 'hidden', paddingBottom: 16, borderRadius: 8, backgroundColor: colors.background.container },
  contractHeader: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.home.contractHeaderBackground },
  contractHeaderSummary: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contractHeaderLabel: { color: colors.text.secondary, ...typographyTokens.title16Regular },
  contractHeaderValue: { color: colors.brand.active, ...typographyTokens.title16Medium },
  contractHeaderIcon: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: colors.brand.disabled },
  contractBody: { marginHorizontal: 16, overflow: 'hidden', borderRadius: 4, backgroundColor: colors.home.protocolBackground },
  protocolTabs: { position: 'relative', height: 38, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  protocolTabsBackground: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  protocolTabActive: { zIndex: 1, height: 38, flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 16, paddingVertical: 8, backgroundColor: colors.home.protocolBackground },
  protocolTabInactive: { minWidth: 0, flex: 1, height: 38, alignItems: 'flex-start', justifyContent: 'center', paddingRight: 8, paddingVertical: 8 },
  protocolTabLabel: { color: colors.text.secondary, ...typographyTokens.body14Regular },
  protocolWedge: { zIndex: 1, flexShrink: 0 },
  protocolCount: { color: colors.text.primary, ...typographyTokens.body14Medium },
  registrationRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, paddingVertical: 8 },
  registrationPrimary: { minWidth: 96 },
  registrationMetric: { flex: 1 },
  valueLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verticalDividerTall: { width: 1, alignSelf: 'stretch', backgroundColor: colors.home.protocolBorder },
  unregisteredRow: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, borderTopWidth: 1, borderTopColor: colors.home.protocolBorder },
  expiringCard: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.background.container },
  expiringMetric: { flex: 1 },
  pagination: { height: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  paginationActive: { width: 18, height: 6, borderRadius: 3, backgroundColor: colors.brand.default },
  paginationDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand.disabled },
  projectTabs: { minHeight: 48, flexDirection: 'row', alignItems: 'center' },

  projectTabActive: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.brand.light },
  projectTabActiveText: { color: colors.brand.default, ...typographyTokens.title16Semibold },
  projectTabText: { paddingHorizontal: 16, paddingVertical: 8, color: colors.text.primary, ...typographyTokens.title16Regular },
  projectCard: { gap: 12, padding: 16, borderRadius: 12, backgroundColor: colors.background.container },
  projectHeader: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  projectName: { minWidth: 0, flex: 1, color: colors.text.primary, ...typographyTokens.title16Medium },
  projectAddress: { color: colors.text.secondary, ...typographyTokens.body14Regular },
  healthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  projectScore: { minWidth: 0, flex: 1, color: colors.text.secondary, ...typographyTokens.body14Regular },
  projectScoreStrong: { color: colors.home.strongText, ...typographyTokens.body14Medium },
  healthTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: colors.success.light },
  healthTagText: { color: colors.success.default, ...typographyTokens.footer12Regular },
  projectDivider: { height: 1, backgroundColor: colors.border.componentStroke },
  projectFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  projectCounts: { minWidth: 0, flex: 1, flexDirection: 'row', gap: 12 },
  projectCountLabel: { color: colors.text.secondary, ...typographyTokens.footer12Regular },
  projectCountValue: { color: colors.text.primary },
  expandAction: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 },
  expandText: { color: colors.text.brand, ...typographyTokens.body14Medium },
  bottomSafeArea: { backgroundColor: colors.background.container },
  bottomBar: { height: 56, flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 0.5, borderTopColor: colors.border.componentStroke, backgroundColor: colors.background.container },
  bottomTab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 2 },
  bottomTabLabel: { color: colors.text.primary, ...typographyTokens.footer10Regular },
  bottomTabLabelActive: { color: colors.brand.default, ...typographyTokens.footer10Semibold },
});
