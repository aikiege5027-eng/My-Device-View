import type { PropsWithChildren } from 'react';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CloseM from '../assets/close-m.svg';
import { colorThemes, typographyTokens } from '../designTokens';

type DialogProps = PropsWithChildren<{
  accessibilityLabel?: string;
  contentBehavior?: 'fit' | 'scroll';
  onClose: () => void;
  title: string;
  visible: boolean;
}>;

/**
 * Design-system content Dialog. It intentionally renders no footer; dismissal
 * is exposed only through the Figma-defined close control and system back.
 */
export function Dialog({
  accessibilityLabel,
  children,
  contentBehavior = 'fit',
  onClose,
  title,
  visible,
}: DialogProps) {
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
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          </View>
          <Pressable
            accessibilityLabel={`关闭${title}`}
            accessibilityRole="button"
            hitSlop={3}
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <CloseM accessibilityElementsHidden importantForAccessibility="no-hide-descendants" width={22} height={22} />
          </Pressable>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            style={[styles.scrollArea, contentBehavior === 'scroll' && styles.fixedScrollArea]}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: colorThemes.light.overlay.modal,
  },
  card: {
    width: '100%',
    maxWidth: 311,
    maxHeight: '86%',
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: colorThemes.light.background.container,
  },
  scrollableCard: {
    height: 540,
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  title: {
    width: '100%',
    color: colorThemes.light.text.primary,
    textAlign: 'center',
    ...typographyTokens.title18Semibold,
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
  pressed: {
    opacity: 0.72,
  },
});
