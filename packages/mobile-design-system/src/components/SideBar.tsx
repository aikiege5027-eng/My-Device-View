import React, { type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  colorThemes,
  componentTokens,
  radiusTokens,
  typographyTokens,
} from '../designTokens';

const colors = colorThemes.light;
const tokens = componentTokens.sideBar;

export type SideBarTheme = 'line' | 'tag';

/** 图标槽收到的当前状态，用于让调用方的图标跟随 Figma 定义的前景色。 */
export type SideBarIconState = {
  color: string;
  disabled: boolean;
  selected: boolean;
  size: number;
};

export type SideBarItem<Value extends string | number = string> = {
  accessibilityHint?: string;
  /** 覆盖默认取自 `label` 的可访问名称。 */
  accessibilityLabel?: string;
  /** Figma `badge=true`：文案尾端的红色圆点。 */
  badge?: boolean;
  /** Figma `disable=true`：不可选，且不触发 `onChange`。 */
  disabled?: boolean;
  /** 稳定标识，不得使用数组下标或显示文案兼作标识。 */
  id: string;
  label: string;
  /** Figma `icon=true` 的 `20×20` 图标槽。 */
  renderIcon?: (state: SideBarIconState) => ReactNode;
  testID?: string;
  value: Value;
};

export type SideBarProps<Value extends string | number = string> = {
  /** 整个侧边栏的可访问名称，例如 `帮助中心分类`。 */
  accessibilityLabel?: string;
  items: readonly SideBarItem<Value>[];
  onChange: (value: Value) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Figma `theme`：`line` 为白底选中行 + 左侧指示条，`tag` 为内缩白底圆角标签。 */
  theme?: SideBarTheme;
  /** 受控选中值，按 `items[].value` 匹配。 */
  value: Value;
};

/**
 * 纵向分类侧边栏（Figma `24787:18812`，组件集 `27264:20884`）。
 *
 * 组件只负责渲染分类列；选中值由调用方受控，右侧内容区由调用方渲染。
 * `theme=line` 的选中行用白底 + 左侧指示条，并在右侧上下各挖一个 9 的反向圆角，
 * 因此该主题假定侧边栏右侧紧贴 `bg-color-container` 的内容面板。
 *
 * Figma 的 `667` 与 `overflow-clip` 是静态画布的展示基准。分类数量超出可视高度时
 * 这里改为纵向滚动，避免分类被静默裁掉；不滚动时与设计稿完全一致。
 */
export function SideBar<Value extends string | number = string>({
  accessibilityLabel,
  items,
  onChange,
  style,
  testID,
  theme = 'line',
  value,
}: SideBarProps<Value>) {
  if (__DEV__) {
    const withIcon = items.filter((item) => item.renderIcon != null).length;
    if (withIcon > 0 && withIcon < items.length) {
      console.warn(
        `SideBar: Figma 的 icon 是侧边栏级变体，同一侧边栏应整列带图标或整列不带，收到 ${withIcon}/${items.length} 项带图标。`,
      );
    }
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tablist"
      style={[styles.container, style]}
      testID={testID}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <SideBarRow
            item={item}
            key={item.id}
            onChange={onChange}
            selected={item.value === value}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function SideBarRow<Value extends string | number>({
  item,
  onChange,
  selected,
  theme,
}: {
  item: SideBarItem<Value>;
  onChange: (value: Value) => void;
  selected: boolean;
  theme: SideBarTheme;
}) {
  const disabled = item.disabled === true;
  // Figma 的 disable 轴只与未选中态组合，选中项不提供禁用形态。
  const active = selected && !disabled;
  const foreground = active
    ? colors.brand.default
    : disabled
      ? colors.text.disabled
      : colors.text.primary;

  const labelTypography = active ? styles.labelActive : styles.labelDefault;

  const content = (
    <>
      {item.renderIcon ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.iconSlot}
        >
          {item.renderIcon({
            color: foreground,
            disabled,
            selected: active,
            size: tokens.iconSize,
          })}
        </View>
      ) : null}
      {item.badge === true ? (
        <View style={styles.badgeRow}>
          {/*
            Figma 的 badge 变体文案为 `whitespace-nowrap`，但 103 的列宽放不下长文案。
            这里收敛为单行省略，避免文案溢出到右侧内容面板；长文案方案 Figma 未定义。
          */}
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[labelTypography, styles.labelNoWrap, { color: foreground }]}
          >
            {item.label}
          </Text>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            style={styles.badgeAnchor}
          >
            <View style={styles.badgeDot} />
          </View>
        </View>
      ) : (
        <Text style={[labelTypography, styles.labelFlexible, { color: foreground }]}>
          {item.label}
        </Text>
      )}
    </>
  );

  return (
    <Pressable
      accessibilityHint={item.accessibilityHint}
      accessibilityLabel={item.accessibilityLabel ?? item.label}
      accessibilityRole="tab"
      accessibilityState={{ disabled, selected: active }}
      disabled={disabled}
      onPress={() => onChange(item.value)}
      style={theme === 'line' ? styles.lineRow : styles.tagRow}
      testID={item.testID}
    >
      {theme === 'line' ? (
        <>
          <View style={[styles.lineBody, active && styles.lineBodyActive]}>{content}</View>
          {active ? (
            <>
              <View style={styles.lineIndicator} />
              <Notch position="above" />
              <Notch position="below" />
            </>
          ) : null}
        </>
      ) : (
        <View style={[styles.tagBody, active && styles.tagBodyActive]}>{content}</View>
      )}
    </Pressable>
  );
}

/**
 * `theme=line` 选中行右侧的反向圆角缺口（Figma `suffix` / `prefix`，各 9×9）。
 * 填充色与内容面板一致，在选中块上下把侧边栏底色切出一个 9 的圆角。
 */
function Notch({ position }: { position: 'above' | 'below' }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[styles.notch, position === 'above' ? styles.notchAbove : styles.notchBelow]}
    >
      <Svg fill="none" height={tokens.line.notchSize} viewBox="0 0 9 9" width={tokens.line.notchSize}>
        <Path
          clipRule="evenodd"
          d={position === 'above'
            ? 'M9 9V0C9 4.97056 4.97056 9 0 9H9Z'
            : 'M9 0H0C4.97056 0 9 4.02944 9 9V0Z'}
          fill={colors.background.container}
          fillRule="evenodd"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: tokens.width,
    alignSelf: 'stretch',
    overflow: 'hidden',
    backgroundColor: colors.background.component,
  },
  content: {
    alignItems: 'stretch',
  },
  lineRow: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  lineBody: {
    minHeight: tokens.itemMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.contentGap,
    padding: tokens.line.padding,
  },
  lineBodyActive: {
    backgroundColor: colors.background.container,
  },
  lineIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: tokens.line.indicatorWidth,
    height: tokens.line.indicatorHeight,
    marginTop: -tokens.line.indicatorHeight / 2,
    borderRadius: radiusTokens.circle,
    backgroundColor: colors.brand.default,
  },
  notch: {
    position: 'absolute',
    right: 0,
    width: tokens.line.notchSize,
    height: tokens.line.notchSize,
  },
  notchAbove: {
    top: -tokens.line.notchSize,
  },
  notchBelow: {
    bottom: -tokens.line.notchSize,
  },
  tagRow: {
    alignSelf: 'stretch',
    padding: tokens.tag.outerPadding,
  },
  tagBody: {
    alignSelf: 'stretch',
    minHeight: tokens.itemMinHeight - 2 * tokens.tag.outerPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.contentGap,
    padding: tokens.tag.innerPadding,
    borderRadius: tokens.tag.radius,
  },
  tagBodyActive: {
    backgroundColor: colors.background.container,
  },
  iconSlot: {
    width: tokens.iconSize,
    height: tokens.iconSize,
  },
  labelDefault: {
    ...typographyTokens.title16Regular,
  },
  labelActive: {
    ...typographyTokens.title16Semibold,
  },
  labelFlexible: {
    minWidth: 0,
    flex: 1,
  },
  labelNoWrap: {
    minWidth: 0,
    flexShrink: 1,
  },
  badgeRow: {
    minWidth: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeAnchor: {
    width: 0,
    height: 0,
  },
  badgeDot: {
    position: 'absolute',
    left: tokens.badgeDotOffsetX,
    top: tokens.badgeDotOffsetY,
    width: tokens.badgeDotSize,
    height: tokens.badgeDotSize,
    borderRadius: radiusTokens.circle,
    backgroundColor: colors.error.default,
  },
});
