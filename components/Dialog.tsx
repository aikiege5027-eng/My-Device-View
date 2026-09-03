import React, { PropsWithChildren, useEffect, useRef } from 'react';
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

import CloseM from '../assets/close-m.svg';
import { colorThemes, typographyTokens } from '../designTokens';

type DialogAction = {
  accessibilityHint?: string;
  label: string;
  onPress: () => void;
};

type DialogFooter = {
  buttonLayout: 'vertical';
  buttonTheme: 'base';
  cancel: DialogAction;
  confirm: DialogAction;
};

type DialogProps = PropsWithChildren<{
  accessibilityLabel?: string;
  contentBehavior?: 'fit' | 'scroll';
  description?: string;
  footer?: DialogFooter;
  onClose: () => void;
  showCloseButton?: boolean;
  title: string;
  visible: boolean;
}>;

/**
 * Design-system Dialog supporting the Figma-defined content dialog and the
 * vertical base-button footer used by confirmation and selection scenarios.
 */
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
  const hasContent = children != null;
  const hasFooter = footer != null;
  const confirmButtonRef = useRef<View>(null);
  const titleRef = useRef<Text>(null);

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
          accessibilityLabel={accessibilityLabel ?? title}
          accessibilityViewIsModal
          style={[styles.card, contentBehavior === 'scroll' && styles.scrollableCard]}
        >
          <View style={[styles.header, !showCloseButton && styles.headerWithoutClose]}>
            <Text accessibilityRole="header" ref={titleRef} style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
          </View>
          {showCloseButton ? (
            <Pressable
              accessibilityLabel={`关闭${title}`}
              accessibilityRole="button"
              hitSlop={3}
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <CloseM accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={22} height={22} />
            </Pressable>
          ) : null}
          {hasContent ? (
            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              style={[styles.scrollArea, contentBehavior === 'scroll' && styles.fixedScrollArea]}
            >
              {children}
            </ScrollView>
          ) : null}
          {footer ? (
            <View style={styles.footer}>
              <Pressable
                accessibilityHint={footer.confirm.accessibilityHint}
                accessibilityRole="button"
                onPress={footer.confirm.onPress}
                ref={confirmButtonRef}
                style={({ pressed }) => [styles.footerButton, styles.confirmButton, pressed && styles.pressed]}
              >
                <Text style={[styles.footerButtonText, styles.confirmButtonText]}>{footer.confirm.label}</Text>
              </Pressable>
              <Pressable
                accessibilityHint={footer.cancel.accessibilityHint}
                accessibilityRole="button"
                onPress={footer.cancel.onPress}
                style={({ pressed }) => [styles.footerButton, styles.cancelButton, pressed && styles.pressed]}
              >
                <Text style={[styles.footerButtonText, styles.cancelButtonText]}>{footer.cancel.label}</Text>
              </Pressable>
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
  scrollableCard: {
    height: 540,
  },
  header: {
    gap: 8,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  headerWithoutClose: {
    paddingTop: 32,
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
