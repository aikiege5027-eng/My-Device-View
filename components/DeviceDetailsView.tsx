import React, { useState } from 'react';
import {
  Alert,
  Image,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ArrowUp from '../assets/arrow-up.svg';
import Back from '../assets/back.svg';
import Building from '../assets/building.svg';
import Check from '../assets/check.svg';
import ChevronGray from '../assets/chevron-gray.svg';
import ChevronWhite from '../assets/chevron-white.svg';
import Dashboard from '../assets/dashboard.svg';
import Elevator from '../assets/elevator.svg';
import ElevatorDoor from '../assets/elevator-door.svg';
import Location from '../assets/location.svg';
import ReportWave from '../assets/report-wave.svg';
import { colorThemes, typographyTokens } from '../designTokens';

type DetailTab = 'realtime' | 'trend' | 'summary' | 'events';
type SensorValue = { label: string; value: string; unit?: string };

type DeviceDetailsViewProps = {
  backButtonRef?: React.Ref<View>;
  onBack: () => void;
};

const tabs: readonly { id: DetailTab; label: string }[] = [
  { id: 'realtime', label: '实时状态' },
  { id: 'trend', label: '日在线率趋势' },
  { id: 'summary', label: '数据统计' },
  { id: 'events', label: '设备事件' },
];

const doorASensors: readonly SensorValue[] = [
  { label: '温度', value: '23.5', unit: '℃' },
  { label: '湿度', value: '23.5', unit: '%' },
  { label: '速度', value: '2.1', unit: 'm/s' },
  { label: '平层感应上', value: '0' },
  { label: '平层感应下', value: '1' },
];

const doorBSensors: readonly SensorValue[] = [
  { label: '温度', value: '23.5', unit: '℃' },
  { label: '湿度', value: '23.5', unit: '%' },
  { label: '速度', value: '2.1', unit: 'm/s' },
  { label: '平层感应上', value: '−−' },
  { label: '平层感应下', value: '−−' },
];

const machineRoomSensors: readonly SensorValue[] = [
  { label: '温度', value: '23.5', unit: '℃' },
  { label: '湿度', value: '23.5', unit: '%' },
  { label: '检修回路', value: '402' },
  { label: '厅门A回路', value: '403' },
  { label: '厅门B回路', value: '403' },
  { label: '轿门A回路', value: '406' },
  { label: '轿门B回路', value: '402' },
];

function DeviceOverview() {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('缆绳有些磨损 看情况换一根。');

  const submitNote = () => {
    const nextNote = note.trim();
    if (!nextNote) return;
    setSavedNote(nextNote);
    setNote('');
  };

  return (
    <View style={styles.overviewSection}>
      <View style={styles.deviceTitleRow}>
        <Text numberOfLines={1} style={styles.deviceTitle}>30267187 | B7号L3</Text>
        <Elevator accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={24} height={24} />
        <View style={styles.alwaysBadge}><Text style={styles.alwaysText}>24/7</Text></View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoLine}>
          <Building accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={16} height={16} />
          <Text numberOfLines={1} style={styles.infoText}>苏州大学附属第一医院</Text>
        </View>
        <View style={styles.infoLine}>
          <Location accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={16} height={16} />
          <Text numberOfLines={1} style={styles.infoText}>苏州市姑苏区平海路899号</Text>
        </View>

        <Pressable
          accessibilityHint="查看设备健康报告详情"
          accessibilityRole="button"
          onPress={() => Alert.alert('设备健康报告', '当前评分 88 分，状态为“注意”。')}
          style={({ pressed }) => [styles.reportCard, pressed && styles.pressed]}
        >
          <ReportWave accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width="100%" height="100%" style={StyleSheet.absoluteFill} />
          <Image
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            resizeMode="cover"
            source={require('../assets/report-texture.png')}
            style={[StyleSheet.absoluteFillObject, styles.reportTexture]}
          />
          <View style={styles.reportTopRow}>
            <View>
              <Text style={styles.reportTitle}>设备健康报告</Text>
              <Text style={styles.reportTip}>设备分数于每日中午12点更新</Text>
            </View>
            <View style={styles.reportLinkRow}>
              <Text style={styles.reportLink}>报告详情</Text>
              <ChevronWhite accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={8} height={13} />
            </View>
          </View>
          <View style={styles.reportScoreRow}>
            <Text style={styles.reportScore}>88<Text style={styles.reportScoreUnit}>分</Text></Text>
            <Text style={styles.reportStatus}>状态：<Text style={styles.reportStatusStrong}>注意</Text></Text>
          </View>
        </Pressable>

        <View style={styles.noteArea}>
          <View style={styles.noteRow}>
            <View style={styles.noteCopy}>
              <Text numberOfLines={1} style={styles.noteText}>
                <Text style={styles.noteLabel}>备注：</Text>{savedNote}
              </Text>
              <Text style={styles.noteMeta}>2025 10 25 10:25:30  Zhangdaoming</Text>
            </View>
            <ChevronGray accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={8} height={13} />
          </View>
          <TextInput
            accessibilityLabel="快速输入备注信息"
            onChangeText={setNote}
            onSubmitEditing={submitNote}
            placeholder="快速输入备注信息"
            placeholderTextColor={colorThemes.light.text.placeholder}
            returnKeyType="done"
            style={styles.noteInput}
            value={note}
          />
        </View>

        <View style={styles.divider} />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((value) => !value)}
          style={({ pressed }) => [styles.moreRow, pressed && styles.pressed]}
        >
          <Text style={styles.moreLabel}>更多基础信息</Text>
          <View style={styles.moreAction}>
            <Text style={styles.moreActionText}>{expanded ? '收起' : '查看'}</Text>
            <ChevronGray
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              width={8}
              height={13}
              style={expanded ? styles.chevronExpanded : undefined}
            />
          </View>
        </Pressable>
        {expanded && (
          <View style={styles.extraInfo}>
            <Text style={styles.extraInfoText}>设备型号　KONE-MonoSpace 700</Text>
            <Text style={styles.extraInfoText}>最近巡检　2025-10-25</Text>
            <Text style={styles.extraInfoText}>维保单位　通力电梯有限公司</Text>
          </View>
        )}
      </View>

      <View accessibilityLabel="第 1 页，共 2 页" style={styles.pagination}>
        <View style={styles.pageActive} />
        <View style={styles.pageDot} />
      </View>
    </View>
  );
}

function StatusTile({ children, label, width }: React.PropsWithChildren<{ label: string; width: number }>) {
  return (
    <View accessible accessibilityLabel={label} style={[styles.statusTile, { width }]}>
      {children}
    </View>
  );
}

function SensorTile({ item, width }: { item: SensorValue; width: number }) {
  return (
    <View accessible accessibilityLabel={`${item.label} ${item.value}${item.unit ?? ''}`} style={[styles.sensorTile, { width }]}>
      <Text numberOfLines={1} style={styles.sensorLabel}>{item.label}</Text>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.sensorValue}>
        {item.value}<Text style={styles.sensorUnit}>{item.unit}</Text>
      </Text>
    </View>
  );
}

function SensorGroup({ data, title, tileWidth }: { data: readonly SensorValue[]; title: string; tileWidth: number }) {
  return (
    <View style={styles.sensorGroup}>
      <Text accessibilityRole="header" style={styles.sensorHeading}>{title}</Text>
      <View style={styles.tileGrid}>
        {data.map((item) => <SensorTile item={item} key={item.label} width={tileWidth} />)}
      </View>
    </View>
  );
}

function RealtimePanel() {
  const [innerWidth, setInnerWidth] = useState(311);
  const tileWidth = Math.max(60, (innerWidth - 36) / 4);
  const handleLayout = (event: LayoutChangeEvent) => setInnerWidth(event.nativeEvent.layout.width - 32);

  return (
    <View onLayout={handleLayout} style={styles.detailPanel}>
      <Text accessibilityRole="header" style={styles.panelHeading}>实时状态数据</Text>
      <View style={styles.tileGrid}>
        <StatusTile label="当前楼层，上行，1层，楼层序号5" width={tileWidth}>
          <Text style={styles.statusLabel}>当前楼层</Text>
          <View style={styles.floorRow}>
            <ArrowUp accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={15} height={17} />
            <Text style={styles.floorValue}>1</Text>
          </View>
          <Text style={styles.statusBottomValue}>[5]</Text>
        </StatusTile>
        <StatusTile label="梯门状态，已关门" width={tileWidth}>
          <Text style={styles.statusLabel}>梯门状态</Text>
          <ElevatorDoor accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={30} height={30} />
          <Text style={styles.statusBottomValue}>已关门</Text>
        </StatusTile>
        <StatusTile label="门区状态，在门区" width={tileWidth}>
          <Text style={styles.statusLabel}>门区状态</Text>
          <Text style={styles.statusMainValue}>在门区</Text>
        </StatusTile>
        <StatusTile label="运行速度，2.4米每秒" width={tileWidth}>
          <Text style={styles.statusLabel}>运行速度</Text>
          <Dashboard accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={30} height={24} />
          <Text style={styles.statusBottomValue}>2.4<Text style={styles.statusUnit}>m/s</Text></Text>
        </StatusTile>
        <StatusTile label="服务模式，正常" width={tileWidth}>
          <Text style={styles.statusLabel}>服务模式</Text>
          <Check accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={30} height={30} />
          <Text style={styles.statusBottomValue}>正常</Text>
        </StatusTile>
        <StatusTile label="实时载重，百分之60" width={tileWidth}>
          <Text style={styles.statusLabel}>实时载重</Text>
          <Text style={styles.statusLargeValue}>60<Text style={styles.statusUnit}>%</Text></Text>
        </StatusTile>
        <StatusTile label="上次内呼，125秒前" width={tileWidth}>
          <Text style={styles.statusLabel}>上次内呼</Text>
          <Text style={styles.statusLargeValue}>125<Text style={styles.statusUnit}>S前</Text></Text>
        </StatusTile>
        <StatusTile label="上次外呼，暂无" width={tileWidth}>
          <Text style={styles.statusLabel}>上次外呼</Text>
          <Text style={styles.statusMainValue}>暂无</Text>
        </StatusTile>
      </View>
      <SensorGroup data={doorASensors} tileWidth={tileWidth} title="轿门A传感器数据" />
      <SensorGroup data={doorBSensors} tileWidth={tileWidth} title="轿门B传感器数据" />
      <SensorGroup data={machineRoomSensors} tileWidth={tileWidth} title="机房传感器数据" />
    </View>
  );
}

function TrendPanel() {
  const values = [62, 72, 68, 91, 85, 88, 96];
  return (
    <View style={styles.detailPanel}>
      <Text accessibilityRole="header" style={styles.panelHeading}>近 7 日日在线率</Text>
      <View style={styles.chart}>
        {values.map((value, index) => (
          <View key={`${index}-${value}`} style={styles.chartColumn}>
            <Text style={styles.chartValue}>{value}%</Text>
            <View style={[styles.chartBar, { height: value }]} />
            <Text style={styles.chartLabel}>{index + 1}日</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SummaryPanel() {
  const summaries = [
    ['累计运行', '286h'],
    ['运行次数', '1842'],
    ['平均载重', '43%'],
    ['健康评分', '88分'],
  ];
  return (
    <View style={styles.detailPanel}>
      <Text accessibilityRole="header" style={styles.panelHeading}>本月设备统计</Text>
      <View style={styles.summaryGrid}>
        {summaries.map(([label, value]) => (
          <View key={label} style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>{label}</Text>
            <Text style={styles.summaryValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function EventsPanel() {
  const events = [
    ['运行状态恢复正常', '今天 10:25'],
    ['维保人员提交巡检备注', '10月25日 10:25'],
    ['设备健康分更新为 88', '10月25日 12:00'],
  ];
  return (
    <View style={styles.detailPanel}>
      <Text accessibilityRole="header" style={styles.panelHeading}>最近设备事件</Text>
      {events.map(([title, time]) => (
        <View key={title} style={styles.eventRow}>
          <View style={styles.eventDot} />
          <View style={styles.eventCopy}>
            <Text style={styles.eventTitle}>{title}</Text>
            <Text style={styles.eventTime}>{time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function DetailContent({ tab }: { tab: DetailTab }) {
  if (tab === 'trend') return <TrendPanel />;
  if (tab === 'summary') return <SummaryPanel />;
  if (tab === 'events') return <EventsPanel />;
  return <RealtimePanel />;
}

/** Full device-details screen from Figma node 18039:23638. */
export function DeviceDetailsView({ backButtonRef, onBack }: DeviceDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('realtime');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colorThemes.light.background.container} />
      <View style={styles.navbar}>
        <Pressable accessibilityLabel="选择设备详情返回页面" accessibilityRole="button" hitSlop={12} onPress={onBack} ref={backButtonRef} style={styles.backButton}>
          <Back accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={10} height={17} />
        </Pressable>
        <Text accessibilityRole="header" style={styles.navTitle}>设备详情</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <DeviceOverview />
        <ScrollView
          accessibilityRole="tablist"
          contentContainerStyle={styles.tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map((tab) => {
            const selected = tab.id === activeTab;
            return (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={({ pressed }) => [styles.tab, selected && styles.activeTab, pressed && styles.pressed]}
              >
                <Text style={[styles.tabText, selected && styles.activeTabText]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.panelWrap}><DetailContent tab={activeTab} /></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const colors = colorThemes.light;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.container },
  navbar: { height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.container },
  backButton: { position: 'absolute', left: 12, width: 28, height: 40, alignItems: 'flex-start', justifyContent: 'center', zIndex: 1 },
  navTitle: { color: colors.text.primary, ...typographyTokens.title18Semibold },
  scroll: { flex: 1, backgroundColor: colors.background.component },
  scrollContent: { paddingBottom: 24 },
  overviewSection: { paddingHorizontal: 16, paddingTop: 16 },
  deviceTitleRow: { height: 24, flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  deviceTitle: { maxWidth: 170, color: colors.text.primary, ...typographyTokens.title16Semibold },
  alwaysBadge: { height: 16, justifyContent: 'center', paddingHorizontal: 3, borderRadius: 2, backgroundColor: colors.brand.default },
  alwaysText: { color: colors.background.container, ...typographyTokens.footer10Semibold },
  infoCard: { gap: 8, padding: 16, borderRadius: 12, backgroundColor: colors.background.container },
  infoLine: { minHeight: 20, flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { flex: 1, color: colors.text.secondary, ...typographyTokens.body14Regular },
  reportCard: { height: 108, marginTop: 8, padding: 16, overflow: 'hidden', justifyContent: 'space-between', borderRadius: 10, backgroundColor: colors.brand.hover },
  reportTexture: { opacity: 0.1 },
  reportTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  reportTitle: { color: colors.background.container, ...typographyTokens.body14Medium },
  reportTip: { marginTop: 1, color: colors.background.container, ...typographyTokens.footer10Semibold },
  reportLinkRow: { marginTop: 7, flexDirection: 'row', alignItems: 'center', gap: 8 },
  reportLink: { color: colors.background.container, ...typographyTokens.body14Medium },
  reportScoreRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  reportScore: { color: colors.background.container, fontFamily: 'PingFang SC', fontSize: 32, lineHeight: 34, fontWeight: '600' },
  reportScoreUnit: { fontSize: 14, lineHeight: 20 },
  reportStatus: { color: colors.background.container, ...typographyTokens.body14Medium },
  reportStatusStrong: { fontWeight: '600' },
  noteArea: { gap: 8, marginTop: 4 },
  noteRow: { flexDirection: 'row', alignItems: 'center' },
  noteCopy: { minWidth: 0, flex: 1 },
  noteText: { color: colors.text.secondary, ...typographyTokens.body14Regular },
  noteLabel: { fontWeight: '500' },
  noteMeta: { color: colors.text.placeholder, ...typographyTokens.footer10Semibold },
  noteInput: { height: 34, paddingHorizontal: 8, paddingVertical: 0, borderRadius: 6, color: colors.text.primary, backgroundColor: colors.background.component, ...typographyTokens.body14Regular },
  divider: { height: StyleSheet.hairlineWidth, marginTop: 8, backgroundColor: colors.border.componentStroke },
  moreRow: { minHeight: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moreLabel: { color: colors.text.secondary, ...typographyTokens.paragraph13Semibold },
  moreAction: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moreActionText: { color: colors.text.secondary, ...typographyTokens.paragraph13Semibold },
  chevronExpanded: { transform: [{ rotate: '90deg' }] },
  extraInfo: { gap: 5, padding: 10, borderRadius: 6, backgroundColor: colors.background.component },
  extraInfoText: { color: colors.text.secondary, ...typographyTokens.footer12Regular },
  pagination: { height: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  pageActive: { width: 20, height: 6, borderRadius: 3, backgroundColor: colors.text.primary },
  pageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.text.placeholder },
  tabs: { paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' },
  tab: { height: 40, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
  activeTab: { backgroundColor: colors.brand.light },
  tabText: { color: colors.text.primary, ...typographyTokens.title16Semibold, fontWeight: '400' },
  activeTabText: { color: colors.text.brand, fontWeight: '600' },
  panelWrap: { paddingHorizontal: 16 },
  detailPanel: { gap: 20, padding: 16, borderRadius: 12, backgroundColor: colors.background.container },
  panelHeading: { color: colors.text.primary, ...typographyTokens.title18Semibold },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 12 },
  statusTile: { height: 80, paddingHorizontal: 4, paddingVertical: 6, alignItems: 'center', justifyContent: 'space-between', borderRadius: 4, backgroundColor: colors.brand.light },
  statusLabel: { width: '100%', color: colors.text.secondary, textAlign: 'center', ...typographyTokens.footer12Regular, lineHeight: 16 },
  floorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  floorValue: { color: colors.text.brand, ...typographyTokens.title24Semibold },
  statusBottomValue: { color: colors.text.primary, textAlign: 'center', ...typographyTokens.paragraph13Semibold },
  statusMainValue: { marginVertical: 'auto', color: colors.text.primary, textAlign: 'center', ...typographyTokens.body14Semibold },
  statusLargeValue: { marginVertical: 'auto', color: colors.text.primary, textAlign: 'center', ...typographyTokens.title18Semibold },
  statusUnit: { fontSize: 10, lineHeight: 16 },
  sensorGroup: { gap: 16 },
  sensorHeading: { color: colors.text.primary, ...typographyTokens.title18Semibold },
  sensorTile: { height: 106, paddingHorizontal: 4, paddingVertical: 12, alignItems: 'center', justifyContent: 'space-between', borderRadius: 4, backgroundColor: colors.brand.light },
  sensorLabel: { width: '100%', color: colors.text.secondary, textAlign: 'center', ...typographyTokens.footer12Regular },
  sensorValue: { width: '100%', color: colors.text.brand, textAlign: 'center', ...typographyTokens.title18Semibold },
  sensorUnit: { fontSize: 12, lineHeight: 20 },
  chart: { height: 176, paddingTop: 8, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  chartColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  chartBar: { width: 18, minHeight: 12, borderRadius: 5, backgroundColor: colors.brand.hover },
  chartValue: { marginBottom: 4, color: colors.text.brand, ...typographyTokens.footer10Semibold },
  chartLabel: { marginTop: 5, color: colors.text.secondary, ...typographyTokens.footer10Semibold },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  summaryCard: { width: '47%', minHeight: 92, padding: 12, justifyContent: 'space-between', borderRadius: 8, backgroundColor: colors.brand.light },
  summaryLabel: { color: colors.text.secondary, ...typographyTokens.body14Regular },
  summaryValue: { color: colors.text.brand, ...typographyTokens.title24Semibold },
  eventRow: { minHeight: 58, paddingVertical: 8, flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.componentStroke },
  eventDot: { width: 8, height: 8, marginTop: 7, borderRadius: 4, backgroundColor: colors.brand.default },
  eventCopy: { flex: 1 },
  eventTitle: { color: colors.text.primary, ...typographyTokens.body14Regular },
  eventTime: { color: colors.text.placeholder, ...typographyTokens.footer12Regular },
  pressed: { opacity: 0.72 },
});
