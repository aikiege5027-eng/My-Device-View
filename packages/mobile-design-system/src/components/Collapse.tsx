import React, { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ChevronDownIcon } from '../icons';
import { colorThemes, componentTokens, typographyTokens } from '../designTokens';

const colors = colorThemes.light;
const tokens = componentTokens.collapse;

type CollapseContentProps =
  | {
      /** 自定义内容槽（Figma `自定义内容`）；与 `contentText` 互斥。 */
      children: ReactNode;
      contentText?: never;
    }
  | {
      children?: never;
      /** 默认 `Body 14/Regular` 文本内容；与 `children` 互斥。 */
      contentText: string;
    };

type CollapseBaseProps = {
  accessibilityHint?: string;
  /** 覆盖可访问名称，默认取 `title`。 */
  accessibilityLabel?: string;
  /** 右侧操作说明文案，对应 Figma `header right content=true`。 */
  actionText?: string;
  /** 对应 Figma `disabled`；禁用时不触发 `onToggle`。 */
  disabled?: boolean;
  /** 受控展开状态，对应 Figma `expand`。 */
  expanded: boolean;
  /** 对应 Figma `expandicon`；关闭后 header 不渲染 chevron。 */
  expandIcon?: boolean;
  onToggle: (expanded: boolean) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  title: string;
};

export type CollapseProps = CollapseBaseProps & CollapseContentProps;

/**
 * 可折叠 / 展开的内容区域。
 *
 * 展开状态由调用方受控；组件只负责 Figma 定义的 header、chevron 方向、
 * 分割线和内容区排版。Figma 当前未定义展开动画、按压态与 hover 态，
 * 因此此处不做补值。
 */
export function Collapse({
  accessibilityHint,
  accessibilityLabel,
  actionText,
  children,
  contentText,
  disabled = false,
  expandIcon = true,
  expanded,
  onToggle,
  style,
  testID,
  title,
}: CollapseProps) {
  return (
    <View style={[styles.panel, style]} testID={testID}>
      <View style={styles.surface}>
        <Pressable
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel ?? title}
          accessibilityRole="button"
          accessibilityState={{ disabled, expanded }}
          disabled={disabled}
          onPress={() => onToggle(!expanded)}
          style={[styles.header, expandIcon ? undefined : styles.headerWithoutIcon]}
        >
          <Text style={[styles.title, disabled ? styles.disabledText : undefined]}>
            {title}
          </Text>
          {actionText === undefined ? null : (
            <Text
              numberOfLines={1}
              style={[styles.actionText, disabled ? styles.disabledText : undefined]}
            >
              {actionText}
            </Text>
          )}
          {expandIcon ? (
            <View style={styles.operation}>
              <View style={expanded ? styles.expandedIcon : undefined}>
                <ChevronDownIcon
                  accessibilityElementsHidden
                  color={disabled ? colors.text.disabled : colors.text.placeholder}
                  height={tokens.iconSize}
                  importantForAccessibility="no-hide-descendants"
                  width={tokens.iconSize}
                />
              </View>
            </View>
          ) : null}
        </Pressable>
      </View>
      {expanded ? (
        <View style={styles.content}>
          <View style={styles.contentInner}>
            {children ?? (
              <Text
                style={[styles.contentText, disabled ? styles.disabledText : undefined]}
              >
                {contentText}
              </Text>
            )}
          </View>
        </View>
      ) : null}
    </View>
  );
}

export type CollapseGroupTheme = 'default' | 'card';

type CollapseGroupItemBase = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  actionText?: string;
  disabled?: boolean;
  /** 稳定标识；不得使用数组下标或显示文案兼作 id。 */
  id: string;
  title: string;
};

type CollapseGroupItemContent =
  | { content: ReactNode; contentText?: never }
  | { content?: never; contentText: string };

export type CollapseGroupItem = CollapseGroupItemBase & CollapseGroupItemContent;

export type CollapseGroupProps = {
  /** 整组的可访问名称；每个面板仍保持独立可聚焦。 */
  accessibilityLabel?: string;
  /**
   * 手风琴式（Figma `Accordion 手风琴式`）：同一时间最多展开一个面板。
   * 只影响展开集合的计算，不引入 Figma 未定义的视觉状态。
   */
  accordion?: boolean;
  /** 组级禁用，与项级 `disabled` 合并。 */
  disabled?: boolean;
  expandIcon?: boolean;
  /** Figma 当前定义 2–5 个面板。 */
  items: readonly CollapseGroupItem[];
  onChange: (expandedIds: readonly string[]) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** `default` 通栏样式；`card` 卡片样式，使用 `radius/radius-large` 并裁切圆角。 */
  theme?: CollapseGroupTheme;
  /** 受控展开面板 id 集合。 */
  value: readonly string[];
};

/**
 * 折叠面板组。受控展开集合，按稳定 `id` 索引；`theme=card` 只改变容器圆角与裁切，
 * 不改变单个面板的 header、分割线与内容排版。
 */
export function CollapseGroup({
  accessibilityLabel,
  accordion = false,
  disabled = false,
  expandIcon = true,
  items,
  onChange,
  style,
  testID,
  theme = 'default',
  value,
}: CollapseGroupProps) {
  if (
    __DEV__ &&
    (items.length < tokens.group.minItemCount || items.length > tokens.group.maxItemCount)
  ) {
    console.warn(
      `CollapseGroup: Figma defines ${tokens.group.minItemCount}–${tokens.group.maxItemCount} panels per group, received ${items.length}.`,
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.group, theme === 'card' ? styles.cardGroup : undefined, style]}
      testID={testID}
    >
      {items.map((item) => {
        const expanded = value.includes(item.id);
        const handleToggle = (nextExpanded: boolean) => {
          if (accordion) {
            onChange(nextExpanded ? [item.id] : []);
            return;
          }

          onChange(
            nextExpanded
              ? [...value, item.id]
              : value.filter((current) => current !== item.id),
          );
        };
        const shared = {
          accessibilityHint: item.accessibilityHint,
          accessibilityLabel: accessibilityLabel
            ? `${accessibilityLabel}, ${item.accessibilityLabel ?? item.title}`
            : item.accessibilityLabel,
          actionText: item.actionText,
          disabled: disabled || item.disabled,
          expandIcon,
          expanded,
          onToggle: handleToggle,
          testID: item.id,
          title: item.title,
        };

        return item.contentText === undefined ? (
          <Collapse {...shared} key={item.id}>
            {item.content}
          </Collapse>
        ) : (
          <Collapse {...shared} contentText={item.contentText} key={item.id} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignSelf: 'stretch',
  },
  surface: {
    alignSelf: 'stretch',
    backgroundColor: colors.background.container,
    paddingLeft: tokens.paddingLeft,
  },
  header: {
    minHeight: tokens.headerMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.headerGap,
    paddingVertical: tokens.headerPaddingVertical,
    borderBottomWidth: tokens.dividerWidth,
    borderBottomColor: colors.border.componentStroke,
  },
  /** `expandicon=false` 时右内边距回到 header 行本身。 */
  headerWithoutIcon: {
    paddingRight: tokens.paddingRight,
  },
  title: {
    minWidth: 0,
    flex: 1,
    color: colors.text.primary,
    ...typographyTokens.title16Regular,
  },
  actionText: {
    flexShrink: 0,
    color: colors.text.placeholder,
    ...typographyTokens.title16Regular,
  },
  operation: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: tokens.paddingRight,
  },
  expandedIcon: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    alignSelf: 'stretch',
    backgroundColor: colors.background.container,
    paddingLeft: tokens.paddingLeft,
    borderBottomWidth: tokens.dividerWidth,
    borderBottomColor: colors.border.componentStroke,
  },
  contentInner: {
    alignSelf: 'stretch',
    paddingRight: tokens.paddingRight,
    paddingVertical: tokens.contentPaddingVertical,
  },
  contentText: {
    color: colors.text.primary,
    ...typographyTokens.body14Regular,
  },
  disabledText: {
    color: colors.text.disabled,
  },
  group: {
    alignSelf: 'stretch',
  },
  cardGroup: {
    overflow: 'hidden',
    borderRadius: tokens.group.cardRadius,
  },
});
