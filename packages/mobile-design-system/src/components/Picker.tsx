import React, { useCallback } from 'react';

import { componentTokens } from '../designTokens';
import {
  WheelPanel,
  type WheelColumn,
  type WheelOption,
  type WheelOptionValue,
  type WheelValue,
} from './internal/WheelPanel';

export type PickerOptionValue = WheelOptionValue;

/**
 * `empty` 选项只作为多列数据的视觉对齐占位：不可选、不朗读，
 * 且在类型上无法同时成为选中项（没有 value）。
 */
export type PickerOption<Value extends PickerOptionValue = PickerOptionValue> = WheelOption<Value>;

export type PickerColumn<Value extends PickerOptionValue = PickerOptionValue> = WheelColumn<Value>;

/** Figma 只定义 1–4 列，用元组联合在类型层排除 0 列与 5 列以上。 */
export type PickerColumns<Value extends PickerOptionValue = PickerOptionValue> =
  | readonly [PickerColumn<Value>]
  | readonly [PickerColumn<Value>, PickerColumn<Value>]
  | readonly [PickerColumn<Value>, PickerColumn<Value>, PickerColumn<Value>]
  | readonly [
      PickerColumn<Value>,
      PickerColumn<Value>,
      PickerColumn<Value>,
      PickerColumn<Value>,
    ];

/** 受控选中值，按稳定的 column id 索引，不依赖数组下标。 */
export type PickerValue<Value extends PickerOptionValue = PickerOptionValue> = WheelValue<Value>;

type PickerTitleProps =
  | { accessibilityLabel: string; title?: false; titleText?: never }
  | { accessibilityLabel?: string; title: true; titleText: string };

export type PickerProps<Value extends PickerOptionValue = PickerOptionValue> =
  PickerTitleProps & {
    cancelText?: string;
    columns: PickerColumns<Value>;
    confirmText?: string;
    onCancel: () => void;
    /** 滚动吸附完成后回调，父级负责保存临时选择。 */
    onChange: (next: PickerValue<Value>, changed: { columnId: string; value: Value }) => void;
    /** Confirm 提交当前受控选择，组件自身不持久化业务值。 */
    onConfirm: (values: PickerValue<Value>) => void;
    testID?: string;
    value: PickerValue<Value>;
  };

/**
 * 统一 Picker 面板（Figma `24386:5250`）。
 *
 * 覆盖 1–4 列 × 有/无标题共 8 个变体、option 的 normal / selected / empty 三态、
 * 跨列共用 indicator 与上下渐隐 mask。
 *
 * 面板本体不包含遮罩、弹出动画、安全区与系统返回处理 —— Figma 当前节点未定义，
 * 应由外层 modal / bottom sheet 宿主负责。
 */
export function Picker<Value extends PickerOptionValue = PickerOptionValue>({
  accessibilityLabel,
  cancelText = 'Cancel',
  columns,
  confirmText = 'Confirm',
  onCancel,
  onChange,
  onConfirm,
  testID,
  title = false,
  titleText,
  value,
}: PickerProps<Value>) {
  const fourColumns = columns.length === tokens.maxColumnCount;
  /**
   * Figma 当前 `4 columns + title=false` 变体的 header 为 `56`，其余 7 个变体为 `58`；
   * indicator 仍固定在面板绝对 `y=130`，因此该变体保留 `2` 的显式偏差。
   */
  const headerHeight =
    !title && fourColumns ? tokens.headerHeightWithoutTitleFourColumns : tokens.headerHeight;

  const handleChange = useCallback(
    (columnId: string, nextValue: Value) => {
      onChange({ ...value, [columnId]: nextValue }, { columnId, value: nextValue });
    },
    [onChange, value],
  );

  return (
    <WheelPanel
      accessibilityLabel={accessibilityLabel}
      cancelText={cancelText}
      columns={columns}
      confirmText={confirmText}
      headerHeight={headerHeight}
      onCancel={onCancel}
      onChange={handleChange}
      onConfirm={() => onConfirm(value)}
      testID={testID}
      titleText={title ? titleText : undefined}
      value={value}
    />
  );
}

const tokens = componentTokens.picker;
