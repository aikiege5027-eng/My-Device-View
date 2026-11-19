import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import EventChevronRight from '../assets/event-chevron-right.svg';
import { colorThemes, typographyTokens } from '@kone/mobile-design-system';

type AiAssistBannerProps = {
  onPress: () => void;
  title: string;
};

/** 气泡路径按 24 单位绘制，实际显示尺寸由 `BADGE_SIZE` 缩放。 */
const BADGE_PATH_UNITS = 24;
const BADGE_SIZE = 22;
/** 徽标外围的白色描边宽度（px，向外延伸，不挤占主体）。 */
const BADGE_RING = 1;
/** 白色描边的不透明度。 */
const BADGE_RING_OPACITY = 0.5;
const BADGE_OUTER = BADGE_SIZE + BADGE_RING * 2;
/** 描边宽度换算成路径单位。 */
const BADGE_RING_UNITS = (BADGE_RING * BADGE_PATH_UNITS) / BADGE_SIZE;
const BADGE_VIEWBOX_UNITS = BADGE_PATH_UNITS + BADGE_RING_UNITS * 2;
/** 圆形气泡：左下角收成小圆角，像对话框的尾角。 */
const BADGE_PATH = 'M12 0A12 12 0 0 1 24 12A12 12 0 0 1 12 24H3A3 3 0 0 1 0 21V12A12 12 0 0 1 12 0Z';

/**
 * AI 入口横幅：胶囊形、浅蓝渐变底，左侧 AI 渐变徽标 + 文案，右侧箭头。
 * 样式参考用户提供的 AI 问答入口示意图，不属于共享设计系统，因此渐变色在此局部登记。
 */
export function AiAssistBanner({ onPress, title }: AiAssistBannerProps) {
  return (
    <Pressable
      accessibilityHint="进入 AI 故障分析"
      accessibilityLabel={title}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <Svg
        height="100%"
        pointerEvents="none"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
        width="100%"
      >
        <Defs>
          <LinearGradient id="aiBannerBackground" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#F8FAFF" />
            <Stop offset="0.55" stopColor="#EAF1FF" />
            <Stop offset="1" stopColor="#DCE8FF" />
          </LinearGradient>
        </Defs>
        <Rect fill="url(#aiBannerBackground)" height="100%" width="100%" />
      </Svg>

      <View style={styles.badgeWrap}>
        <View style={styles.badge}>
          <Svg
            height={BADGE_OUTER}
            pointerEvents="none"
            style={styles.badgeSvg}
            viewBox={`${-BADGE_RING_UNITS} ${-BADGE_RING_UNITS} ${BADGE_VIEWBOX_UNITS} ${BADGE_VIEWBOX_UNITS}`}
            width={BADGE_OUTER}
          >
            <Defs>
              <LinearGradient id="aiBadgeBackground" x1="0" x2="1" y1="0" y2="1">
                <Stop offset="0" stopColor="#C4A6FF" />
                <Stop offset="0.5" stopColor="#7B82FF" />
                <Stop offset="1" stopColor="#3A90FF" />
              </LinearGradient>
            </Defs>
            <Path d={BADGE_PATH} fill="none" stroke="#FFFFFF" strokeLinejoin="round" strokeOpacity={BADGE_RING_OPACITY} strokeWidth={BADGE_RING_UNITS * 2} />
            <Path d={BADGE_PATH} fill="url(#aiBadgeBackground)" />
          </Svg>
          <Text style={styles.badgeText}>AI</Text>
        </View>
      </View>

      <Text numberOfLines={2} style={styles.title}>{title}</Text>
      <View style={styles.chevron}>
        <EventChevronRight color={colors.text.placeholder} width={16} height={16} />
      </View>
    </Pressable>
  );
}

const colors = colorThemes.light;

const styles = StyleSheet.create({
  banner: {
    // 卡片内部上下内边距：内容（22 高）距上下边缘各 10，原为 15（minHeight 52）。
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(20, 80, 245, 0.16)',
    backgroundColor: '#FFFFFF',
  },
  pressed: { opacity: 0.72 },
  badgeWrap: { width: BADGE_SIZE, height: BADGE_SIZE },
  /** 描边向四周多出 BADGE_RING，靠负边距让它不影响横幅布局。 */
  badgeSvg: { position: 'absolute', top: -BADGE_RING, left: -BADGE_RING },
  badge: { width: BADGE_SIZE, height: BADGE_SIZE, alignItems: 'center', justifyContent: 'center' },
  /** 不用 fontStyle: 'italic'（系统合成的斜体倾角偏大），改用 skewX 手动控制倾斜度。 */
  badgeText: { color: '#FFFFFF', fontSize: 12, lineHeight: 14, fontWeight: '700', transform: [{ skewX: '-8deg' }] },
  title: { flex: 1, minWidth: 0, color: colors.text.primary, ...typographyTokens.body14Regular },
  /** 外包一层 View：裸 svg 在 web 上不是定位元素，会被绝对定位的渐变底盖住。 */
  chevron: { width: 16, height: 16 },
});
