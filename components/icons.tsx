import React from 'react';
import Svg, { Path } from 'react-native-svg';

export type IconProps = {
  color: string;
  size: number;
};

/**
 * Figma `chevron-down`（China Design System for Mobile，Collapse 节点 24386:5265）。
 *
 * 设计系统包目前未从根入口导出图标，App 侧的折叠 / 展开控件复用这一份，避免同一段
 * path 在多个组件里各写一遍。viewBox 为 24，按 `size` 等比缩放。
 */
export function ChevronDownIcon({ color, size }: IconProps) {
  return (
    <Svg
      accessibilityElementsHidden
      fill="none"
      height={size}
      importantForAccessibility="no-hide-descendants"
      preserveAspectRatio="none"
      viewBox="0 0 24 24"
      width={size}
    >
      <Path
        clipRule="evenodd"
        d="M17.946 7.95118L19.1726 9.21622L12.7495 15.8406C12.1602 16.4483 11.185 16.4483 10.5957 15.8406L4.17262 9.21622L5.39923 7.95118L11.6726 14.4211L17.946 7.95118Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

/**
 * Figma `check-circle-filled`（Design Token China）。
 *
 * 单条 even-odd path：对勾是从实心圆里镂空出来的，因此会透出所在容器的背景色。
 * viewBox 为 24，其中圆的直径为 21（半径 `10.5`），按 `size` 等比缩放。
 */
export function CheckCircleFilledIcon({ color, size }: IconProps) {
  return (
    <Svg
      accessibilityElementsHidden
      fill="none"
      height={size}
      importantForAccessibility="no-hide-descendants"
      preserveAspectRatio="none"
      viewBox="0 0 24 24"
      width={size}
    >
      <Path
        clipRule="evenodd"
        d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM17.0304 9.53039L11.0304 15.5304C10.7375 15.8233 10.2626 15.8233 9.96973 15.5304L6.96973 12.5304L8.03039 11.4697L10.5001 13.9394L15.9697 8.46973L17.0304 9.53039Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

/** Figma `minus-circle-filled`（Design Token China）。几何与 check 版本一致。 */
export function MinusCircleFilledIcon({ color, size }: IconProps) {
  return (
    <Svg
      accessibilityElementsHidden
      fill="none"
      height={size}
      importantForAccessibility="no-hide-descendants"
      preserveAspectRatio="none"
      viewBox="0 0 24 24"
      width={size}
    >
      <Path
        clipRule="evenodd"
        d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM17.25 12.75H6.75V11.25H17.25V12.75Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}
