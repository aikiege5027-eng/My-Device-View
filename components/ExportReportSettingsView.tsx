import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  colorThemes,
  componentTokens,
  typographyTokens,
} from '../designTokens';
import { Checkbox } from './Checkbox';
import { DataPanelTitle } from './DataPanelTitle';
import { PageTemplate } from './PageTemplate';
import { ProjectStatusTag } from './ProjectStatusTag';
import { CheckTag } from './Tag';

type ExportReportSettingsViewProps = {
  onBack: () => void;
  onExportReport: () => void;
  titleRef?: React.Ref<Text>;
};

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

const allDimensionIds = analysisDimensions.map(({ id }) => id);
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

export function ExportReportSettingsView({
  onBack,
  onExportReport,
  titleRef,
}: ExportReportSettingsViewProps) {
  const [selectedDimensionIds, setSelectedDimensionIds] =
    useState<readonly AnalysisDimensionId[]>(allDimensionIds);
  const [selectedDeviceIds, setSelectedDeviceIds] =
    useState<readonly string[]>(allDeviceIds);

  const allDevicesSelected = selectedDeviceIds.length === allDeviceIds.length;
  const someDevicesSelected = selectedDeviceIds.length > 0;
  const exportDisabled = selectedDimensionIds.length === 0 || !someDevicesSelected;

  const toggleDimension = (id: AnalysisDimensionId, checked: boolean) => {
    setSelectedDimensionIds((current) =>
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

  const selectAllCheckbox = someDevicesSelected && !allDevicesSelected ? (
    <Checkbox
      accessibilityLabel="全选导出设备，已选择部分设备"
      checked
      indeterminate
      iconTheme="checkCircle"
      label="全选"
      onChange={selectAllDevices}
      variant="inline"
    />
  ) : (
    <Checkbox
      accessibilityLabel="全选导出设备"
      checked={allDevicesSelected}
      iconTheme="checkCircle"
      label="全选"
      onChange={selectAllDevices}
      variant="inline"
    />
  );

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
          <DataPanelTitle action={<View style={styles.selectAll}>{selectAllCheckbox}</View>}>
            导出设备选择
          </DataPanelTitle>
          <View accessibilityLabel="导出设备选项" style={styles.deviceList}>
            {exportDevices.map((device) => {
              const selected = selectedDeviceIds.includes(device.id);
              const statusLabel = statusLabels[device.status];
              const visibleDeviceName = getVisibleDeviceName(device.name);
              return (
                <Checkbox
                  accessibilityLabel={`${device.name}，设备编号 ${device.serialNumber}，状态${statusLabel}`}
                  checked={selected}
                  key={device.id}
                  label={device.name}
                  onChange={(checked) => toggleDevice(device.id, checked)}
                  testID={`device-${device.id}`}
                  variant="card"
                >
                  <View style={styles.deviceCardContent}>
                    <View style={styles.deviceIdentity}>
                      <Text
                        numberOfLines={1}
                        style={styles.deviceName}
                      >
                        {visibleDeviceName}
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
                </Checkbox>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </PageTemplate>
  );
}

const colors = colorThemes.light;
const checkboxCardTokens = componentTokens.checkbox.card;
const dataPanelTokens = componentTokens.dataPanel;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background.page,
  },
  scrollContent: {
    paddingBottom: 24,
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
  deviceSection: {
    gap: dataPanelTokens.contentGap,
    marginTop: dataPanelTokens.cardGap,
    marginHorizontal: 16,
    paddingHorizontal: dataPanelTokens.paddingHorizontal,
    paddingVertical: dataPanelTokens.paddingVertical,
    borderRadius: dataPanelTokens.radius,
    backgroundColor: colors.background.container,
  },
  selectAll: {
    width: 96,
    alignItems: 'flex-end',
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
