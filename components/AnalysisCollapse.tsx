import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colorThemes, componentTokens, typographyTokens } from '@kone/mobile-design-system';
import { ChevronDownIcon } from './icons';

export type AnalysisCollapseItem = {
  accessibilityHint?: string;
  /** 右侧摘要文案，位于 chevron 左侧。 */
  actionText?: string;
  content: ReactNode;
  /** 稳定标识；不使用数组下标。 */
  id: string;
  title: string;
};

export type AnalysisCollapseProps = {
  accessibilityLabel?: string;
  /**
   * 手风琴式：同一时间最多展开一个面板，展开某一项会收起其余项。
   * 只改变展开集合的计算，不引入新的视觉状态。
   */
  accordion?: boolean;
  items: readonly AnalysisCollapseItem[];
  onChange: (expandedIds: readonly string[]) => void;
  testID?: string;
  /** 受控展开面板 id 集合。 */
  value: readonly string[];
};

/**
 * 「部件分析维度」卡片内使用的折叠面板组。
 *
 * 这是本页面自己的定制实现，不是设计系统组件的替代品。设计系统 `Collapse` 的分割线
 * 规则由 Figma 定义（左缩进、右通栏、末项保留分割线），本页面需要的是另一套：
 *
 * - 分割线左右等距缩进，与 header 标题对齐
 * - 展开时 header 与内容区连成一块，不画中间那条线
 * - 最后一个面板不画底部分割线，因为整组已被外层数据面板卡片收口
 * - 摘要文案降一档到 `Body 14/22 Regular`
 *
 * 这些都是页面层的定制诉求，因此实现放在 App 内，设计系统组件保持 Figma 定义不变。
 * 尺寸、排版与颜色仍全部取自设计系统 token，不写裸值。
 */
export function AnalysisCollapse({
  accessibilityLabel,
  accordion = false,
  items,
  onChange,
  testID,
  value,
}: AnalysisCollapseProps) {
  return (
    <View accessibilityLabel={accessibilityLabel} style={styles.group} testID={testID}>
      {items.map((item, index) => {
        const expanded = value.includes(item.id);
        const last = index === items.length - 1;
        const toggle = () => {
          if (accordion) {
            onChange(expanded ? [] : [item.id]);
            return;
          }

          onChange(
            expanded
              ? value.filter((current) => current !== item.id)
              : [...value, item.id],
          );
        };

        return (
          <View key={item.id} style={styles.panel}>
            <View style={styles.inset}>
              <Pressable
                accessibilityHint={item.accessibilityHint}
                accessibilityLabel={item.title}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={toggle}
                style={[
                  styles.header,
                  // 收起时 header 底边就是面板底边：末项不画，其余画。
                  !expanded && !last ? styles.divider : undefined,
                ]}
                testID={`${item.id}-header`}
              >
                <Text style={styles.title}>{item.title}</Text>
                {item.actionText === undefined ? null : (
                  <Text numberOfLines={1} style={styles.actionText}>
                    {item.actionText}
                  </Text>
                )}
                <View style={styles.operation}>
                  <View style={expanded ? styles.expandedIcon : undefined}>
                    <ChevronDownIcon
                      color={colors.text.placeholder}
                      size={collapseTokens.iconSize}
                    />
                  </View>
                </View>
              </Pressable>
            </View>

            {expanded ? (
              <View style={styles.inset}>
                <View style={[styles.content, last ? undefined : styles.divider]}>
                  {item.content}
                </View>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const colors = colorThemes.light;
const collapseTokens = componentTokens.collapse;

const styles = StyleSheet.create({
  group: {
    alignSelf: 'stretch',
  },
  panel: {
    alignSelf: 'stretch',
    backgroundColor: colors.background.container,
  },
  /**
   * 承担左右缩进的一层。`borderBottomWidth` 的边框盒不会被元素自身的内边距缩进，
   * 所以缩进必须放在带分割线元素的父级上，两侧才能等距。
   */
  inset: {
    alignSelf: 'stretch',
    paddingHorizontal: collapseTokens.paddingLeft,
  },
  divider: {
    borderBottomWidth: collapseTokens.dividerWidth,
    borderBottomColor: colors.border.componentStroke,
  },
  header: {
    minHeight: collapseTokens.headerMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: collapseTokens.headerGap,
    paddingVertical: collapseTokens.headerPaddingVertical,
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
    ...typographyTokens.body14Regular,
  },
  operation: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  expandedIcon: {
    transform: [{ rotate: '180deg' }],
  },
  /** header 的下内边距已提供 16 间距，内容区因此不再重复上内边距。 */
  content: {
    alignSelf: 'stretch',
    paddingBottom: collapseTokens.contentPaddingVertical,
  },
});
