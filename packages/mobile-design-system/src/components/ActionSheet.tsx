import React, { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colorThemes, componentTokens, radiusTokens, typographyTokens } from '../designTokens';

/** Figma `align` 轴。影响列表 cell、description 行与宫格 item 的排列方式。 */
export type ActionSheetAlign = 'center' | 'left';

/** Figma `item/action-cell` 的 `theme` 轴。宫格 item 没有该轴。 */
export type ActionSheetCellTheme = 'default' | 'error' | 'primary';

/** 宫格每行列数。Figma 只定义 2、3、4 列（`item/≤3 columns` 与 `item/4 columns`）。 */
export type ActionSheetGridColumns = 2 | 3 | 4;

export type ActionSheetListItem = {
  /**
   * Figma 列表 cell 的 `badge=true`：文案右上角的 `8×8` error 圆点，没有文案。
   * 圆点本身是装饰元素，需要朗读含义时用 `badgeAccessibilityLabel` 补充。
   */
  badge?: boolean;
  badgeAccessibilityLabel?: string;
  /** Figma 只定义 `theme=default` 的禁用态；禁用时文案统一解析为 `text.disabled`。 */
  disabled?: boolean;
  id: string;
  /** `24×24` 图标槽（Figma `icon=true`）。装饰元素，组件内部已从无障碍树隐藏。 */
  icon?: React.ReactNode;
  label: string;
  onPress: () => void;
  theme?: ActionSheetCellTheme;
};

/** 宫格 item 的 media 槽：图片或「组件底色 + 24 图标」。 */
export type ActionSheetGridMedia =
  | { icon: React.ReactNode; source?: never; type: 'icon' }
  | { icon?: never; source: ImageSourcePropType; type: 'image' };

export type ActionSheetGridItem = {
  /**
   * Figma 宫格使用带文案的 `Badge 徽标`（如 `NEW`），而不是列表的圆点，
   * 因此这里接收文案而非布尔值。
   */
  badge?: string;
  id: string;
  label: string;
  media: ActionSheetGridMedia;
  onPress: () => void;
};

/** `cancel=true` 必须提供取消回调；`cancel=false` 不保留任何占位。 */
type ActionSheetCancelProps =
  | { cancel?: false; cancelText?: never; onCancel?: never }
  | { cancel: true; cancelText?: string; onCancel: () => void };

type ActionSheetBaseProps = ActionSheetCancelProps & {
  /** `title=false` 的面板没有可读名称，由宿主或此处提供。 */
  accessibilityLabel?: string;
  align?: ActionSheetAlign;
  /** Figma `description=true` 的说明行；留空即 `description=false`。 */
  description?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

type ActionSheetListProps = ActionSheetBaseProps & {
  items: readonly ActionSheetListItem[];
  theme?: 'list';
};

type ActionSheetGridProps = ActionSheetBaseProps & {
  /**
   * 每行列数。缺省时按 Figma 已定义的 item 数推导
   * （2→2 列、4/8→4 列、6→3 列、>8→4 列）。`align=left` 固定 4 列。
   */
  columns?: ActionSheetGridColumns;
  items: readonly ActionSheetGridItem[];
  /**
   * Figma `Multiple Rows Scrolling 多行滚动宫格`：限制可视行数，超出纵向滚动。
   * 设计稿示例为 2 行，具体行数由调用方按场景传入。
   */
  maxVisibleRows?: number;
  /**
   * Figma `with Swiper 带翻页宫格`：按页横向翻页并显示 swiper 圆点。
   * 与 `maxVisibleRows` 互斥，设计稿示例为每页 2 行。
   */
  rowsPerPage?: number;
  theme: 'grid';
};

export type ActionSheetProps = ActionSheetGridProps | ActionSheetListProps;

/**
 * 统一 ActionSheet 动作面板（Figma `24386:5277`，图层名 `ActionSheet 动作面板`）。
 *
 * 覆盖 `theme=list|gird`（代码统一拼作 `grid`）、`align=center|left`、
 * `cancel`、`description` 四个 variant 轴，以及列表 cell 的
 * `icon` / `theme` / `badge` / `disabled` / `no-border` 与宫格的
 * `item/≤3 columns`（48 media + Body 14/22）与 `item/4 columns`
 * （40 media + Foot 12/20）两档 item 尺寸。
 *
 * 面板本体不包含遮罩、弹出动画、安全区与系统返回处理 —— Figma 当前节点未定义，
 * 应由外层 `BottomSheet` 宿主负责。
 */
export function ActionSheet(props: ActionSheetProps) {
  const {
    accessibilityLabel,
    align = 'center',
    cancel,
    cancelText = 'Cancel',
    description,
    onCancel,
    style,
    testID,
  } = props;

  const list = props.theme !== 'grid';
  const descriptionRow =
    description === undefined ? null : (
      <DescriptionRow
        align={align}
        /** 宫格的说明行在 Figma 中为 `no-border=true`，列表为 `no-border=false`。 */
        divider={list}
        text={description}
      />
    );

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.container,
        list ? (cancel ? styles.listContainerWithCancel : styles.listContainer) : styles.gridContainer,
        style,
      ]}
      testID={testID}
    >
      {list ? (
        <View style={styles.listGroup}>
          {descriptionRow}
          {props.items.map((item, index) => (
            <ActionCell
              align={align}
              divider={index < props.items.length - 1}
              item={item}
              key={item.id}
            />
          ))}
        </View>
      ) : (
        <GridSection
          align={align}
          columns={props.columns}
          description={descriptionRow}
          items={props.items}
          maxVisibleRows={props.maxVisibleRows}
          rowsPerPage={props.rowsPerPage}
        />
      )}

      {cancel ? (
        <Pressable accessibilityRole="button" onPress={onCancel} style={styles.cancelCell}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.cancelLabel}>
            {cancelText}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function DescriptionRow({
  align,
  divider,
  text,
}: {
  align: ActionSheetAlign;
  divider: boolean;
  text: string;
}) {
  return (
    <View
      style={[
        styles.descriptionRow,
        align === 'center' ? styles.rowCenter : styles.rowLeft,
        divider && styles.divider,
      ]}
    >
      <Text style={[styles.descriptionLabel, align === 'center' && styles.textCenter]}>
        {text}
      </Text>
    </View>
  );
}

function ActionCell({
  align,
  divider,
  item,
}: {
  align: ActionSheetAlign;
  divider: boolean;
  item: ActionSheetListItem;
}) {
  const { badge, badgeAccessibilityLabel, disabled, icon, label, onPress, theme = 'default' } = item;
  const centered = align === 'center';

  return (
    <Pressable
      accessibilityLabel={
        badge && badgeAccessibilityLabel ? `${label}, ${badgeAccessibilityLabel}` : label
      }
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.actionCell,
        centered ? styles.rowCenter : styles.rowLeft,
        divider && styles.divider,
      ]}
    >
      {icon ? <Decorative style={styles.cellIcon}>{icon}</Decorative> : null}
      {badge ? (
        /** `badge=true` 时文案不再占满行宽，整体内容按 align 排列，徽标紧随文案。 */
        <View style={styles.cellBadgeRow}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[styles.cellLabelHug, cellLabelColor(theme, disabled)]}
          >
            {label}
          </Text>
          <Anchor>
            <View style={styles.cellBadgeDot} />
          </Anchor>
        </View>
      ) : (
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={[
            styles.cellLabelFill,
            centered && styles.textCenter,
            cellLabelColor(theme, disabled),
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

type GridSectionProps = {
  align: ActionSheetAlign;
  columns?: ActionSheetGridColumns;
  description: React.ReactNode;
  items: readonly ActionSheetGridItem[];
  maxVisibleRows?: number;
  rowsPerPage?: number;
};

function GridSection({
  align,
  columns,
  description,
  items,
  maxVisibleRows,
  rowsPerPage,
}: GridSectionProps) {
  const [pageWidth, setPageWidth] = useState(0);
  const [page, setPage] = useState(0);

  const resolved = resolveGridColumns(align, items.length, columns);
  /** `align=left` 的 item 为固定 `80` 宽并左侧紧排，始终使用紧凑档。 */
  const compact = align === 'left' || resolved === tokens.grid.maxColumns;
  const rows = chunk(items, resolved);
  const rowHeight = compact ? compactRowHeight : regularRowHeight;

  const handlePageScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageWidth <= 0) return;
      setPage(Math.round(event.nativeEvent.contentOffset.x / pageWidth));
    },
    [pageWidth],
  );

  const gridStyle = [
    styles.grid,
    description === null ? styles.gridPaddingY : styles.gridPaddingBottom,
  ];

  const renderRow = (row: readonly ActionSheetGridItem[], key: number) => (
    <View key={key} style={[styles.gridRow, align === 'left' && styles.rowLeft]}>
      {row.map((item) => (
        <GridItem align={align} compact={compact} item={item} key={item.id} />
      ))}
    </View>
  );

  if (rowsPerPage !== undefined && rowsPerPage > 0) {
    const pages = chunk(rows, rowsPerPage);

    return (
      <View style={gridStyle}>
        {description}
        <ScrollView
          horizontal
          onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}
          onMomentumScrollEnd={handlePageScroll}
          onScrollEndDrag={handlePageScroll}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ height: rowsPerPage * rowHeight }}
        >
          {pages.map((pageRows, pageIndex) => (
            <View key={pageIndex} style={pageWidth > 0 ? { width: pageWidth } : styles.pageFallback}>
              {pageRows.map(renderRow)}
            </View>
          ))}
        </ScrollView>
        {pages.length > 1 ? <Swiper count={pages.length} current={page} /> : null}
      </View>
    );
  }

  if (maxVisibleRows !== undefined && maxVisibleRows > 0 && rows.length > maxVisibleRows) {
    return (
      <View style={gridStyle}>
        {description}
        <ScrollView showsVerticalScrollIndicator={false} style={{ height: maxVisibleRows * rowHeight }}>
          {rows.map(renderRow)}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={gridStyle}>
      {description}
      {rows.map(renderRow)}
    </View>
  );
}

function GridItem({
  align,
  compact,
  item,
}: {
  align: ActionSheetAlign;
  compact: boolean;
  item: ActionSheetGridItem;
}) {
  const { badge, label, media, onPress } = item;
  const mediaSize = compact ? tokens.grid.compactMediaSize : tokens.grid.regularMediaSize;

  return (
    <Pressable
      accessibilityLabel={badge ? `${label}, ${badge}` : label}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.gridItem,
        align === 'left' ? styles.gridItemFixed : styles.gridItemFill,
      ]}
    >
      <View style={styles.gridMediaWrapper}>
        {media.type === 'image' ? (
          <Image
            source={media.source}
            style={[styles.gridMediaImage, { height: mediaSize, width: mediaSize }]}
          />
        ) : (
          <Decorative style={[styles.gridMediaIcon, { height: mediaSize, width: mediaSize }]}>
            {media.icon}
          </Decorative>
        )}
        {badge === undefined ? null : (
          <View
            style={[
              styles.gridBadgeAnchor,
              { left: mediaSize + tokens.grid.badge.offsetX, top: tokens.grid.badge.offsetY },
            ]}
          >
            <View style={styles.gridBadge}>
              <Text numberOfLines={1} style={styles.gridBadgeLabel}>
                {badge}
              </Text>
            </View>
          </View>
        )}
      </View>
      <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        style={[styles.gridLabel, compact ? styles.gridLabelCompact : styles.gridLabelRegular]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Figma `swiper`：`p=12`、`gap=8`、`8×8` 圆点，当前页为品牌色，其余为组件描边色。 */
function Swiper({ count, current }: { count: number; current: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.swiper}
    >
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          style={[styles.swiperDot, index === current && styles.swiperDotActive]}
        />
      ))}
    </View>
  );
}

/** 0×0 定位锚点：子元素在锚点上双向居中并允许溢出，对应 Figma 的 `size-0` 包裹层。 */
function Anchor({ children }: { children: React.ReactNode }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.anchor}
    >
      {children}
    </View>
  );
}

function Decorative({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={style}
    >
      {children}
    </View>
  );
}

function cellLabelColor(theme: ActionSheetCellTheme, disabled?: boolean) {
  if (disabled) return styles.cellLabelDisabled;
  if (theme === 'primary') return styles.cellLabelPrimary;
  if (theme === 'error') return styles.cellLabelError;
  return styles.cellLabelDefault;
}

/**
 * Figma 宫格按 item 数定义列数：2→2、4→4、6→3、8→4、`>8`→4。
 * 其余数量未定义，调用方应显式传入 `columns`。
 */
function resolveGridColumns(
  align: ActionSheetAlign,
  count: number,
  explicit?: ActionSheetGridColumns,
): ActionSheetGridColumns {
  if (align === 'left') return tokens.grid.maxColumns;
  if (explicit !== undefined) return explicit;
  if (count === 2) return 2;
  if (count === 6) return 3;
  if (count % tokens.grid.maxColumns === 0 || count > 8) return tokens.grid.maxColumns;

  if (__DEV__) {
    console.warn(
      `[ActionSheet] Figma 宫格只定义 2、4、6、8 与 >8 个 item 的列数，收到 ${count} 个。` +
        '请显式传入 columns，或回到设计确认该数量的布局。',
    );
  }
  return tokens.grid.maxColumns;
}

function chunk<T>(items: readonly T[], size: number): readonly T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

const colors = colorThemes.light;
const tokens = componentTokens.actionSheet;

/** 16 + 40 + 8 + 20 + 12 = 96，Figma `item/4 columns` 的基准行高。 */
const compactRowHeight =
  tokens.grid.item.paddingTop +
  tokens.grid.compactMediaSize +
  tokens.grid.item.gap +
  typographyTokens.footer12Regular.lineHeight +
  tokens.grid.item.paddingBottom;

/** 16 + 48 + 8 + 22 + 12 = 106，Figma `item/≤3 columns` 的基准行高。 */
const regularRowHeight =
  tokens.grid.item.paddingTop +
  tokens.grid.regularMediaSize +
  tokens.grid.item.gap +
  typographyTokens.body14Regular.lineHeight +
  tokens.grid.item.paddingBottom;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    overflow: 'hidden',
    borderTopLeftRadius: tokens.topRadius,
    borderTopRightRadius: tokens.topRadius,
  },
  /**
   * `theme=list` + `cancel=true`：容器底色透出 `groupGap`，形成 cell 组与
   * cancel-cell 之间唯一的分组间隙。
   */
  listContainerWithCancel: {
    gap: tokens.groupGap,
    backgroundColor: colors.background.component,
  },
  /** `cancel=false` 时没有间隙，容器底色不参与视觉，保持透明。 */
  listContainer: {
    backgroundColor: colors.background.transparent,
  },
  /** `theme=gird` 的容器底色即 cell 底色，分组靠 `gird` 底部的 0.5 分割线。 */
  gridContainer: {
    backgroundColor: colors.background.container,
  },
  listGroup: {
    alignSelf: 'stretch',
  },
  divider: {
    borderBottomColor: colors.border.componentStroke,
    borderBottomWidth: tokens.dividerWidth,
  },
  rowCenter: {
    justifyContent: 'center',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  textCenter: {
    textAlign: 'center',
  },
  actionCell: {
    alignSelf: 'stretch',
    minHeight: tokens.cell.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.cell.contentGap,
    padding: tokens.cell.padding,
    backgroundColor: colors.background.container,
  },
  cellIcon: {
    height: tokens.cell.iconSize,
    width: tokens.cell.iconSize,
  },
  cellLabelFill: {
    minWidth: 0,
    flex: 1,
    ...typographyTokens.title16Regular,
  },
  /** `badge=true` 时文案按内容收缩，让徽标锚点贴紧文案右边缘。 */
  cellLabelHug: {
    flexShrink: 1,
    ...typographyTokens.title16Regular,
  },
  cellLabelDefault: {
    color: colors.text.primary,
  },
  cellLabelPrimary: {
    color: colors.brand.default,
  },
  cellLabelError: {
    color: colors.error.default,
  },
  cellLabelDisabled: {
    color: colors.text.disabled,
  },
  cellBadgeRow: {
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  anchor: {
    height: 0,
    width: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellBadgeDot: {
    position: 'absolute',
    left: tokens.cell.badgeDotOffsetX,
    top: tokens.cell.badgeDotOffsetY,
    height: tokens.cell.badgeDotSize,
    width: tokens.cell.badgeDotSize,
    borderRadius: radiusTokens.circle,
    backgroundColor: colors.error.default,
  },
  descriptionRow: {
    alignSelf: 'stretch',
    minHeight: tokens.description.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.description.paddingHorizontal,
    paddingVertical: tokens.description.paddingVertical,
    backgroundColor: colors.background.container,
  },
  descriptionLabel: {
    minWidth: 0,
    flexShrink: 1,
    color: colors.text.placeholder,
    ...typographyTokens.body14Regular,
  },
  cancelCell: {
    alignSelf: 'stretch',
    minHeight: tokens.cancel.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.cancel.paddingHorizontal,
    paddingVertical: tokens.cancel.paddingVertical,
    backgroundColor: colors.background.container,
  },
  cancelLabel: {
    minWidth: 0,
    flex: 1,
    color: colors.text.primary,
    textAlign: 'center',
    ...typographyTokens.title16Regular,
  },
  grid: {
    alignSelf: 'stretch',
    borderBottomColor: colors.border.componentStroke,
    borderBottomWidth: tokens.dividerWidth,
  },
  gridPaddingY: {
    paddingVertical: tokens.grid.paddingVertical,
  },
  /** `description=true` 时上内边距由说明行的 `12` 承担。 */
  gridPaddingBottom: {
    paddingBottom: tokens.grid.paddingVertical,
  },
  gridRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageFallback: {
    alignSelf: 'stretch',
  },
  gridItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.grid.item.gap,
    paddingTop: tokens.grid.item.paddingTop,
    paddingBottom: tokens.grid.item.paddingBottom,
    paddingHorizontal: tokens.grid.item.paddingHorizontal,
  },
  gridItemFill: {
    minWidth: 0,
    flex: 1,
  },
  gridItemFixed: {
    flexShrink: 0,
    width: tokens.grid.leftItemWidth,
  },
  gridMediaWrapper: {
    flexShrink: 0,
  },
  gridMediaImage: {
    borderRadius: tokens.grid.mediaRadius,
    borderColor: colors.actionSheet.gridMediaBorder,
    borderWidth: tokens.grid.mediaBorderWidth,
    resizeMode: 'cover',
  },
  gridMediaIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.grid.mediaPadding,
    borderRadius: tokens.grid.mediaRadius,
    backgroundColor: colors.background.component,
  },
  gridBadgeAnchor: {
    position: 'absolute',
    height: 0,
    width: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBadge: {
    minHeight: tokens.grid.badge.minHeight,
    minWidth: tokens.grid.badge.minContentWidth + tokens.grid.badge.paddingHorizontal * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.grid.badge.paddingHorizontal,
    borderRadius: tokens.grid.badge.radius,
    backgroundColor: colors.error.default,
  },
  gridBadgeLabel: {
    color: colors.text.white,
    textAlign: 'center',
    ...typographyTokens.footer10Semibold,
  },
  gridLabel: {
    alignSelf: 'stretch',
    color: colors.text.primary,
    textAlign: 'center',
  },
  gridLabelCompact: {
    ...typographyTokens.footer12Regular,
  },
  gridLabelRegular: {
    ...typographyTokens.body14Regular,
  },
  swiper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.grid.swiper.gap,
    padding: tokens.grid.swiper.padding,
  },
  swiperDot: {
    height: tokens.grid.swiper.dotSize,
    width: tokens.grid.swiper.dotSize,
    borderRadius: radiusTokens.circle,
    backgroundColor: colors.border.componentStroke,
  },
  swiperDotActive: {
    backgroundColor: colors.brand.default,
  },
});
