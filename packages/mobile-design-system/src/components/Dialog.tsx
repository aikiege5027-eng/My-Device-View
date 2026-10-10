import React, { PropsWithChildren, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  findNodeHandle,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CloseMIcon } from '../icons';
import { colorThemes, typographyTokens } from '../designTokens';

/**
 * `contentBehavior=fit` 时卡片的最大高度，取 Dialog 长内容变体节点 `27360:22420`
 * 的自身高度；正文超出后只滚动正文区。
 */
const FIT_CARD_MAX_HEIGHT = 400;
/**
 * 正文滚动指示条，Figma `27360:22420` 的 `scrollbar`：宽 `4`、圆角 `2`、
 * `component-border` 50% 透明度、距卡片右边缘 `16`。
 */
const SCROLLBAR_WIDTH = 4;
const SCROLLBAR_RIGHT_INSET = 16;
const SCROLLBAR_OPACITY = 0.5;
/**
 * 指示条长度按「可视高度 / 内容高度」等比计算。Figma 给的 `64` 是该示例内容量下的
 * 静态结果，不是固定值；这里只约定一个下限，避免内容极长时指示条细到看不见。
 */
const SCROLLBAR_MIN_THUMB_HEIGHT = 24;

export type DialogAction = {
  accessibilityHint?: string;
  label: string;
  onPress: () => void;
};

export type DialogFooter =
  | {
      buttonLayout: 'vertical';
      buttonTheme: 'base';
      cancel: DialogAction;
      confirm: DialogAction;
    }
  | {
      /**
       * Figma `item/footer` 的 `confirm-btn=true, cancel-btn=false` 变体
       * （节点 `27360:21891`）：单按钮没有 `button-layout` 轴，footer 高 `88`
       * （`24` 内边距 + `40` 按钮 + `24` 内边距），按钮占满内容宽度。
       */
      buttonLayout?: never;
      buttonTheme: 'base';
      cancel?: never;
      confirm: DialogAction;
    };

export type DialogProps = PropsWithChildren<{
  accessibilityLabel?: string;
  contentBehavior?: 'fit' | 'scroll';
  /**
   * Figma `content=true` 的正文。传字符串时按 `H7 16/Regular` + `text-color-secondary`
   * 居中渲染；传节点时原样渲染，用于正文本身是组合内容的场景（如进度条 + 状态行），
   * 两种形式都落在标题下方 `8` 间距的内容流里。
   */
  description?: ReactNode;
  footer?: DialogFooter;
  onClose: () => void;
  showCloseButton?: boolean;
  title: string;
  visible: boolean;
}>;

/**
 * Design-system Dialog supporting the Figma-defined content dialog plus two
 * `item/footer` variants: the vertical base-button pair used by confirmation
 * and selection scenarios, and the confirm-only single base button.
 */
/** 淡出期间需要继续渲染的那部分 props，见 `lastVisibleContent`。 */
type DialogContent = {
  accessibilityLabel: string | undefined;
  children: ReactNode;
  description: ReactNode;
  footer: DialogFooter | undefined;
  showCloseButton: boolean;
  title: string;
};

export function Dialog({
  accessibilityLabel,
  children,
  contentBehavior = 'fit',
  description,
  footer,
  onClose,
  showCloseButton = true,
  title,
  visible,
}: DialogProps) {
  /**
   * `Modal` 的淡出有 250ms，而调用方通常把「显示哪一份内容」和 `visible` 绑在同一份
   * 状态上（关闭时把选中项置空），于是淡出期间弹窗会先被清空，只剩一张空白卡片和
   * footer 在渐隐——看起来就是关闭后的残影。
   *
   * 这里锁存最后一次可见时的内容，不可见时继续用它渲染，让淡出播放的仍是用户刚看到
   * 的那一屏。`visible` 与 `onClose` 不锁存，关闭时序完全不变。
   */
  const content: DialogContent = {
    accessibilityLabel,
    children,
    description,
    footer,
    showCloseButton,
    title,
  };
  const lastVisibleContent = useRef(content);
  if (visible) lastVisibleContent.current = content;
  const shown = visible ? content : lastVisibleContent.current;

  const hasContent = shown.children != null;
  const hasFooter = shown.footer != null;
  const confirmButtonRef = useRef<View>(null);
  const titleRef = useRef<Text>(null);

  /** 正文滚动区的几何，用来按比例算滚动指示条。`top` 是滚动区在卡片内的纵向起点。 */
  const [scrollArea, setScrollArea] = useState({ height: 0, top: 0 });
  const [scrollContentHeight, setScrollContentHeight] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  const scrollableOverflow = Math.max(0, scrollContentHeight - scrollArea.height);
  const showScrollbar = hasContent && scrollArea.height > 0 && scrollableOverflow > 1;
  const thumbHeight = showScrollbar
    ? Math.max(
      SCROLLBAR_MIN_THUMB_HEIGHT,
      (scrollArea.height / scrollContentHeight) * scrollArea.height,
    )
    : 0;
  const thumbTop = showScrollbar
    ? scrollArea.top
      + (Math.min(Math.max(scrollOffset, 0), scrollableOverflow) / scrollableOverflow)
      * (scrollArea.height - thumbHeight)
    : 0;

  useEffect(() => {
    if (!visible) return undefined;

    const focusTimer = setTimeout(() => {
      const focusTarget = hasFooter ? confirmButtonRef.current : titleRef.current;
      const reactTag = focusTarget ? findNodeHandle(focusTarget) : null;
      if (reactTag) AccessibilityInfo.setAccessibilityFocus(reactTag);
    }, 100);

    return () => clearTimeout(focusTimer);
  }, [hasFooter, visible]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View
          accessibilityLabel={shown.accessibilityLabel ?? shown.title}
          accessibilityViewIsModal
          style={[
            styles.card,
            contentBehavior === 'scroll' ? styles.scrollableCard : styles.fitCard,
          ]}
        >
          <View
            style={[
              styles.header,
              // 既无正文滚动区也无 footer 时，没有其他区域提供下内边距，由 header 自己补齐。
              !hasContent && !hasFooter && (shown.showCloseButton
                ? styles.headerStandalone
                : styles.headerStandaloneWithoutClose),
            ]}
          >
            <Text accessibilityRole="header" ref={titleRef} style={styles.title}>{shown.title}</Text>
            {shown.description === undefined || shown.description === null ? null : (
              typeof shown.description === 'string'
                ? <Text style={styles.description}>{shown.description}</Text>
                : shown.description
            )}
          </View>
          {shown.showCloseButton ? (
            <Pressable
              accessibilityLabel={`关闭${shown.title}`}
              accessibilityRole="button"
              hitSlop={3}
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <CloseMIcon
                accessibilityElementsHidden
                color={colors.text.placeholder}
                height={22}
                importantForAccessibility="no-hide-descendants"
                width={22}
              />
            </Pressable>
          ) : null}
          {hasContent ? (
            <ScrollView
              contentContainerStyle={styles.content}
              onContentSizeChange={(_width, height) => setScrollContentHeight(height)}
              onLayout={({ nativeEvent }) => {
                const { height, y } = nativeEvent.layout;
                setScrollArea((previous) => (
                  previous.height === height && previous.top === y
                    ? previous
                    : { height, top: y }
                ));
              }}
              onScroll={({ nativeEvent }) => setScrollOffset(nativeEvent.contentOffset.y)}
              scrollEventThrottle={16}
              // 指示条由下面那条按 Figma 画的轨道承担，不再叠平台自带的滚动条。
              showsVerticalScrollIndicator={false}
              style={[styles.scrollArea, contentBehavior === 'scroll' && styles.fixedScrollArea]}
            >
              {shown.children}
            </ScrollView>
          ) : null}
          {/**
           * 正文滚动指示条，Figma 长内容变体 `27360:22420` 的 `scrollbar`。Figma 只给了
           * 静态示意，长度与位置在这里按实时滚动量等比计算；它是纯装饰，从无障碍树中隐藏
           * 并且不吃触摸事件（滚动仍由正文区本身承担）。
           */}
          {showScrollbar ? (
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              pointerEvents="none"
              style={[styles.scrollbarThumb, { height: thumbHeight, top: thumbTop }]}
            />
          ) : null}
          {shown.footer ? (
            <View style={styles.footer}>
              <Pressable
                accessibilityHint={shown.footer.confirm.accessibilityHint}
                accessibilityRole="button"
                onPress={shown.footer.confirm.onPress}
                ref={confirmButtonRef}
                style={({ pressed }) => [styles.footerButton, styles.confirmButton, pressed && styles.pressed]}
              >
                <Text style={[styles.footerButtonText, styles.confirmButtonText]}>{shown.footer.confirm.label}</Text>
              </Pressable>
              {shown.footer.cancel ? (
                <Pressable
                  accessibilityHint={shown.footer.cancel.accessibilityHint}
                  accessibilityRole="button"
                  onPress={shown.footer.cancel.onPress}
                  style={({ pressed }) => [styles.footerButton, styles.cancelButton, pressed && styles.pressed]}
                >
                  <Text style={[styles.footerButtonText, styles.cancelButtonText]}>{shown.footer.cancel.label}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const colors = colorThemes.light;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.overlay.modal,
  },
  card: {
    width: '100%',
    maxWidth: 311,
    maxHeight: '86%',
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: colors.background.container,
  },
  /**
   * `contentBehavior=fit` 的卡片贴合内容，上限取长内容变体节点 `27360:22420`
   * 自身的 `400`；超出后只滚动正文区。该上限覆盖了 `card` 的 `86%`，因此假定
   * 视口高度大于 `400`（最小的手机视口是 `568`）。
   */
  fitCard: {
    maxHeight: FIT_CARD_MAX_HEIGHT,
  },
  scrollableCard: {
    height: 540,
  },
  header: {
    gap: 8,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  /**
   * 无正文滚动区、无 footer 的卡片（如远程呼梯的进程页 `19721:216005`）上下内边距
   * 对称，设计稿中为 `32/32`；带关闭按钮时沿用 header 的 `24` 顶部内边距。
   *
   * 这个 `32` 只属于上面这种「孤立卡片」。带 footer 的变体无论有没有关闭按钮，
   * 顶部内边距都是 `24`（无关闭按钮的变体见节点 `27360:22420`）。
   */
  headerStandalone: {
    paddingBottom: 24,
  },
  headerStandaloneWithoutClose: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  title: {
    width: '100%',
    color: colors.text.primary,
    textAlign: 'center',
    ...typographyTokens.title18Semibold,
  },
  description: {
    width: '100%',
    color: colors.text.secondary,
    textAlign: 'center',
    ...typographyTokens.title16Regular,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  scrollArea: {
    flexShrink: 1,
  },
  fixedScrollArea: {
    flex: 1,
  },
  /** Figma `27360:22420` 的 `scrollbar`：`4` 宽、圆角 `2`、距卡片右边缘 `16`。 */
  scrollbarThumb: {
    position: 'absolute',
    right: SCROLLBAR_RIGHT_INSET,
    width: SCROLLBAR_WIDTH,
    borderRadius: 2,
    backgroundColor: colors.border.componentBorder,
    opacity: SCROLLBAR_OPACITY,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  footer: {
    gap: 12,
    padding: 24,
    backgroundColor: colors.background.container,
  },
  footerButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  confirmButton: {
    backgroundColor: colors.brand.default,
  },
  cancelButton: {
    backgroundColor: colors.brand.light,
  },
  footerButtonText: {
    textAlign: 'center',
    ...typographyTokens.title16Semibold,
  },
  confirmButtonText: {
    color: colors.text.white,
  },
  cancelButtonText: {
    color: colors.text.brand,
  },
  pressed: {
    opacity: 0.72,
  },
});
