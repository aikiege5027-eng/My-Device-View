import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import BackChevron from '../assets/project-back.svg';
import {
  BottomSheet,
  Dialog,
  Fab,
  Picker,
  Progress,
  SideBar,
  colorThemes,
  typographyTokens,
  type PickerColumns,
  type SideBarItem,
} from '@kone/mobile-design-system';
import { UploadIcon } from './icons';
import { LocalFilePickerView, type LocalFile } from './LocalFilePickerView';
import { PreviewStatusBar, useMobileChromeInsets } from './mobileChrome';

const colors = colorThemes.light;

export type HelpCenterCategoryId = 'overview' | 'features' | 'faq' | 'cases';

export type HelpCenterViewProps = {
  onBack: () => void;
  onOpenResource: (resource: { category: HelpCenterCategoryId; name: string }) => void;
};

/** Figma `17715:16546`：侧边栏固定 4 个分类，文案与顺序由设计稿定义。 */
const categories: readonly SideBarItem<HelpCenterCategoryId>[] = [
  { id: 'overview', label: '使用概述', value: 'overview' },
  { id: 'features', label: '主要功能', value: 'features' },
  { id: 'faq', label: '常见问题', value: 'faq' },
  { id: 'cases', label: '案例分享', value: 'cases' },
];

const UPLOAD_CATEGORY_COLUMN_ID = 'uploadCategory';

/**
 * 上传分类选择复用设计系统 Picker 的「1 列 + 带标题」变体（Figma `27222:18480`）。
 * 选项直接取自上面的分类表，保证与侧边栏分类始终一致。
 */
const uploadCategoryColumns: PickerColumns<HelpCenterCategoryId> = [
  {
    accessibilityLabel: '上传分类',
    id: UPLOAD_CATEGORY_COLUMN_ID,
    options: categories.map(({ label, value }) => ({ id: value, label, value })),
  },
];

function categoryLabelOf(id: HelpCenterCategoryId) {
  return categories.find((category) => category.value === id)?.label ?? '';
}

type HelpResource = { id: string; name: string };

/**
 * 各分类的初始资源列表。设计稿只给出「使用概述」的 4 条 `文件名称.mp4`，
 * 其余三个分类沿用同一种链接形态，条数为原型占位值，待设计补充真实内容。
 */
const initialResources: Record<HelpCenterCategoryId, readonly HelpResource[]> = {
  cases: placeholders('cases', 2),
  faq: placeholders('faq', 5),
  features: placeholders('features', 3),
  overview: placeholders('overview', 4),
};

function placeholders(category: HelpCenterCategoryId, count: number): readonly HelpResource[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${category}-${index}`,
    name: '文件名称.mp4',
  }));
}

/** 模拟的手机本地文件清单，由 `LocalFilePickerView` 这个模拟页面展示。 */
const localFiles: readonly LocalFile[] = [
  { id: 'guideline', kind: 'MP4', modifiedAt: '2026-10-08', name: 'Guideline.mp4', size: '42.6 MB' },
  { id: 'manual', kind: 'PDF', modifiedAt: '2026-09-30', name: '安装手册.pdf', size: '8.1 MB' },
  { id: 'inspection', kind: 'MP4', modifiedAt: '2026-09-22', name: '巡检要点.mp4', size: '126.4 MB' },
  { id: 'faq', kind: 'DOCX', modifiedAt: '2026-09-15', name: '常见问题汇总.docx', size: '640 KB' },
];

/** 导航栏高度，Figma `NavBar 导航栏 - mini program小程序`（`17715:16568`）。 */
const NAVBAR_HEIGHT = 48;
const BACK_ICON_SIZE = 24;
/**
 * 链接行视觉高度 22、行间距 16（行距 38）。在这个节距下无法再撑到 44 的推荐触控
 * 尺寸，这里用 hitSlop 吃满整段行距（22 + 8 × 2 = 38），既无死区也不互相重叠。
 */
const RESOURCE_HIT_SLOP = { bottom: 8, left: 16, right: 16, top: 8 };
/**
 * 悬浮按钮与屏幕右下角的间距。Fab 节点只定义按钮本体，没有定义页面内的吸附位置，
 * 这里沿用本页 `16` 的横向边距节奏，底部再让开安全区。
 */
const FAB_INSET = 16;
/** 上传进度演示的推进节奏，Figma 未定义，属于原型模拟值。 */
const UPLOAD_TICK_MS = 240;
const UPLOAD_TICK_PERCENT = 12;
/**
 * 进度满格后停留的时长。远程呼梯的设计稿把「进度条跑满并转成功态」和「结果页」
 * 画成两帧（`19721:216020` / `19721:216035`），这里留出这段时间展示满格的成功态。
 */
const UPLOAD_SETTLE_MS = 700;

/** 上传流程：选分类 → 选本地文件 → 进度 → 成功。 */
type UploadFlow =
  | { step: 'idle' }
  | { step: 'category' }
  | { category: HelpCenterCategoryId; step: 'file' }
  | { category: HelpCenterCategoryId; fileName: string; percent: number; step: 'uploading' }
  | { category: HelpCenterCategoryId; fileName: string; step: 'done' };

export function HelpCenterView({ onBack, onOpenResource }: HelpCenterViewProps) {
  const { bottomInset, isWebPreview, topInset } = useMobileChromeInsets();
  const [category, setCategory] = useState<HelpCenterCategoryId>('overview');
  const [resources, setResources] = useState(initialResources);
  const [flow, setFlow] = useState<UploadFlow>({ step: 'idle' });
  /** Picker 滚动过程中的临时选择，Confirm 前不提交。 */
  const [draftUploadCategory, setDraftUploadCategory] = useState<HelpCenterCategoryId>('overview');
  const uploadSeq = useRef(0);

  const uploading = flow.step === 'uploading';

  // 进度推进、满格停留与完成后落库都挂在这一个 effect 上，避免散落的定时器。
  useEffect(() => {
    if (flow.step !== 'uploading') return undefined;

    const { category: target, fileName, percent } = flow;

    if (percent >= 100) {
      // 进度已满格，停留一下展示成功态进度条，再切到结果页。
      const settleTimer = setTimeout(() => {
        uploadSeq.current += 1;
        const uploaded: HelpResource = { id: `uploaded-${uploadSeq.current}`, name: fileName };
        setResources((previous) => ({
          ...previous,
          [target]: [...previous[target], uploaded],
        }));
        setFlow({ category: target, fileName, step: 'done' });
      }, UPLOAD_SETTLE_MS);

      return () => clearTimeout(settleTimer);
    }

    const tickTimer = setTimeout(() => {
      setFlow({
        category: target,
        fileName,
        percent: Math.min(100, percent + UPLOAD_TICK_PERCENT),
        step: 'uploading',
      });
    }, UPLOAD_TICK_MS);

    return () => clearTimeout(tickTimer);
  }, [flow]);

  const openUploadPicker = () => {
    // 默认落在当前正在浏览的分类上。
    setDraftUploadCategory(category);
    setFlow({ step: 'category' });
  };
  const closeFlow = () => setFlow({ step: 'idle' });

  const visibleResources = resources[category];

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
          <Text accessibilityRole="header" style={styles.navTitle}>帮助中心</Text>
        </View>
      </View>

      <View style={styles.body}>
        <SideBar<HelpCenterCategoryId>
          accessibilityLabel="帮助中心分类"
          items={categories}
          onChange={setCategory}
          testID="help-center-sidebar"
          value={category}
        />
        <ScrollView
          contentContainerStyle={styles.resourceList}
          showsVerticalScrollIndicator={false}
          style={styles.resourcePane}
        >
          {visibleResources.map((resource) => (
            <Pressable
              accessibilityHint="打开该文件"
              accessibilityRole="link"
              hitSlop={RESOURCE_HIT_SLOP}
              key={resource.id}
              onPress={() => onOpenResource({ category, name: resource.name })}
              style={styles.resourceRow}
            >
              <Text style={styles.resourceName}>{resource.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Fab
        accessibilityHint="选择要上传到的分类"
        accessibilityLabel="上传"
        onPress={openUploadPicker}
        renderIcon={({ color, size }) => <UploadIcon color={color} size={size} />}
        style={[styles.fab, { bottom: FAB_INSET + bottomInset }]}
        testID="help-center-upload-fab"
      />

      {/* 第 1 步：选分类。Picker 面板自带顶部圆角，宿主必须不铺底色。 */}
      <BottomSheet
        dismissAccessibilityLabel="关闭上传分类选择"
        onRequestClose={closeFlow}
        surface="transparent"
        visible={flow.step === 'category'}
      >
        <Picker<HelpCenterCategoryId>
          cancelText="取消"
          columns={uploadCategoryColumns}
          confirmText="下一步"
          onCancel={closeFlow}
          onChange={(next) => {
            setDraftUploadCategory(next[UPLOAD_CATEGORY_COLUMN_ID] ?? category);
          }}
          onConfirm={(values) => {
            setFlow({ category: values[UPLOAD_CATEGORY_COLUMN_ID] ?? category, step: 'file' });
          }}
          testID="help-center-upload-picker"
          title
          titleText="选择上传分类"
          value={{ [UPLOAD_CATEGORY_COLUMN_ID]: draftUploadCategory }}
        />
        {/* Picker 面板不含安全区，用同底色的留白把白底延伸到 Home Indicator。 */}
        <View style={[styles.sheetSafeArea, { height: bottomInset }]} />
      </BottomSheet>

      {/*
        第 3 步：上传进度。参照远程呼梯的进程页（Figma `19721:216005` / `19721:216020`）：
        居中的标题 + Progress + 次要状态行，进度满格后进度条转成功态，期间不提供关闭入口。
      */}
      <Dialog
        description={(
          <View style={styles.uploadProgressBody}>
            <Progress
              accessibilityLabel="上传进度"
              percent={flow.step === 'uploading' ? flow.percent : 0}
              status={flow.step === 'uploading' && flow.percent >= 100 ? 'success' : 'active'}
              testID="help-center-upload-progress"
            />
            <Text style={styles.uploadStatusLine}>
              {flow.step === 'uploading' ? flow.fileName : ''}
            </Text>
          </View>
        )}
        onClose={closeFlow}
        showCloseButton={false}
        title="正在上传"
        visible={uploading}
      />

      {/*
        第 4 步：结果页。参照远程呼梯的结果页（Figma `19721:216035`）：
        标题 + 居中描述 + 单个确认按钮。
      */}
      <Dialog
        description={flow.step === 'done'
          ? `${flow.fileName} 已上传到「${categoryLabelOf(flow.category)}」，可在该分类的文件列表中查看。`
          : undefined}
        footer={{
          buttonTheme: 'base',
          confirm: {
            label: '完成',
            // 完成后切到上传目标分类，让新文件直接出现在列表里。
            onPress: () => {
              if (flow.step === 'done') setCategory(flow.category);
              closeFlow();
            },
          },
        }}
        onClose={closeFlow}
        showCloseButton={false}
        title="上传成功"
        visible={flow.step === 'done'}
      />

      {/* 第 2 步：浏览手机本地文件。占满屏幕的模拟页面，盖在帮助中心之上。 */}
      {flow.step === 'file' ? (
        <LocalFilePickerView
          description={`选择要上传到「${categoryLabelOf(flow.category)}」的文件`}
          files={localFiles}
          onBack={() => {
            setDraftUploadCategory(flow.category);
            setFlow({ step: 'category' });
          }}
          onConfirm={(file) => {
            setFlow({
              category: flow.category,
              fileName: file.name,
              percent: 0,
              step: 'uploading',
            });
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background.container },
  topChrome: { position: 'relative', backgroundColor: colors.background.container },
  navbar: { height: NAVBAR_HEIGHT, alignItems: 'center', justifyContent: 'center' },
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
  navTitle: { color: colors.text.primary, ...typographyTokens.title18Semibold },
  body: { minHeight: 0, flex: 1, flexDirection: 'row', backgroundColor: colors.background.container },
  resourcePane: { minWidth: 0, flex: 1 },
  /** Figma：链接块左 128（侧边栏右侧留 25）、右边距 16、距面板顶 21、行距 16。 */
  resourceList: { gap: 16, paddingLeft: 25, paddingRight: 16, paddingTop: 21, paddingBottom: 24 },
  /** 与设计系统 Link 一致：Figma 未定义链接按压态，这里同样不自行补视觉反馈。 */
  resourceRow: { alignSelf: 'stretch' },
  resourceName: { color: colors.text.link, ...typographyTokens.body14Medium },
  fab: { position: 'absolute', right: FAB_INSET },
  sheetSafeArea: { backgroundColor: colors.background.container },
  /** 远程呼梯进程页的内容块为 `gap 8`、内容居中。 */
  uploadProgressBody: { alignSelf: 'stretch', gap: 8 },
  uploadStatusLine: {
    width: '100%',
    color: colors.text.secondary,
    textAlign: 'center',
    ...typographyTokens.title16Regular,
  },
});
