import React, { useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
} from 'react-native';

import AddIcon from '../assets/add.svg';
import MoreChevronRight from '../assets/event-chevron-right.svg';
import BackChevron from '../assets/project-back.svg';
import {
  Dialog,
  Tag,
  colorThemes,
  componentTokens,
  radiusTokens,
  typographyTokens,
} from '@kone/mobile-design-system';
import { PreviewStatusBar, useMobileChromeInsets } from './mobileChrome';

const colors = colorThemes.light;

export type FaultMessageFilterGroupId =
  | 'liftLce'
  | 'liftKce'
  | 'liftGce'
  | 'escalator501'
  | 'escalatorKse'
  | 'dtu';

export type FaultMessageFilterGroup = {
  /** 该设备类型已过滤的全部故障代码，顺序即展示顺序。 */
  codes: readonly FaultCodeItem[];
  id: FaultMessageFilterGroupId;
  title: string;
};

type FaultCodeItem = { id: string; label: string };

/** `added` 区分品牌色的用户新增代码与既有代码。 */
type VisibleFaultCode = FaultCodeItem & { added: boolean };

export type FaultMessageFilterViewProps = {
  onBack: () => void;
};

/**
 * 各设备类型已过滤的故障代码。
 *
 * 设计稿（`20357:11013` 等 6 个代码区）里的 Tag 实例文案一律是占位的 `000`，
 * 没有给真实代码，因此这里按业务要求模拟数据：代码值均为原型模拟值，待接入真实
 * 故障代码表后替换。
 *
 * 除「直梯LCE」外每类 15–17 个（平均 16）；「直梯LCE」刻意放到 72 个，用来演示
 * 「更多」弹窗正文超高后只滚动正文、标题与底部按钮保持固定的那个 Dialog 变体。
 */
const groupCodeLabels: Record<FaultMessageFilterGroupId, readonly string[]> = {
  dtu: [
    '0701', '0708', '0714', '0721', '0727', '0733', '0740', '0746', '0753',
    '0759', '0766', '0772', '0779', '0785', '0791', '0798', '0805',
  ],
  escalator501: [
    '0501', '0507', '0513', '0520', '0526', '0533', '0539', '0546',
    '0552', '0558', '0565', '0571', '0578', '0584', '0590', '0597',
  ],
  escalatorKse: [
    '0602', '0609', '0615', '0622', '0628', '0634', '0641',
    '0647', '0654', '0660', '0667', '0673', '0680', '0686', '0693',
  ],
  liftGce: [
    '0302', '0308', '0315', '0321', '0327', '0334', '0340', '0347', '0353',
    '0359', '0366', '0372', '0379', '0385', '0391', '0398', '0404',
  ],
  liftKce: [
    '0203', '0209', '0214', '0221', '0228', '0235', '0241',
    '0248', '0254', '0261', '0267', '0273', '0280', '0286', '0292',
  ],
  liftLce: [
    '0101', '0102', '0103', '0105', '0106', '0107', '0109', '0110',
    '0111', '0113', '0114', '0115', '0117', '0118', '0119', '0121',
    '0122', '0123', '0125', '0126', '0127', '0129', '0130', '0131',
    '0133', '0134', '0135', '0137', '0138', '0139', '0141', '0142',
    '0143', '0145', '0146', '0147', '0149', '0150', '0151', '0153',
    '0154', '0155', '0157', '0158', '0159', '0161', '0162', '0163',
    '0165', '0166', '0167', '0169', '0170', '0171', '0173', '0174',
    '0175', '0177', '0178', '0179', '0181', '0182', '0183', '0185',
    '0186', '0187', '0189', '0190', '0191', '0193', '0194', '0195',
  ],
};

function groupCodes(groupId: FaultMessageFilterGroupId): readonly FaultCodeItem[] {
  return groupCodeLabels[groupId].map((label) => ({
    id: `${groupId}-${label}`,
    label,
  }));
}

/** Figma `20357:10672`：卡片列表固定 6 张，顺序与标题由设计稿定义。 */
const filterGroups: readonly FaultMessageFilterGroup[] = [
  { codes: groupCodes('liftLce'), id: 'liftLce', title: '直梯LCE故障过滤' },
  { codes: groupCodes('liftKce'), id: 'liftKce', title: '直梯KCE故障过滤' },
  { codes: groupCodes('liftGce'), id: 'liftGce', title: '直梯GCE故障过滤' },
  { codes: groupCodes('escalator501'), id: 'escalator501', title: '扶梯501故障过滤' },
  { codes: groupCodes('escalatorKse'), id: 'escalatorKse', title: '扶梯KSE故障过滤' },
  { codes: groupCodes('dtu'), id: 'dtu', title: 'DTU故障过滤' },
];

type AddedCodes = Partial<Record<FaultMessageFilterGroupId, readonly FaultCodeItem[]>>;

/** 导航栏高度，Figma `NavBar 导航栏 - mini program小程序`（`20357:10067`）。 */
const NAVBAR_HEIGHT = 48;
const BACK_ICON_SIZE = 24;
/** Figma：卡片列表顶边 `y=107`，导航栏底边 `y=94`。 */
const CONTENT_PADDING_TOP = 13;
/**
 * 「编辑」/「完成」按钮的几何取 Button `size=extraSmall`（28 高、8/3 内边距、
 * `radius/radius-medium`、`Body 14/Medium`），与 Figma 实例 `20357:11012` 一致。
 */
const editButtonTokens = componentTokens.button.sizes.extraSmall;
/**
 * 代码胶囊与「更多」入口共用的几何，取 Tag `size=large`
 * （28 高、10/3 内边距、16 图标、`contentGap 4`、`Body 14/22`）。
 */
const codeTagTokens = componentTokens.tag.sizes.large;
/**
 * 输入行几何，Figma `20357:11060`：行内间距 `8`，输入框与添加按钮同高 `32`。
 * 输入框为 1px `component-border` 描边 + `8/4` 内边距 + `radius/radius-medium`，
 * 其 `4 + 22 + 4 + 2×1` 正好等于 `32`，因此行高写成常量而不是让两者各自撑高。
 */
const INPUT_ROW_HEIGHT = 32;
const INPUT_ROW_GAP = 8;
const INPUT_BORDER_WIDTH = 1;
const INPUT_PADDING_HORIZONTAL = 8;
const INPUT_PADDING_VERTICAL = 4;
/**
 * 激活态描边宽度，China Design System for Mobile 的 Input「Extension 特殊样式」
 * `state=action` / `state=fill`（节点 `21305:792` / `21305:800`）：
 * `1.5` 品牌色描边 + `Light/Shadow/1` 投影 + 品牌色光标。尺寸保持本页的
 * `32` 高与 `8/4` 内边距不变，只换激活态的描边、投影与光标。
 */
const INPUT_FOCUSED_BORDER_WIDTH = 1.5;
/**
 * RN 的 `height` 含描边（border-box），描边从 `1` 加粗到 `1.5` 会把内容区压掉 `1`，
 * 刚好不够 `22` 行高 + `8` 内边距。内边距同步各减 `0.5`，文字位置与行高都不跳变。
 */
const INPUT_FOCUSED_PADDING_OFFSET = INPUT_FOCUSED_BORDER_WIDTH - INPUT_BORDER_WIDTH;
/** `Light/Shadow/1`：`0 2 5 rgba(0, 0, 0, 0.1)`，spread 0。 */
const INPUT_FOCUSED_SHADOW = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  /** Android 没有等价的 offset/radius 组合，用 `elevation` 近似同一层级。 */
  elevation: 2,
} as const;
/**
 * Web 端浏览器会给聚焦的 input 画一圈默认 focus ring（Chrome 下呈黄色描边），
 * 与规范的激活态冲突。规范的激活态已经由 `1.5` 品牌色描边 + 投影表达，因此在
 * Web 上关掉 UA 的 outline。`outlineStyle` 是 react-native-web 的 Web 专有样式，
 * RN 的 `TextStyle` 没有这个键，所以单独声明并断言类型，不把它混进共用样式表。
 */
const webFocusRingReset = Platform.OS === 'web'
  ? ({ outlineStyle: 'none' } as unknown as TextStyle)
  : undefined;
/** Figma `20357:11064`：`32×32` 品牌色方形按钮，内含 `18×18` 的 `add` 图标。 */
const ADD_BUTTON_SIZE = 32;
const ADD_ICON_SIZE = 18;
/** Figma `20357:11062` 的 Placeholder 文案。 */
const CODE_INPUT_PLACEHOLDER = '输入故障代码如0000';
/** 卡片内容行间距，Figma `20357:11009`。 */
const CARD_ROW_GAP = 6;
/**
 * 编辑态下输入行与代码行之间的间距。比其他行距松一档，把「输入新代码」和
 * 「已有代码列表」在视觉上分开；设计稿这一段是 `16`，按设计确认收到 `12`。
 */
const INPUT_TO_CODE_ROW_GAP = 12;
/** Figma `20357:11013`：代码胶囊的行列间距均为 `4`。 */
const CODE_TAG_GAP = 4;
/** 代码区最多两排；排满后其余代码归到「更多」。 */
const MAX_CODE_ROWS = 2;
/**
 * `14px` PingFang SC Regular 下单个数字的字宽。取自 Figma：`000` 胶囊宽 `46`，
 * 减去左右各 `10` 的内边距得 `26`，即每位 `26 / 3`。
 */
const CODE_DIGIT_ADVANCE = 26 / 3;
/** 「更多」两个汉字在 `14px` 下的宽度。取自 Figma 的 `64` 宽胶囊：`10 + 28 + 2 + 16 + 8`。 */
const MORE_LABEL_WIDTH = 28;
/** 代码区在 `375` 基准画布上的可用宽度（卡片 `343` 减去左右各 `12` 内边距），用于首帧测量前兜底。 */
const CODE_AREA_BASELINE_WIDTH = 319;

/**
 * 既有故障代码胶囊。
 *
 * 几何与底色完全对齐 Tag `size=large` + `theme=default` + `variant=light`
 * （28 高、`10/3` 内边距、`radius/radius-circle`、`bg-color-component` 底），
 * 只有文案色降了一档：用 `text-color-secondary` 而不是 Tag 常态的
 * `text-color-primary`。
 *
 * 之所以没有直接用 `Tag` 组件：Tag 的配色矩阵由 Figma 固定，`theme=default` 只有
 * 常态（`text-color-primary`）和 disabled（`text-color-disabled`）两档，拿不到
 * `text-color-secondary`，而组件规则不允许在组件内覆盖前景色。设计规范对这种情况
 * 的指引正是「在页面侧按 Tag 的几何 token 实现并显式登记偏离」（见 design-system.md
 * 的 Tag 组件规则），该偏离已登记在 Tag 的「项目实现现状」里。
 */
function FaultCodeTag({ label }: { label: string }) {
  return (
    <View style={styles.codePill}>
      <Text style={styles.codePillLabel}>{label}</Text>
    </View>
  );
}

/** 胶囊宽度 = 左右内边距 + 文案宽度（+ 可删除时的 close 槽）。 */
function codeTagWidth(code: VisibleFaultCode, closable: boolean) {
  const closeSlot = closable ? codeTagTokens.closeGap + codeTagTokens.iconSize : 0;
  return codeTagTokens.paddingHorizontal * 2 + code.label.length * CODE_DIGIT_ADVANCE + closeSlot;
}

const moreEntryWidth = codeTagTokens.paddingHorizontal * 2
  + MORE_LABEL_WIDTH
  + codeTagTokens.contentGap
  + codeTagTokens.iconSize;

/**
 * 把代码按可用宽度贪心排进最多 `MAX_CODE_ROWS` 排，并在最后一排给「更多」留出位置。
 *
 * 之所以自己算而不是交给 `flexWrap`：「最多两排 + 第二排末尾是更多」这条规则需要知道
 * 哪些代码放不下，`flexWrap` 只会一直往下换行。宽度用 Tag 的几何 token 加字宽推算，
 * 可用宽度由代码区实测得到，所以换屏宽也成立。
 */
function layoutCodeRows(
  codes: readonly VisibleFaultCode[],
  availableWidth: number,
  closable: boolean,
): readonly (readonly VisibleFaultCode[])[] {
  const rows: VisibleFaultCode[][] = [];
  let current: VisibleFaultCode[] = [];
  let used = 0;

  for (const code of codes) {
    // 只有最后一排需要给「更多」留位置。
    const onLastRow = rows.length === MAX_CODE_ROWS - 1;
    const reserved = onLastRow ? CODE_TAG_GAP + moreEntryWidth : 0;
    const width = codeTagWidth(code, closable && code.added);
    const nextUsed = current.length === 0 ? width : used + CODE_TAG_GAP + width;

    if (nextUsed + reserved <= availableWidth) {
      current.push(code);
      used = nextUsed;
      continue;
    }

    // 一个都放不下说明可用宽度异常，直接收口避免空转。
    if (current.length === 0) break;

    rows.push(current);
    if (rows.length >= MAX_CODE_ROWS) return rows;
    current = [];
    used = 0;
  }

  if (current.length > 0) rows.push(current);
  return rows.length > 0 ? rows : [[]];
}

/**
 * 「故障消息过滤设置」页（Figma `20357:10041`，编辑态 `20357:10840` / `20357:11030`，
 * 完成后 `20360:11203`）。
 *
 * 该页有返回入口但没有底部按钮操作区，不符合 Page Template 的模板边界
 * （`footer` 为必填），因此与帮助中心一样自行组合导航栏 + 滚动内容区。
 *
 * 结构：导航栏 + 6 张设备类型卡片。卡片默认只读（标题 + 编辑 + 代码胶囊行）；
 * 点「编辑」后该卡片进入编辑态，标题行按钮变「完成」，标题与代码行之间插入
 * 「输入框 + 添加按钮」，新增的代码以品牌色胶囊排在代码行最前面并可删除。
 */
export function FaultMessageFilterView({ onBack }: FaultMessageFilterViewProps) {
  const { bottomInset, isWebPreview, topInset } = useMobileChromeInsets();
  /**
   * 设计稿只画了「单张卡片处于编辑态」，没有定义多张卡片同时编辑的版式，
   * 因此同一时刻只允许一张卡片进入编辑态；切换卡片时丢弃未提交的输入草稿。
   */
  const [editingGroupId, setEditingGroupId] = useState<FaultMessageFilterGroupId | null>(null);
  const [draftCode, setDraftCode] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [addedCodes, setAddedCodes] = useState<AddedCodes>({});
  /** 代码区实测可用宽度；6 张卡片同宽，测到一次就够。 */
  const [codeAreaWidth, setCodeAreaWidth] = useState(0);
  /** 正在用「更多」弹窗查看全部代码的类别。 */
  const [moreGroupId, setMoreGroupId] = useState<FaultMessageFilterGroupId | null>(null);
  const addedSeq = useRef(0);

  const startEditing = (groupId: FaultMessageFilterGroupId) => {
    setEditingGroupId(groupId);
    setDraftCode('');
    setInputFocused(false);
  };
  const finishEditing = () => {
    setEditingGroupId(null);
    setDraftCode('');
    setInputFocused(false);
  };

  const trimmedDraft = draftCode.trim();
  const canAdd = trimmedDraft.length > 0;

  const addCode = (groupId: FaultMessageFilterGroupId) => {
    if (!canAdd) return;

    const existing = addedCodes[groupId] ?? [];
    // 设计稿没有定义重复代码的提示态，这里直接忽略重复输入而不臆造错误样式。
    if (existing.some((code) => code.label === trimmedDraft)) {
      setDraftCode('');
      return;
    }

    addedSeq.current += 1;
    const added: FaultCodeItem = {
      id: `${groupId}-added-${addedSeq.current}`,
      label: trimmedDraft,
    };
    // 「新增的故障代码始终在最前面」，多个新增之间按最近添加优先。
    setAddedCodes((previous) => ({ ...previous, [groupId]: [added, ...existing] }));
    setDraftCode('');
  };

  const removeCode = (groupId: FaultMessageFilterGroupId, codeId: string) => {
    setAddedCodes((previous) => ({
      ...previous,
      [groupId]: (previous[groupId] ?? []).filter((code) => code.id !== codeId),
    }));
  };

  const moreGroup = filterGroups.find((group) => group.id === moreGroupId);
  /** 弹窗里的顺序与卡片一致：新增代码在前。 */
  const moreGroupCodes: readonly VisibleFaultCode[] = moreGroup
    ? [
      ...(addedCodes[moreGroup.id] ?? []).map((code) => ({ ...code, added: true })),
      ...moreGroup.codes.map((code) => ({ ...code, added: false })),
    ]
    : [];

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor={colors.background.container} barStyle="dark-content" />
      <View style={[styles.topChrome, { paddingTop: topInset }]}>
        {isWebPreview ? <PreviewStatusBar /> : null}
        <View style={styles.navbar}>
          <Pressable
            accessibilityLabel="返回更多操作"
            accessibilityRole="button"
            hitSlop={12}
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <BackChevron
              accessibilityElementsHidden
              height={BACK_ICON_SIZE}
              importantForAccessibility="no-hide-descendants"
              width={BACK_ICON_SIZE}
            />
          </Pressable>
          <Text accessibilityRole="header" style={styles.navTitle}>故障消息过滤设置</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: CONTENT_PADDING_TOP + bottomInset }]}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        {filterGroups.map((group) => {
          const editing = editingGroupId === group.id;
          const added = addedCodes[group.id] ?? [];
          // 新增代码始终排在最前面，再按可用宽度排进最多两排。
          const codeRows = layoutCodeRows(
            [
              ...added.map((code) => ({ ...code, added: true })),
              ...group.codes.map((code) => ({ ...code, added: false })),
            ],
            codeAreaWidth > 0 ? codeAreaWidth : CODE_AREA_BASELINE_WIDTH,
            editing,
          );

          return (
            <View key={group.id} style={styles.card}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>{group.title}</Text>
                {/**
                 * Figma 用 Button 的文字形态（白底 + 品牌色文案）承载「编辑」/「完成」，
                 * 而共享 Button 目前只开放 `theme=default|light|primary`，没有 `variant=text`，
                 * 因此这里用 Pressable 实现，几何与排版仍取 Button `extraSmall` 的 token。
                 * 设计稿未定义该形态的按压态，按惯例不自行补视觉反馈。
                 */}
                <Pressable
                  accessibilityHint={editing
                    ? `结束编辑${group.title}`
                    : `编辑${group.title}包含的故障代码`}
                  accessibilityLabel={editing ? '完成' : '编辑'}
                  accessibilityRole="button"
                  onPress={() => (editing ? finishEditing() : startEditing(group.id))}
                  style={styles.editButton}
                >
                  <Text style={styles.editLabel}>{editing ? '完成' : '编辑'}</Text>
                </Pressable>
              </View>

              {editing ? (
                /**
                 * Figma `20357:11060`。设计系统目前没有 Input 组件，输入框的描边、
                 * 内边距与 placeholder 配色直接取自该节点并映射到语义 token。
                 * 添加按钮是 `32×32` 的品牌色方形按钮，对应 Button 的 `size=small`
                 * + `shape=square`，而共享 Button 只开放 `extraSmall`（28）与
                 * `medium`（40），因此同样在页面侧按节点几何实现。
                 */
                <View style={styles.inputRow}>
                  <TextInput
                    accessibilityLabel="故障代码"
                    /** 规范里的「输入线」就是文本光标，用品牌色着色而不是额外画一条线。 */
                    cursorColor={colors.brand.default}
                    onBlur={() => setInputFocused(false)}
                    onChangeText={setDraftCode}
                    onFocus={() => setInputFocused(true)}
                    onSubmitEditing={() => addCode(group.id)}
                    placeholder={CODE_INPUT_PLACEHOLDER}
                    placeholderTextColor={colors.text.placeholder}
                    returnKeyType="done"
                    selectionColor={colors.brand.default}
                    style={[
                      styles.codeInput,
                      inputFocused && styles.codeInputFocused,
                      webFocusRingReset,
                    ]}
                    value={draftCode}
                  />
                  {/**
                   * 设计稿只给出了空输入框搭配品牌色按钮的形态，没有定义禁用态，
                   * 因此按钮始终保持品牌色；输入为空时点击不产生新增。
                   */}
                  <Pressable
                    accessibilityHint={`把输入的故障代码加入${group.title}`}
                    accessibilityLabel="添加故障代码"
                    accessibilityRole="button"
                    onPress={() => addCode(group.id)}
                    style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
                  >
                    <AddIcon
                      accessibilityElementsHidden
                      color={colors.text.white}
                      height={ADD_ICON_SIZE}
                      importantForAccessibility="no-hide-descendants"
                      width={ADD_ICON_SIZE}
                    />
                  </Pressable>
                </View>
              ) : null}

              <View
                onLayout={({ nativeEvent }) => {
                  const { width } = nativeEvent.layout;
                  if (width > 0 && width !== codeAreaWidth) setCodeAreaWidth(width);
                }}
                style={[styles.codeArea, editing && styles.codeAreaEditing]}
              >
                {codeRows.map((row, rowIndex) => (
                  // 排是位置性的，序号即稳定标识；代码本身仍用自己的 id 作 key。
                  <View key={`row-${rowIndex}`} style={styles.codeRow}>
                    <View style={styles.codeRowFill}>
                      {/**
                       * 新增代码用 Tag 的 `theme=primary` + `variant=light`（品牌浅底 +
                       * 品牌色文字，Figma `20360:11365` / `20360:11408`）。编辑态带 close
                       * 槽可删除，完成后同一枚胶囊转为只读，始终排在既有代码前面。
                       *
                       * 既有代码用 `FaultCodeTag`：几何与底色同 Tag `variant=light`，文案色
                       * 降一档到 `text-color-secondary`。设计稿里这些实例给的是 disabled 态，
                       * 已与设计确认改掉：代码是正常的展示内容，不是不可用项。
                       */}
                      {row.map((code) => (
                        code.added ? (
                          editing ? (
                            <Tag
                              closable
                              closeAccessibilityLabel={`从${group.title}移除故障代码 ${code.label}`}
                              key={code.id}
                              label={code.label}
                              onClose={() => removeCode(group.id, code.id)}
                              shape="round"
                              size="large"
                              theme="primary"
                            />
                          ) : (
                            <Tag key={code.id} label={code.label} shape="round" size="large" theme="primary" />
                          )
                        ) : (
                          <FaultCodeTag key={code.id} label={code.label} />
                        )
                      ))}
                    </View>

                    {/**
                     * 「更多」固定收在最后一排的末尾，点击后用 Dialog 展示该类别全部代码。
                     *
                     * Figma 用 Tag 实例承载它并把 close 槽换成 chevron-right，而 Tag 按设计
                     * 系统规则是只读容器、不开放自定义尾部图标，也不能整体暴露为按钮，因此
                     * 这里用 Pressable 自行组合，几何与配色都复用 Tag `size=large` 的
                     * `theme=default` + `variant=light` 常态，与同排代码胶囊保持一致。
                     */}
                    {rowIndex === codeRows.length - 1 ? (
                      <Pressable
                        accessibilityHint={`查看${group.title}的全部故障代码`}
                        accessibilityLabel="更多"
                        accessibilityRole="button"
                        onPress={() => setMoreGroupId(group.id)}
                        style={({ pressed }) => [styles.codePill, styles.moreEntry, pressed && styles.pressed]}
                      >
                        <Text style={styles.codePillLabel}>更多</Text>
                        <MoreChevronRight
                          accessibilityElementsHidden
                          color={colors.text.secondary}
                          height={codeTagTokens.iconSize}
                          importantForAccessibility="no-hide-descendants"
                          width={codeTagTokens.iconSize}
                        />
                      </Pressable>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/**
       * 「更多」弹窗：展示该类别全部故障代码。
       *
       * 用设计系统 Dialog 的「无关闭按钮 + 正文独立滚动 + 单确认按钮」变体
       * （Figma `27360:22420`，footer 为 `27360:21891`）：标题与 footer 固定，正文
       * 超出时只滚动正文。代码胶囊沿用卡片里的同一套样式，不另造。
       */}
      <Dialog
        description={moreGroup ? `共 ${moreGroupCodes.length} 个故障代码` : undefined}
        footer={{
          buttonTheme: 'base',
          confirm: { label: '知道了', onPress: () => setMoreGroupId(null) },
        }}
        onClose={() => setMoreGroupId(null)}
        showCloseButton={false}
        title={moreGroup?.title ?? ''}
        visible={moreGroup !== undefined}
      >
        <View style={styles.dialogCodeGrid}>
          {moreGroupCodes.map((code) => (
            code.added
              ? <Tag key={code.id} label={code.label} shape="round" size="large" theme="primary" />
              : <FaultCodeTag key={code.id} label={code.label} />
          ))}
        </View>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background.page },
  topChrome: { position: 'relative', backgroundColor: colors.background.container },
  navbar: { height: NAVBAR_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  navTitle: { color: colors.text.primary, ...typographyTokens.title18Semibold },
  backButton: {
    position: 'absolute',
    left: 12,
    width: 32,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 1,
  },
  backButtonPressed: { backgroundColor: colors.background.component },
  scroll: { flex: 1 },
  /** Figma：卡片宽 `343`（左右边距 16）、卡片间距 `8`。底部留白沿用顶部节奏并让开安全区。 */
  scrollContent: {
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: CONTENT_PADDING_TOP,
  },
  /**
   * Figma `20357:11009`：白底卡片，内边距 `12/8`、内容间距 `6`、`radius/radius-medium`，
   * 只读态卡片高 `78`。
   *
   * 设计稿的编辑态卡片（`20357:11056`）与完成后的卡片（`20360:11398`）给的是
   * `12` 上 / `16` 下内边距、`16` 内容间距，已与设计确认属于设计稿失误：三种状态
   * 共用同一套卡片间距，编辑态只是多插入一行输入行（卡片高 `116`）。
   */
  card: {
    gap: CARD_ROW_GAP,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radiusTokens.medium,
    backgroundColor: colors.background.container,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { minWidth: 0, flex: 1, color: colors.text.primary, ...typographyTokens.title16Medium },
  editButton: {
    minHeight: editButtonTokens.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: editButtonTokens.paddingHorizontal,
    paddingVertical: editButtonTokens.paddingVertical,
    borderRadius: editButtonTokens.radius,
    backgroundColor: colors.background.container,
  },
  editLabel: { color: colors.text.brand, textAlign: 'center', ...typographyTokens.body14Medium },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: INPUT_ROW_GAP },
  /**
   * Figma 把输入框画成固定 `271` 宽，右侧与添加按钮之间多出 `8` 的空隙，判断为
   * 手动改宽的残留，这里让输入框占满剩余宽度以适应不同屏宽。
   */
  codeInput: {
    minWidth: 0,
    flex: 1,
    height: INPUT_ROW_HEIGHT,
    paddingHorizontal: INPUT_PADDING_HORIZONTAL,
    paddingVertical: INPUT_PADDING_VERTICAL,
    borderWidth: INPUT_BORDER_WIDTH,
    borderColor: colors.border.componentBorder,
    borderRadius: radiusTokens.medium,
    backgroundColor: colors.background.container,
    color: colors.text.primary,
    ...typographyTokens.body14Regular,
  },
  /**
   * 激活态（Input「Extension 特殊样式」`state=action` / `state=fill`）：
   * 描边换成 `1.5` 的品牌色并叠加 `Light/Shadow/1`，内边距同步补偿 `0.5`。
   */
  codeInputFocused: {
    paddingHorizontal: INPUT_PADDING_HORIZONTAL - INPUT_FOCUSED_PADDING_OFFSET,
    paddingVertical: INPUT_PADDING_VERTICAL - INPUT_FOCUSED_PADDING_OFFSET,
    borderWidth: INPUT_FOCUSED_BORDER_WIDTH,
    borderColor: colors.brand.default,
    ...INPUT_FOCUSED_SHADOW,
  },
  addButton: {
    width: ADD_BUTTON_SIZE,
    height: ADD_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radiusTokens.medium,
    backgroundColor: colors.brand.default,
  },
  /** 设计稿未给该实例的按压态，沿用 Button `theme=primary` 已定义的按压底色。 */
  addButtonPressed: { backgroundColor: colors.brand.active },
  /** Figma `20357:11013`：代码区行间距 `4`，最多两排。 */
  codeArea: { gap: CODE_TAG_GAP },
  /** 卡片用统一的 `gap` 排行，这里只把输入行与代码区之间补到 `INPUT_TO_CODE_ROW_GAP`。 */
  codeAreaEditing: { marginTop: INPUT_TO_CODE_ROW_GAP - CARD_ROW_GAP },
  codeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: CODE_TAG_GAP },
  /**
   * 代码按实测宽度排好后本来就不会溢出；这里仍然只让这一段可收缩并裁切，
   * 保证即使某个代码比按字宽推算的更长，被挤掉的也是代码而不是「更多」。
   */
  codeRowFill: {
    minWidth: 0,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: CODE_TAG_GAP,
    overflow: 'hidden',
  },
  /** 代码胶囊与「更多」入口共用的容器：几何与底色同 Tag `size=large` + `variant=light`。 */
  codePill: {
    minHeight: codeTagTokens.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: codeTagTokens.paddingHorizontal,
    paddingVertical: codeTagTokens.paddingVertical,
    borderRadius: radiusTokens.tagRound,
    backgroundColor: colors.background.component,
  },
  /** 比 Tag 常态的 `text-color-primary` 低一档，用 `text-color-secondary`。 */
  codePillLabel: { color: colors.text.secondary, textAlign: 'center', ...typographyTokens.body14Regular },
  /** 「更多」比代码胶囊多一个尾部 chevron，间距取 Tag 的 `contentGap`。 */
  moreEntry: { gap: codeTagTokens.contentGap },
  /** 与设备事件面板的「更多」入口一致：Figma 未定义按压态，沿用项目既有的压暗反馈。 */
  pressed: { opacity: 0.72 },
  /** 弹窗里展示全部代码，不受卡片「最多两排」的约束，自由换行。 */
  dialogCodeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    columnGap: CODE_TAG_GAP,
    rowGap: CODE_TAG_GAP,
  },
});
