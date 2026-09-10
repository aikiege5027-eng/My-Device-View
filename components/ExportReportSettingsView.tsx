import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Checkbox,
  CheckTag,
  PageTemplate,
  colorThemes,
  componentTokens,
  typographyTokens,
} from '@kone/mobile-design-system';
import { AnalysisCollapse, type AnalysisCollapseItem } from './AnalysisCollapse';
import { CompactSelectAll } from './CompactSelectAll';
import { CompactSelectCard } from './CompactSelectCard';
import { DataPanelTitle } from './DataPanelTitle';
import { ChevronDownIcon } from './icons';
import { ProjectStatusTag } from './ProjectStatusTag';
import { VersionSwitcher } from './VersionSwitcher';

type ExportReportSettingsViewProps = {
  onBack: () => void;
  onExportReport: () => void;
  titleRef?: React.Ref<Text>;
};

type ExportReportVersion = 'v1' | 'v2' | 'v3';

const versionOptions = [
  { accessibilityLabel: '版本一', label: 'V1', value: 'v1' },
  { accessibilityLabel: '版本二', label: 'V2', value: 'v2' },
  { accessibilityLabel: '版本三', label: 'V3', value: 'v3' },
] as const satisfies readonly {
  accessibilityLabel: string;
  label: string;
  value: ExportReportVersion;
}[];

type DeviceHealthStatus = 'attention' | 'healthy' | 'risk';

type ExportDevice = {
  id: string;
  name: string;
  serialNumber: string;
  status: DeviceHealthStatus;
};

const analysisDimensions = [
  { id: 'project-health', label: '项目健康五维图' },
  { id: 'wire-rope-life', label: '钢丝绳年限分析' },
  { id: 'usage-count', label: '电梯使用次数统计' },
  { id: 'fault-images', label: '故障图片' },
] as const;

type AnalysisDimensionId = (typeof analysisDimensions)[number]['id'];

/** Version two splits the dimensions into a report-body group and a component group. */
const reportBodyDimensions = [
  { id: 'project-health', label: '项目健康五维图' },
  { id: 'usage-count', label: '电梯使用次数统计' },
] as const satisfies readonly { id: AnalysisDimensionId; label: string }[];

type ReportBodyDimensionId = (typeof reportBodyDimensions)[number]['id'];

type ComponentDimension = {
  id: string;
  label: string;
};

/** Dimensions offered under the 钢丝绳 panel of the version two component card. */
const wireRopeDimensions: readonly ComponentDimension[] = [
  { id: 'wire-rope-life', label: '钢丝绳年限分析' },
  { id: 'fault-images', label: '故障图片' },
];

/** 变频器 mock dimensions; mirrors the 钢丝绳 shape until real ones are defined. */
const inverterDimensions: readonly ComponentDimension[] = [
  { id: 'inverter-life', label: '变频器年限分析' },
  { id: 'fault-images', label: '故障图片' },
];

const exportDevices: readonly ExportDevice[] = [
  { id: 'lift-a-c', name: 'A-C梯', serialNumber: '42369783', status: 'healthy' },
  { id: 'lift-a-d', name: 'A-D梯', serialNumber: '42369784', status: 'attention' },
  { id: 'lift-b-c', name: 'B-C梯', serialNumber: '42369785', status: 'risk' },
  { id: 'lift-b-d', name: 'B-D梯', serialNumber: '42369786', status: 'healthy' },
  { id: 'passenger-lift-1', name: '1号客梯', serialNumber: '42369787', status: 'healthy' },
  { id: 'passenger-lift-2', name: '2号客梯', serialNumber: '42369788', status: 'attention' },
  { id: 'passenger-lift-3', name: '3号客梯', serialNumber: '42369789', status: 'healthy' },
  { id: 'passenger-lift-4', name: '4号客梯', serialNumber: '42369790', status: 'risk' },
  { id: 'freight-lift-1', name: '1号货梯', serialNumber: '42369791', status: 'attention' },
  { id: 'freight-lift-2', name: '2号货梯', serialNumber: '42369792', status: 'healthy' },
  { id: 'east-fire-lift', name: '东区一号消防电梯', serialNumber: '42369793', status: 'risk' },
  { id: 'west-fire-lift', name: '西区二号消防电梯', serialNumber: '42369794', status: 'healthy' },
  { id: 'north-service-lift', name: '北塔高层专用服务梯', serialNumber: '42369795', status: 'attention' },
  { id: 'south-service-lift', name: '南塔低层专用服务梯', serialNumber: '42369796', status: 'healthy' },
];

/** 每个部件面板下建议更换的设备。钢丝绳 5 台，变频器 7 台。 */
const wireRopeDevices = exportDevices.slice(0, 5);
const inverterDevices = exportDevices.slice(5, 12);

/** 设备列表默认展示的条数，超出后由「查看更多」/「收起」控制。 */
const deviceListVisibleLimit = 5;

/** 「查看更多」的 chevron 比折叠 header 的 24 小一档，与 14 号文字同级。 */
const deviceListToggleIconSize = 16;

/** 视觉高度只有 22，用 hitSlop 补足触控热区且不改变布局。 */
const deviceListToggleHitSlop = { bottom: 8, left: 8, right: 8, top: 8 };

const allDimensionIds = analysisDimensions.map(({ id }) => id);
const allReportBodyDimensionIds = reportBodyDimensions.map(({ id }) => id);
const allWireRopeDimensionIds = wireRopeDimensions.map(({ id }) => id);
const allWireRopeDeviceIds = wireRopeDevices.map(({ id }) => id);
const allInverterDimensionIds = inverterDimensions.map(({ id }) => id);
const allInverterDeviceIds = inverterDevices.map(({ id }) => id);
const allDeviceIds = exportDevices.map(({ id }) => id);

const statusLabels: Record<DeviceHealthStatus, string> = {
  attention: '注意',
  healthy: '健康',
  risk: '风险',
};

const maxVisibleDeviceNameLength = 6;

function getVisibleDeviceName(name: string) {
  const characters = Array.from(name);

  return characters.length > maxVisibleDeviceNameLength
    ? `${characters.slice(0, maxVisibleDeviceNameLength).join('')}…`
    : name;
}

type SelectAllProps = {
  accessibilityLabel: string;
  allSelected: boolean;
  onToggle: () => void;
  someSelected: boolean;
};

/** 设备列表上方的全选行，左对齐。 */
function SelectAllRow(props: SelectAllProps) {
  return (
    <View style={styles.selectAllRow}>
      <CompactSelectAll {...props} />
    </View>
  );
}

/**
 * 设备名的排版档位。
 *
 * - `strong`：`Title 16/24 Medium`，版本一的基准。
 * - `subtle`：`Body 14/22 Regular`，版本二在折叠面板里降一档字号与字重。
 */
type DeviceNameEmphasis = 'strong' | 'subtle';

function getDeviceAccessibilityLabel(device: ExportDevice) {
  return `${device.name}，设备编号 ${device.serialNumber}，状态${statusLabels[device.status]}`;
}

/** 卡片内的一行：设备名 / 分隔线 / 设备编号 / 状态标签。两个版本共用。 */
function DeviceRowContent({
  device,
  nameEmphasis,
}: {
  device: ExportDevice;
  nameEmphasis: DeviceNameEmphasis;
}) {
  return (
    <View style={styles.deviceCardContent}>
      <View style={styles.deviceIdentity}>
        <Text
          numberOfLines={1}
          style={[
            styles.deviceName,
            nameEmphasis === 'subtle' ? styles.deviceNameSubtle : undefined,
          ]}
        >
          {getVisibleDeviceName(device.name)}
        </Text>
        <View
          accessible={false}
          importantForAccessibility="no"
          style={styles.deviceDivider}
        />
        <Text numberOfLines={1} style={styles.deviceSerial}>
          {device.serialNumber}
        </Text>
      </View>
      <ProjectStatusTag status={device.status} />
    </View>
  );
}

function toggleId(
  ids: readonly string[],
  id: string,
  checked: boolean,
): readonly string[] {
  if (checked) {
    return ids.includes(id) ? ids : [...ids, id];
  }
  return ids.filter((current) => current !== id);
}

type DeviceCardProps = {
  device: ExportDevice;
  onChange: (checked: boolean) => void;
  selected: boolean;
  testID: string;
};

/** 版本一：设计系统 `Checkbox variant="card"` 的基准行高。 */
function DeviceCheckbox({ device, onChange, selected, testID }: DeviceCardProps) {
  return (
    <Checkbox
      accessibilityLabel={getDeviceAccessibilityLabel(device)}
      checked={selected}
      label={device.name}
      onChange={onChange}
      testID={testID}
      variant="card"
    >
      <DeviceRowContent device={device} nameEmphasis="strong" />
    </Checkbox>
  );
}

/** 版本二：折叠面板内的紧凑卡片，行高与排版由页面自己定制。 */
function CompactDeviceCard({ device, onChange, selected, testID }: DeviceCardProps) {
  return (
    <CompactSelectCard
      accessibilityLabel={getDeviceAccessibilityLabel(device)}
      checked={selected}
      onChange={onChange}
      testID={testID}
    >
      <DeviceRowContent device={device} nameEmphasis="subtle" />
    </CompactSelectCard>
  );
}

type ComponentPanelBodyProps = {
  devices: readonly ExportDevice[];
  dimensions: readonly ComponentDimension[];
  /** testID 与可访问文案前缀，例如「钢丝绳」。 */
  idPrefix: string;
  label: string;
  onChangeDeviceIds: (ids: readonly string[]) => void;
  onChangeDimensionIds: (ids: readonly string[]) => void;
  selectedDeviceIds: readonly string[];
  selectedDimensionIds: readonly string[];
};

/**
 * 部件折叠面板的内容：分析维度 tag 组 + 全选 + 设备列表。
 *
 * 设备数超过 `deviceListVisibleLimit` 时默认只展示前若干条，底部由「查看更多」/
 * 「收起」控制。展开状态是纯展示态，随面板收起一起重置。
 */
function ComponentPanelBody({
  devices,
  dimensions,
  idPrefix,
  label,
  onChangeDeviceIds,
  onChangeDimensionIds,
  selectedDeviceIds,
  selectedDimensionIds,
}: ComponentPanelBodyProps) {
  const [showAllDevices, setShowAllDevices] = useState(false);

  const truncatable = devices.length > deviceListVisibleLimit;
  const visibleDevices = truncatable && !showAllDevices
    ? devices.slice(0, deviceListVisibleLimit)
    : devices;
  const hiddenCount = devices.length - deviceListVisibleLimit;
  const allSelected = selectedDeviceIds.length === devices.length;
  const someSelected = selectedDeviceIds.length > 0;

  return (
    <View style={styles.componentPanelContent}>
      <View accessibilityLabel={`${label}分析维度选项`} style={styles.tagGroup}>
        {dimensions.map(({ id, label: dimensionLabel }) => {
          const selected = selectedDimensionIds.includes(id);
          return (
            <CheckTag
              checked={selected}
              key={id}
              label={dimensionLabel}
              onChange={(checked) =>
                onChangeDimensionIds(toggleId(selectedDimensionIds, id, checked))
              }
              shape="round"
              size="large"
              testID={`${idPrefix}-dimension-${id}`}
              uncheckedBorder="stroke"
              variant={selected ? 'lightOutline' : 'light'}
            />
          );
        })}
      </View>

      <View style={styles.deviceSelection}>
        <SelectAllRow
          accessibilityLabel={`全选${label}设备`}
          allSelected={allSelected}
          onToggle={() => onChangeDeviceIds(allSelected ? [] : devices.map(({ id }) => id))}
          someSelected={someSelected}
        />
        <View accessibilityLabel={`${label}设备选项`} style={styles.deviceList}>
          {visibleDevices.map((device) => (
            <CompactDeviceCard
              device={device}
              key={device.id}
              onChange={(checked) =>
                onChangeDeviceIds(toggleId(selectedDeviceIds, device.id, checked))
              }
              selected={selectedDeviceIds.includes(device.id)}
              testID={`${idPrefix}-device-${device.id}`}
            />
          ))}
        </View>
        {truncatable ? (
          <View style={styles.deviceListToggle}>
            <Pressable
              accessibilityHint={
                showAllDevices
                  ? `收起后只显示前 ${deviceListVisibleLimit} 台设备`
                  : `展开剩余 ${hiddenCount} 台设备`
              }
              accessibilityLabel={showAllDevices ? '收起' : '查看更多'}
              accessibilityRole="button"
              accessibilityState={{ expanded: showAllDevices }}
              hitSlop={deviceListToggleHitSlop}
              onPress={() => setShowAllDevices((current) => !current)}
              style={styles.deviceListToggleControl}
              testID={`${idPrefix}-device-list-toggle`}
            >
              <Text style={styles.deviceListToggleLabel}>
                {showAllDevices ? '收起' : '查看更多'}
              </Text>
              <View style={showAllDevices ? styles.deviceListToggleIconUp : undefined}>
                <ChevronDownIcon
                  color={colors.text.placeholder}
                  size={deviceListToggleIconSize}
                />
              </View>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function ExportReportSettingsView({
  onBack,
  onExportReport,
  titleRef,
}: ExportReportSettingsViewProps) {
  const [version, setVersion] = useState<ExportReportVersion>('v1');
  const [selectedDimensionIds, setSelectedDimensionIds] =
    useState<readonly AnalysisDimensionId[]>(allDimensionIds);
  const [selectedDeviceIds, setSelectedDeviceIds] =
    useState<readonly string[]>(allDeviceIds);
  const [selectedReportBodyIds, setSelectedReportBodyIds] =
    useState<readonly ReportBodyDimensionId[]>(allReportBodyDimensionIds);
  const [expandedComponentIds, setExpandedComponentIds] =
    useState<readonly string[]>(['wire-rope']);
  const [selectedWireRopeDimensionIds, setSelectedWireRopeDimensionIds] =
    useState<readonly string[]>(allWireRopeDimensionIds);
  const [selectedWireRopeDeviceIds, setSelectedWireRopeDeviceIds] =
    useState<readonly string[]>(allWireRopeDeviceIds);
  const [selectedInverterDimensionIds, setSelectedInverterDimensionIds] =
    useState<readonly string[]>(allInverterDimensionIds);
  const [selectedInverterDeviceIds, setSelectedInverterDeviceIds] =
    useState<readonly string[]>(allInverterDeviceIds);

  const allDevicesSelected = selectedDeviceIds.length === allDeviceIds.length;
  const someDevicesSelected = selectedDeviceIds.length > 0;
  const exportDisabled =
    version === 'v1' && (selectedDimensionIds.length === 0 || !someDevicesSelected);

  const toggleDimension = (id: AnalysisDimensionId, checked: boolean) => {
    setSelectedDimensionIds((current) =>
      checked
        ? current.includes(id) ? current : [...current, id]
        : current.filter((currentId) => currentId !== id),
    );
  };

  const toggleReportBodyDimension = (id: ReportBodyDimensionId, checked: boolean) => {
    setSelectedReportBodyIds((current) =>
      checked
        ? current.includes(id) ? current : [...current, id]
        : current.filter((currentId) => currentId !== id),
    );
  };

  const toggleDevice = (id: string, checked: boolean) => {
    setSelectedDeviceIds((current) =>
      checked
        ? current.includes(id) ? current : [...current, id]
        : current.filter((currentId) => currentId !== id),
    );
  };

  const selectAllDevices = () => {
    setSelectedDeviceIds(allDevicesSelected ? [] : allDeviceIds);
  };

  const wireRopePanel: AnalysisCollapseItem = {
    accessibilityHint: '展开或收起钢丝绳的分析维度与设备列表',
    actionText: `${wireRopeDevices.length}台设备建议更换`,
    content: (
      <ComponentPanelBody
        devices={wireRopeDevices}
        dimensions={wireRopeDimensions}
        idPrefix="wire-rope"
        label="钢丝绳"
        onChangeDeviceIds={setSelectedWireRopeDeviceIds}
        onChangeDimensionIds={setSelectedWireRopeDimensionIds}
        selectedDeviceIds={selectedWireRopeDeviceIds}
        selectedDimensionIds={selectedWireRopeDimensionIds}
      />
    ),
    id: 'wire-rope',
    title: '钢丝绳',
  };

  const inverterPanel: AnalysisCollapseItem = {
    accessibilityHint: '展开或收起变频器的分析维度与设备列表',
    actionText: `${inverterDevices.length}台设备建议更换`,
    content: (
      <ComponentPanelBody
        devices={inverterDevices}
        dimensions={inverterDimensions}
        idPrefix="inverter"
        label="变频器"
        onChangeDeviceIds={setSelectedInverterDeviceIds}
        onChangeDimensionIds={setSelectedInverterDimensionIds}
        selectedDeviceIds={selectedInverterDeviceIds}
        selectedDimensionIds={selectedInverterDimensionIds}
      />
    ),
    id: 'inverter',
    title: '变频器',
  };

  /** 版本三的部件分析维度只保留钢丝绳。 */
  const componentPanels: readonly AnalysisCollapseItem[] =
    version === 'v3' ? [wireRopePanel] : [wireRopePanel, inverterPanel];

  return (
    <PageTemplate
      backAccessibilityHint="返回项目详情"
      backAccessibilityLabel="返回"
      footer={{
        primary: {
          accessibilityHint: exportDisabled
            ? '请至少选择一个分析维度和一台设备'
            : '按当前设置导出项目健康报告',
          disabled: exportDisabled,
          id: 'export-report',
          label: '导出报告',
          onPress: onExportReport,
        },
        variant: 'singlePrimary',
      }}
      onBack={onBack}
      title="导出报告设置"
      titleRef={titleRef}
    >
      <View style={styles.page}>
        {version === 'v1' ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
          >
            <View style={styles.reportScope}>
              <Text style={styles.reportScopeText}>
                * 本报告仅针对钢丝绳，近期已更换钢丝绳的电梯可取消勾选。
              </Text>
            </View>

            <View style={styles.section}>
              <DataPanelTitle>报告分析维度</DataPanelTitle>
              <View accessibilityLabel="报告分析维度选项" style={styles.tagGroup}>
                {analysisDimensions.map(({ id, label }) => {
                  const selected = selectedDimensionIds.includes(id);
                  return (
                    <CheckTag
                      checked={selected}
                      key={id}
                      label={label}
                      onChange={(checked) => toggleDimension(id, checked)}
                      shape="round"
                      size="large"
                      testID={`analysis-${id}`}
                      uncheckedBorder="stroke"
                      variant={selected ? 'lightOutline' : 'light'}
                    />
                  );
                })}
              </View>
            </View>

            <View style={styles.deviceSection}>
              <DataPanelTitle>导出设备选择</DataPanelTitle>
              <SelectAllRow
                accessibilityLabel="全选导出设备"
                allSelected={allDevicesSelected}
                onToggle={selectAllDevices}
                someSelected={someDevicesSelected}
              />
              <View accessibilityLabel="导出设备选项" style={styles.deviceList}>
                {exportDevices.map((device) => (
                  <DeviceCheckbox
                    device={device}
                    key={device.id}
                    onChange={(checked) => toggleDevice(device.id, checked)}
                    selected={selectedDeviceIds.includes(device.id)}
                    testID={`device-${device.id}`}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.versionTwoContent}
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
          >
            <View style={styles.versionTwoCard}>
              <DataPanelTitle>主体分析维度</DataPanelTitle>
              <View accessibilityLabel="主体分析维度选项" style={styles.tagGroup}>
                {reportBodyDimensions.map(({ id, label }) => {
                  const selected = selectedReportBodyIds.includes(id);
                  return (
                    <CheckTag
                      checked={selected}
                      key={id}
                      label={label}
                      onChange={(checked) => toggleReportBodyDimension(id, checked)}
                      shape="round"
                      size="large"
                      testID={`report-body-${id}`}
                      uncheckedBorder="stroke"
                      variant={selected ? 'lightOutline' : 'light'}
                    />
                  );
                })}
              </View>
            </View>

            <View style={styles.versionTwoCard}>
              <DataPanelTitle>部件分析维度</DataPanelTitle>
              <View style={styles.componentCollapseGroup}>
                <AnalysisCollapse
                  accessibilityLabel="部件分析维度"
                  accordion
                  items={componentPanels}
                  onChange={setExpandedComponentIds}
                  value={expandedComponentIds}
                />
              </View>
            </View>
          </ScrollView>
        )}

        <VersionSwitcher
          accessibilityLabel="导出报告设置页面版本切换"
          onChange={setVersion}
          options={versionOptions}
          value={version}
        />
      </View>
    </PageTemplate>
  );
}

const colors = colorThemes.light;
const checkboxCardTokens = componentTokens.checkbox.card;
const dataPanelTokens = componentTokens.dataPanel;

const styles = StyleSheet.create({
  page: {
    minHeight: 0,
    flex: 1,
    backgroundColor: colors.background.page,
  },
  scroll: {
    minHeight: 0,
    flex: 1,
    backgroundColor: colors.background.page,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  versionTwoContent: {
    gap: dataPanelTokens.cardGap,
    paddingTop: 12,
    paddingBottom: 24,
  },
  versionTwoCard: {
    gap: dataPanelTokens.contentGap,
    marginHorizontal: 16,
    /** 折叠行会铺到卡片边缘，需由卡片裁切圆角，否则会盖掉下方两个圆角。 */
    overflow: 'hidden',
    paddingHorizontal: dataPanelTokens.paddingHorizontal,
    paddingVertical: dataPanelTokens.paddingVertical,
    borderRadius: dataPanelTokens.radius,
    backgroundColor: colors.background.container,
  },
  reportScope: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  reportScopeText: {
    color: colors.text.placeholder,
    ...typographyTokens.footer12Regular,
  },
  section: {
    gap: dataPanelTokens.contentGap,
    marginHorizontal: 16,
    paddingHorizontal: dataPanelTokens.paddingHorizontal,
    paddingVertical: dataPanelTokens.paddingVertical,
    borderRadius: dataPanelTokens.radius,
    backgroundColor: colors.background.container,
  },
  tagGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  /**
   * 折叠行铺满卡片宽度，分割线才能按自身规则缩进。首行与末行 header 自带 16 上下
   * 内边距，与卡片标题间距、卡片下内边距重复，因此把这两处抵掉，只留 header 自身的
   * 16，与另一张卡片保持同一节奏。
   */
  componentCollapseGroup: {
    marginTop: -dataPanelTokens.contentGap,
    marginHorizontal: -dataPanelTokens.paddingHorizontal,
    marginBottom: -dataPanelTokens.paddingVertical,
  },
  componentPanelContent: {
    gap: 16,
  },

  deviceSection: {
    gap: dataPanelTokens.contentGap,
    marginTop: dataPanelTokens.cardGap,
    marginHorizontal: 16,
    paddingHorizontal: dataPanelTokens.paddingHorizontal,
    paddingVertical: dataPanelTokens.paddingVertical,
    borderRadius: dataPanelTokens.radius,
    backgroundColor: colors.background.container,
  },
  selectAllRow: {
    alignItems: 'flex-start',
  },
  deviceSelection: {
    gap: 8,
  },
  deviceListToggle: {
    alignItems: 'center',
    paddingTop: 4,
  },
  deviceListToggleControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  deviceListToggleLabel: {
    color: colors.text.placeholder,
    ...typographyTokens.body14Regular,
  },
  deviceListToggleIconUp: {
    transform: [{ rotate: '180deg' }],
  },
  deviceList: {
    gap: checkboxCardTokens.gap,
  },
  deviceCardContent: {
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  deviceIdentity: {
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 8,
  },
  deviceName: {
    minWidth: 0,
    flexShrink: 1,
    color: colors.text.primary,
    ...typographyTokens.title16Medium,
  },
  deviceNameSubtle: {
    ...typographyTokens.body14Regular,
  },
  deviceDivider: {
    width: 1,
    height: 14,
    flexShrink: 0,
    backgroundColor: colors.border.componentStroke,
  },
  deviceSerial: {
    flexShrink: 0,
    color: colors.text.secondary,
    ...typographyTokens.body14Regular,
  },
});
