import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ViewProps,
} from 'react-native';

import { colorThemes, radiusTokens, typographyTokens } from '@kone/mobile-design-system';

export type VersionSwitcherOption<TValue extends string> = {
  /** 读屏用的完整名称，默认取 `label`。 */
  accessibilityLabel?: string;
  label: string;
  value: TValue;
};

export type VersionSwitcherProps<TValue extends string> = {
  accessibilityLabel?: string;
  onChange: (value: TValue) => void;
  options: readonly VersionSwitcherOption<TValue>[];
  value: TValue;
};

/**
 * react-native-web turns `dataSet` into `data-*` attributes. `WebScreenshotTool`
 * skips `[data-version-switcher]`, so the floating switch stays out of captures.
 * Native builds ignore the unknown prop.
 */
const screenshotIgnoreProps = {
  dataSet: { versionSwitcher: 'true' },
} as unknown as ViewProps;

type Position = { left: number; top: number };
type Size = { height: number; width: number };

/** 拖动后与可用区域边缘保持的最小距离。 */
const dragGutter = 8;

/**
 * Compact floating segmented switch used to compare alternative layouts of the same page.
 *
 * Prototype-only affordance: it overlays the page instead of taking layout space and is
 * excluded from screenshots. On web, holding the right mouse button drags it anywhere
 * inside the page content area; left click still switches versions. Native builds keep
 * the default bottom-centered position because the drag relies on DOM pointer capture.
 */
export function VersionSwitcher<TValue extends string>({
  accessibilityLabel = '页面版本切换',
  onChange,
  options,
  value,
}: VersionSwitcherProps<TValue>) {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const pillRef = useRef<View | null>(null);
  const layerSizeRef = useRef<Size>({ height: 0, width: 0 });
  const pillLayoutRef = useRef<Position & Size>({
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  });
  const dragRef = useRef<{
    pointerId: number;
    startLeft: number;
    startTop: number;
    startX: number;
    startY: number;
  } | null>(null);

  const clampToLayer = useCallback((left: number, top: number): Position => {
    const layer = layerSizeRef.current;
    const pill = pillLayoutRef.current;

    return {
      left: Math.min(
        Math.max(left, dragGutter),
        Math.max(dragGutter, layer.width - pill.width - dragGutter),
      ),
      top: Math.min(
        Math.max(top, dragGutter),
        Math.max(dragGutter, layer.height - pill.height - dragGutter),
      ),
    };
  }, []);

  const handleLayerLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    layerSizeRef.current = { height, width };
  };

  const handlePillLayout = (event: LayoutChangeEvent) => {
    const { height, width, x, y } = event.nativeEvent.layout;
    pillLayoutRef.current = { height, left: x, top: y, width };
  };

  useEffect(() => {
    const node = pillRef.current as unknown as HTMLElement | null;
    if (!node || typeof node.addEventListener !== 'function') {
      return;
    }

    // 捕获阶段处理右键，避免分段按钮先收到这次 pointerdown 而误触发切换。
    const startDrag = (event: PointerEvent) => {
      if (event.button !== 2 || event.pointerType !== 'mouse') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      dragRef.current = {
        pointerId: event.pointerId,
        startLeft: pillLayoutRef.current.left,
        startTop: pillLayoutRef.current.top,
        startX: event.clientX,
        startY: event.clientY,
      };
      node.setPointerCapture(event.pointerId);
      setDragging(true);
    };

    const moveDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      setPosition(
        clampToLayer(
          drag.startLeft + event.clientX - drag.startX,
          drag.startTop + event.clientY - drag.startY,
        ),
      );
    };

    const endDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      if (node.hasPointerCapture(event.pointerId)) {
        node.releasePointerCapture(event.pointerId);
      }
      dragRef.current = null;
      setDragging(false);
    };

    const blockContextMenu = (event: Event) => event.preventDefault();

    node.addEventListener('pointerdown', startDrag, true);
    node.addEventListener('pointermove', moveDrag);
    node.addEventListener('pointerup', endDrag);
    node.addEventListener('pointercancel', endDrag);
    node.addEventListener('lostpointercapture', endDrag);
    node.addEventListener('contextmenu', blockContextMenu);

    return () => {
      node.removeEventListener('pointerdown', startDrag, true);
      node.removeEventListener('pointermove', moveDrag);
      node.removeEventListener('pointerup', endDrag);
      node.removeEventListener('pointercancel', endDrag);
      node.removeEventListener('lostpointercapture', endDrag);
      node.removeEventListener('contextmenu', blockContextMenu);
    };
  }, [clampToLayer]);

  return (
    <View
      {...screenshotIgnoreProps}
      onLayout={handleLayerLayout}
      pointerEvents="box-none"
      style={styles.floatingLayer}
    >
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="tablist"
        onLayout={handlePillLayout}
        ref={pillRef}
        style={[
          styles.track,
          position ? { left: position.left, position: 'absolute', top: position.top } : null,
          dragging ? styles.trackDragging : null,
        ]}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              accessibilityLabel={option.accessibilityLabel ?? option.label}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              key={option.value}
              onPress={() => {
                if (!selected) {
                  onChange(option.value);
                }
              }}
              style={({ pressed }) => [
                styles.segment,
                selected && styles.segmentSelected,
                pressed && !selected && styles.segmentPressed,
              ]}
              testID={`version-switch-${option.value}`}
            >
              <Text
                numberOfLines={1}
                style={[styles.segmentLabel, selected && styles.segmentLabelSelected]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const colors = colorThemes.light;

const styles = StyleSheet.create({
  /**
   * 铺满内容区，未拖动时把胶囊摆在底部居中，也就是紧贴底部操作栏上沿。拖动范围同样
   * 限制在这一层内：PageTemplate 先绘制内容区、后绘制操作栏，再往下会被操作栏遮住。
   */
  floatingLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.componentStroke,
    borderRadius: radiusTokens.circle,
    backgroundColor: colors.background.container,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  trackDragging: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  segment: {
    minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: radiusTokens.circle,
  },
  segmentPressed: {
    backgroundColor: colors.background.component,
  },
  segmentSelected: {
    backgroundColor: colors.brand.light,
  },
  segmentLabel: {
    color: colors.text.secondary,
    ...typographyTokens.footer12Medium,
  },
  segmentLabelSelected: {
    color: colors.text.brand,
  },
});
