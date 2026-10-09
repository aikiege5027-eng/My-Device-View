import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import ArrowRight from '../assets/arrow-right.svg';
import EventChevronRight from '../assets/event-chevron-right.svg';
import { FaultCodePill } from './FaultCodePill';
import { FaultCodeStatsSheet, type FaultCodeStat } from './FaultCodeStatsSheet';
import {
  Divider,
  Tag,
  colorThemes,
  componentTokens,
  radiusTokens,
  typographyTokens,
} from '@kone/mobile-design-system';

type EventRange = '24h' | '7d' | '30d';
type EventCategory =
  | 'fault'
  | 'alarmBell'
  | 'modeChange'
  | 'customerNotice'
  | 'serviceRequest'
  | 'repairOrder'
  | 'maintenanceOrder';

type FaultMessage = {
  code: string;
  description: string;
  id: string;
  occurredAt: string;
  /** `true` 渲染「已恢复」success outline Tag；Figma 仅定义有/无两种形态。 */
  recovered?: boolean;
};

const ranges: readonly { id: EventRange; label: string }[] = [
  { id: '24h', label: '近24小时' },
  { id: '7d', label: '近7天' },
  { id: '30d', label: '近30天' },
];

/**
 * 故障消息模拟数据：58 条，覆盖 12 类四位故障代码，按 `occurredAt` 严格倒序。
 * 同一故障代码固定对应同一描述文案，避免同码不同义。
 * 最新 3 条为处理中（不显示「已恢复」标签），其余均已恢复。
 */
const faultMessages: readonly FaultMessage[] = [
  { code: '0021', description: '平层感应信号丢失', id: 'fault-20251212-121212', occurredAt: '2025-12-12 12:12:12' },
  { code: '0036', description: '门锁回路瞬时断开，轿厢停于非平层', id: 'fault-20251212-000827', occurredAt: '2025-12-12 00:08:27' },
  { code: '0048', description: '电梯门无法关闭-人为挡门', id: 'fault-20251211-183303', occurredAt: '2025-12-11 18:33:03' },
  { code: '0105', description: '轿厢非正常移动', id: 'fault-20251211-114348', occurredAt: '2025-12-11 11:43:48', recovered: true },
  { code: '0117', description: '曳引机温度超过保护阈值', id: 'fault-20251210-170959', occurredAt: '2025-12-10 17:09:59', recovered: true },
  { code: '0142', description: '安全回路断开，电梯急停', id: 'fault-20251210-024406', occurredAt: '2025-12-10 02:44:06', recovered: true },
  { code: '0208', description: '轿内对讲呼叫无应答', id: 'fault-20251209-142846', occurredAt: '2025-12-09 14:28:46', recovered: true },
  { code: '0233', description: '称重装置数据异常', id: 'fault-20251209-081811', occurredAt: '2025-12-09 08:18:11', recovered: true },
  { code: '0317', description: '层门锁紧装置动作延迟', id: 'fault-20251209-002336', occurredAt: '2025-12-09 00:23:36', recovered: true },
  { code: '0349', description: '变频器过流保护触发', id: 'fault-20251208-171851', occurredAt: '2025-12-08 17:18:51', recovered: true },
  { code: '0412', description: '制动器反馈开关未闭合', id: 'fault-20251208-130131', occurredAt: '2025-12-08 13:01:31', recovered: true },
  { code: '0527', description: '井道照明回路断电', id: 'fault-20251208-030841', occurredAt: '2025-12-08 03:08:41', recovered: true },
  { code: '0142', description: '安全回路断开，电梯急停', id: 'fault-20251207-141956', occurredAt: '2025-12-07 14:19:56', recovered: true },
  { code: '0527', description: '井道照明回路断电', id: 'fault-20251207-075900', occurredAt: '2025-12-07 07:59:00', recovered: true },
  { code: '0105', description: '轿厢非正常移动', id: 'fault-20251206-161100', occurredAt: '2025-12-06 16:11:00', recovered: true },
  { code: '0036', description: '门锁回路瞬时断开，轿厢停于非平层', id: 'fault-20251206-112615', occurredAt: '2025-12-06 11:26:15', recovered: true },
  { code: '0527', description: '井道照明回路断电', id: 'fault-20251206-044345', occurredAt: '2025-12-06 04:43:45', recovered: true },
  { code: '0105', description: '轿厢非正常移动', id: 'fault-20251205-140350', occurredAt: '2025-12-05 14:03:50', recovered: true },
  { code: '0233', description: '称重装置数据异常', id: 'fault-20251205-033641', occurredAt: '2025-12-05 03:36:41', recovered: true },
  { code: '0412', description: '制动器反馈开关未闭合', id: 'fault-20251204-211628', occurredAt: '2025-12-04 21:16:28', recovered: true },
  { code: '0527', description: '井道照明回路断电', id: 'fault-20251204-035412', occurredAt: '2025-12-04 03:54:12', recovered: true },
  { code: '0105', description: '轿厢非正常移动', id: 'fault-20251203-201602', occurredAt: '2025-12-03 20:16:02', recovered: true },
  { code: '0021', description: '平层感应信号丢失', id: 'fault-20251203-143040', occurredAt: '2025-12-03 14:30:40', recovered: true },
  { code: '0048', description: '电梯门无法关闭-人为挡门', id: 'fault-20251202-194154', occurredAt: '2025-12-02 19:41:54', recovered: true },
  { code: '0048', description: '电梯门无法关闭-人为挡门', id: 'fault-20251202-054540', occurredAt: '2025-12-02 05:45:40', recovered: true },
  { code: '0349', description: '变频器过流保护触发', id: 'fault-20251201-154341', occurredAt: '2025-12-01 15:43:41', recovered: true },
  { code: '0412', description: '制动器反馈开关未闭合', id: 'fault-20251130-225818', occurredAt: '2025-11-30 22:58:18', recovered: true },
  { code: '0105', description: '轿厢非正常移动', id: 'fault-20251130-044705', occurredAt: '2025-11-30 04:47:05', recovered: true },
  { code: '0048', description: '电梯门无法关闭-人为挡门', id: 'fault-20251129-230504', occurredAt: '2025-11-29 23:05:04', recovered: true },
  { code: '0349', description: '变频器过流保护触发', id: 'fault-20251129-060630', occurredAt: '2025-11-29 06:06:30', recovered: true },
  { code: '0048', description: '电梯门无法关闭-人为挡门', id: 'fault-20251128-183735', occurredAt: '2025-11-28 18:37:35', recovered: true },
  { code: '0048', description: '电梯门无法关闭-人为挡门', id: 'fault-20251128-101344', occurredAt: '2025-11-28 10:13:44', recovered: true },
  { code: '0233', description: '称重装置数据异常', id: 'fault-20251127-143915', occurredAt: '2025-11-27 14:39:15', recovered: true },
  { code: '0349', description: '变频器过流保护触发', id: 'fault-20251127-033753', occurredAt: '2025-11-27 03:37:53', recovered: true },
  { code: '0317', description: '层门锁紧装置动作延迟', id: 'fault-20251126-134053', occurredAt: '2025-11-26 13:40:53', recovered: true },
  { code: '0317', description: '层门锁紧装置动作延迟', id: 'fault-20251125-192451', occurredAt: '2025-11-25 19:24:51', recovered: true },
  { code: '0048', description: '电梯门无法关闭-人为挡门', id: 'fault-20251124-234558', occurredAt: '2025-11-24 23:45:58', recovered: true },
  { code: '0021', description: '平层感应信号丢失', id: 'fault-20251124-065517', occurredAt: '2025-11-24 06:55:17', recovered: true },
  { code: '0036', description: '门锁回路瞬时断开，轿厢停于非平层', id: 'fault-20251123-201330', occurredAt: '2025-11-23 20:13:30', recovered: true },
  { code: '0412', description: '制动器反馈开关未闭合', id: 'fault-20251123-101401', occurredAt: '2025-11-23 10:14:01', recovered: true },
  { code: '0117', description: '曳引机温度超过保护阈值', id: 'fault-20251122-143506', occurredAt: '2025-11-22 14:35:06', recovered: true },
  { code: '0527', description: '井道照明回路断电', id: 'fault-20251122-005057', occurredAt: '2025-11-22 00:50:57', recovered: true },
  { code: '0233', description: '称重装置数据异常', id: 'fault-20251121-052050', occurredAt: '2025-11-21 05:20:50', recovered: true },
  { code: '0021', description: '平层感应信号丢失', id: 'fault-20251120-162329', occurredAt: '2025-11-20 16:23:29', recovered: true },
  { code: '0117', description: '曳引机温度超过保护阈值', id: 'fault-20251120-032934', occurredAt: '2025-11-20 03:29:34', recovered: true },
  { code: '0412', description: '制动器反馈开关未闭合', id: 'fault-20251119-204541', occurredAt: '2025-11-19 20:45:41', recovered: true },
  { code: '0317', description: '层门锁紧装置动作延迟', id: 'fault-20251119-064917', occurredAt: '2025-11-19 06:49:17', recovered: true },
  { code: '0349', description: '变频器过流保护触发', id: 'fault-20251119-022446', occurredAt: '2025-11-19 02:24:46', recovered: true },
  { code: '0117', description: '曳引机温度超过保护阈值', id: 'fault-20251118-152243', occurredAt: '2025-11-18 15:22:43', recovered: true },
  { code: '0105', description: '轿厢非正常移动', id: 'fault-20251118-103958', occurredAt: '2025-11-18 10:39:58', recovered: true },
  { code: '0208', description: '轿内对讲呼叫无应答', id: 'fault-20251117-194959', occurredAt: '2025-11-17 19:49:59', recovered: true },
  { code: '0233', description: '称重装置数据异常', id: 'fault-20251117-020049', occurredAt: '2025-11-17 02:00:49', recovered: true },
  { code: '0021', description: '平层感应信号丢失', id: 'fault-20251116-202524', occurredAt: '2025-11-16 20:25:24', recovered: true },
  { code: '0412', description: '制动器反馈开关未闭合', id: 'fault-20251116-132232', occurredAt: '2025-11-16 13:22:32', recovered: true },
  { code: '0142', description: '安全回路断开，电梯急停', id: 'fault-20251116-052936', occurredAt: '2025-11-16 05:29:36', recovered: true },
  { code: '0048', description: '电梯门无法关闭-人为挡门', id: 'fault-20251116-001643', occurredAt: '2025-11-16 00:16:43', recovered: true },
  { code: '0117', description: '曳引机温度超过保护阈值', id: 'fault-20251115-091815', occurredAt: '2025-11-15 09:18:15', recovered: true },
  { code: '0036', description: '门锁回路瞬时断开，轿厢停于非平层', id: 'fault-20251115-013504', occurredAt: '2025-11-15 01:35:04', recovered: true },
];

/**
 * 全部故障代码统计，按次数从高到低排列；次数相同时按代码升序，保证渲染顺序稳定。
 * 从 `faultMessages` 推导而非写死，数据变更后自动同步。
 */
const faultCodeStats: readonly FaultCodeStat[] = [
  ...faultMessages.reduce(
    (counts, item) => counts.set(item.code, (counts.get(item.code) ?? 0) + 1),
    new Map<string, number>(),
  ),
]
  .sort(([codeA, countA], [codeB, countB]) => countB - countA || codeA.localeCompare(codeB))
  .map(([code, count]) => ({ code, count }));

/** 面板行默认展示的统计数量，其余在「更多」面板里展示。 */
const panelStatCount = 3;

/**
 * 面板行固定展示次数最高的 3 个故障代码，顺序不随选择变化。
 *
 * 代价是：排除项不在这 3 个里时，收起状态下看不到该筛选已生效，需要打开「更多」
 * 才能确认。这是刻意选择的「顺序稳定优先」。
 */
const panelStats = faultCodeStats.slice(0, panelStatCount);

/** `fault` 的条数由 `faultMessages` 推导，避免角标与列表长度不一致。 */
const categories: readonly { count: number; id: EventCategory; label: string }[] = [
  { count: faultMessages.length, id: 'fault', label: '故障消息' },
  { count: 12, id: 'alarmBell', label: '警铃消息' },
  { count: 12, id: 'modeChange', label: '模式变化' },
  { count: 12, id: 'customerNotice', label: '客户通知' },
  { count: 48, id: 'serviceRequest', label: '服务需求' },
  { count: 12, id: 'repairOrder', label: '走修工单' },
  { count: 12, id: 'maintenanceOrder', label: '保养工单' },
];

/**
 * 设备事件页签内容，当前以 Figma 节点 `20340:8888`（`event`）为准。
 *
 * 包含四段：时间范围筛选（`20340:8889`）、事件分类卡片（`20340:8897`）、
 * 故障代码统计行（`20340:9070`）、故障消息列表（`20340:8931`）。
 *
 * 故障代码统计行在该版本中改为「3 个统计 Tag + 更多入口」，分割线不再带文案，
 * 原先的过滤设置图标按钮已从设计中移除。Figma 当前只定义了故障消息的列表形态，
 * 其余分类的列表内容尚无设计稿，因此选中后显示占位说明而不臆造行结构。
 */
export function DeviceEventsPanel() {
  const [range, setRange] = useState<EventRange>('30d');
  const [category, setCategory] = useState<EventCategory>('fault');
  const [innerWidth, setInnerWidth] = useState(311);
  /**
   * 故障代码筛选采用排除语义：默认全部选中，取消选中即把该代码从列表里排除。
   * 状态记录「被取消的代码」而不是「被选中的代码」，这样空集天然等于全选，
   * 且数据里新增故障代码时默认是选中态，不会被静默过滤掉。
   */
  const [excludedCodes, setExcludedCodes] = useState<readonly string[]>([]);
  const [statsSheetVisible, setStatsSheetVisible] = useState(false);

  const tileWidth = Math.max(60, (innerWidth - categoryGap * 3) / 4);
  const handleLayout = (event: LayoutChangeEvent) =>
    setInnerWidth(event.nativeEvent.layout.width - 32);
  const activeCategory = categories.find((item) => item.id === category);

  const visibleMessages =
    excludedCodes.length === 0
      ? faultMessages
      : faultMessages.filter((item) => !excludedCodes.includes(item.code));

  /** 取消选中即加入排除集，再次选中即移出排除集。 */
  const toggleCode = (code: string) =>
    setExcludedCodes((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code],
    );

  return (
    <View onLayout={handleLayout} style={styles.panel}>
      <View accessibilityRole="radiogroup" style={styles.rangeRow}>
        <View style={styles.rangeGroup}>
          {ranges.map((item) => {
            const selected = item.id === range;
            return (
              <Pressable
                accessibilityLabel={`统计范围 ${item.label}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                hitSlop={{ bottom: 12, left: 4, right: 4, top: 12 }}
                key={item.id}
                onPress={() => setRange(item.id)}
                style={({ pressed }) => [
                  styles.rangeChip,
                  selected && styles.rangeChipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.rangeText, selected && styles.rangeTextSelected]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View accessibilityRole="radiogroup" style={styles.categoryGrid}>
        {categories.map((item) => {
          const selected = item.id === category;
          return (
            <Pressable
              accessibilityLabel={`${item.label} ${item.count} 条`}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              key={item.id}
              onPress={() => setCategory(item.id)}
              style={({ pressed }) => [
                styles.categoryTile,
                { width: tileWidth },
                selected && styles.categoryTileSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text numberOfLines={1} style={[styles.categoryLabel, selected && styles.categoryTextSelected]}>
                {item.label}
              </Text>
              <Text style={[styles.categoryCount, selected && styles.categoryTextSelected]}>
                {item.count}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {category === 'fault' ? (
        <>
          {/** 新版只保留无文案的虚线分割线，原「故障代码统计及过滤」文案已移除。 */}
          <Divider dashed />

          <View style={styles.statRow}>
            <View style={styles.statTags}>
              {/**
               * 统计胶囊同时是筛选项。几何与配色对齐 CheckTag `size=medium`，
               * 两段字重的偏离集中在 `FaultCodePill` 里说明，「更多」面板用同一个
               * 组件的 `extraLarge` 档，保证两处格式一致。
               */}
              {panelStats.map((item) => (
                <FaultCodePill
                  checked={!excludedCodes.includes(item.code)}
                  code={item.code}
                  count={item.count}
                  key={item.code}
                  onToggle={() => toggleCode(item.code)}
                  size="medium"
                />
              ))}
            </View>

            {/**
             * Figma 用 Tag 实例承载「更多」并把 close 槽换成 chevron-right，但整块是
             * 进入完整统计的入口，而 Tag 按设计系统规则是只读容器、不得整体暴露为按钮，
             * 因此这里用 Pressable 实现，几何同样复用 Tag `size=medium`。
             */}
            <Pressable
              accessibilityHint={`查看并筛选全部 ${faultCodeStats.length} 类故障代码`}
              accessibilityLabel="更多"
              accessibilityRole="button"
              hitSlop={{ bottom: 10, left: 4, right: 4, top: 10 }}
              onPress={() => setStatsSheetVisible(true)}
              style={({ pressed }) => [styles.pill, styles.moreEntry, pressed && styles.pressed]}
            >
              <Text style={styles.moreLabel}>更多</Text>
              <EventChevronRight
                accessibilityElementsHidden
                color={colors.text.secondary}
                height={moreEntryTokens.iconSize}
                importantForAccessibility="no-hide-descendants"
                width={moreEntryTokens.iconSize}
              />
            </Pressable>
          </View>
          {visibleMessages.length === 0 ? (
            /** 排除语义允许「全部取消」，此时列表为空。Figma 未定义空态样式。 */
            <Text style={styles.undesignedHint}>已取消全部故障代码，没有可展示的故障消息。</Text>
          ) : (
            <View accessibilityLabel="故障消息列表" style={styles.list}>
              {visibleMessages.map((item) => (
                <FaultMessageCard item={item} key={item.id} />
              ))}
            </View>
          )}

          <FaultCodeStatsSheet
            excluded={excludedCodes}
            onClose={() => setStatsSheetVisible(false)}
            onConfirm={(next) => {
              setExcludedCodes(next);
              setStatsSheetVisible(false);
            }}
            stats={faultCodeStats}
            visible={statsSheetVisible}
          />
        </>
      ) : (
        <Text style={styles.undesignedHint}>
          {activeCategory?.label}的列表样式待设计稿补充。
        </Text>
      )}
    </View>
  );
}

function FaultMessageCard({ item }: { item: FaultMessage }) {
  const recoveredLabel = item.recovered ? '，已恢复' : '';

  return (
    <Pressable
      accessibilityHint="查看该故障消息详情"
      accessibilityLabel={`故障代码 ${item.code}${recoveredLabel}，${item.occurredAt}，${item.description}`}
      accessibilityRole="button"
      onPress={() => Alert.alert(`故障 ${item.code}`, `${item.description}\n\n发生时间：${item.occurredAt}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.cardCodeGroup}>
          <Text style={styles.cardCode}>{item.code}</Text>
          {item.recovered ? (
            <Tag label="已恢复" size="small" theme="success" variant="outline" />
          ) : null}
        </View>
        <Text style={styles.cardTime}>{item.occurredAt}</Text>
      </View>
      <View style={styles.cardBottomRow}>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <ArrowRight
          accessibilityElementsHidden
          height={22}
          importantForAccessibility="no-hide-descendants"
          width={22}
        />
      </View>
    </Pressable>
  );
}

const colors = colorThemes.light;
const eventColors = colors.deviceEvents;

/** Figma 分类卡片 auto layout 间距，行列共用。 */
const categoryGap = 9;

/**
 * 「更多」入口的几何，取 Tag `size=medium`（24 高、8/2 内边距、14 图标、`Foot 12`），
 * 与 Figma `20340:9118` 一致，也与同一行的统计胶囊等高。
 */
const moreEntryTokens = componentTokens.tag.sizes.medium;

const styles = StyleSheet.create({
  panel: { gap: 16, padding: 16, borderRadius: 12, backgroundColor: colors.background.container },
  rangeRow: { minHeight: 20, flexDirection: 'row', alignItems: 'center' },
  rangeGroup: { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 16, backgroundColor: colors.brand.light },
  rangeChip: { paddingHorizontal: 8, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' },
  rangeChipSelected: { borderRadius: 50, backgroundColor: colors.brand.default },
  rangeText: { color: eventColors.rangeInactiveText, ...typographyTokens.footer10Regular, lineHeight: 12 },
  rangeTextSelected: { color: colors.text.white, ...typographyTokens.footer10Semibold, lineHeight: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: categoryGap, rowGap: categoryGap },
  categoryTile: { gap: 2, paddingHorizontal: 4, paddingVertical: 8, alignItems: 'center', borderRadius: radiusTokens.medium, backgroundColor: colors.brand.light },
  /** 选中态加 1 边框，内边距同步减 1，避免行高比未选中卡片高 2。 */
  categoryTileSelected: { paddingHorizontal: 3, paddingVertical: 7, borderWidth: 1, borderColor: colors.brand.default },
  categoryLabel: { maxWidth: '100%', color: eventColors.categoryInactiveText, textAlign: 'center', ...typographyTokens.footer12Regular, lineHeight: 16 },
  categoryCount: { color: eventColors.categoryInactiveText, textAlign: 'center', ...typographyTokens.body14Semibold, lineHeight: 19 },
  categoryTextSelected: { color: colors.text.brand },
  /**
   * Figma `Frame 22`（311×24）：横向两端对齐并允许换行，窄屏时「更多」整块换到下一行，
   * 行间距 12。Figma 未定义换行后的列间距，因此只设置 rowGap。
   */
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  statTags: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  /** 「更多」入口容器，几何与 Tag `size=medium` + `shape=round` 一致。 */
  pill: {
    minHeight: moreEntryTokens.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moreEntryTokens.paddingHorizontal,
    paddingVertical: moreEntryTokens.paddingVertical,
    borderRadius: radiusTokens.tagRound,
    backgroundColor: colors.background.component,
  },
  moreEntry: { gap: moreEntryTokens.contentGap },
  moreLabel: { color: colors.text.secondary, textAlign: 'center', ...typographyTokens.footer12Regular },

  list: { gap: 8 },
  undesignedHint: { paddingVertical: 24, color: colors.text.placeholder, textAlign: 'center', ...typographyTokens.footer12Regular },
  card: { gap: 4, padding: 12, borderRadius: radiusTokens.small, backgroundColor: colors.background.secondaryContainer },
  cardTopRow: { minHeight: 24, flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardCodeGroup: { minWidth: 0, flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardCode: { color: colors.text.primary, ...typographyTokens.title16Semibold },
  cardTime: { color: colors.text.primary, ...typographyTokens.footer12Regular },
  cardBottomRow: { minHeight: 22, flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardDescription: { minWidth: 0, flex: 1, color: colors.text.primary, ...typographyTokens.body14Regular },
  pressed: { opacity: 0.72 },
});
