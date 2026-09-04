import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import CaretDownSmall from '../assets/caret-down-small.svg';
import { colorThemes, componentTokens, typographyTokens } from '../designTokens';

const colors = colorThemes.light;
const tokens = componentTokens.filterBar;

export type FilterBarItem = {
  /** Stable identifier; never use the array index or the display label. */
  id: string;
  /** Currently selected value shown on the trigger. */
  label: string;
  /** Overrides the accessible name, which defaults to `label`. */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Whether the owning picker / dropdown is currently open. */
  expanded?: boolean;
  /**
   * Fixed label width in px. Figma notes the selected value uses a fixed
   * length and ellipsises on overflow; pass the width defined by the target
   * design when it specifies one. Without it the label shrinks to the space
   * left in the row and still ellipsises.
   */
  maxLabelWidth?: number;
  onPress: () => void;
  testID?: string;
};

export type FilterBarProps = {
  /** Accessible name for the whole filter row, e.g. `设备筛选条件`. */
  accessibilityLabel?: string;
  /** One to four triggers, each with a stable `id`. */
  items: FilterBarItem[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Filter row of dropdown triggers, each showing the currently selected value
 * plus a `caret-down-small` caret.
 *
 * The component only renders the trigger row. Opening the picker, bottom sheet
 * or dropdown panel and owning the selected value stays with the caller, which
 * feeds the result back through `items[].label`.
 */
export function FilterBar({
  accessibilityLabel,
  items,
  style,
  testID,
}: FilterBarProps) {
  if (__DEV__ && items.length > tokens.maxItems) {
    console.warn(
      `FilterBar: Figma defines at most ${tokens.maxItems} filter triggers per row, received ${items.length}.`,
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.row, style]}
      testID={testID}
    >
      {items.map((item) => (
        <FilterTrigger key={item.id} {...item} />
      ))}
    </View>
  );
}

export type FilterTriggerProps = Omit<FilterBarItem, 'id'>;

/** Single filter trigger; exported for rows that are not a plain list of items. */
export function FilterTrigger({
  accessibilityHint,
  accessibilityLabel,
  expanded,
  label,
  maxLabelWidth,
  onPress,
  testID,
}: FilterTriggerProps) {
  const verticalHitSlop = Math.max(
    0,
    (tokens.minTouchSize - tokens.rowMinHeight) / 2,
  );

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      hitSlop={{
        top: verticalHitSlop,
        bottom: verticalHitSlop,
        left: tokens.itemGap / 2,
        right: tokens.itemGap / 2,
      }}
      onPress={onPress}
      style={styles.trigger}
      testID={testID}
    >
      <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        style={[
          styles.label,
          maxLabelWidth === undefined ? styles.labelFlexible : { width: maxLabelWidth },
        ]}
      >
        {label}
      </Text>
      <CaretDownSmall
        accessibilityElementsHidden
        color={colors.text.primary}
        height={tokens.iconSize}
        importantForAccessibility="no-hide-descendants"
        width={tokens.iconSize}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: tokens.itemGap,
    minHeight: tokens.rowMinHeight,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.labelIconGap,
    flexShrink: 1,
    minWidth: 0,
  },
  label: {
    color: colors.text.primary,
    ...typographyTokens.footer12Regular,
  },
  labelFlexible: {
    flexShrink: 1,
  },
});
