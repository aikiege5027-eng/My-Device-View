import React, { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colorThemes, componentTokens, typographyTokens } from '../designTokens';
import { CloseMIcon } from '../icons';
import { Button } from './Button';
import { WheelPanel, type WheelColumn } from './internal/WheelPanel';

/** Figma `type` 轴：单选、多选、区间。 */
export type CalendarType = 'multiple' | 'range' | 'single';

/**
 * Figma `format` 轴。括号内为原始变体名。
 *
 * - `default`（`default`）：只有日期数字，垂直居中
 * - `suffix`（`suffix`）：日期 + 下方描述，内容底部对齐
 * - `prefixSuffix`（`prefix&suffix`）：上方描述 + 日期 + 下方描述，垂直居中
 */
export type CalendarFormat = 'default' | 'prefixSuffix' | 'suffix';

export type CalendarDateMeta = {
  /** Figma `disabled=true`：不可选，文案使用 `text.disabled`。 */
  disabled?: boolean;
  /**
   * 日期上方的 `10/16 Regular` 描述（Figma `prefix=true`，示例 `Spring`）。
   * 该状态下 prefix 与日期数字整体使用 error 语义色。
   */
  prefix?: string;
  /** 日期下方的 `10/16 Regular` 描述（Figma `suffix=true`，示例 `¥60`），使用 `text.disabled`。 */
  suffix?: string;
};

export type CalendarRange = { end?: Date; start?: Date };

export type CalendarTimePicker = {
  formatHour?: (hour: number) => string;
  formatMinute?: (minute: number) => string;
  hourAccessibilityLabel: string;
  minuteAccessibilityLabel: string;
  /** 分钟步进。Figma 未定义步进值，默认逐分钟。 */
  minuteStep?: number;
  onChange: (next: { hour: number; minute: number }) => void;
  /** 居中标题，Figma 示例为 `Time`。 */
  title?: string;
  value: { hour: number; minute: number };
};

/**
 * close-M 位于 title 行内部，关闭入口必须与标题同时存在
 * （Figma 的无标题形态是把整个 title 层隐藏）。
 */
type CalendarTitleProps =
  | { closeAccessibilityLabel?: string; onClose?: () => void; title: string }
  | { closeAccessibilityLabel?: never; onClose?: never; title?: never };

type CalendarBaseProps = CalendarTitleProps & {
  /** 无标题时面板没有可读名称，由宿主或此处提供。 */
  accessibilityLabel?: string;
  confirmText?: string;
  /** 可选月份范围的最后一个月（按月取整，含该月）。 */
  endMonth: Date;
  /** 月份标题文案，Figma 示例为 `March 2023`；本地化由调用方负责。 */
  formatMonth: (month: Date) => string;
  format?: CalendarFormat;
  /** Figma 星期表头从 `SUN` 起；`firstDayOfWeek` 改变起始列时需同步调整该数组顺序。 */
  weekdayLabels: readonly [string, string, string, string, string, string, string];
  /** 0 为周日起（Figma 当前定义），1 为周一起。 */
  firstDayOfWeek?: 0 | 1;
  /** 每一天的附加文案与禁用状态，键为 `YYYY-MM-DD`（本地时区）。 */
  meta?: Readonly<Record<string, CalendarDateMeta>>;
  /** Figma `now=true`：今天的日期数字使用品牌色。缺省不标记任何一天。 */
  now?: Date;
  /** 可选月份范围的第一个月（按月取整）。 */
  startMonth: Date;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Figma `timePicker=true`：底部操作上方内嵌的时间滚轮。 */
  timePicker?: CalendarTimePicker;
};

export type CalendarProps =
  | (CalendarBaseProps & {
      onChange: (next: Date) => void;
      onConfirm: (value: Date | undefined) => void;
      type?: 'single';
      value: Date | undefined;
    })
  | (CalendarBaseProps & {
      onChange: (next: readonly Date[]) => void;
      onConfirm: (value: readonly Date[]) => void;
      type: 'multiple';
      value: readonly Date[];
    })
  | (CalendarBaseProps & {
      onChange: (next: CalendarRange) => void;
      onConfirm: (value: CalendarRange) => void;
      type: 'range';
      value: CalendarRange;
    });

/**
 * 统一 Calendar 日历（Figma `24386:5262`，图层名 `Calendar 日历`）。
 *
 * 覆盖 `type=single|multiple|range` × `format=default|suffix|prefix&suffix` ×
 * `timePicker=false|true` 共 18 个变体，以及 `item/date` 的
 * `select` / `select-start` / `select-end` / `hight-light` / `now` /
 * `prefix` / `suffix` / `empty` / `disabled` 状态。
 *
 * 月份按 `startMonth`–`endMonth` 连续渲染并纵向滚动；标题、星期表头、
 * 时间滚轮与确认按钮固定。内嵌时间滚轮复用与 Picker / DateTimePicker 相同的
 * 内部滚轮面板，不另画一套滚轮。
 *
 * 面板本体不包含遮罩、弹出动画、安全区与系统返回处理 —— Figma 当前节点未定义，
 * 应由外层 `BottomSheet` 宿主负责。
 */
export function Calendar(props: CalendarProps) {
  const {
    accessibilityLabel,
    closeAccessibilityLabel = 'Close',
    confirmText = 'Confirm',
    endMonth,
    firstDayOfWeek = 0,
    format = 'default',
    formatMonth,
    meta,
    now,
    onClose,
    startMonth,
    style,
    testID,
    timePicker,
    title,
    weekdayLabels,
  } = props;

  const months = monthsBetween(startMonth, endMonth);

  const handlePress = useCallback(
    (date: Date) => {
      if (props.type === 'multiple') {
        const selected = props.value.some((item) => isSameDay(item, date));
        props.onChange(
          selected
            ? props.value.filter((item) => !isSameDay(item, date))
            : [...props.value, date],
        );
        return;
      }

      if (props.type === 'range') {
        props.onChange(nextRange(props.value, date));
        return;
      }

      props.onChange(date);
    },
    [props],
  );

  return (
    <View
      accessibilityLabel={title ?? accessibilityLabel}
      style={[styles.container, style]}
      testID={testID}
    >
      {title === undefined ? null : (
        <View style={styles.title}>
          <Text numberOfLines={1} style={styles.titleLabel}>
            {title}
          </Text>
          {onClose === undefined ? null : (
            <Pressable
              accessibilityLabel={closeAccessibilityLabel}
              accessibilityRole="button"
              hitSlop={closeHitSlop}
              onPress={onClose}
              style={styles.close}
            >
              <CloseMIcon
                color={colors.text.primary}
                height={tokens.title.closeIconSize}
                width={tokens.title.closeIconSize}
              />
            </Pressable>
          )}
        </View>
      )}

      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.weekdays}
      >
        {weekdayLabels.map((label) => (
          <View key={label} style={styles.weekdayItem}>
            <Text style={styles.weekdayLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.monthList} style={styles.scroll}>
        {months.map((month) => (
          <Month
            firstDayOfWeek={firstDayOfWeek}
            format={format}
            formatMonth={formatMonth}
            key={monthKey(month)}
            meta={meta}
            month={month}
            now={now}
            onPress={handlePress}
            selection={props}
          />
        ))}
      </ScrollView>

      {timePicker === undefined ? null : <TimeWheel timePicker={timePicker} />}

      <View style={styles.footer}>
        <Button
          block
          onPress={() => confirmSelection(props)}
          shape="round"
          size="large"
          theme="primary"
        >
          {confirmText}
        </Button>
      </View>
    </View>
  );
}

type MonthProps = {
  firstDayOfWeek: 0 | 1;
  format: CalendarFormat;
  formatMonth: (month: Date) => string;
  meta: Readonly<Record<string, CalendarDateMeta>> | undefined;
  month: Date;
  now: Date | undefined;
  onPress: (date: Date) => void;
  selection: CalendarProps;
};

function Month({
  firstDayOfWeek,
  format,
  formatMonth,
  meta,
  month,
  now,
  onPress,
  selection,
}: MonthProps) {
  return (
    <View style={styles.month}>
      <Text accessibilityRole="header" style={styles.monthLabel}>
        {formatMonth(month)}
      </Text>
      <View style={styles.table}>
        {weeksOf(month, firstDayOfWeek).map((week, weekIndex) => (
          <View key={weekIndex} style={styles.row}>
            {week.map((date, dayIndex) => (
              <DateCell
                date={date}
                format={format}
                key={date === undefined ? `empty-${dayIndex}` : dateKey(date)}
                meta={date === undefined ? undefined : meta?.[dateKey(date)]}
                now={now}
                onPress={onPress}
                selection={selection}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

type DateCellProps = {
  date: Date | undefined;
  format: CalendarFormat;
  meta: CalendarDateMeta | undefined;
  now: Date | undefined;
  onPress: (date: Date) => void;
  selection: CalendarProps;
};

/**
 * `item/date` 的状态解析顺序：`empty` → `disabled` → 选中（含区间端点）→
 * `hight-light` → `now` → 默认。Figma 没有定义 `select` 与 `now`、
 * `select` 与 `disabled` 的组合，因此这里以先命中者为准，不叠加视觉。
 */
function DateCell({ date, format, meta, now, onPress, selection }: DateCellProps) {
  if (date === undefined) {
    return <View style={styles.dateCell} />;
  }

  const state = resolveDateState(date, selection);
  const disabled = Boolean(meta?.disabled);
  const isNow = now !== undefined && isSameDay(now, date);
  const selected = state === 'select' || state === 'start' || state === 'end';
  const hasPrefix = format === 'prefixSuffix' && meta?.prefix !== undefined;
  const hasSuffix = format !== 'default' && meta?.suffix !== undefined;

  const textColor = disabled
    ? styles.dateTextDisabled
    : selected
      ? styles.dateTextSelected
      : meta?.prefix !== undefined
        ? styles.dateTextAffix
        : isNow
          ? styles.dateTextNow
          : styles.dateTextDefault;

  return (
    <Pressable
      accessibilityLabel={dateKey(date)}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={() => onPress(date)}
      style={[
        styles.dateCell,
        alignByFormat(format, meta),
        selected && styles.dateCellSelected,
        state === 'start' && styles.dateCellStart,
        state === 'end' && styles.dateCellEnd,
        state === 'highlight' && styles.dateCellHighlight,
      ]}
    >
      {/**
       * 区间底色需要跨过 `4` 的列间距才能连续：中间段向左右各延伸 `4`，
       * 两端只向区间内侧延伸 `4`，且延伸部分使用 brand-light。
       */}
      {state === 'highlight' ? <View style={styles.bandFull} pointerEvents="none" /> : null}
      {state === 'start' ? <View style={styles.bandRight} pointerEvents="none" /> : null}
      {state === 'end' ? <View style={styles.bandLeft} pointerEvents="none" /> : null}

      {hasPrefix ? (
        <Text numberOfLines={1} style={[styles.affix, styles.affixOverlap, textColor]}>
          {meta?.prefix}
        </Text>
      ) : null}
      <Text
        numberOfLines={1}
        /** `marginBottom: -2` 只出现在后面还有一行内容时，与 Figma 的四种组合一致。 */
        style={[styles.dateText, hasSuffix ? styles.affixOverlap : null, textColor]}
      >
        {String(date.getDate())}
      </Text>
      {hasSuffix ? (
        <Text
          numberOfLines={1}
          style={[styles.affix, selected ? styles.dateTextSelected : styles.dateTextDisabled]}
        >
          {meta?.suffix}
        </Text>
      ) : null}
    </Pressable>
  );
}

/**
 * Figma `timePicker` 块：header 只有居中标题，两列滚轮各显示 3 个 option，
 * indicator 固定在块内绝对 `y=90`，提交由 Calendar 底部的 Button 负责。
 */
function TimeWheel({ timePicker }: { timePicker: CalendarTimePicker }) {
  const {
    formatHour = String,
    formatMinute = String,
    hourAccessibilityLabel,
    minuteAccessibilityLabel,
    minuteStep = 1,
    onChange,
    title = 'Time',
    value,
  } = timePicker;

  const columns: readonly WheelColumn<number>[] = [
    {
      accessibilityLabel: hourAccessibilityLabel,
      id: 'hour',
      options: range(0, 23, 1).map((hour) => ({
        id: `hour-${hour}`,
        label: formatHour(hour),
        value: hour,
      })),
    },
    {
      accessibilityLabel: minuteAccessibilityLabel,
      id: 'minute',
      options: range(0, 59, minuteStep).map((minute) => ({
        id: `minute-${minute}`,
        label: formatMinute(minute),
        value: minute,
      })),
    },
  ];

  return (
    <WheelPanel
      columns={columns}
      contentHeight={timeTokens.contentHeight}
      headerHeight={timeTokens.headerHeight}
      indicatorTop={timeTokens.indicatorTop}
      maskHeight={timeTokens.maskHeight}
      onChange={(columnId, next) => {
        onChange(columnId === 'hour' ? { ...value, hour: next } : { ...value, minute: next });
      }}
      roundedTop={false}
      showActions={false}
      titleText={title}
      value={{ hour: value.hour, minute: value.minute }}
    />
  );
}

type DateState = 'default' | 'end' | 'highlight' | 'select' | 'start';

function resolveDateState(date: Date, selection: CalendarProps): DateState {
  if (selection.type === 'multiple') {
    return selection.value.some((item) => isSameDay(item, date)) ? 'select' : 'default';
  }

  if (selection.type === 'range') {
    const { end, start } = selection.value;
    if (start !== undefined && isSameDay(start, date)) {
      /** 只选了起点时没有区间可衔接，按完整圆角的 `select` 渲染。 */
      return end === undefined || isSameDay(end, start) ? 'select' : 'start';
    }
    if (end !== undefined && isSameDay(end, date)) return 'end';
    if (
      start !== undefined &&
      end !== undefined &&
      date.getTime() > startOfDay(start).getTime() &&
      date.getTime() < startOfDay(end).getTime()
    ) {
      return 'highlight';
    }
    return 'default';
  }

  return selection.value !== undefined && isSameDay(selection.value, date)
    ? 'select'
    : 'default';
}

function confirmSelection(props: CalendarProps) {
  if (props.type === 'multiple') {
    props.onConfirm(props.value);
    return;
  }
  if (props.type === 'range') {
    props.onConfirm(props.value);
    return;
  }
  props.onConfirm(props.value);
}

/**
 * Figma 的垂直对齐由实际渲染的行数决定，而不是 `format` 本身：
 * 只有日期 → 居中（`27205:14789`）；日期 + suffix → 底部对齐（`27205:14788`）；
 * prefix + 日期 + suffix → 居中（`27205:14787`）；prefix + 日期 → 顶部对齐（`27205:14927`）。
 */
function alignByFormat(format: CalendarFormat, meta: CalendarDateMeta | undefined) {
  const hasPrefix = format === 'prefixSuffix' && meta?.prefix !== undefined;
  const hasSuffix = format !== 'default' && meta?.suffix !== undefined;

  if (hasPrefix && !hasSuffix) return styles.dateCellTop;
  if (!hasPrefix && hasSuffix) return styles.dateCellBottom;
  return styles.dateCellCenter;
}

function nextRange(current: CalendarRange, date: Date): CalendarRange {
  const { end, start } = current;

  if (start === undefined || end !== undefined) return { start: date };
  if (date.getTime() < start.getTime()) return { start: date };
  return { end: date, start };
}

function monthsBetween(start: Date, end: Date): readonly Date[] {
  const months: Date[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);

  while (cursor.getTime() <= last.getTime()) {
    months.push(new Date(cursor.getTime()));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
}

/**
 * 把一个月切成以 `firstDayOfWeek` 起始的周；首尾不足一周的位置用
 * `undefined` 占位，对应 Figma `item/date` 的 `empty=true`。
 */
function weeksOf(month: Date, firstDayOfWeek: 0 | 1): readonly (readonly (Date | undefined)[])[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const dayCount = new Date(year, monthIndex + 1, 0).getDate();
  const leading = (new Date(year, monthIndex, 1).getDay() - firstDayOfWeek + 7) % 7;

  const cells: (Date | undefined)[] = Array.from({ length: leading }, () => undefined);
  for (let day = 1; day <= dayCount; day += 1) {
    cells.push(new Date(year, monthIndex, day));
  }
  while (cells.length % 7 !== 0) cells.push(undefined);

  const weeks: (Date | undefined)[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return weeks;
}

function range(from: number, to: number, step: number) {
  const values: number[] = [];
  for (let value = from; value <= to; value += step) values.push(value);
  return values;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function pad(value: number) {
  return value < 10 ? `0${value}` : String(value);
}

/** 本地时区的稳定日期键，用于 `meta` 索引与列表 key。 */
function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function monthKey(month: Date) {
  return `${month.getFullYear()}-${pad(month.getMonth() + 1)}`;
}

const colors = colorThemes.light;
const tokens = componentTokens.calendar;
const timeTokens = tokens.timePicker;

/** `24×24` 图形小于 44 的推荐触控尺寸，用 hitSlop 扩展且不改变视觉布局。 */
const closeHitSlop = { bottom: 10, left: 10, right: 10, top: 10 };

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: tokens.panelHeight,
    overflow: 'hidden',
    borderTopLeftRadius: tokens.topRadius,
    borderTopRightRadius: tokens.topRadius,
    backgroundColor: colors.background.container,
  },
  title: {
    alignSelf: 'stretch',
    minHeight: tokens.title.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.title.padding,
  },
  titleLabel: {
    minWidth: 0,
    flex: 1,
    color: colors.text.primary,
    textAlign: 'center',
    ...typographyTokens.title18Semibold,
  },
  close: {
    position: 'absolute',
    top: tokens.title.closeTop,
    right: tokens.title.closeRight,
    height: tokens.title.closeIconSize,
    width: tokens.title.closeIconSize,
  },
  weekdays: {
    alignSelf: 'stretch',
    height: tokens.weekdays.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.weekdays.columnGap,
    paddingHorizontal: tokens.weekdays.paddingHorizontal,
  },
  weekdayItem: {
    minWidth: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.weekdays.paddingVertical,
  },
  weekdayLabel: {
    color: colors.text.secondary,
    textAlign: 'center',
    ...typographyTokens.body14Regular,
  },
  scroll: {
    alignSelf: 'stretch',
    flex: 1,
  },
  monthList: {
    gap: tokens.month.gap,
    paddingTop: tokens.month.gap,
  },
  month: {
    alignSelf: 'stretch',
    gap: tokens.month.labelGap,
    paddingHorizontal: tokens.month.paddingHorizontal,
  },
  monthLabel: {
    alignSelf: 'stretch',
    color: colors.text.primary,
    ...typographyTokens.body14Regular,
  },
  table: {
    alignSelf: 'stretch',
    gap: tokens.month.rowGap,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.month.columnGap,
  },
  dateCell: {
    minWidth: 0,
    flex: 1,
    height: tokens.date.height,
    alignItems: 'center',
    paddingVertical: tokens.date.paddingVertical,
    borderRadius: tokens.date.radius,
  },
  dateCellCenter: {
    justifyContent: 'center',
  },
  dateCellBottom: {
    justifyContent: 'flex-end',
  },
  dateCellTop: {
    justifyContent: 'flex-start',
  },
  dateCellSelected: {
    backgroundColor: colors.brand.default,
  },
  /** `select-start`：只保留左侧圆角，右侧与区间衔接。 */
  dateCellStart: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  /** `select-end`：只保留右侧圆角，左侧与区间衔接。 */
  dateCellEnd: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  /** `hight-light`：区间中间段使用 brand-light 且不带圆角。 */
  dateCellHighlight: {
    borderRadius: 0,
    backgroundColor: colors.brand.light,
  },
  bandFull: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -tokens.date.bandOverhang,
    right: -tokens.date.bandOverhang,
    backgroundColor: colors.brand.light,
  },
  bandRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: -tokens.date.bandOverhang,
    width: tokens.date.bandOverhang,
    backgroundColor: colors.brand.light,
  },
  bandLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -tokens.date.bandOverhang,
    width: tokens.date.bandOverhang,
    backgroundColor: colors.brand.light,
  },
  dateText: {
    alignSelf: 'stretch',
    height: tokens.date.lineHeight,
    textAlign: 'center',
    ...typographyTokens.title16Semibold,
  },
  affix: {
    alignSelf: 'stretch',
    height: tokens.date.affixLineHeight,
    textAlign: 'center',
    ...typographyTokens.footer10Regular,
  },
  affixOverlap: {
    marginBottom: tokens.date.affixOverlap,
  },
  dateTextDefault: {
    color: colors.text.primary,
  },
  dateTextSelected: {
    color: colors.text.white,
  },
  dateTextDisabled: {
    color: colors.text.disabled,
  },
  dateTextNow: {
    color: colors.brand.default,
  },
  /** `prefix=true` 时 prefix 与日期数字整体使用 error 语义色。 */
  dateTextAffix: {
    color: colors.error.default,
  },
  footer: {
    alignSelf: 'stretch',
    minHeight: tokens.footer.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.footer.padding,
    backgroundColor: colors.background.container,
  },
});
