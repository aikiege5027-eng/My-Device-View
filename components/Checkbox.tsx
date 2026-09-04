import React, { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type AccessibilityState,
} from 'react-native';

import CheckboxCardCheck from '../assets/checkbox-card-check.svg';
import CheckboxCheck from '../assets/checkbox-check.svg';
import CheckCircleFilled from '../assets/check-circle-filled.svg';
import MinusCircleFilled from '../assets/minus-circle-filled.svg';
import { colorThemes, componentTokens, typographyTokens } from '../designTokens';

export type CheckboxPlacement = 'left' | 'right';
export type CheckboxIconTheme = 'check' | 'checkCircle' | 'customize';
export type CheckboxVariant = 'card' | 'inline' | 'row';

type CheckboxSelectionProps =
  | { checked: true; indeterminate: true }
  | { checked: boolean; indeterminate?: false };

type CheckboxIndicatorState = {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
};

type CheckboxIndicatorProps =
  | {
      iconTheme?: Exclude<CheckboxIconTheme, 'customize'>;
      renderIndicator?: never;
    }
  | {
      iconTheme: 'customize';
      renderIndicator: (state: CheckboxIndicatorState) => ReactNode;
    };

type CheckboxBaseProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  label: string;
  onChange: (checked: boolean) => void;
  testID?: string;
};

type CheckboxContentProps =
  | {
      children?: never;
      description?: string;
      disabled?: boolean;
      placement?: CheckboxPlacement;
      variant?: 'row';
    }
  | {
      children?: never;
      description?: never;
      disabled?: boolean;
      placement?: CheckboxPlacement;
      variant: 'inline';
    }
  | {
      children: ReactNode;
      description?: never;
      disabled?: false;
      placement?: never;
      variant: 'card';
    };

export type CheckboxProps = CheckboxBaseProps &
  CheckboxContentProps &
  CheckboxSelectionProps &
  CheckboxIndicatorProps;

/** Controlled design-system checkbox supporting the Figma row and card variants. */
export function Checkbox({
  accessibilityHint,
  accessibilityLabel,
  checked,
  children,
  description,
  disabled = false,
  iconTheme = 'check',
  indeterminate = false,
  label,
  onChange,
  placement = 'left',
  renderIndicator,
  testID,
  variant = 'row',
}: CheckboxProps) {
  const card = variant === 'card';
  const inline = variant === 'inline';
  const indicatorState = { checked, disabled, indeterminate };
  const accessibilityState: AccessibilityState = {
    checked: indeterminate ? 'mixed' : checked,
    disabled,
  };

  const indicator = card ? (
    checked || indeterminate ? (
      <CheckboxCardCheck
        height={tokens.card.indicatorSize}
        width={tokens.card.indicatorSize}
      />
    ) : null
  ) : iconTheme === 'customize' ? (
    renderIndicator?.(indicatorState)
  ) : (
    <CheckboxIndicator
      checked={checked}
      disabled={disabled}
      iconTheme={iconTheme}
      indeterminate={indeterminate}
    />
  );

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="checkbox"
      accessibilityState={accessibilityState}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={[
        styles.row,
        inline ? styles.inlineRow : undefined,
        card ? styles.card : undefined,
        card && checked ? styles.cardSelected : undefined,
        !card && description ? styles.rowWithDescription : undefined,
        !card && placement === 'right' ? styles.rowReverse : undefined,
      ]}
      testID={testID}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={
          card
            ? styles.cardIndicatorSlot
            : inline
              ? styles.inlineIndicatorSlot
              : styles.indicatorSlot
        }
      >
        {indicator}
      </View>
      {card ? (
        <View style={styles.cardContent}>{children}</View>
      ) : (
        <View
          style={[
            styles.content,
            placement === 'right' ? styles.contentRight : undefined,
            inline ? styles.inlineContent : undefined,
          ]}
        >
          <Text
            style={[
              styles.label,
              inline ? styles.inlineLabel : undefined,
              disabled ? styles.disabledLabel : undefined,
            ]}
          >
            {label}
          </Text>
          {description ? (
            <Text
              style={[
                styles.description,
                disabled ? styles.disabledDescription : undefined,
              ]}
            >
              {description}
            </Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

type CheckboxIndicatorInternalProps = CheckboxIndicatorState & {
  iconTheme: Exclude<CheckboxIconTheme, 'customize'>;
};

function CheckboxIndicator({
  checked,
  disabled,
  iconTheme,
  indeterminate,
}: CheckboxIndicatorInternalProps) {
  const color = disabled ? colors.brand.disabled : colors.brand.default;
  const showGlyph = checked || indeterminate;

  if (iconTheme === 'checkCircle' && showGlyph) {
    const FilledIndicator = indeterminate ? MinusCircleFilled : CheckCircleFilled;

    return (
      <FilledIndicator
        color={color}
        height={tokens.indicatorSize}
        width={tokens.indicatorSize}
      />
    );
  }

  return (
    <View
      style={[
        styles.indicator,
        iconTheme === 'checkCircle' ? styles.circleIndicator : undefined,
        iconTheme === 'checkCircle'
          ? disabled
            ? styles.disabledCircleIndicator
            : styles.uncheckedCircleIndicator
          : undefined,
      ]}
    >
      {showGlyph ? (
        indeterminate ? (
          <View style={[styles.mixedGlyph, { backgroundColor: color }]} />
        ) : (
          <CheckboxCheck
            color={color}
            height={tokens.checkHeight}
            width={tokens.checkWidth}
          />
        )
      ) : null}
    </View>
  );
}

export type CheckboxGroupValue = string | number;

export type CheckboxGroupItem<Value extends CheckboxGroupValue> = {
  description?: string;
  disabled?: boolean;
  id: string;
  label: string;
  value: Value;
};

export type CheckboxGroupProps<Value extends CheckboxGroupValue> = {
  accessibilityLabel?: string;
  disabled?: boolean;
  iconTheme?: Exclude<CheckboxIconTheme, 'customize'>;
  items: readonly CheckboxGroupItem<Value>[];
  onChange: (values: readonly Value[]) => void;
  placement?: CheckboxPlacement;
  value: readonly Value[];
};

/** Controlled checkbox group; each item remains an independent accessible control. */
export function CheckboxGroup<Value extends CheckboxGroupValue>({
  accessibilityLabel,
  disabled = false,
  iconTheme = 'check',
  items,
  onChange,
  placement = 'left',
  value,
}: CheckboxGroupProps<Value>) {
  return (
    <View>
      {items.map((item) => {
        const selected = value.some((current) => Object.is(current, item.value));

        return (
          <Checkbox
            accessibilityLabel={
              accessibilityLabel
                ? `${accessibilityLabel}, ${item.label}`
                : item.label
            }
            checked={selected}
            description={item.description}
            disabled={disabled || item.disabled}
            iconTheme={iconTheme}
            key={item.id}
            label={item.label}
            onChange={(nextChecked) => {
              const nextValues = nextChecked
                ? [...value, item.value]
                : value.filter((current) => !Object.is(current, item.value));
              onChange(nextValues);
            }}
            placement={placement}
            testID={item.id}
          />
        );
      })}
    </View>
  );
}

const colors = colorThemes.light;
const tokens = componentTokens.checkbox;

const styles = StyleSheet.create({
  row: {
    minHeight: tokens.rowMinHeight,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: tokens.paddingHorizontal,
  },
  inlineRow: {
    minHeight: tokens.indicatorSize,
    alignItems: 'center',
    paddingLeft: 0,
  },
  rowWithDescription: {
    minHeight: tokens.rowWithDescriptionMinHeight,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
    paddingLeft: 0,
    paddingRight: tokens.paddingHorizontal,
  },
  card: {
    minHeight: tokens.card.minHeight,
    paddingLeft: 0,
    overflow: 'hidden',
    borderWidth: tokens.card.borderWidth,
    borderColor: colors.border.componentStroke,
    borderRadius: tokens.card.radius,
    backgroundColor: colors.background.container,
  },
  cardSelected: {
    borderColor: colors.brand.default,
  },
  indicatorSlot: {
    width: tokens.indicatorSize,
    height: tokens.indicatorSize,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.paddingVertical,
  },
  inlineIndicatorSlot: {
    width: tokens.indicatorSize,
    height: tokens.indicatorSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIndicatorSlot: {
    position: 'absolute',
    top: -tokens.card.borderWidth,
    left: -tokens.card.borderWidth,
    width: tokens.card.indicatorSize,
    height: tokens.card.indicatorSize,
    zIndex: 1,
  },
  indicator: {
    width: tokens.indicatorSize,
    height: tokens.indicatorSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIndicator: {
    borderWidth: tokens.glyphStrokeWidth,
    borderRadius: tokens.indicatorSize / 2,
  },
  uncheckedCircleIndicator: {
    borderColor: colors.border.componentBorder,
  },
  disabledCircleIndicator: {
    borderColor: colors.border.componentStroke,
  },
  mixedGlyph: {
    width: tokens.mixedWidth,
    height: tokens.glyphStrokeWidth,
  },
  content: {
    flex: 1,
    minHeight: '100%',
    justifyContent: 'center',
    gap: tokens.titleDescriptionGap,
    marginLeft: tokens.indicatorContentGap,
    paddingTop: tokens.paddingVertical,
    paddingRight: tokens.paddingHorizontal,
    paddingBottom: tokens.paddingVertical,
    borderBottomWidth: tokens.dividerWidth,
    borderBottomColor: colors.border.componentStroke,
  },
  contentRight: {
    marginLeft: 0,
    marginRight: tokens.indicatorContentGap,
    paddingLeft: tokens.paddingHorizontal,
    paddingRight: 0,
  },
  inlineContent: {
    minHeight: tokens.indicatorSize,
    marginLeft: tokens.indicatorContentGap,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  cardContent: {
    minWidth: 0,
    flex: 1,
    minHeight: tokens.card.minHeight - tokens.card.borderWidth * 2,
    justifyContent: 'center',
    paddingLeft: tokens.card.paddingLeft,
    paddingRight: tokens.card.paddingRight,
    paddingVertical: tokens.card.paddingVertical,
  },
  label: {
    color: colors.text.primary,
    ...typographyTokens.title16Regular,
  },
  inlineLabel: {
    ...typographyTokens.body14Regular,
  },
  disabledLabel: {
    color: colors.text.disabled,
  },
  description: {
    color: colors.text.secondary,
    ...typographyTokens.body14Regular,
  },
  disabledDescription: {
    color: colors.text.disabled,
  },
});
