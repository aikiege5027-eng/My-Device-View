import React from 'react';
import { Platform, StyleSheet, Text, View, type TextStyle } from 'react-native';
import { colorThemes, componentTokens, typographyTokens } from '@kone/mobile-design-system';
import { DataPanelTitle } from './DataPanelTitle';

/** 最近一次远程呼梯的结果；尚未呼梯时为 `null`。 */
export type AiLiftResult = 'success' | 'failure' | null;

type AiStep = {
  /** 与远程操作相关的步骤会带上标签，便于一眼找到。 */
  label?: string;
  text: string;
};

type AiAnalysis = {
  confidence: number;
  cause: string;
  evidence: readonly string[];
  steps: readonly AiStep[];
};

/**
 * 模拟生成的分析结果，并非真实模型输出。内容与页面上的演示数据对齐
 * （故障消息 0048、轿门B 已开门、轿厢停于非平层、远程呼梯 5F→1F）。
 * 远程呼梯完成后，结论、依据和建议操作随结果切换。
 */
function getAnalysis(liftResult: AiLiftResult, canRestart: boolean): AiAnalysis {
  if (liftResult === 'success') {
    return {
      confidence: 91,
      cause: '远程呼梯成功，轿厢已回到起始层。故障更像是轿门B锁触点接触不良引起的间歇性断开，暂无需紧急救援。',
      evidence: [
        '远程呼梯 5F→1F 已完成，轿厢可正常运行',
        '故障消息 0048 仍只有 1 次，呼梯后无新增',
        '轿门B曾为开门状态，仍需现场核实锁触点',
      ],
      steps: [
        { text: '与客户共同确认轿厢已平层，门可正常开关' },
        { label: '远程呼梯', text: '如需复核，可再远程呼梯 1 次（1 小时内最多 2 次），观察 0048 是否再次出现' },
        ...(canRestart
          ? [{ label: '远程重启', text: '若 0048 再次出现，可尝试 1 次远程重启恢复控制系统' }]
          : []),
        { text: '到现场检查轿门B锁触点，连续开关门 3 次，并在工单备注“间歇性故障，需跟踪”' },
      ],
    };
  }

  if (liftResult === 'failure') {
    return {
      confidence: 93,
      cause: '电梯对远程呼梯无响应，门锁回路可能仍处于断开状态，远程手段难以恢复，建议尽快到现场处理。',
      evidence: [
        '远程呼梯失败：电梯未响应',
        '轿厢仍停于非平层，门区信号为“在门区”',
        '故障消息 0048 记录 1 次，门锁回路疑似未恢复',
      ],
      steps: [
        { text: '联系客户确认轿厢内无人被困，必要时按被困流程处理' },
        { label: '远程呼梯', text: '不建议连续重复呼梯（1 小时内最多 2 次），先现场排查后再试' },
        ...(canRestart
          ? [{ label: '远程重启', text: '可尝试 1 次远程重启（1 小时内仅限 1 次），无响应则立即安排到场' }]
          : []),
        { text: '尽快安排维保员工到现场，检查轿门B锁触点与门锁回路' },
      ],
    };
  }

  return {
    confidence: 86,
    cause: '门锁回路瞬时断开，疑似轿门B锁触点接触不良，导致轿厢停在非平层。',
    evidence: [
      '故障消息 0048 出现 1 次，工单后无新增',
      '轿门B为开门状态，与轿门A（已关门）不一致',
      '轿厢停于非平层，门区信号为“在门区”',
    ],
    steps: [
      { text: '联系客户确认轿厢内无人被困' },
      { label: '远程呼梯', text: '点击底部「远程呼梯」让轿厢回到起始层，观察能否正常平层并开门（1 小时内最多 2 次）' },
      { text: '呼梯成功后，到现场检查轿门B锁钩、锁触点与门刀间隙' },
      { text: '呼梯失败或无响应时，请直接到现场处理' },
    ],
  };
}

/**
 * AI故障分析页顶部的 AI 分析卡片（模拟内容）：给出可能原因、依据与建议操作。
 * 远程呼梯完成后，内容会随呼梯结果变化。
 */
export function AiAnalysisCard({
  canRestart,
  liftResult,
}: {
  /** 设备是否支持远程重启（KCECPUC）。 */
  canRestart: boolean;
  liftResult: AiLiftResult;
}) {
  const analysis = getAnalysis(liftResult, canRestart);

  return (
    <View style={styles.card}>
      <DataPanelTitle
        action={(
          <View style={styles.confidenceTag}>
            <Text style={styles.confidenceText}>置信度 {analysis.confidence}%</Text>
          </View>
        )}
      >
        AI分析结果
      </DataPanelTitle>

      <View accessibilityLabel="原因分析" accessibilityLiveRegion="polite" style={styles.causeBlock}>
        <Text style={styles.causeText}>{analysis.cause}</Text>
        <View style={styles.evidenceQuote}>
          <Text style={styles.evidenceText}>
            <Text style={styles.evidenceLabel}>判断依据：</Text>
            {`${analysis.evidence.join('；')}。`}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>建议操作</Text>
        <View style={styles.stepList}>
          {analysis.steps.map((step, stepIndex) => (
            <View key={step.text} style={styles.listRow}>
              <Text style={styles.stepNumber}>{`${stepIndex + 1}.`}</Text>
              <Text style={styles.listText}>
                {step.label ? <><Text style={styles.stepLabel}>{step.label}</Text>：</> : null}
                {step.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.disclaimer}>以上内容由AI生成，请结合实际情况做判断。</Text>
    </View>
  );
}

const colors = colorThemes.light;
/** `warning.light`（#FFF1DB）再淡一层。设计系统没有更浅的橘黄，这里局部登记。 */
const CAUSE_BLOCK_BACKGROUND = '#FFF8EC';
const tokens = componentTokens.dataPanel;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: tokens.paddingHorizontal,
    paddingVertical: tokens.paddingVertical,
    borderRadius: tokens.radius,
    gap: 12,
    backgroundColor: colors.background.container,
  },
  causeBlock: {
    padding: 12,
    gap: 6,
    borderRadius: 8,
    backgroundColor: CAUSE_BLOCK_BACKGROUND,
  },
  sectionTitle: { color: colors.text.primary, ...typographyTokens.body14Medium },
  /** 引用样式：左侧一条与整段等高的细竖线。 */
  evidenceQuote: { paddingLeft: 8, borderLeftWidth: 1, borderLeftColor: colors.border.componentStroke },
  evidenceLabel: { color: colors.text.secondary, ...typographyTokens.body14Medium },
  evidenceText: { color: colors.text.secondary, ...typographyTokens.body14Regular },
  /** 与卡片标题同一行，靠右。 */
  confidenceTag: {
    marginLeft: 'auto',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: colors.brand.light,
  },
  confidenceText: { color: colors.text.brand, ...typographyTokens.footer12Medium },
  causeText: { color: colors.text.primary, ...typographyTokens.body14Medium },
  section: { gap: 8 },
  /** 各条建议之间的间距（原为 8）。标题与第一条的间距仍由 section 的 gap 控制。 */
  stepList: { gap: 4 },
  /** 序号与正文贴近：序号宽 14（容纳「1.」），间距 2。 */
  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 2 },
  /** 序号用普通正文样式，不再加色或圆底。 */
  stepNumber: { width: 14, color: colors.text.primary, ...typographyTokens.body14Regular },
  /**
   * 远程操作关键词：黑色、Medium、虚线下划线。
   * 下划线与文字的距离只有 web 能调（`text-underline-offset`）；
   * iOS / Android 的 Text 没有对应属性，保持系统默认位置。
   */
  stepLabel: {
    color: colors.text.primary,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
    ...typographyTokens.body14Medium,
    ...(Platform.OS === 'web' ? ({ textUnderlineOffset: 3 } as TextStyle) : null),
  },
  listText: { flex: 1, minWidth: 0, color: colors.text.primary, ...typographyTokens.body14Regular },
  disclaimer: { color: colors.text.placeholder, ...typographyTokens.footer12Regular },
});
