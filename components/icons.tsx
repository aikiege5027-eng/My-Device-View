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
/**
 * 底部标签栏图标（My Device View，TabBar 节点 `19971:8542`）。
 *
 * 同一个字形在选中 / 未选中两种页签状态下只有颜色不同，因此这里按 `components/icons.tsx`
 * 既有约定用 `color` 驱动，而不是为每种状态各导出一份烧死颜色的 SVG 资产。
 * viewBox 均为 20，按 `size` 等比缩放。
 */
export function HomeTabIcon({ color, size }: IconProps) {
  return (
    <Svg
      accessibilityElementsHidden
      fill="none"
      height={size}
      importantForAccessibility="no-hide-descendants"
      preserveAspectRatio="none"
      viewBox="0 0 20 20"
      width={size}
    >
      <Path
        clipRule="evenodd"
        d="M7.5 11.8478C7.5 11.1575 8.05964 10.5978 8.75 10.5978H11.25C11.9404 10.5978 12.5 11.1575 12.5 11.8478V16.25H16.25V8.18771L10 2.88879L3.75 8.1877L2.94164 7.23426L9.19164 1.93535C9.65802 1.53994 10.342 1.53994 10.8084 1.93535L17.0584 7.23426C17.3385 7.47176 17.5 7.82044 17.5 8.18771V16.25C17.5 16.9404 16.9404 17.5 16.25 17.5H12.5C11.8096 17.5 11.25 16.9404 11.25 16.25V11.8478H8.75V16.25C8.75 16.9404 8.19036 17.5 7.5 17.5H3.75C3.05964 17.5 2.5 16.9404 2.5 16.25V8.18771C2.5 7.82044 2.66151 7.47176 2.94164 7.23426L3.75 8.1877L3.75 16.25H7.5V11.8478Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

/** Figma `report2`（My Device View，TabBar 节点 `19971:8542`）。 */
export function ReportTabIcon({ color, size }: IconProps) {
  return (
    <Svg
      accessibilityElementsHidden
      fill="none"
      height={size}
      importantForAccessibility="no-hide-descendants"
      preserveAspectRatio="none"
      viewBox="0 0 20 20"
      width={size}
    >
      <Path d="M6.875 6.25H13.125V7.5H6.875V6.25Z" fill={color} />
      <Path d="M11.25 10H6.875V11.25H11.25V10Z" fill={color} />
      <Path
        d="M5 2.5C4.30964 2.5 3.75 3.05964 3.75 3.75V16.25C3.75 16.9404 4.30964 17.5 5 17.5H15C15.6904 17.5 16.25 16.9404 16.25 16.25V3.75C16.25 3.05964 15.6904 2.5 15 2.5H5ZM15 3.75V16.25H5V3.75H15Z"
        fill={color}
      />
    </Svg>
  );
}

/** Figma `more-2`（My Device View，TabBar 节点 `19971:8542`）。 */
export function MoreTabIcon({ color, size }: IconProps) {
  return (
    <Svg
      accessibilityElementsHidden
      fill="none"
      height={size}
      importantForAccessibility="no-hide-descendants"
      preserveAspectRatio="none"
      viewBox="0 0 20 20"
      width={size}
    >
      <Path
        d="M5.71431 10C5.71431 9.7175 5.63053 9.44129 5.47356 9.20636C5.31658 8.97143 5.09347 8.78832 4.83243 8.6802C4.5714 8.57207 4.28416 8.5438 4.00705 8.59892C3.72993 8.65405 3.47539 8.79009 3.2756 8.98988C3.07581 9.18967 2.93975 9.44422 2.88463 9.72133C2.82951 9.99845 2.8578 10.2857 2.96592 10.5467C3.07405 10.8078 3.25715 11.0309 3.49208 11.1878C3.727 11.3448 4.0032 11.4286 4.28575 11.4286C4.66463 11.4286 5.02799 11.2781 5.29589 11.0102C5.5638 10.7423 5.71431 10.3789 5.71431 10ZM8.57144 10C8.57144 10.2826 8.65522 10.5588 8.8122 10.7937C8.96917 11.0286 9.19228 11.2117 9.45332 11.3199C9.71435 11.428 10.0016 11.4563 10.2787 11.4012C10.5558 11.346 10.8104 11.21 11.0102 11.0102C11.2099 10.8104 11.346 10.5558 11.4011 10.2787C11.4562 10.0016 11.428 9.71439 11.3198 9.45335C11.2117 9.19232 11.0286 8.96919 10.7937 8.81221C10.5587 8.65524 10.2825 8.57146 10 8.57146C9.8124 8.57146 9.62664 8.60841 9.45332 8.6802C9.28 8.75199 9.12251 8.85723 8.98986 8.98988C8.8572 9.12254 8.75197 9.28003 8.68018 9.45335C8.60839 9.62667 8.57144 9.81244 8.57144 10ZM14.2857 10C14.2857 10.2826 14.3695 10.5588 14.5265 10.7937C14.6834 11.0286 14.9065 11.2117 15.1676 11.3199C15.4286 11.428 15.7158 11.4563 15.993 11.4012C16.2701 11.346 16.5246 11.21 16.7244 11.0102C16.9242 10.8104 17.0603 10.5558 17.1154 10.2787C17.1705 10.0016 17.1422 9.71439 17.0341 9.45335C16.926 9.19232 16.7429 8.96919 16.5079 8.81221C16.273 8.65524 15.9968 8.57146 15.7143 8.57146C15.3355 8.57166 14.9724 8.72227 14.7046 8.99016C14.4369 9.25804 14.2857 9.62129 14.2857 10Z"
        fill={color}
      />
    </Svg>
  );
}

/**
 * Figma `upload`（Design Token China · Icon，节点 `615:1739`）。
 *
 * Icon 规范以 `16×16` symbol 为基准规格，实际展示尺寸由承载组件决定，
 * 因此 viewBox 保持 16 并按 `size` 等比缩放。设计系统包未从根入口导出图标，
 * 业务侧按既有约定在这里维护一份。
 */
export function UploadIcon({ color, size }: IconProps) {
  return (
    <Svg
      accessibilityElementsHidden
      fill="none"
      height={size}
      importantForAccessibility="no-hide-descendants"
      preserveAspectRatio="none"
      viewBox="0 0 16 16"
      width={size}
    >
      <Path
        d="M10.2969 6.19148L8.5 4.39462L8.5 9.8125H7.5L7.5 4.39459L5.70311 6.19148L4.996 5.48438L7.64643 2.83395C7.84169 2.63868 8.15828 2.63868 8.35354 2.83395L11.004 5.48438L10.2969 6.19148Z"
        fill={color}
      />
      <Path
        d="M3.6875 12.3125V8.8125H2.6875V12.375C2.6875 12.6236 2.78627 12.8621 2.96209 13.0379C3.1379 13.2137 3.37636 13.3125 3.625 13.3125H12.375C12.6236 13.3125 12.8621 13.2137 13.0379 13.0379C13.2137 12.8621 13.3125 12.6236 13.3125 12.375V8.8125H12.3125V12.3125H3.6875Z"
        fill={color}
      />
    </Svg>
  );
}
