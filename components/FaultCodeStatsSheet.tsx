import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CloseM from '../assets/close-m.svg';
import { FaultCodePill } from './FaultCodePill';
import {
  BottomSheet,
  Button,
  Checkbox,
  Link,
  colorThemes,
  typographyTokens,
} from '@kone/mobile-design-system';

export type FaultCodeStat = { code: string; count: number };

export type FaultCodeStatsSheetProps = {
  /**
   * 已生效的排除项（被取消选中的故障代码），每次打开时作为草稿初始值。
   * 空集即全部选中。
   */
  excluded: readonly string[];
  /** 全部故障代码统计，由调用方按次数从高到低排好序。 */
  stats: readonly FaultCodeStat[];
  onClose: () => void;
  /** 「确认」提交草稿；参数同样是排除项集合。 */
  onConfirm: (nextExcluded: readonly string[]) => void;
  visible: boolean;
};

/**
 * 故障代码统计半屏面板，来自 Figma 节点 `20340:8827`（`picker` / `Popup` / `footer`）。
 *
 * 结构：顶部 `58` 高标题区（居中标题 + 右侧 `24×24` close-M）、`343` 宽的 CheckTag
 * 换行网格（每行 3 个、行列间距 `12`、单个 `40` 高）、底部 `80` 高双按钮操作区
 * （`重置` / `确认`，`large + round + block`，间距 `8`）。
 *
 * 筛选采用排除语义：默认全部选中，取消某一项即把该故障代码从列表里排除。草稿记录
 * 的是「被取消的代码」，因此空集等于全选。
 *
 * 选择在面板内是草稿状态：`确认` 才提交，`重置` 把草稿清回全选但不关闭，关闭按钮
 * 与遮罩丢弃草稿。遮罩、滑入动效、安全区与系统返回由统一 `BottomSheet` 宿主承担。
 */
export function FaultCodeStatsSheet({
  excluded,
  onClose,
  onConfirm,
  stats,
  visible,
}: FaultCodeStatsSheetProps) {
  /** 草稿同样是排除项集合；空集等于全选。 */
  const [draft, setDraft] = useState<readonly string[]>(excluded);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  /** Web 预览没有真实安全区，按 Figma 的 iOS Home Indicator 高度模拟。 */
  const bottomInset =
    Platform.OS === 'web' && insets.bottom === 0 ? webBottomSafeArea : insets.bottom;

  /** 每次打开时用已生效的排除项重置草稿，避免上次未确认的改动残留。 */
  useEffect(() => {
    if (visible) setDraft(excluded);
  }, [excluded, visible]);

  /** 草稿是排除集：空集即全选，覆盖全部代码即全不选。 */
  const allSelected = draft.length === 0;
  const someSelected = draft.length < stats.length;

  /** 取消选中即加入排除集，再次选中即移出排除集。 */
  const toggle = (code: string) =>
    setDraft((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code],
    );

  return (
    <BottomSheet
      dismissAccessibilityLabel="关闭故障代码统计"
      onRequestClose={onClose}
      /** 面板自带顶部圆角，宿主必须不铺底色，否则圆角在遮罩上看不出来。 */
      surface="transparent"
      visible={visible}
    >
      <View style={[styles.popup, { maxHeight: height * maxSheetRatio }]}>
        <View style={styles.title}>
          <Text accessibilityRole="header" style={styles.titleLabel}>
            故障代码统计及筛选
          </Text>
          <Pressable
            accessibilityLabel="关闭"
            accessibilityRole="button"
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onPress={onClose}
            style={styles.close}
          >
            <CloseM color={colors.text.primary} height={closeIconSize} width={closeIconSize} />
          </Pressable>
        </View>

        {/**
         * Figma 的 Popup 固定 `570` 高，但示例里只放了 8 个标签，下方是预留空白。
         * 这里改为内容自然高度并设上限：标签少时面板不会出现大片空白，标签多到
         * 超过上限时网格内部滚动，标题与底部操作始终可见。
         */}
        <ScrollView contentContainerStyle={styles.gridContent} style={styles.grid}>
          {/**
           * 全选 / 反选是业务新增的批量操作，Figma 节点未定义。
           *
           * 全选用设计系统 `Checkbox` 的 `variant=inline`（24 indicator + `Body 14/22`
           * + `text-color-primary`），与网格里 `Body 14` 的标签同一档；没有沿用导出报告
           * 设置页的 `CompactSelectAll`，那个是为了塞进分割线刻意缩到 16 + `Foot 12`
           * + placeholder 色的页面专用控件。
           *
           * 反选是纯动作、没有勾选态，所以用统一 `Link` 的 `primary` 主题，排版与全选
           * 文案同为 `Body 14/22`，颜色用品牌色表达可点击。
           */}
          <View style={styles.bulkRow}>
            <SelectAllCheckbox
              allSelected={allSelected}
              onToggle={() => setDraft(allSelected ? stats.map((item) => item.code) : [])}
              someSelected={someSelected}
            />
            <Link
              accessibilityHint="把当前选中与未选中的故障代码互换"
              accessibilityRole="button"
              onPress={() =>
                setDraft((current) =>
                  stats
                    .filter((item) => !current.includes(item.code))
                    .map((item) => item.code),
                )
              }
              theme="primary"
            >
              反选
            </Link>
          </View>

          <View style={styles.gridRow}>
            {stats.map((item) => (
              <FaultCodePill
                checked={!draft.includes(item.code)}
                code={item.code}
                count={item.count}
                key={item.code}
                layoutStyle={styles.tag}
                onToggle={() => toggle(item.code)}
                size="extraLarge"
              />
            ))}
          </View>
        </ScrollView>

        {/**
         * Figma `20340:8864`：两个按钮都是 `flex-[1_0_0]`，各占 `167.5`。
         * Button 的 `block` 用的是 `alignSelf: 'stretch'`，在横向容器里只拉高度不拉宽度，
         * 所以等宽分配必须由父级 slot 承担 —— 与 PageTemplate 的 `actionSlot` 一致。
         */}
        <View style={[styles.footer, { paddingBottom: footerPadding + bottomInset }]}>
          <View style={styles.actionSlot}>
            <Button block onPress={() => setDraft([])} shape="round" size="large" theme="light">
              重置
            </Button>
          </View>
          <View style={styles.actionSlot}>
            <Button
              block
              onPress={() => onConfirm(draft)}
              shape="round"
              size="large"
              theme="primary"
            >
              确认
            </Button>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

/**
 * 全选控件。设计系统 `Checkbox` 的 mixed 态要求 `checked` 同时为 `true`
 * （`{ checked: true; indeterminate: true }`），所以按状态分两个分支渲染，
 * 而不是用展开语法绕过判别联合。
 */
function SelectAllCheckbox({
  allSelected,
  onToggle,
  someSelected,
}: {
  allSelected: boolean;
  onToggle: () => void;
  someSelected: boolean;
}) {
  const mixed = someSelected && !allSelected;

  if (mixed) {
    return (
      <Checkbox
        accessibilityLabel="全选故障代码，已选择部分"
        checked
        iconTheme="checkCircle"
        indeterminate
        label="全选"
        onChange={onToggle}
        variant="inline"
      />
    );
  }

  return (
    <Checkbox
      accessibilityLabel="全选故障代码"
      checked={allSelected}
      iconTheme="checkCircle"
      label="全选"
      onChange={onToggle}
      variant="inline"
    />
  );
}

const colors = colorThemes.light;

/** Figma `20340:8842`：close-M 在标题行内的图形尺寸。 */
const closeIconSize = 24;

/** 面板高度上限，沿用 Figma `650 / 812` 的占屏比例。 */
const maxSheetRatio = 650 / 812;

/** Figma `20340:8864`：footer 四边内边距，底部再叠加安全区。 */
const footerPadding = 16;

/** Web 预览的 Home Indicator 高度，与 Figma iOS 基准一致。 */
const webBottomSafeArea = 34;

const styles = StyleSheet.create({
  popup: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: colors.background.container,
    overflow: 'hidden',
  },
  /** 26 行高 + 上内边距 16，标题与标签网格之间再留 36（Figma 标签起始 y=78）。 */
  title: {
    minHeight: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  titleLabel: {
    color: colors.text.primary,
    textAlign: 'center',
    ...typographyTokens.title18Semibold,
  },
  close: {
    position: 'absolute',
    top: 1,
    right: 0,
    height: closeIconSize,
    width: closeIconSize,
  },
  grid: { flexGrow: 0, flexShrink: 1 },
  gridContent: { gap: 12, paddingTop: 36, paddingBottom: 16, paddingHorizontal: 16 },
  /** 批量操作行，与下方网格保持 12 的行间距；两个入口左对齐成一组。 */
  bulkRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12 },
  /**
   * Figma `20341:9147`：`flex-[1_0_0]` + `min-w-88` + `max-w-106`。
   * `flexBasis` 取最小宽度，让 `343` 的内容宽度在 `12` 间距下稳定排 3 列
   * （3 × 88 + 2 × 12 = 288 ≤ 343），再由 `flexGrow` 补到上限 `106`
   * （3 × 106 + 2 × 12 = 342）。不按 `106` 写死宽度，窄屏时自然收缩。
   */
  tag: { flexBasis: 88, flexGrow: 1, flexShrink: 0, maxWidth: 106, minWidth: 88 },
  /** Figma `20340:8864`：p16、双按钮等宽、间距 8；底部内边距额外叠加安全区。 */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: footerPadding,
    paddingHorizontal: footerPadding,
    backgroundColor: colors.background.container,
  },
  actionSlot: { minWidth: 0, flex: 1 },
});
