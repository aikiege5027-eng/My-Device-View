import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { colorThemes } from '../designTokens';

const colors = colorThemes.light;

/**
 * 进出场时长。Figma 当前的面板节点（如 Picker `24386:5250`）只定义了静态面板，
 * 没有定义动效曲线与时长，这里采用平台常规的短时长，待设计补充后再对齐。
 */
const ENTER_DURATION = 240;
const EXIT_DURATION = 180;

export type BottomSheetProps = {
  children: ReactNode;
  /** 点击遮罩关闭的可访问名称。 */
  dismissAccessibilityLabel: string;
  /** 遮罩点击、系统返回键触发；调用方负责把 `visible` 置为 false。 */
  onRequestClose: () => void;
  visible: boolean;
};

/**
 * 底部面板宿主：负责遮罩、进出场动效、安全区之上的定位和系统关闭路径。
 *
 * 设计系统里的面板组件（Picker 等）只定义静态面板本体，所以这些宿主职责统一放在
 * 这里，业务页面不要各自实现遮罩和动画。
 *
 * 遮罩用透明度淡入淡出，只有面板本身从底部滑入，避免 `Modal` 的 `animationType="slide"`
 * 把遮罩一起从底部抬上来。
 */
export function BottomSheet({
  children,
  dismissAccessibilityLabel,
  onRequestClose,
  visible,
}: BottomSheetProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);
  const [panelHeight, setPanelHeight] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      return;
    }
    if (reduceMotion) {
      progress.setValue(0);
      setMounted(false);
      return;
    }

    Animated.timing(progress, {
      duration: EXIT_DURATION,
      easing: Easing.in(Easing.cubic),
      toValue: 0,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [progress, reduceMotion, visible]);

  useEffect(() => {
    // 面板高度量到之后才能算滑入距离；此前面板保持透明，避免先闪一帧到位。
    if (!visible || !mounted || panelHeight === 0) return;

    if (reduceMotion) {
      progress.setValue(1);
      return;
    }

    Animated.timing(progress, {
      duration: ENTER_DURATION,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [mounted, panelHeight, progress, reduceMotion, visible]);

  if (!mounted) return null;

  const measured = panelHeight > 0;
  const translateY = Animated.multiply(Animated.subtract(1, progress), panelHeight);

  return (
    <Modal animationType="none" onRequestClose={onRequestClose} statusBarTranslucent transparent visible>
      <View style={styles.root}>
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={[styles.backdrop, { opacity: progress }]}
        />
        <Pressable
          accessibilityLabel={dismissAccessibilityLabel}
          accessibilityRole="button"
          onPress={onRequestClose}
          style={styles.dismissArea}
        />
        <Animated.View
          onLayout={({ nativeEvent }) => setPanelHeight(nativeEvent.layout.height)}
          style={[styles.panel, { opacity: measured ? 1 : 0, transform: [{ translateY }] }]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.modal,
  },
  dismissArea: {
    flex: 1,
  },
  panel: {
    backgroundColor: colors.background.container,
  },
});
