import type { TextStyle } from 'react-native';

export const colorThemes = {
  light: {
    brand: {
      default: '#1450F5',
      hover: '#4373F7',
      light: '#F3F6FE',
    },
    background: {
      page: '#F5F7FA',
      container: '#FFFFFF',
      secondaryContainer: '#F5F7FA',
      component: '#F2F4F7',
    },
    overlay: {
      modal: 'rgba(0, 0, 0, 0.60)',
    },
    border: {
      componentStroke: '#DFE1E8',
    },
    dataTile: {
      realtimeIconBackground: '#E7EDFE',
      sensorIconBackground: '#E3E3FF',
    },
    table: {
      border: '#DFE1E8',
      headerBackground: '#F2F4F7',
      alternateRowBackground: '#F5F7FA',
    },
    error: {
      default: '#F51414',
    },
    success: {
      default: '#1ED273',
      strong: '#1FBA68',
    },
    warning: {
      default: '#F98600',
      accent: '#FDAA31',
    },
    projectDetails: {
      statusHealthyBackground: 'rgba(31, 191, 107, 0.10)',
      statusAttentionBackground: 'rgba(253, 170, 49, 0.10)',
      statusRiskBackground: 'rgba(244, 85, 85, 0.10)',
      statusUnratedBackground: '#EAECF1',
      dailyReportBackground: '#E7EDFE',
      weeklyReportBackground: '#E3E3FF',
      monthlyReportBackground: '#F3EEE6',
      scoreCardBackground: '#FAFBFC',
    },
    text: {
      primary: '#141414',
      secondary: '#676A72',
      placeholder: '#8F9195',
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
  footer10Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '600',
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
  title24Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
} as const satisfies Record<string, TextStyle>;
