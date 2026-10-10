import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import BackChevron from '../assets/project-back.svg';
import SelectedCheck from '../assets/checkbox-check.svg';
import {
  Button,
  colorThemes,
  radiusTokens,
  typographyTokens,
} from '@kone/mobile-design-system';
import { PreviewStatusBar, useMobileChromeInsets } from './mobileChrome';

const colors = colorThemes.light;

export type LocalFile = {
  id: string;
  /** 大写扩展名，用于类型角标。 */
  kind: string;
  modifiedAt: string;
  name: string;
  size: string;
};

export type LocalFilePickerViewProps = {
  /** 页面副标题，用于说明选中的文件会上传到哪里。 */
  description?: string;
  files: readonly LocalFile[];
  /** 返回上一步（选择分类）。 */
  onBack: () => void;
  /** 确认上传选中的文件。 */
  onConfirm: (file: LocalFile) => void;
};

/** 导航栏高度，与本项目其他小程序页面一致。 */
const NAVBAR_HEIGHT = 48;
const BACK_ICON_SIZE = 24;
/** 行几何沿用设计系统列表行的 `56` 行高与 `16` 行内边距。 */
const ROW_MIN_HEIGHT = 56;
const KIND_BADGE_SIZE = 40;
const CHECK_WIDTH = 20;
/**
 * 底部确认区沿用 Page Template 的按钮操作区几何：内容左右边距 `16`、顶部偏移 `16`、
 * 按钮高 `40`、双按钮等宽且间距 `16`。
 */
const FOOTER_PADDING_TOP = 16;
const FOOTER_PADDING_BOTTOM = 12;
const FOOTER_ACTION_GAP = 16;
/** 选中后底部多出的操作区高度，用于给列表留出不被遮挡的滚动空间。 */
const FOOTER_RESERVED_HEIGHT = 68;

/**
 * 模拟的「手机本地文件」页面。
 *
 * 真实实现应调用系统文件选择器（iOS Document Picker / Android SAF），该能力的
 * 界面由平台提供、设计稿未定义。这里用一个占满屏幕的页面模拟它，几何与排版仍
 * 全部取自项目既有 token 与列表行规范，不引入新的视觉语言。
 *
 * 选中文件后底部出现「取消 / 确认上传」确认区，确认后才开始上传。Page Template
 * 只定义「始终存在底部操作」的页面骨架，没有定义按需出现的操作区，因此这里自行
 * 组合，但两个按钮仍复用统一 Button 并沿用模板的按钮区几何。
 */
export function LocalFilePickerView({
  description,
  files,
  onBack,
  onConfirm,
}: LocalFilePickerViewProps) {
  const { bottomInset, isWebPreview, topInset } = useMobileChromeInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedFile = files.find((file) => file.id === selectedId);

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor={colors.background.container} barStyle="dark-content" />
      <View style={[styles.topChrome, { paddingTop: topInset }]}>
        {isWebPreview ? <PreviewStatusBar /> : null}
        <View style={styles.navbar}>
          <Pressable
            accessibilityLabel="返回分类选择"
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
          <Text accessibilityRole="header" style={styles.navTitle}>本地文件</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: 24
              + bottomInset
              + (selectedFile === undefined ? 0 : FOOTER_RESERVED_HEIGHT),
          },
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        {description === undefined ? null : (
          <Text style={styles.description}>{description}</Text>
        )}
        <View accessibilityRole="radiogroup" style={styles.list}>
          {files.map((file, index) => {
            const selected = file.id === selectedId;

            return (
              <Pressable
                accessibilityHint="选择该文件，再在底部确认上传"
                accessibilityLabel={`${file.name}，${file.size}，${file.modifiedAt}`}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                key={file.id}
                onPress={() => setSelectedId(file.id)}
                style={({ pressed }) => [
                  styles.row,
                  index < files.length - 1 && styles.rowDivider,
                  selected && styles.rowSelected,
                  pressed && styles.rowPressed,
                ]}
              >
                <View
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  style={styles.kindBadge}
                >
                  <Text style={styles.kindLabel}>{file.kind}</Text>
                </View>
                <View style={styles.rowCopy}>
                  <Text numberOfLines={1} style={[styles.fileName, selected && styles.fileNameSelected]}>
                    {file.name}
                  </Text>
                  <Text numberOfLines={1} style={styles.fileMeta}>{`${file.size} · ${file.modifiedAt}`}</Text>
                </View>
                <View style={styles.checkSlot}>
                  {selected ? (
                    <SelectedCheck
                      accessibilityElementsHidden
                      color={colors.brand.default}
                      importantForAccessibility="no-hide-descendants"
                      width={CHECK_WIDTH}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {selectedFile === undefined ? null : (
        <View style={[styles.footer, { paddingBottom: FOOTER_PADDING_BOTTOM + bottomInset }]}>
          <View style={styles.actionSlot}>
            <Button
              accessibilityHint="取消本次文件选择"
              block
              onPress={() => setSelectedId(null)}
              shape="round"
              size="medium"
              theme="light"
              variant="base"
            >
              取消
            </Button>
          </View>
          <View style={styles.actionSlot}>
            <Button
              accessibilityHint={`开始上传 ${selectedFile.name}`}
              block
              onPress={() => onConfirm(selectedFile)}
              shape="round"
              size="medium"
              theme="primary"
              variant="base"
            >
              确认上传
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.background.page },
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
  scroll: { flex: 1 },
  content: { gap: 8, paddingTop: 12 },
  description: { paddingHorizontal: 16, color: colors.text.secondary, ...typographyTokens.footer12Regular },
  list: { backgroundColor: colors.background.container },
  row: {
    minHeight: ROW_MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rowDivider: { borderBottomWidth: 0.5, borderBottomColor: colors.border.componentStroke },
  rowSelected: { backgroundColor: colors.brand.light },
  rowPressed: { backgroundColor: colors.background.component },
  kindBadge: {
    width: KIND_BADGE_SIZE,
    height: KIND_BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radiusTokens.medium,
    backgroundColor: colors.background.component,
  },
  kindLabel: { color: colors.text.secondary, ...typographyTokens.footer10Semibold },
  rowCopy: { minWidth: 0, flex: 1 },
  fileName: { color: colors.text.primary, ...typographyTokens.title16Regular },
  fileNameSelected: { color: colors.text.brand, ...typographyTokens.title16Medium },
  fileMeta: { color: colors.text.secondary, ...typographyTokens.footer12Regular },
  checkSlot: { width: CHECK_WIDTH, alignItems: 'center', justifyContent: 'center' },
  footer: {
    flexDirection: 'row',
    gap: FOOTER_ACTION_GAP,
    paddingHorizontal: 16,
    paddingTop: FOOTER_PADDING_TOP,
    borderTopWidth: 0.5,
    borderTopColor: colors.border.componentStroke,
    backgroundColor: colors.background.container,
  },
  actionSlot: { minWidth: 0, flex: 1 },
});
