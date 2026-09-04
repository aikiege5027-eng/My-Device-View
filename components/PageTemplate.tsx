import React, { type PropsWithChildren } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Back from '../assets/back.svg';
import { colorThemes, typographyTokens } from '../designTokens';
import { Button } from './Button';

export type PageAction = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  id: string;
  label: string;
  onPress: () => void;
};

export type PageFooterActions =
  | { actions: readonly [PageAction, PageAction]; variant: 'dualSecondary' }
  | { primary: PageAction; secondary: PageAction; variant: 'secondaryPrimary' }
  | { primary: PageAction; variant: 'singlePrimary' }
  | { secondary: PageAction; variant: 'singleSecondary' };

type PageTemplateProps = PropsWithChildren<{
  backAccessibilityHint?: string;
  backAccessibilityLabel: string;
  footer: PageFooterActions;
  onBack: () => void;
  title: string;
  titleRef?: React.Ref<Text>;
}>;

type FooterItem = {
  action: PageAction;
  theme: 'light' | 'primary';
};

function getFooterItems(footer: PageFooterActions): readonly FooterItem[] {
  switch (footer.variant) {
    case 'dualSecondary':
      return footer.actions.map((action) => ({ action, theme: 'light' }));
    case 'secondaryPrimary':
      return [
        { action: footer.secondary, theme: 'light' },
        { action: footer.primary, theme: 'primary' },
      ];
    case 'singlePrimary':
      return [{ action: footer.primary, theme: 'primary' }];
    case 'singleSecondary':
      return [{ action: footer.secondary, theme: 'light' }];
  }
}

/**
 * Shared mobile page shell defined by the Page Template Figma node.
 * Business pages provide content and one of the four supported footer variants.
 */
export function PageTemplate({
  backAccessibilityHint,
  backAccessibilityLabel,
  children,
  footer,
  onBack,
  title,
  titleRef,
}: PageTemplateProps) {
  const footerItems = getFooterItems(footer);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar backgroundColor={colors.background.container} barStyle="dark-content" />
      <View style={styles.navbar}>
        <Pressable
          accessibilityHint={backAccessibilityHint}
          accessibilityLabel={backAccessibilityLabel}
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.backIconFrame}
          >
            <Back width={8.06829} height={13.3789} />
          </View>
        </Pressable>
        <Text accessibilityRole="header" ref={titleRef} style={styles.title}>{title}</Text>
      </View>

      <View style={styles.content}>{children}</View>

      <View style={styles.footer}>
        <View style={styles.footerActions}>
          {footerItems.map(({ action, theme }) => (
            <View key={action.id} style={styles.actionSlot}>
              <Button
                accessibilityHint={action.accessibilityHint}
                accessibilityLabel={action.accessibilityLabel}
                block
                disabled={action.disabled}
                onPress={action.onPress}
                shape="round"
                size="medium"
                theme={theme}
                variant="base"
              >
                {action.label}
              </Button>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const colors = colorThemes.light;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.container,
  },
  navbar: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.container,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  backButtonPressed: {
    backgroundColor: colors.background.component,
  },
  backIconFrame: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
    ...typographyTokens.title18Semibold,
  },
  content: {
    minHeight: 0,
    flex: 1,
    backgroundColor: colors.background.page,
  },
  footer: {
    backgroundColor: colors.background.container,
  },
  footerActions: {
    minHeight: 68,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  actionSlot: {
    minWidth: 0,
    flex: 1,
  },
});
