import type { TextStyle } from 'react-native';

export const colorThemes = {
  light: {
    brand: {
      default: '#1450F5',
      hover: '#4373F7',
      active: '#1444C8',
      disabled: '#A1B9FB',
      light: '#F3F6FE',
    },
    background: {
      page: '#F5F7FA',
      container: '#FFFFFF',
      secondaryContainer: '#F5F7FA',
      component: '#F2F4F7',
      transparent: 'transparent',
    },
    overlay: {
      modal: 'rgba(0, 0, 0, 0.60)',
    },
    border: {
      componentStroke: '#DFE1E8',
      componentBorder: '#C8CAD0',
    },
    dataTile: {
      realtimeIconBackground: '#E7EDFE',
      sensorIconBackground: '#E3E3FF',
    },
    home: {
      heroPink: '#FEF3F3',
      heroGreen: '#E8FBF1',
      pageBackground: '#F2F4F7',
      organizationText: '#3D464C',
      strongText: '#11161A',
      contractHeaderBackground: '#D0DCFD',
      protocolBackground: '#F1F1FF',
      protocolBorder: '#DDDDFE',
    },
    table: {
      border: '#DFE1E8',
      headerBackground: '#F2F4F7',
      alternateRowBackground: '#F5F7FA',
    },
    error: {
      default: '#F51414',
      disabled: '#FBA1A1',
      light: '#FEF3F3',
    },
    success: {
      default: '#1ED273',
      strong: '#1FBA68',
      disabled: '#8CEEBA',
      light: '#DBFBEA',
    },
    warning: {
      default: '#F98600',
      accent: '#FDAA31',
      disabled: '#FFD18D',
      light: '#FFF1DB',
    },
    projectDetails: {
      statusHealthyBackground: 'rgba(31, 191, 107, 0.10)',
      statusAttentionBackground: 'rgba(253, 170, 49, 0.10)',
      statusRiskBackground: 'rgba(244, 85, 85, 0.10)',
      statusUnratedBackground: '#EAECF1',
      statusAttentionTagStart: '#FFC775',
      statusAttentionTagEnd: '#FDA92E',
      statusRiskTagStart: '#FF8484',
      statusRiskTagEnd: '#F45555',
      dailyReportBackground: '#E7EDFE',
      weeklyReportBackground: '#E3E3FF',
      monthlyReportBackground: '#F3EEE6',
      scoreCardBackground: '#FAFBFC',
    },
    text: {
      primary: '#141414',
      secondary: '#676A72',
      placeholder: '#8F9195',
      disabled: '#ABADB2',
      white: '#FFFFFF',
      brand: '#1450F5',
      link: '#1450F5',
    },
  },
  dark: {
    text: {
      link: '#1450F5',
    },
  },
} as const;

export const radiusTokens = {
  small: 4,
  medium: 6,
  circle: 9999,
  tagRound: 128,
} as const;

export const typographyTokens = {
  data16Regular: {
    fontFamily: 'KONE Information',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '400',
  },
  data24Regular: {
    fontFamily: 'KONE Information',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '400',
  },
  footer10Regular: {
    fontFamily: 'PingFang SC',
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '400',
  },
  footer10Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '600',
  },
  status15Semibold: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  projectStatus11Regular: {
    fontFamily: 'PingFang SC',
    fontSize: 11,
    lineHeight: 18,
    fontWeight: '400',
  },
  footer12Regular: {
    fontFamily: 'PingFang SC',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '400',
  },
  footer12Medium: {
    fontFamily: 'PingFang SC',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  paragraph13Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  body14Regular: {
    fontFamily: 'PingFang SC',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  body14Medium: {
    fontFamily: 'PingFang SC',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  body14Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  title16Regular: {
    fontFamily: 'PingFang SC',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  title16Medium: {
    fontFamily: 'PingFang SC',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  title16Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title18Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },
  title20Medium: {
    fontFamily: 'PingFang SC',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500',
  },
  title30Medium: {
    fontFamily: 'PingFang SC',
    fontSize: 30,
    lineHeight: 44,
    fontWeight: '500',
  },
  title24Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
} as const satisfies Record<string, TextStyle>;

export const componentTokens = {
  dataPanel: {
    cardGap: 12,
    contentGap: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    radius: 12,
    titleGap: 8,
    titleAccentWidth: 4,
    titleAccentHeight: 14,
    titleAccentRadius: 1,
  },
  checkbox: {
    rowMinHeight: 56,
    rowWithDescriptionMinHeight: 82,
    paddingHorizontal: 16,
    paddingVertical: 16,
    indicatorSize: 24,
    indicatorContentGap: 8,
    titleDescriptionGap: 4,
    dividerWidth: 0.5,
    glyphStrokeWidth: 1.5,
    checkWidth: 18.5758,
    checkHeight: 12.7634,
    mixedWidth: 12,
    card: {
      minHeight: 52,
      paddingLeft: 24,
      paddingRight: 8,
      paddingVertical: 6,
      borderWidth: 1.5,
      radius: 6,
      indicatorSize: 28,
      gap: 6,
    },
  },
  link: {
    /** Figma Link 容器圆角，见 Picker 内嵌 Link 实例。 */
    radius: 3,
    sizes: {
      /** 当前仅读取到 `size=medium`；其余尺寸未在已读节点中出现。 */
      medium: {
        /** Body 14/22 行高即 Link 的视觉高度（无内边距）。 */
        minHeight: 22,
        /** 视觉高度不等于触控热区，用 hitSlop 扩展且不改变布局。 */
        hitSlopHorizontal: 8,
        hitSlopVertical: 11,
      },
    },
  },
  picker: {
    topRadius: 12,
    paddingBottom: 16,
    headerHeight: 58,
    /**
     * Figma 当前 `4 columns + title=false` 变体为 375×256、header 56；
     * 其余 7 个变体为 375×258、header 58。保留该差异，不静默归一。
     */
    headerHeightWithoutTitleFourColumns: 56,
    headerPaddingHorizontal: 16,
    headerPaddingVertical: 16,
    headerGap: 4,
    /** indicator 在 375 基准面板中的绝对 y；8 个变体均固定为 130。 */
    indicatorTop: 130,
    /** 5 × optionHeight + 4 × optionGap = 184。 */
    contentHeight: 184,
    contentPaddingHorizontal: 16,
    visibleOptionCount: 5,
    optionHeight: 24,
    optionGap: 16,
    optionPaddingHorizontal: 8,
    /** optionHeight + optionGap，滚动吸附步距。 */
    snapInterval: 40,
    indicatorHeight: 40,
    maskHeight: 48,
    minColumnCount: 1,
    maxColumnCount: 4,
  },
  filterBar: {
    /** Figma row height for the filter trigger line (Frame 1000015803, 344x20). */
    rowMinHeight: 20,
    /** Auto-layout gap between filter triggers. */
    itemGap: 24,
    /** Gap between the selected-value label and the caret icon. */
    labelIconGap: 2,
    /** caret-down-small graphic size. */
    iconSize: 16,
    /** Minimum touch target; the 20px visual height is not the hit area. */
    minTouchSize: 44,
    /** Figma defines at most four triggers in one filter row. */
    maxItems: 4,
  },
  projectStatusTag: {
    width: 48,
    height: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    contentGap: 2,
    iconSize: 12,
    radius: 11,
  },
  tag: {
    borderWidth: 1,
    sizes: {
      extraLarge: {
        minHeight: 40,
        paddingHorizontal: 16,
        paddingVertical: 9,
        iconSize: 16,
        contentGap: 4,
        closeGap: 12,
        radius: 6,
      },
      large: {
        minHeight: 28,
        paddingHorizontal: 10,
        paddingVertical: 3,
        iconSize: 16,
        contentGap: 4,
        closeGap: 8,
        radius: 4,
      },
      medium: {
        minHeight: 24,
        paddingHorizontal: 8,
        paddingVertical: 2,
        iconSize: 14,
        contentGap: 4,
        closeGap: 8,
        radius: 4,
      },
      small: {
        minHeight: 20,
        paddingHorizontal: 6,
        paddingVertical: 2,
        iconSize: 12,
        contentGap: 2,
        closeGap: 4,
        radius: 4,
      },
    },
  },
  checkTag: {
    sizes: {
      extraLarge: {
        minHeight: 40,
        paddingHorizontal: 16,
        paddingVertical: 9,
        iconSize: 16,
        contentGap: 4,
        radius: 6,
      },
      large: {
        minHeight: 32,
        paddingHorizontal: 10,
        paddingVertical: 5,
        iconSize: 16,
        contentGap: 4,
        radius: 4,
      },
      medium: {
        minHeight: 24,
        paddingHorizontal: 8,
        paddingVertical: 2,
        iconSize: 14,
        contentGap: 4,
        radius: 4,
      },
      small: {
        minHeight: 20,
        paddingHorizontal: 6,
        paddingVertical: 2,
        iconSize: 12,
        contentGap: 2,
        radius: 4,
      },
    },
  },
} as const;
