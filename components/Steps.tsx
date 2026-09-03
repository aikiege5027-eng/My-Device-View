import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colorThemes, typographyTokens } from '../designTokens';

export type StepStatus = 'default' | 'process' | 'finish' | 'error';

export type StepItem = {
  description: string;
  errorDescription?: string;
  id: string;
  meta?: string;
  status: StepStatus;
  title: string;
};

type ReadOnlyVerticalDotStepsProps = {
  items: readonly StepItem[];
  layout: 'vertical';
  readOnly: true;
  theme: 'dot';
};

const statusLabels: Record<StepStatus, string> = {
  default: '未开始',
  process: '进行中',
  finish: '已完成',
  error: '错误',
};

/** Figma Read-only Steps: vertical layout with dot markers. */
export function Steps({ items }: ReadOnlyVerticalDotStepsProps) {
  return (
    <View accessibilityLabel="设备动态有序流程" style={styles.list}>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        const isError = item.status === 'error';
        const readableError = item.errorDescription ?? item.description;

        return (
          <View
            accessible
            accessibilityLabel={`第 ${index + 1} 步，共 ${items.length} 步，${item.title}，${item.meta ?? ''}，${statusLabels[item.status]}，${isError ? readableError : item.description}`}
            key={item.id}
            style={styles.item}
          >
            <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.markerColumn}>
              <View style={styles.markerSlot}>
                <View style={[styles.marker, isError && styles.errorMarker]} />
              </View>
              {!last && <View style={[styles.connector, isError && styles.errorConnector]} />}
            </View>
            <View style={[styles.content, !last && styles.contentWithConnector]}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, isError && styles.errorTitle]}>{item.title}</Text>
                {item.meta ? <Text style={styles.meta}>{item.meta}</Text> : null}
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    gap: 4,
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 16,
  },
  markerColumn: {
    width: 8,
    alignItems: 'center',
    gap: 4,
  },
  markerSlot: {
    height: 22,
    paddingVertical: 7,
  },
  marker: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: colorThemes.light.brand.default,
    borderRadius: 999,
  },
  errorMarker: {
    borderColor: colorThemes.light.error.default,
  },
  connector: {
    flex: 1,
    minHeight: 16,
    width: 1,
    backgroundColor: colorThemes.light.brand.default,
  },
  errorConnector: {
    backgroundColor: colorThemes.light.error.default,
  },
  content: {
    minWidth: 0,
    flex: 1,
    gap: 4,
  },
  contentWithConnector: {
    paddingBottom: 16,
  },
  titleRow: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    minWidth: 0,
    flex: 1,
    color: colorThemes.light.text.primary,
    ...typographyTokens.body14Regular,
  },
  errorTitle: {
    color: colorThemes.light.error.default,
  },
  meta: {
    color: colorThemes.light.text.placeholder,
    ...typographyTokens.footer12Regular,
  },
  description: {
    width: '100%',
    color: colorThemes.light.text.placeholder,
    ...typographyTokens.footer12Regular,
  },
});
