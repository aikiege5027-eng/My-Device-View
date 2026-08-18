import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import ArrowUp from './assets/arrow-up.svg';
import Back from './assets/back.svg';
import Building from './assets/building.svg';
import Check from './assets/check.svg';
import ChevronGray from './assets/chevron-gray.svg';
import ChevronWhite from './assets/chevron-white.svg';
import CloseCircleFilled from './assets/close-circle-filled.svg';
import Dashboard from './assets/dashboard.svg';
import Elevator from './assets/elevator.svg';
import ElevatorDoor from './assets/elevator-door.svg';
import Location from './assets/location.svg';
import OperationChevron from './assets/operation-chevron.svg';
import ReportWave from './assets/report-wave.svg';
import NoticeWarning from './assets/notice-warning.svg';

const BLUE = '#1450F5';
const BG = '#F2F4F7';
const LIGHT_BLUE = '#F3F6FE';
const MUTED = '#717A80';
const ONE_HOUR_MS = 60 * 60 * 1000;

type Tab = '实时状态' | '日在线率趋势' | '数据统计' | '设备事件';
type Metric = { label: string; value: string; unit?: string; icon?: 'up' | 'door' | 'check' | 'gauge' };
type LiftScenario = 'success' | 'failure' | 'occupied' | 'weightUnavailable' | 'markedFloorUnavailable';
type LiftDialog = 'hidden' | 'scenario' | 'confirm' | 'progress' | 'progressError' | 'success' | 'failure' | 'occupied' | 'weightUnavailable' | 'markedFloorUnavailable';
type RestartScenario = 'success' | 'failure';
type RestartDialog = 'hidden' | 'scenario' | 'confirm' | 'progress' | 'progressError' | 'success' | 'failure';
type DeviceType = 'KCECPUC' | 'LCE';
type OperationType = 'lift' | 'restart';
type OperationResult = 'success' | 'failure';
type OperationWindow = { startedAt: number; count: number } | null;
type OperationRecord = {
  id: string;
  type: OperationType;
  result: OperationResult;
  operator: string;
  operatedAt: string;
  snSnapshot: string;
  detailLabel: '楼层轨迹' | '失败原因';
  detailValue: string;
};

const tabs: Tab[] = ['实时状态', '日在线率趋势', '数据统计', '设备事件'];

function formatOperationTime(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const realtime: Metric[] = [
  { label: '当前楼层', value: '1', icon: 'up' },
  { label: '梯门状态', value: '已关', icon: 'door' },
  { label: '门区状态', value: '在门区' },
  { label: '运行速度', value: '2.4', unit: 'm/s', icon: 'gauge' },
  { label: '服务模式', value: '正常', icon: 'check' },
  { label: '实时载重', value: '60', unit: '%' },
  { label: '上次内呼', value: '125', unit: 's前' },
  { label: '上次外呼', value: '暂无' },
];

const doorA: Metric[] = [
  { label: '温度', value: '23.5', unit: '℃' },
  { label: '湿度', value: '23.5', unit: '%' },
  { label: '速度', value: '2.1', unit: 'm/s' },
  { label: '平层感应上', value: '0' },
  { label: '平层感应下', value: '1' },
];

const doorB: Metric[] = [
  { label: '温度', value: '23.5', unit: '℃' },
  { label: '湿度', value: '23.5', unit: '%' },
  { label: '速度', value: '2.1', unit: 'm/s' },
  { label: '平层感应上', value: '--' },
  { label: '平层感应下', value: '--' },
];

const machineRoom: Metric[] = [
  { label: '温度', value: '23.5', unit: '℃' },
  { label: '湿度', value: '23.5', unit: '%' },
  { label: '检修回路', value: '402' },
  { label: '厅门A回路', value: '403' },
  { label: '厅门B回路', value: '403' },
  { label: '轿门A回路', value: '406' },
  { label: '轿门B回路', value: '402' },
];

function MetricCard({ item, index }: { item: Metric; index: number }) {
  return (
    <View style={styles.metricCard}>
      <Text numberOfLines={1} style={styles.metricLabel}>{item.label}</Text>
      <View style={styles.metricValueRow}>
        {item.icon === 'up' && <ArrowUp width={17} height={17} />}
        {item.icon === 'door' && <ElevatorDoor width={18} height={18} />}
        {item.icon === 'check' && <Check width={18} height={18} />}
        {item.icon === 'gauge' && <Dashboard width={18} height={18} />}
        <Text style={[styles.metricValue, item.icon && styles.metricValueSmall]}>{item.value}</Text>
        {!!item.unit && <Text style={styles.metricUnit}>{item.unit}</Text>}
      </View>
      {index === 0 && item.icon === 'up' && <Text style={styles.floorCode}>[5]</Text>}
    </View>
  );
}

function MetricGrid({ data }: { data: Metric[] }) {
  return <View style={styles.metricGrid}>{data.map((item, index) => <MetricCard key={item.label} item={item} index={index} />)}</View>;
}

function SectionTitle({ children }: React.PropsWithChildren) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function DeviceInfoCard() {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('缆绳有些磨损 看情况换一根。');

  const submitNote = () => {
    const clean = note.trim();
    if (!clean) return;
    setSavedNote(clean);
    setNote('');
  };

  return (
    <>
      <View style={styles.deviceTitleRow}>
        <Text style={styles.deviceTitle}>30267187 | B7号L3</Text>
        <Elevator width={18} height={18} />
        <View style={styles.alwaysBadge}><Text style={styles.alwaysText}>24/7</Text></View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoLine}><Building width={16} height={16} /><Text style={styles.infoText}>苏州大学附属第一医院</Text></View>
        <View style={styles.infoLine}><Location width={16} height={16} /><Text style={styles.infoText}>苏州市姑苏区平海路899号</Text></View>

        <Pressable style={({ pressed }) => [styles.reportCard, pressed && styles.pressed]} onPress={() => Alert.alert('设备健康报告', '当前评分 88 分，状态为“注意”。')}>
          <ReportWave width="100%" height="100%" style={StyleSheet.absoluteFill} />
          <View style={styles.reportTop}>
            <View><Text style={styles.reportTitle}>设备健康报告</Text><Text style={styles.reportTip}>设备分数于每日中午12点更新</Text></View>
            <View style={styles.reportLink}><Text style={styles.reportLinkText}>报告详情</Text><ChevronWhite width={8} height={13} /></View>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.score}>88<Text style={styles.scoreUnit}>分</Text></Text>
            <Text style={styles.reportStatus}>状态：<Text style={styles.reportStatusStrong}>注意</Text></Text>
          </View>
        </Pressable>

        <View style={styles.noteBlock}>
          <View style={styles.noteRow}>
            <View style={styles.noteCopy}>
              <Text numberOfLines={1} style={styles.noteText}><Text style={styles.noteLabel}>备注：</Text>{savedNote}</Text>
              <Text style={styles.noteMeta}>2025 10 25 10:25:30  Zhangdaoming</Text>
            </View>
            <ChevronGray width={8} height={13} />
          </View>
          <TextInput
            value={note}
            onChangeText={setNote}
            onSubmitEditing={submitNote}
            placeholder="快速输入备注信息"
            placeholderTextColor="#8F9195"
            returnKeyType="done"
            style={styles.noteInput}
          />
        </View>

        <View style={styles.divider} />
        <Pressable style={styles.moreRow} onPress={() => setExpanded((value) => !value)}>
          <Text style={styles.moreLabel}>更多基础信息</Text>
          <View style={styles.viewRow}><Text style={styles.viewText}>{expanded ? '收起' : '查看'}</Text><ChevronGray width={8} height={13} style={expanded ? styles.chevronUp : undefined} /></View>
        </Pressable>
        {expanded && (
          <View style={styles.extraInfo}>
            <Text style={styles.extraInfoText}>设备型号　KONE-MonoSpace 700</Text>
            <Text style={styles.extraInfoText}>最近巡检　2025-10-25</Text>
            <Text style={styles.extraInfoText}>维保单位　通力电梯有限公司</Text>
          </View>
        )}
      </View>
      <View style={styles.pagination}><View style={styles.pageActive} /><View style={styles.pageDot} /></View>
    </>
  );
}

function RealtimeContent() {
  return (
    <View style={styles.dataPanel}>
      <SectionTitle>实时状态数据</SectionTitle>
      <MetricGrid data={realtime} />
      <SectionTitle>轿门A传感器数据</SectionTitle>
      <MetricGrid data={doorA} />
      <SectionTitle>轿门B传感器数据</SectionTitle>
      <MetricGrid data={doorB} />
      <SectionTitle>机房传感器数据</SectionTitle>
      <MetricGrid data={machineRoom} />
    </View>
  );
}

function TrendContent() {
  const bars = [62, 72, 68, 91, 85, 88, 96];
  return (
    <View style={styles.dataPanel}>
      <SectionTitle>近 7 日日在线率</SectionTitle>
      <View style={styles.chart}>
        {bars.map((value, index) => (
          <View key={index} style={styles.barColumn}>
            <Text style={styles.barValue}>{value}%</Text>
            <View style={[styles.bar, { height: value * 1.15 }]} />
            <Text style={styles.barLabel}>{index + 1}日</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SummaryContent() {
  return (
    <View style={styles.dataPanel}>
      <SectionTitle>本月设备统计</SectionTitle>
      <MetricGrid data={[
        { label: '累计运行', value: '286', unit: 'h' },
        { label: '运行次数', value: '1842' },
        { label: '平均载重', value: '43', unit: '%' },
        { label: '健康评分', value: '88', unit: '分' },
      ]} />
    </View>
  );
}

function EventsContent() {
  return (
    <View style={styles.dataPanel}>
      <SectionTitle>最近设备事件</SectionTitle>
      {[
        ['运行状态恢复正常', '今天 10:25'],
        ['维保人员提交巡检备注', '10月25日 10:25'],
        ['设备健康分更新为 88', '10月25日 12:00'],
      ].map(([title, time]) => (
        <View key={title} style={styles.eventRow}><View style={styles.eventDot} /><View><Text style={styles.eventTitle}>{title}</Text><Text style={styles.eventTime}>{time}</Text></View></View>
      ))}
    </View>
  );
}

function DialogButton({
  children,
  onPress,
  variant = 'primary',
}: React.PropsWithChildren<{ onPress: () => void; variant?: 'primary' | 'secondary' }>) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.dialogButton, variant === 'secondary' ? styles.dialogButtonSecondary : styles.dialogButtonPrimary, pressed && styles.pressed]}
    >
      <Text style={[styles.dialogButtonText, variant === 'secondary' ? styles.dialogButtonTextSecondary : styles.dialogButtonTextPrimary]}>{children}</Text>
    </Pressable>
  );
}

function LiftFlowDialog({
  mode,
  progress,
  currentFloor,
  attemptNumber,
  onCancel,
  onSelectScenario,
  onConfirm,
  onAcknowledge,
}: {
  mode: LiftDialog;
  progress: number;
  currentFloor: number;
  attemptNumber: number;
  onCancel: () => void;
  onSelectScenario: (scenario: LiftScenario) => void;
  onConfirm: () => void;
  onAcknowledge: () => void;
}) {
  if (mode === 'hidden') return null;

  return (
    <Modal transparent visible animationType="fade" statusBarTranslucent onRequestClose={mode === 'scenario' || mode === 'confirm' ? onCancel : undefined}>
      <View style={styles.modalBackdrop}>
        {mode === 'scenario' ? (
          <View style={styles.dialogCard}>
            <View style={styles.dialogContent}>
              <Text style={styles.dialogTitle}>选择演示场景</Text>
              <Text style={styles.scenarioDialogBody}>请选择本次远程呼梯的演示结果</Text>
            </View>
            <View style={styles.scenarioOptions}>
              <Pressable onPress={() => onSelectScenario('success')} style={({ pressed }) => [styles.scenarioOption, pressed && styles.pressed]}>
                <View style={[styles.scenarioIcon, styles.scenarioSuccessIcon]}><Text style={styles.scenarioSuccessMark}>✓</Text></View>
                <View style={styles.scenarioCopy}><Text style={styles.scenarioTitle}>远程呼梯成功</Text><Text style={styles.scenarioDescription}>演示正常执行并成功返回起始层</Text></View>
                <Text style={styles.scenarioChevron}>›</Text>
              </Pressable>
              <View style={styles.scenarioDivider} />
              <Pressable onPress={() => onSelectScenario('failure')} style={({ pressed }) => [styles.scenarioOption, pressed && styles.pressed]}>
                <View style={[styles.scenarioIcon, styles.scenarioFailureIcon]}><CloseCircleFilled width={18} height={18} /></View>
                <View style={styles.scenarioCopy}><Text style={styles.scenarioTitle}>远程呼梯失败</Text><Text style={styles.scenarioDescription}>演示进度异常并显示失败提示</Text></View>
                <Text style={styles.scenarioChevron}>›</Text>
              </Pressable>
              <View style={styles.scenarioDivider} />
              <Pressable onPress={() => onSelectScenario('occupied')} style={({ pressed }) => [styles.scenarioOption, pressed && styles.pressed]}>
                <View style={[styles.scenarioIcon, styles.scenarioWarningIcon]}><Text style={styles.scenarioWarningMark}>!</Text></View>
                <View style={styles.scenarioCopy}><Text style={styles.scenarioTitle}>检测到轿厢内有人</Text><Text style={styles.scenarioDescription}>演示检测到乘客并阻止远程呼梯</Text></View>
                <Text style={styles.scenarioChevron}>›</Text>
              </Pressable>
              <View style={styles.scenarioDivider} />
              <Pressable onPress={() => onSelectScenario('weightUnavailable')} style={({ pressed }) => [styles.scenarioOption, pressed && styles.pressed]}>
                <View style={[styles.scenarioIcon, styles.scenarioWarningIcon]}><Text style={styles.scenarioWarningMark}>!</Text></View>
                <View style={styles.scenarioCopy}><Text style={styles.scenarioTitle}>称重数据无法获取</Text><Text style={styles.scenarioDescription}>演示称重数据缺失并阻止远程操作</Text></View>
                <Text style={styles.scenarioChevron}>›</Text>
              </Pressable>
              <View style={styles.scenarioDivider} />
              <Pressable onPress={() => onSelectScenario('markedFloorUnavailable')} style={({ pressed }) => [styles.scenarioOption, pressed && styles.pressed]}>
                <View style={[styles.scenarioIcon, styles.scenarioWarningIcon]}><Text style={styles.scenarioWarningMark}>!</Text></View>
                <View style={styles.scenarioCopy}><Text style={styles.scenarioTitle}>标记楼层无法获取</Text><Text style={styles.scenarioDescription}>演示标记楼层缺失并阻止远程操作</Text></View>
                <Text style={styles.scenarioChevron}>›</Text>
              </Pressable>
            </View>
            <View style={styles.scenarioCancelWrap}><DialogButton variant="secondary" onPress={onCancel}>取消</DialogButton></View>
          </View>
        ) : mode === 'progress' || mode === 'progressError' ? (
          <View accessibilityLiveRegion="polite" style={[styles.dialogCard, styles.progressDialog]}>
            <Text style={styles.dialogTitle}>正在远程呼梯</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, mode === 'progressError' && styles.progressFillError, { width: `${progress}%` }]} />
              </View>
              {mode === 'progressError'
                ? <View style={styles.progressErrorIcon}><CloseCircleFilled width={20} height={20} /></View>
                : <Text style={styles.progressText}>{progress}%</Text>}
            </View>
            <Text style={styles.currentFloorText}>当前楼层：{currentFloor}F</Text>
          </View>
        ) : (
          <View style={styles.dialogCard}>
            <View style={styles.dialogContent}>
              <Text style={styles.dialogTitle}>{mode === 'confirm' ? '远程呼梯确认' : mode === 'success' ? '远程呼梯成功' : mode === 'occupied' ? '检测到轿厢内有人' : mode === 'weightUnavailable' ? '称重数据无法获取' : mode === 'markedFloorUnavailable' ? '标记楼层无法获取' : '远程呼梯失败'}</Text>
              {mode === 'confirm' && (
                <View accessibilityRole="alert" style={styles.operationLimitNotice}>
                  <NoticeWarning width={22} height={22} />
                  <Text style={styles.operationLimitText}>1 小时内只允许远程呼梯 2 次，当前为第 {attemptNumber} 次。</Text>
                </View>
              )}
              <Text style={styles.dialogBody}>
                {mode === 'confirm'
                  ? '系统将尝试远程呼叫电梯并使其回到起始层，执行过程中「远程重启」不可操作。'
                  : mode === 'success'
                    ? '电梯已恢复移动并回到起始层，请与客户共同确认电梯是否已恢复正常，并判断是否仍需前往现场。'
                    : mode === 'occupied'
                      ? '出于安全考虑，有人时不执行远程移动。请确认无人后再操作。'
                      : mode === 'weightUnavailable'
                        ? '系统无法获取电梯称重数据，出于安全考虑，无法远程操作'
                        : mode === 'markedFloorUnavailable'
                          ? '系统无法获取标记楼层，出于安全考虑，无法远程操作。'
                        : '电梯未响应远程呼梯，可再次呼梯，或尝试远程重启（重启含自动呼梯）。'}
              </Text>
            </View>
            <View style={styles.dialogFooter}>
              {mode === 'confirm' ? (
                <>
                  <DialogButton variant="secondary" onPress={onCancel}>取消</DialogButton>
                  <DialogButton onPress={onConfirm}>确认</DialogButton>
                </>
              ) : <DialogButton onPress={onAcknowledge}>我知道了</DialogButton>}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

function RestartFlowDialog({
  mode,
  progress,
  attemptNumber,
  onCancel,
  onSelectScenario,
  onConfirm,
  onAcknowledge,
}: {
  mode: RestartDialog;
  progress: number;
  attemptNumber: number;
  onCancel: () => void;
  onSelectScenario: (scenario: RestartScenario) => void;
  onConfirm: () => void;
  onAcknowledge: () => void;
}) {
  if (mode === 'hidden') return null;

  return (
    <Modal transparent visible animationType="fade" statusBarTranslucent onRequestClose={mode === 'scenario' || mode === 'confirm' ? onCancel : undefined}>
      <View style={styles.modalBackdrop}>
        {mode === 'scenario' ? (
          <View style={styles.dialogCard}>
            <View style={styles.dialogContent}>
              <Text style={styles.dialogTitle}>选择演示场景</Text>
              <Text style={styles.scenarioDialogBody}>请选择本次远程重启的演示结果</Text>
            </View>
            <View style={styles.scenarioOptions}>
              <Pressable onPress={() => onSelectScenario('success')} style={({ pressed }) => [styles.scenarioOption, pressed && styles.pressed]}>
                <View style={[styles.scenarioIcon, styles.scenarioSuccessIcon]}><Text style={styles.scenarioSuccessMark}>✓</Text></View>
                <View style={styles.scenarioCopy}><Text style={styles.scenarioTitle}>远程重启成功</Text><Text style={styles.scenarioDescription}>演示重启并自动呼梯成功</Text></View>
                <Text style={styles.scenarioChevron}>›</Text>
              </Pressable>
              <View style={styles.scenarioDivider} />
              <Pressable onPress={() => onSelectScenario('failure')} style={({ pressed }) => [styles.scenarioOption, pressed && styles.pressed]}>
                <View style={[styles.scenarioIcon, styles.scenarioFailureIcon]}><CloseCircleFilled width={18} height={18} /></View>
                <View style={styles.scenarioCopy}><Text style={styles.scenarioTitle}>远程重启失败</Text><Text style={styles.scenarioDescription}>演示进度异常并显示无响应提示</Text></View>
                <Text style={styles.scenarioChevron}>›</Text>
              </Pressable>
            </View>
            <View style={styles.scenarioCancelWrap}><DialogButton variant="secondary" onPress={onCancel}>取消</DialogButton></View>
          </View>
        ) : mode === 'progress' || mode === 'progressError' ? (
          <View accessibilityLiveRegion="polite" style={[styles.dialogCard, styles.progressDialog]}>
            <Text style={styles.dialogTitle}>正在远程重启</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, mode === 'progressError' && styles.progressFillError, { width: `${progress}%` }]} />
              </View>
              {mode === 'progressError'
                ? <View style={styles.progressErrorIcon}><CloseCircleFilled width={20} height={20} /></View>
                : <Text style={styles.progressText}>{progress}%</Text>}
            </View>
          </View>
        ) : (
          <View style={styles.dialogCard}>
            <View style={styles.dialogContent}>
              <Text style={styles.dialogTitle}>{mode === 'confirm' ? '远程重启确认' : mode === 'success' ? '远程重启成功' : '设备重启无响应'}</Text>
              {mode === 'confirm' && (
                <View accessibilityRole="alert" style={styles.operationLimitNotice}>
                  <NoticeWarning width={22} height={22} />
                  <Text style={styles.operationLimitText}>1 小时内只允许远程重启 1 次，当前为第 {attemptNumber} 次。</Text>
                </View>
              )}
              <Text style={styles.dialogBody}>
                {mode === 'confirm'
                  ? '系统将重启电梯控制系统，并在重启后自动执行一次远程呼梯（无需再手动呼梯）'
                  : mode === 'success'
                    ? '重启后自动呼梯成功，电梯已回到起始层，状态显示正常。请与客户共同确认电梯是否已恢复正常'
                    : '电梯对远程重启无响应，远程手段已无法恢复。请立即安排维保员工前往现场修梯。'}
              </Text>
            </View>
            <View style={styles.dialogFooter}>
              {mode === 'confirm' ? (
                <>
                  <DialogButton variant="secondary" onPress={onCancel}>取消</DialogButton>
                  <DialogButton onPress={onConfirm}>确认重启</DialogButton>
                </>
              ) : <DialogButton onPress={onAcknowledge}>我知道了</DialogButton>}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

function WorkOrderView({ onOpenDevice }: { onOpenDevice: (deviceType: DeviceType) => void }) {
  const [cloudDialogMode, setCloudDialogMode] = useState<'hidden' | 'prompt' | 'deviceType'>('hidden');

  const closeCloudDialog = () => setCloudDialogMode('hidden');
  const openDevice = (deviceType: DeviceType) => {
    closeCloudDialog();
    onOpenDevice(deviceType);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.workOrderSafeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.workOrderNav}>
        <Back width={10} height={17} style={styles.workOrderBack} />
        <Text style={styles.workOrderTitle}>工单明细</Text>
        <Text style={styles.workOrderMore}>更多</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.workOrderScroll}>
        <View style={styles.workOrderCard}>
          <View style={styles.orderHeading}>
            <View style={styles.orderElevatorIcon}><Elevator width={22} height={22} /></View>
            <View style={styles.orderHeadingText}>
              <Text style={styles.orderName}>B7号L6 | 43467562</Text>
              <Text style={styles.orderProject}>项目名称：宜家花园</Text>
              <View style={styles.pendingTag}><Text style={styles.pendingTagText}>未处理</Text></View>
            </View>
          </View>
          <View style={styles.workOrderDivider} />
          <View style={styles.orderInfoRow}><Text style={styles.orderLabel}>工单编号</Text><Text style={styles.orderValue}>NMT29394030204232 <Text style={styles.copyText}>复制</Text></Text></View>
          <View style={styles.orderInfoRow}><Text style={styles.orderLabel}>96333编号</Text><Text style={styles.orderValue}>238402</Text></View>
          <Text style={styles.orderLink}>查看更多⌄</Text>
        </View>

        <View style={styles.workOrderCard}>
          <Text style={styles.faultTitle}>故障信息</Text>
          <View style={styles.dateRow}>{['21日', '22日', '23日', '24日', '25日', '保养', '27日'].map((date) => <Text key={date} style={[styles.dateText, date === '保养' && styles.dateMaintenance]}>{date}</Text>)}</View>
          <View style={styles.dateMarker} />
          <Text style={styles.floorText}>10楼</Text>
          <Text style={styles.orderLink}>查看更多⌄</Text>
        </View>

        <Pressable accessibilityRole="button" onPress={() => setCloudDialogMode('prompt')} style={({ pressed }) => [styles.remotePrompt, pressed && styles.pressed]}>
          <View style={styles.cloudGlyph}><Text style={styles.cloudGlyphText}>⌁</Text></View>
          <Text style={styles.remotePromptText}>别急着接单，先点这里远程瞅一眼，省得白跑一趟!</Text>
          <View style={styles.alertDot} />
          <Text style={styles.remoteChevron}>›</Text>
        </Pressable>

        <View style={styles.statusCard}>
          <View style={styles.statusGlyph}><Text style={styles.statusGlyphText}>⌕</Text></View>
          <View style={styles.statusCopy}><Text style={styles.statusTitle}>已报修 <Text style={styles.statusTime}>2021-11-16 16:46:31</Text></Text><Text style={styles.statusDetail}>保修内容：电梯厅门损坏了</Text></View>
        </View>
      </ScrollView>

      <View style={styles.workOrderBottomBar}>
        <Pressable style={styles.workOrderBottomButton}><Text style={styles.transferText}>转发</Text></Pressable>
        <Pressable style={[styles.workOrderBottomButton, styles.rejectButton]}><Text style={styles.rejectText}>拒绝</Text></Pressable>
        <Pressable style={[styles.workOrderBottomButton, styles.acceptButton]}><Text style={styles.acceptText}>接受</Text></Pressable>
      </View>

      <Modal transparent visible={cloudDialogMode !== 'hidden'} animationType="fade" statusBarTranslucent onRequestClose={closeCloudDialog}>
        <View style={styles.modalBackdrop}>
          {cloudDialogMode === 'prompt' ? (
            <View style={styles.cloudDialogCard}>
              <View style={styles.cloudDialogContent}>
                <Text style={styles.cloudDialogTitle}>查看云管家数据</Text>
                <Text style={styles.cloudDialogBody}>为了帮助您核实工单，请先查看云管家</Text>
              </View>
              <View style={styles.cloudDialogFooter}>
                <Pressable onPress={closeCloudDialog} style={styles.cloudDialogFooterButton}><Text style={styles.cloudCancelText}>取消</Text></Pressable>
                <View style={styles.cloudDialogFooterDivider} />
                <Pressable onPress={() => setCloudDialogMode('deviceType')} style={styles.cloudDialogFooterButton}><Text style={styles.cloudOpenText}>查看云管家</Text></Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.dialogCard}>
              <View style={styles.dialogContent}>
                <Text style={styles.dialogTitle}>选择设备类型</Text>
                <Text style={styles.scenarioDialogBody}>请选择本次 Demo 要进入的设备详情</Text>
              </View>
              <View style={styles.scenarioOptions}>
                <Pressable onPress={() => openDevice('KCECPUC')} style={({ pressed }) => [styles.scenarioOption, pressed && styles.pressed]}>
                  <View style={[styles.deviceTypeIcon, styles.deviceTypeKceIcon]}><Text style={styles.deviceTypeKceMark}>K</Text></View>
                  <View style={styles.scenarioCopy}><Text style={styles.scenarioTitle}>KCECPUC</Text><Text style={styles.scenarioDescription}>支持远程呼梯与远程重启</Text></View>
                  <Text style={styles.scenarioChevron}>›</Text>
                </Pressable>
                <View style={styles.scenarioDivider} />
                <Pressable onPress={() => openDevice('LCE')} style={({ pressed }) => [styles.scenarioOption, pressed && styles.pressed]}>
                  <View style={[styles.deviceTypeIcon, styles.deviceTypeLceIcon]}><Text style={styles.deviceTypeLceMark}>L</Text></View>
                  <View style={styles.scenarioCopy}><Text style={styles.scenarioTitle}>LCE</Text><Text style={styles.scenarioDescription}>仅支持远程呼梯</Text></View>
                  <Text style={styles.scenarioChevron}>›</Text>
                </Pressable>
              </View>
              <View style={styles.scenarioCancelWrap}><DialogButton variant="secondary" onPress={closeCloudDialog}>取消</DialogButton></View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function OperationRecordCard({ record }: { record: OperationRecord }) {
  const success = record.result === 'success';
  return (
    <View style={styles.operationCard}>
      <View style={styles.operationCardHeader}>
        <Text style={styles.operationCardTitle}>{record.type === 'lift' ? '远程呼梯' : '远程重启'}</Text>
        <View style={[styles.operationResultTag, success ? styles.operationResultSuccess : styles.operationResultFailure]}>
          <Text style={[styles.operationResultText, success ? styles.operationResultSuccessText : styles.operationResultFailureText]}>{success ? '成功' : '失败'}</Text>
        </View>
      </View>
      <View style={styles.operationMetaList}>
        <View style={styles.operationMetaRow}>
          <Text style={styles.operationMetaLabel}>操作者</Text>
          <Text style={styles.operationMetaValue}>{record.operator}</Text>
        </View>
        <View style={styles.operationMetaRow}>
          <Text style={styles.operationMetaLabel}>操作时间</Text>
          <Text style={styles.operationMetaValue}>{record.operatedAt}</Text>
        </View>
        <View style={styles.operationMetaRow}>
          <Text style={styles.operationMetaLabel}>SN快照</Text>
          <Text style={styles.operationMetaValue}>{record.snSnapshot}</Text>
        </View>
        <View style={styles.operationMetaRow}>
          <Text style={styles.operationMetaLabel}>{record.detailLabel}</Text>
          <Text numberOfLines={1} style={styles.operationMetaValue}>{record.detailValue}</Text>
        </View>
      </View>
    </View>
  );
}

function OperationRecordsView({ records, onBack }: { records: OperationRecord[]; onBack: () => void }) {
  return (
    <SafeAreaView edges={['top']} style={styles.recordsSafeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.navbar}>
        <Pressable accessibilityLabel="返回设备详情" hitSlop={12} style={styles.backButton} onPress={onBack}><Back width={10} height={17} /></Pressable>
        <Text style={styles.navTitle}>操作记录</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.recordsScroll}>
        {records.map((record) => <OperationRecordCard key={record.id} record={record} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

function DeviceView({ deviceType, onBack }: { deviceType: DeviceType; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('实时状态');
  const [liftDialog, setLiftDialog] = useState<LiftDialog>('hidden');
  const [liftScenario, setLiftScenario] = useState<LiftScenario>('success');
  const [progress, setProgress] = useState(0);
  const [currentFloor, setCurrentFloor] = useState(5);
  const [restartEnabled, setRestartEnabled] = useState(false);
  const [restartDialog, setRestartDialog] = useState<RestartDialog>('hidden');
  const [restartScenario, setRestartScenario] = useState<RestartScenario>('success');
  const [restartProgress, setRestartProgress] = useState(0);
  const [liftAttemptNumber, setLiftAttemptNumber] = useState(1);
  const [restartAttemptNumber, setRestartAttemptNumber] = useState(1);
  const [liftLimitReached, setLiftLimitReached] = useState(false);
  const [restartLimitReached, setRestartLimitReached] = useState(false);
  const [records, setRecords] = useState<OperationRecord[]>([]);
  const [devicePage, setDevicePage] = useState<'detail' | 'records'>('detail');
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const liftLimitResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartLimitResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const liftOperationWindow = useRef<OperationWindow>(null);
  const restartOperationWindow = useRef<OperationWindow>(null);

  useEffect(() => () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    if (resultTimer.current) clearTimeout(resultTimer.current);
    if (restartTimer.current) clearInterval(restartTimer.current);
    if (liftLimitResetTimer.current) clearTimeout(liftLimitResetTimer.current);
    if (restartLimitResetTimer.current) clearTimeout(restartLimitResetTimer.current);
  }, []);

  const startRemoteLift = () => {
    const now = Date.now();
    const currentWindow = liftOperationWindow.current;
    const activeWindow = currentWindow && now - currentWindow.startedAt < ONE_HOUR_MS
      ? currentWindow
      : { startedAt: now, count: 0 };
    if (activeWindow.count >= 2) {
      setLiftDialog('hidden');
      Alert.alert('已达远程操作上限', '从首次远程呼梯起，1 小时内最多操作 2 次，请稍后再试。');
      return;
    }
    const nextCount = activeWindow.count + 1;
    liftOperationWindow.current = { ...activeWindow, count: nextCount };
    setLiftAttemptNumber(nextCount);
    setLiftLimitReached(nextCount >= 2);
    if (!currentWindow || now - currentWindow.startedAt >= ONE_HOUR_MS) {
      if (liftLimitResetTimer.current) clearTimeout(liftLimitResetTimer.current);
      liftLimitResetTimer.current = setTimeout(() => {
        liftLimitResetTimer.current = null;
        liftOperationWindow.current = null;
        setLiftAttemptNumber(1);
        setLiftLimitReached(false);
      }, ONE_HOUR_MS);
    }
    setProgress(0);
    setCurrentFloor(5);
    setLiftDialog('progress');
    const startedAt = Date.now();
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / 6000) * 100));
      setProgress(nextProgress);
      setCurrentFloor(Math.max(1, 5 - Math.floor(nextProgress / 20)));
      if (liftScenario === 'failure' && elapsed >= 4200) {
        if (progressTimer.current) clearInterval(progressTimer.current);
        progressTimer.current = null;
        setProgress(70);
        setLiftDialog('progressError');
        resultTimer.current = setTimeout(() => {
          resultTimer.current = null;
          setLiftDialog('failure');
        }, 800);
      } else if (nextProgress >= 100) {
        if (progressTimer.current) clearInterval(progressTimer.current);
        progressTimer.current = null;
        setLiftDialog('success');
      }
    }, 100);
  };

  const acknowledgeResult = () => {
    if (liftDialog === 'occupied' || liftDialog === 'weightUnavailable' || liftDialog === 'markedFloorUnavailable') {
      setLiftDialog('hidden');
      return;
    }
    const result: OperationResult = liftDialog === 'failure' ? 'failure' : 'success';
    setRecords((current) => [{
      id: `lift-${Date.now()}`,
      type: 'lift',
      result,
      operator: '李维保',
      operatedAt: formatOperationTime(),
      snSnapshot: 'SN000000',
      detailLabel: result === 'success' ? '楼层轨迹' : '失败原因',
      detailValue: result === 'success' ? '5F→1F' : '电梯未响应远程呼梯',
    }, ...current]);
    setRestartEnabled(true);
    setLiftDialog('hidden');
  };

  const selectScenario = (scenario: LiftScenario) => {
    setLiftScenario(scenario);
    setLiftDialog(scenario === 'occupied' || scenario === 'weightUnavailable' || scenario === 'markedFloorUnavailable' ? scenario : 'confirm');
  };

  const openLiftScenario = () => {
    const now = Date.now();
    const currentWindow = liftOperationWindow.current;
    if (currentWindow && now - currentWindow.startedAt < ONE_HOUR_MS) {
      if (currentWindow.count >= 2) {
        Alert.alert('已达远程操作上限', '从首次远程呼梯起，1 小时内最多操作 2 次，请稍后再试。');
        return;
      }
      setLiftAttemptNumber(currentWindow.count + 1);
    } else {
      setLiftAttemptNumber(1);
    }
    setLiftDialog('scenario');
  };

  const startRemoteRestart = () => {
    const now = Date.now();
    const currentWindow = restartOperationWindow.current;
    const activeWindow = currentWindow && now - currentWindow.startedAt < ONE_HOUR_MS
      ? currentWindow
      : { startedAt: now, count: 0 };
    if (activeWindow.count >= 1) {
      setRestartDialog('hidden');
      Alert.alert('已达远程重启上限', '从首次远程重启起，1 小时内最多操作 1 次，请稍后再试。');
      return;
    }
    const nextCount = activeWindow.count + 1;
    restartOperationWindow.current = { ...activeWindow, count: nextCount };
    setRestartAttemptNumber(nextCount);
    setRestartLimitReached(true);
    if (!currentWindow || now - currentWindow.startedAt >= ONE_HOUR_MS) {
      if (restartLimitResetTimer.current) clearTimeout(restartLimitResetTimer.current);
      restartLimitResetTimer.current = setTimeout(() => {
        restartLimitResetTimer.current = null;
        restartOperationWindow.current = null;
        setRestartAttemptNumber(1);
        setRestartLimitReached(false);
      }, ONE_HOUR_MS);
    }
    setRestartProgress(0);
    setRestartDialog('progress');
    const startedAt = Date.now();
    restartTimer.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / 6000) * 100));
      setRestartProgress(nextProgress);
      if (restartScenario === 'failure' && elapsed >= 4200) {
        if (restartTimer.current) clearInterval(restartTimer.current);
        restartTimer.current = null;
        setRestartProgress(70);
        setRestartDialog('progressError');
        resultTimer.current = setTimeout(() => {
          resultTimer.current = null;
          setRestartDialog('failure');
        }, 800);
      } else if (nextProgress >= 100) {
        if (restartTimer.current) clearInterval(restartTimer.current);
        restartTimer.current = null;
        setRestartDialog('success');
      }
    }, 100);
  };

  const selectRestartScenario = (scenario: RestartScenario) => {
    setRestartScenario(scenario);
    setRestartDialog('confirm');
  };

  const openRestartScenario = () => {
    const now = Date.now();
    const currentWindow = restartOperationWindow.current;
    if (currentWindow && now - currentWindow.startedAt < ONE_HOUR_MS && currentWindow.count >= 1) {
      Alert.alert('已达远程重启上限', '从首次远程重启起，1 小时内最多操作 1 次，请稍后再试。');
      return;
    }
    setRestartAttemptNumber(1);
    setRestartDialog('scenario');
  };

  const acknowledgeRestart = () => {
    const result: OperationResult = restartDialog === 'failure' ? 'failure' : 'success';
    setRecords((current) => [{
      id: `restart-${Date.now()}`,
      type: 'restart',
      result,
      operator: '李维保',
      operatedAt: formatOperationTime(),
      snSnapshot: 'SN000000',
      detailLabel: result === 'success' ? '楼层轨迹' : '失败原因',
      detailValue: result === 'success' ? '5F→1F' : '电梯对远程重启无响应',
    }, ...current]);
    setRestartDialog('hidden');
  };
  const tabContent = useMemo(() => {
    if (activeTab === '日在线率趋势') return <TrendContent />;
    if (activeTab === '数据统计') return <SummaryContent />;
    if (activeTab === '设备事件') return <EventsContent />;
    return <RealtimeContent />;
  }, [activeTab]);

  if (devicePage === 'records') return <OperationRecordsView records={records} onBack={() => setDevicePage('detail')} />;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.navbar}>
        <Pressable accessibilityLabel="返回工单明细" hitSlop={12} style={styles.backButton} onPress={onBack}><Back width={10} height={17} /></Pressable>
        <Text style={styles.navTitle}>设备详情</Text>
      </View>

      <View style={styles.debugCard}>
        <View style={styles.debugTitleRow}>
          <View style={styles.debugIdentity}>
            <Text style={styles.debugSn}>SN000000</Text>
            <View style={styles.controllerTag}><Text style={styles.controllerTagText}>{deviceType}</Text></View>
          </View>
          {records.length > 0 && (
            <Pressable accessibilityRole="button" onPress={() => setDevicePage('records')} style={({ pressed }) => [styles.operationEntry, pressed && styles.pressed]}>
              <Text style={styles.operationEntryText}>操作记录</Text>
              <OperationChevron width={6} height={10} style={styles.operationChevron} />
            </Pressable>
          )}
        </View>
        <Text style={styles.debugDescription}>门锁回路瞬时断开，轿厢停于非平层</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}><DeviceInfoCard /></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {tabs.map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.panelWrap}>{tabContent}</View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.bottomActions}>
          {deviceType === 'KCECPUC' && (
            <Pressable
              accessibilityLabel="远程重启"
              disabled={!restartEnabled || restartLimitReached}
              onPress={openRestartScenario}
              style={({ pressed }) => [styles.actionButton, (!restartEnabled || restartLimitReached) && styles.actionButtonDisabled, pressed && styles.pressed]}
            >
              <Text style={[styles.actionText, (!restartEnabled || restartLimitReached) && styles.actionTextDisabled]}>远程重启</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityLabel="远程呼梯"
            disabled={liftLimitReached}
            onPress={openLiftScenario}
            style={({ pressed }) => [styles.actionButton, liftLimitReached && styles.actionButtonDisabled, pressed && styles.pressed]}
          >
            <Text style={[styles.actionText, liftLimitReached && styles.actionTextDisabled]}>远程呼梯</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <LiftFlowDialog
        mode={liftDialog}
        progress={progress}
        currentFloor={currentFloor}
        attemptNumber={liftAttemptNumber}
        onCancel={() => setLiftDialog('hidden')}
        onSelectScenario={selectScenario}
        onConfirm={startRemoteLift}
        onAcknowledge={acknowledgeResult}
      />
      {deviceType === 'KCECPUC' && (
        <RestartFlowDialog
          mode={restartDialog}
          progress={restartProgress}
          attemptNumber={restartAttemptNumber}
          onCancel={() => setRestartDialog('hidden')}
          onSelectScenario={selectRestartScenario}
          onConfirm={startRemoteRestart}
          onAcknowledge={acknowledgeRestart}
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  const [screen, setScreen] = useState<'workOrder' | 'device'>('workOrder');
  const [deviceType, setDeviceType] = useState<DeviceType>('KCECPUC');
  const openDevice = (nextDeviceType: DeviceType) => {
    setDeviceType(nextDeviceType);
    setScreen('device');
  };
  return (
    <SafeAreaProvider>
      {screen === 'workOrder'
        ? <WorkOrderView onOpenDevice={openDevice} />
        : <DeviceView deviceType={deviceType} onBack={() => setScreen('workOrder')} />}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  navbar: { height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  navTitle: { color: '#141414', fontSize: 18, lineHeight: 26, fontWeight: '600' },
  backButton: { position: 'absolute', left: 12, width: 28, height: 40, alignItems: 'flex-start', justifyContent: 'center', zIndex: 2 },
  debugCard: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, zIndex: 2 },
  debugTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  debugIdentity: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  debugSn: { color: '#141414', fontSize: 16, lineHeight: 24, fontWeight: '600' },
  controllerTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: LIGHT_BLUE },
  controllerTagText: { color: BLUE, fontSize: 12, lineHeight: 20, fontWeight: '500' },
  debugDescription: { color: '#141414', fontSize: 14, lineHeight: 22 },
  operationEntry: { height: 24, flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 3 },
  operationEntryText: { color: BLUE, fontSize: 14, lineHeight: 22 },
  operationChevron: { transform: [{ rotate: '180deg' }] },
  scrollContent: { paddingBottom: 102, backgroundColor: BG },
  topSection: { paddingHorizontal: 16, paddingTop: 16 },
  deviceTitleRow: { height: 24, flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  deviceTitle: { maxWidth: 165, color: '#141414', fontSize: 16, lineHeight: 24, fontWeight: '500' },
  alwaysBadge: { borderRadius: 2, paddingHorizontal: 3, height: 14, justifyContent: 'center', backgroundColor: BLUE },
  alwaysText: { color: '#FFFFFF', fontWeight: '600', fontSize: 8, lineHeight: 12 },
  infoCard: { borderRadius: 12, padding: 16, gap: 8, backgroundColor: '#FFFFFF' },
  infoLine: { height: 20, flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { flex: 1, color: '#676A72', fontSize: 14, lineHeight: 20 },
  reportCard: { height: 108, marginTop: 8, padding: 16, borderRadius: 10, overflow: 'hidden', backgroundColor: '#4D7AF7', justifyContent: 'space-between' },
  reportTop: { flexDirection: 'row', justifyContent: 'space-between' },
  reportTitle: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  reportTip: { color: 'rgba(255,255,255,0.8)', fontSize: 9, marginTop: 1 },
  reportLink: { marginTop: 7, flexDirection: 'row', alignItems: 'center', gap: 8 },
  reportLinkText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  scoreRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  score: { color: '#F8F8F8', fontSize: 32, lineHeight: 34, fontWeight: '600' },
  scoreUnit: { fontSize: 14, lineHeight: 20 },
  reportStatus: { color: '#F8F8F8', fontSize: 14, lineHeight: 23, fontWeight: '500' },
  reportStatusStrong: { fontWeight: '700' },
  noteBlock: { gap: 8, marginTop: 4 },
  noteRow: { flexDirection: 'row', alignItems: 'center' },
  noteCopy: { flex: 1 },
  noteText: { color: '#676A72', fontSize: 14, lineHeight: 22 },
  noteLabel: { fontWeight: '500' },
  noteMeta: { color: '#ABADB2', fontSize: 9, lineHeight: 14 },
  noteInput: { height: 34, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 0, backgroundColor: BG, color: '#141414', fontSize: 14 },
  divider: { height: StyleSheet.hairlineWidth, marginTop: 8, backgroundColor: '#E7E7E7' },
  moreRow: { height: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moreLabel: { color: '#676A72', fontSize: 13 },
  viewRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  viewText: { color: '#566066', fontSize: 13 },
  chevronUp: { transform: [{ rotate: '90deg' }] },
  extraInfo: { gap: 5, padding: 10, borderRadius: 6, backgroundColor: BG },
  extraInfoText: { color: '#676A72', fontSize: 12, lineHeight: 18 },
  pagination: { height: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  pageActive: { width: 20, height: 6, borderRadius: 3, backgroundColor: '#11161A' },
  pageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#8F9195' },
  tabs: { paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' },
  tab: { height: 40, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
  activeTab: { backgroundColor: LIGHT_BLUE },
  tabText: { color: '#141414', fontSize: 16, lineHeight: 24 },
  activeTabText: { color: BLUE, fontWeight: '600' },
  panelWrap: { paddingHorizontal: 16 },
  dataPanel: { padding: 16, borderRadius: 12, gap: 16, backgroundColor: '#FFFFFF' },
  sectionTitle: { color: '#181818', fontSize: 16, lineHeight: 24, fontWeight: '600' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: '21.8%', minWidth: 62, height: 80, paddingHorizontal: 4, paddingVertical: 7, alignItems: 'center', justifyContent: 'flex-start', borderRadius: 4, backgroundColor: LIGHT_BLUE },
  metricLabel: { color: MUTED, fontSize: 10, lineHeight: 16 },
  metricValueRow: { minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 7 },
  metricValue: { color: BLUE, fontSize: 18, lineHeight: 26, fontWeight: '600' },
  metricValueSmall: { fontSize: 13, lineHeight: 20 },
  metricUnit: { color: '#262E33', fontSize: 9, lineHeight: 15, fontWeight: '600' },
  floorCode: { marginTop: -4, color: '#262E33', fontSize: 12, lineHeight: 18, fontWeight: '600' },
  chart: { height: 176, paddingTop: 12, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: 18, minHeight: 12, borderRadius: 5, backgroundColor: '#7296F9' },
  barValue: { marginBottom: 4, color: BLUE, fontSize: 9 },
  barLabel: { marginTop: 5, color: MUTED, fontSize: 9 },
  eventRow: { minHeight: 58, paddingVertical: 8, flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E7E7E7' },
  eventDot: { width: 8, height: 8, marginTop: 6, borderRadius: 4, backgroundColor: BLUE },
  eventTitle: { color: '#262E33', fontSize: 14, lineHeight: 20 },
  eventTime: { color: '#ABADB2', fontSize: 11, lineHeight: 18 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 8 },
  bottomActions: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8, flexDirection: 'row', gap: 16 },
  actionButton: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 128, backgroundColor: LIGHT_BLUE },
  actionText: { color: BLUE, fontSize: 16, lineHeight: 24, fontWeight: '600' },
  actionButtonDisabled: { backgroundColor: '#F3F6FE' },
  actionTextDisabled: { color: '#A1B9FB' },
  modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, backgroundColor: 'rgba(0,0,0,0.60)' },
  dialogCard: { width: '100%', maxWidth: 311, alignItems: 'stretch', overflow: 'hidden', borderRadius: 12, backgroundColor: '#FFFFFF' },
  dialogContent: { gap: 8, alignItems: 'center', paddingHorizontal: 24, paddingTop: 32 },
  dialogTitle: { width: '100%', color: '#141414', fontSize: 18, lineHeight: 26, fontWeight: '600', textAlign: 'center' },
  dialogBody: { width: '100%', color: '#676A72', fontSize: 16, lineHeight: 24, textAlign: 'center' },
  operationLimitNotice: { width: '100%', padding: 8, flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderRadius: 6, backgroundColor: '#FFF1DB' },
  operationLimitText: { flex: 1, color: '#141414', fontSize: 14, lineHeight: 22 },
  scenarioDialogBody: { width: '100%', color: '#676A72', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  scenarioOptions: { marginTop: 24, marginHorizontal: 24, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DFE1E8', borderRadius: 8 },
  scenarioOption: { minHeight: 72, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF' },
  scenarioIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  scenarioSuccessIcon: { backgroundColor: '#EAF8F0' },
  scenarioFailureIcon: { backgroundColor: '#FFF0F0' },
  scenarioWarningIcon: { backgroundColor: '#FFF7E8' },
  scenarioSuccessMark: { color: '#12A150', fontSize: 19, lineHeight: 22, fontWeight: '700' },
  scenarioWarningMark: { color: '#F59A23', fontSize: 19, lineHeight: 22, fontWeight: '700' },
  deviceTypeIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  deviceTypeKceIcon: { backgroundColor: '#EEF3FF' },
  deviceTypeLceIcon: { backgroundColor: '#EAF8F0' },
  deviceTypeKceMark: { color: BLUE, fontSize: 16, lineHeight: 22, fontWeight: '700' },
  deviceTypeLceMark: { color: '#12A150', fontSize: 16, lineHeight: 22, fontWeight: '700' },
  scenarioCopy: { flex: 1, gap: 2 },
  scenarioTitle: { color: '#141414', fontSize: 15, lineHeight: 22, fontWeight: '600' },
  scenarioDescription: { color: '#8F9195', fontSize: 11, lineHeight: 17 },
  scenarioChevron: { color: '#ABADB2', fontSize: 24, lineHeight: 24 },
  scenarioDivider: { height: StyleSheet.hairlineWidth, marginLeft: 58, backgroundColor: '#DFE1E8' },
  scenarioCancelWrap: { padding: 24 },
  dialogFooter: { padding: 24, flexDirection: 'row', gap: 12 },
  dialogButton: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  dialogButtonPrimary: { backgroundColor: BLUE },
  dialogButtonSecondary: { backgroundColor: LIGHT_BLUE },
  dialogButtonText: { fontSize: 16, lineHeight: 24, fontWeight: '600', textAlign: 'center' },
  dialogButtonTextPrimary: { color: '#FFFFFF' },
  dialogButtonTextSecondary: { color: BLUE },
  progressDialog: { paddingHorizontal: 24, paddingVertical: 32, gap: 8 },
  progressRow: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressTrack: { flex: 1, height: 6, overflow: 'hidden', borderRadius: 999, backgroundColor: '#DFE1E8' },
  progressFill: { height: 6, borderRadius: 999, backgroundColor: BLUE },
  progressFillError: { backgroundColor: '#F51414' },
  progressText: { width: 36, color: '#141414', fontSize: 14, lineHeight: 22, textAlign: 'right' },
  progressErrorIcon: { width: 36, height: 22, alignItems: 'center', justifyContent: 'center' },
  currentFloorText: { width: '100%', color: '#676A72', fontSize: 16, lineHeight: 24, textAlign: 'center' },

  recordsSafeArea: { flex: 1, backgroundColor: '#F5F7FA' },
  recordsScroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, gap: 8 },
  operationCard: { width: '100%', paddingHorizontal: 10, paddingVertical: 8, gap: 8, borderRadius: 8, backgroundColor: '#FFFFFF' },
  operationCardHeader: { height: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  operationCardTitle: { flex: 1, color: '#141414', fontSize: 16, lineHeight: 24, fontWeight: '500' },
  operationResultTag: { paddingHorizontal: 8, paddingVertical: 1, borderRadius: 13 },
  operationResultSuccess: { backgroundColor: '#DBFBEA' },
  operationResultFailure: { backgroundColor: '#FEF3F3' },
  operationResultText: { fontSize: 14, lineHeight: 22, fontWeight: '500' },
  operationResultSuccessText: { color: '#16B662' },
  operationResultFailureText: { color: '#F51414' },
  operationMetaList: { gap: 4 },
  operationMetaRow: { height: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  operationMetaLabel: { color: '#676A72', fontSize: 14, lineHeight: 22 },
  operationMetaValue: { color: '#141414', fontSize: 14, lineHeight: 22, textAlign: 'right' },

  workOrderSafeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  workOrderNav: { height: 48, alignItems: 'center', justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E8E8E8', backgroundColor: '#FFFFFF' },
  workOrderBack: { position: 'absolute', left: 20 },
  workOrderTitle: { color: '#111827', fontSize: 18, lineHeight: 26, fontWeight: '600' },
  workOrderMore: { position: 'absolute', right: 16, color: '#2772EE', fontSize: 14, lineHeight: 22 },
  workOrderScroll: { paddingBottom: 96, gap: 8 },
  workOrderCard: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF' },
  orderHeading: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  orderElevatorIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#E5EAF1', backgroundColor: '#F5F7FA' },
  orderHeadingText: { flex: 1, alignItems: 'flex-start' },
  orderName: { color: '#17223B', fontSize: 15, lineHeight: 22, fontWeight: '600' },
  orderProject: { color: '#48556A', fontSize: 12, lineHeight: 18 },
  pendingTag: { marginTop: 3, paddingHorizontal: 5, paddingVertical: 1, borderWidth: 1, borderColor: '#FF9C4A', borderRadius: 2, backgroundColor: '#FFF7ED' },
  pendingTagText: { color: '#F47B20', fontSize: 11, lineHeight: 16 },
  workOrderDivider: { height: StyleSheet.hairlineWidth, marginVertical: 12, backgroundColor: '#E8EBEF' },
  orderInfoRow: { height: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderLabel: { color: '#758195', fontSize: 13, lineHeight: 20 },
  orderValue: { color: '#3C4B63', fontSize: 13, lineHeight: 20 },
  copyText: { color: '#2772EE', fontSize: 11 },
  orderLink: { marginTop: 3, color: '#58667A', fontSize: 12, lineHeight: 18 },
  faultTitle: { color: '#101827', fontSize: 15, lineHeight: 22, fontWeight: '600' },
  dateRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateText: { color: '#6D788A', fontSize: 11, lineHeight: 18 },
  dateMaintenance: { color: '#2772EE' },
  dateMarker: { width: 46, height: 18, marginTop: 5, marginLeft: '55%', borderRadius: 5, backgroundColor: '#E1EDFF' },
  floorText: { marginTop: 8, color: '#697689', fontSize: 12, lineHeight: 18 },
  remotePrompt: { minHeight: 54, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF' },
  cloudGlyph: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  cloudGlyphText: { color: '#2772EE', fontSize: 23, lineHeight: 23, transform: [{ rotate: '-20deg' }] },
  remotePromptText: { flex: 1, color: '#2772EE', fontSize: 13, lineHeight: 18, fontWeight: '600' },
  alertDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#F23D4F' },
  remoteChevron: { color: '#A7AFBA', fontSize: 24, lineHeight: 24 },
  statusCard: { minHeight: 64, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFFFFF' },
  statusGlyph: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#2772EE' },
  statusGlyphText: { color: '#FFFFFF', fontSize: 16, lineHeight: 20 },
  statusCopy: { flex: 1 },
  statusTitle: { color: '#2772EE', fontSize: 14, lineHeight: 20, fontWeight: '600' },
  statusTime: { color: '#8995A8', fontSize: 11, fontWeight: '400' },
  statusDetail: { color: '#536076', fontSize: 12, lineHeight: 18 },
  workOrderBottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', gap: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E1E5EA', backgroundColor: '#FFFFFF' },
  workOrderBottomButton: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 7, borderWidth: 1, borderColor: '#D6DCE4', backgroundColor: '#FFFFFF' },
  rejectButton: { borderColor: '#F56B73' },
  acceptButton: { borderColor: BLUE, backgroundColor: BLUE },
  transferText: { color: '#3B4658', fontSize: 14, fontWeight: '500' },
  rejectText: { color: '#F04E5D', fontSize: 14, fontWeight: '500' },
  acceptText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  cloudDialogCard: { width: '100%', maxWidth: 270, overflow: 'hidden', borderRadius: 14, backgroundColor: '#FFFFFF' },
  cloudDialogContent: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20, gap: 8 },
  cloudDialogTitle: { color: '#151B27', fontSize: 17, lineHeight: 24, fontWeight: '600', textAlign: 'center' },
  cloudDialogBody: { color: '#7A8494', fontSize: 14, lineHeight: 21, textAlign: 'center' },
  cloudDialogFooter: { height: 48, flexDirection: 'row', alignItems: 'stretch', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E8ED' },
  cloudDialogFooterButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cloudDialogFooterDivider: { width: StyleSheet.hairlineWidth, backgroundColor: '#E5E8ED' },
  cloudCancelText: { color: '#5D687B', fontSize: 14, fontWeight: '500' },
  cloudOpenText: { color: '#2772EE', fontSize: 14, fontWeight: '600' },
  pressed: { opacity: 0.72 },
});
