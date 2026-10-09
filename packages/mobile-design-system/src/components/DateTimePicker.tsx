import React, { useCallback } from 'react';

import { componentTokens } from '../designTokens';
import { WheelPanel, type WheelColumn, type WheelValue } from './internal/WheelPanel';

/** Figma `item/datetime-option` 的时间单位，对应面板中的一列。 */
export type DateTimeUnit = 'day' | 'hour' | 'minute' | 'month' | 'second' | 'year';

/**
 * Figma `mode` 轴。括号内为 Figma 中的原始变体名。
 *
 * - `year`（`year`）：年
 * - `month`（`month`）：年 + 月
 * - `date`（`date`）：年 + 月 + 日
 * - `dateWeek`（`date week`）：年 + 月 + 日，日列文案同时包含星期（示例 `10th Mon.`）
 * - `dateHour`（`date with hour`）：年 + 月 + 日 + 时
 * - `dateMinute`（`date with minute`）：年 + 月 + 日 + 时 + 分
 * - `dateSecond`（`date with second`）：年 + 月 + 日 + 时 + 分 + 秒
 * - `hour`（`hour`）：时
 * - `minute`（`minute`）：时 + 分
 * - `second`（`second`）：时 + 分 + 秒
 */
export type DateTimePickerMode =
  | 'date'
  | 'dateHour'
  | 'dateMinute'
  | 'dateSecond'
  | 'dateWeek'
  | 'hour'
  | 'minute'
  | 'month'
  | 'second'
  | 'year';

/** 含年列的 mode，必须显式给出可选范围。 */
export type DateTimePickerDateMode = Extract<
  DateTimePickerMode,
  'date' | 'dateHour' | 'dateMinute' | 'dateSecond' | 'dateWeek' | 'month' | 'year'
>;

/** 仅含时间列的 mode，Figma 未定义其日期边界，因此不接收 min / max。 */
export type DateTimePickerTimeMode = Extract<DateTimePickerMode, 'hour' | 'minute' | 'second'>;

/**
 * 列文案格式化。`date` 是该列候选值对应的完整日期，可用于派生星期等文案。
 *
 * Figma 示例文案（`2023` / `January` / `10th Mon.`）是英文本地化示例，不是组件默认值；
 * 组件默认只输出裸数值，具体本地化格式必须由调用方通过该回调提供。
 */
export type DateTimeFormatter = (context: { date: Date; value: number }) => string;

type DateTimePickerTitleProps =
  | { accessibilityLabel: string; title?: false; titleText?: never }
  | { accessibilityLabel?: string; title: true; titleText: string };

type DateTimePickerBaseProps = DateTimePickerTitleProps & {
  cancelText?: string;
  /** 每列的可读名称，供辅助技术逐列朗读。 */
  columnLabels?: Partial<Record<DateTimeUnit, string>>;
  confirmText?: string;
  formatters?: Partial<Record<DateTimeUnit, DateTimeFormatter>>;
  onCancel: () => void;
  /** 滚动吸附完成后回调，父级负责保存临时选择。 */
  onChange: (next: Date, changed: { unit: DateTimeUnit; value: number }) => void;
  /** Confirm 提交当前受控值，组件自身不持久化业务值。 */
  onConfirm: (value: Date) => void;
  testID?: string;
  value: Date;
};

export type DateTimePickerProps =
  | (DateTimePickerBaseProps & {
      maxDate: Date;
      minDate: Date;
      mode: DateTimePickerDateMode;
    })
  | (DateTimePickerBaseProps & {
      maxDate?: never;
      minDate?: never;
      mode: DateTimePickerTimeMode;
    });

/**
 * 统一 DateTimePicker 时间选择器（Figma `24386:5248`）。
 *
 * 覆盖 10 个 `mode` × 有/无标题共 20 个变体。面板几何（圆角、header、indicator、
 * 渐隐 mask、`40` 吸附步距、option 的 normal / selected 排版）与 Picker 完全一致，
 * 因此复用同一内部滚轮面板，不另画一套滚轮。
 *
 * 与 Picker 的区别只在数据来源：列由 `mode` 推导，option 由 `minDate` / `maxDate`
 * 与上层单位的当前取值共同约束，受控值是一个 `Date`。
 *
 * 面板本体不包含遮罩、弹出动画、安全区与系统返回处理 —— Figma 当前节点未定义，
 * 应由外层 `BottomSheet` 宿主负责。
 */
export function DateTimePicker(props: DateTimePickerProps) {
  const {
    accessibilityLabel,
    cancelText = 'Cancel',
    columnLabels,
    confirmText = 'Confirm',
    formatters,
    maxDate,
    minDate,
    mode,
    onCancel,
    onChange,
    onConfirm,
    testID,
    title = false,
    titleText,
    value,
  } = props;

  const units = modeUnits[mode];

  const handleChange = useCallback(
    (columnId: string, next: number) => {
      const unit = columnId as DateTimeUnit;
      onChange(clampDate(setUnit(value, unit, next), minDate, maxDate), { unit, value: next });
    },
    [maxDate, minDate, onChange, value],
  );

  const columns: readonly WheelColumn<number>[] = units.map((unit) => {
    const [min, max] = unitRange(unit, value, minDate, maxDate);
    const format = formatters?.[unit] ?? defaultFormatters[unit];
    const options = [];

    for (let candidate = min; candidate <= max; candidate += 1) {
      options.push({
        id: `${unit}-${candidate}`,
        label: format({ date: setUnit(value, unit, candidate), value: candidate }),
        value: candidate,
      });
    }

    return {
      accessibilityLabel: columnLabels?.[unit] ?? defaultColumnLabels[unit],
      id: unit,
      options,
    };
  });

  const wheelValue: WheelValue<number> = Object.fromEntries(
    units.map((unit) => [unit, unitOf(value, unit)]),
  );

  return (
    <WheelPanel
      accessibilityLabel={accessibilityLabel}
      cancelText={cancelText}
      columns={columns}
      confirmText={confirmText}
      headerHeight={tokens.headerHeight}
      onCancel={onCancel}
      onChange={handleChange}
      onConfirm={() => onConfirm(value)}
      testID={testID}
      titleText={title ? titleText : undefined}
      value={wheelValue}
    />
  );
}

/** 各 mode 的列构成，直接对应 Figma 20 个变体中读取到的 `colunms` 数量与语义。 */
const modeUnits: Readonly<Record<DateTimePickerMode, readonly DateTimeUnit[]>> = {
  date: ['year', 'month', 'day'],
  dateHour: ['year', 'month', 'day', 'hour'],
  dateMinute: ['year', 'month', 'day', 'hour', 'minute'],
  dateSecond: ['year', 'month', 'day', 'hour', 'minute', 'second'],
  dateWeek: ['year', 'month', 'day'],
  hour: ['hour'],
  minute: ['hour', 'minute'],
  month: ['year', 'month'],
  second: ['hour', 'minute', 'second'],
  year: ['year'],
};

/**
 * 组件默认只输出裸数值（月份按 1–12 呈现，内部仍为 0–11）。
 * Figma 的 `January` / `10th Mon.` 等文案属于本地化示例，必须由调用方通过
 * `formatters` 提供，组件不自行引入语言包或日期格式推断。
 */
const defaultFormatters: Readonly<Record<DateTimeUnit, DateTimeFormatter>> = {
  day: ({ value }) => String(value),
  hour: ({ value }) => String(value),
  minute: ({ value }) => String(value),
  month: ({ value }) => String(value + 1),
  second: ({ value }) => String(value),
  year: ({ value }) => String(value),
};

const defaultColumnLabels: Readonly<Record<DateTimeUnit, string>> = {
  day: 'Day',
  hour: 'Hour',
  minute: 'Minute',
  month: 'Month',
  second: 'Second',
  year: 'Year',
};

function unitOf(date: Date, unit: DateTimeUnit) {
  switch (unit) {
    case 'year':
      return date.getFullYear();
    case 'month':
      return date.getMonth();
    case 'day':
      return date.getDate();
    case 'hour':
      return date.getHours();
    case 'minute':
      return date.getMinutes();
    case 'second':
      return date.getSeconds();
  }
}

/**
 * 按单位重建日期。日期从各分量重新构造而非直接 `setMonth`，
 * 避免「1 月 31 日切到 2 月」这类月末溢出被静默推进到下个月。
 */
function setUnit(date: Date, unit: DateTimeUnit, next: number) {
  const year = unit === 'year' ? next : date.getFullYear();
  const month = unit === 'month' ? next : date.getMonth();
  const day = Math.min(unit === 'day' ? next : date.getDate(), daysInMonth(year, month));

  return new Date(
    year,
    month,
    day,
    unit === 'hour' ? next : date.getHours(),
    unit === 'minute' ? next : date.getMinutes(),
    unit === 'second' ? next : date.getSeconds(),
    date.getMilliseconds(),
  );
}

/**
 * 每列的候选值受上层单位的当前取值约束：只有落在边界年 / 月 / 日 / 时 / 分上时，
 * 才收窄到 `minDate` / `maxDate` 给出的分量，其余情况使用完整自然范围。
 */
function unitRange(
  unit: DateTimeUnit,
  value: Date,
  minDate: Date | undefined,
  maxDate: Date | undefined,
): readonly [number, number] {
  const atMinYear = minDate !== undefined && value.getFullYear() === minDate.getFullYear();
  const atMaxYear = maxDate !== undefined && value.getFullYear() === maxDate.getFullYear();
  const atMinMonth = atMinYear && value.getMonth() === minDate!.getMonth();
  const atMaxMonth = atMaxYear && value.getMonth() === maxDate!.getMonth();
  const atMinDay = atMinMonth && value.getDate() === minDate!.getDate();
  const atMaxDay = atMaxMonth && value.getDate() === maxDate!.getDate();
  const atMinHour = atMinDay && value.getHours() === minDate!.getHours();
  const atMaxHour = atMaxDay && value.getHours() === maxDate!.getHours();
  const atMinMinute = atMinHour && value.getMinutes() === minDate!.getMinutes();
  const atMaxMinute = atMaxHour && value.getMinutes() === maxDate!.getMinutes();

  switch (unit) {
    case 'year':
      return [
        minDate?.getFullYear() ?? value.getFullYear(),
        maxDate?.getFullYear() ?? value.getFullYear(),
      ];
    case 'month':
      return [atMinYear ? minDate!.getMonth() : 0, atMaxYear ? maxDate!.getMonth() : 11];
    case 'day':
      return [
        atMinMonth ? minDate!.getDate() : 1,
        atMaxMonth ? maxDate!.getDate() : daysInMonth(value.getFullYear(), value.getMonth()),
      ];
    case 'hour':
      return [atMinDay ? minDate!.getHours() : 0, atMaxDay ? maxDate!.getHours() : 23];
    case 'minute':
      return [atMinHour ? minDate!.getMinutes() : 0, atMaxHour ? maxDate!.getMinutes() : 59];
    case 'second':
      return [atMinMinute ? minDate!.getSeconds() : 0, atMaxMinute ? maxDate!.getSeconds() : 59];
  }
}

/** 改动高位单位后，低位单位可能越界，统一再夹一次区间。 */
function clampDate(date: Date, minDate: Date | undefined, maxDate: Date | undefined) {
  if (minDate !== undefined && date.getTime() < minDate.getTime()) return new Date(minDate.getTime());
  if (maxDate !== undefined && date.getTime() > maxDate.getTime()) return new Date(maxDate.getTime());
  return date;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const tokens = componentTokens.dateTimePicker;
