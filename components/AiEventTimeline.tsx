import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckTag, Steps, colorThemes, componentTokens, typographyTokens, type StepItem } from '@kone/mobile-design-system';
import { DataPanelTitle } from './DataPanelTitle';

type EventKind = 'fault' | 'sn' | 'other';

type DeviceEvent = {
  id: string;
  kind: EventKind;
  /** `HH:mm`，同一天内按时间升序排列。 */
  time: string;
  /** 故障代码（4 位数字）、SN 编号（如 SN2919）或普通事件名。 */
  title: string;
  description: string;
};

type TimelineView = 'key' | 'all';

/**
 * 模拟的设备事件，时间范围 16:02–17:12，工单创建于 16:46。
 * 与 AI 分析的叙述对齐：故障消息 0048 在 16:42 出现 1 次，工单后无新增故障代码。
 * 0317 与 SN2919 各连续出现多次，用来演示默认视图的合并。
 */
const events: readonly DeviceEvent[] = [
  { id: 'f-0317-1602', kind: 'fault', time: '16:02', title: '0317', description: '层门锁紧装置动作延迟' },
  { id: 'f-0317-1605', kind: 'fault', time: '16:05', title: '0317', description: '层门锁紧装置动作延迟' },
  { id: 'load-1606', kind: 'other', time: '16:06', title: '称重变化', description: '120 kg → 246 kg' },
  { id: 'f-0317-1608', kind: 'fault', time: '16:08', title: '0317', description: '层门锁紧装置动作延迟' },
  { id: 'call-1610', kind: 'other', time: '16:10', title: '外呼登记', description: '1F 呼叫，来自 12F' },
  { id: 'run-1614', kind: 'other', time: '16:14', title: '电梯运行', description: '1F → 12F，运行时长 11s' },
  { id: 'sn-2919-1614', kind: 'sn', time: '16:14', title: 'SN2919', description: '轿门B到位信号抖动' },
  { id: 'sn-2919-1616', kind: 'sn', time: '16:16', title: 'SN2919', description: '轿门B到位信号抖动' },
  { id: 'sn-2919-1618', kind: 'sn', time: '16:18', title: 'SN2919', description: '轿门B到位信号抖动' },
  { id: 'close-1619', kind: 'other', time: '16:19', title: '关门', description: '1F 关门完成，用时 2.2s' },
  { id: 'load-1624', kind: 'other', time: '16:24', title: '称重变化', description: '368 kg → 246 kg' },
  { id: 'open-1628', kind: 'other', time: '16:28', title: '开门', description: '12F 开门完成，用时 2.3s' },
  { id: 'load-1633', kind: 'other', time: '16:33', title: '称重变化', description: '246 kg → 368 kg' },
  { id: 'sn-3047-1640', kind: 'sn', time: '16:40', title: 'SN3047', description: '机房温度传感器读数偏高' },
  { id: 'f-0048-1642', kind: 'fault', time: '16:42', title: '0048', description: '电梯门无法关闭-人为挡门' },
  { id: 'call-1651', kind: 'other', time: '16:51', title: '外呼登记', description: '12F 呼叫，来自 10F' },
  { id: 'run-1658', kind: 'other', time: '16:58', title: '电梯运行', description: '12F → 10F，运行时长 9s' },
  { id: 'close-1702', kind: 'other', time: '17:02', title: '关门', description: '10F 关门完成，用时 2.4s' },
  { id: 'load-1708', kind: 'other', time: '17:08', title: '称重变化', description: '292 kg → 286 kg' },
  { id: 'sn-3047-1710', kind: 'sn', time: '17:10', title: 'SN3047', description: '机房温度传感器读数偏高' },
  { id: 'open-1712', kind: 'other', time: '17:12', title: '开门', description: '1F 开门完成，用时 2.1s' },
];

const kindLabels: Record<Exclude<EventKind, 'other'>, string> = {
  fault: '故障代码',
  sn: '',
};

/** 默认视图：只留故障代码和 SN 事件，相邻且同编号的合并成一个时间段，最新的在最上面。 */
function buildKeyItems(): StepItem[] {
  const keyEvents = events.filter((event) => event.kind !== 'other');
  const groups: DeviceEvent[][] = [];
  for (const event of keyEvents) {
    const last = groups[groups.length - 1];
    if (last && last[0]?.title === event.title) last.push(event);
    else groups.push([event]);
  }

  return groups
    .map((group): StepItem | null => {
      const first = group[0];
      const last = group[group.length - 1];
      if (!first || !last) return null;
      const merged = group.length > 1;
      const kind = first.kind === 'fault' ? 'fault' : 'sn';
      const prefix = kindLabels[kind];
      return {
        id: `key-${first.id}`,
        title: prefix ? `${prefix} ${first.title}` : first.title,
        meta: merged ? `${first.time}–${last.time}` : first.time,
        description: merged ? `${first.description}，共 ${group.length} 次` : first.description,
        status: 'finish',
      };
    })
    .filter((item): item is StepItem => item !== null)
    .reverse();
}

/** 所有事件：按时间倒序逐条展示，不合并。 */
function buildAllItems(): StepItem[] {
  return events
    .map((event): StepItem => ({
      id: `all-${event.id}`,
      title: event.kind === 'fault' ? `故障代码 ${event.title}` : event.title,
      meta: event.time,
      description: event.description,
      status: 'finish',
    }))
    .reverse();
}

/** 「AI事件汇总」：默认展示故障代码与 SN 事件的时间线，可切换到所有事件。 */
export function AiEventTimeline() {
  const [view, setView] = useState<TimelineView>('key');
  const keyItems = useMemo(buildKeyItems, []);
  const allItems = useMemo(buildAllItems, []);
  const items = view === 'key' ? keyItems : allItems;

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <DataPanelTitle
          action={(
            <View accessibilityRole="radiogroup" style={styles.filters}>
              <CheckTag
                accessibilityRole="radio"
                checked={view === 'key'}
                label="故障与 SN"
                onChange={() => setView('key')}
                shape="round"
                size="medium"
              />
              <CheckTag
                accessibilityRole="radio"
                checked={view === 'all'}
                label="所有事件"
                onChange={() => setView('all')}
                shape="round"
                size="medium"
              />
            </View>
          )}
        >
          AI事件汇总
        </DataPanelTitle>
        <Text style={styles.description}>该数据统计截止至当前页面打开时。</Text>
      </View>
      <Steps
        accessibilityLabel={view === 'key' ? '故障代码与 SN 事件时间线' : '所有事件时间线'}
        items={items}
        layout="vertical"
        readOnly
        theme="dot"
      />
    </View>
  );
}

const colors = colorThemes.light;
const tokens = componentTokens.dataPanel;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: tokens.paddingHorizontal,
    paddingVertical: tokens.paddingVertical,
    borderRadius: tokens.radius,
    gap: 12,
    backgroundColor: colors.background.container,
  },
  heading: { gap: 4 },
  description: { color: colors.text.placeholder, ...typographyTokens.footer12Regular },
  filters: { marginLeft: 'auto', flexDirection: 'row', gap: 8 },
});
