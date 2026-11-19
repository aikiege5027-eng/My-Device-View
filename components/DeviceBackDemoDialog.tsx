import React from 'react';

import { Dialog } from '@kone/mobile-design-system';

type DeviceBackDemoDialogProps = {
  /** 第一个选项的文案与读屏提示，默认返回 AI 故障分析页。 */
  returnHint?: string;
  returnLabel?: string;
  onClose: () => void;
  onReturnToCloudData: () => void;
  onReturnToProjectDetails: () => void;
  visible: boolean;
};

/** Lets presenters choose the destination for the device-details back demo. */
export function DeviceBackDemoDialog({
  onClose,
  onReturnToCloudData,
  onReturnToProjectDetails,
  returnHint = '关闭弹窗并显示AI故障分析页',
  returnLabel = '返回AI故障分析',
  visible,
}: DeviceBackDemoDialogProps) {
  return (
    <Dialog
      accessibilityLabel="Demo 演示场景选择"
      description="请选择设备详情返回后的 Demo 演示场景"
      footer={{
        buttonLayout: 'vertical',
        buttonTheme: 'base',
        confirm: {
          accessibilityHint: returnHint,
          label: returnLabel,
          onPress: onReturnToCloudData,
        },
        cancel: {
          accessibilityHint: '关闭弹窗并显示项目详情页',
          label: '返回项目详情',
          onPress: onReturnToProjectDetails,
        },
      }}
      onClose={onClose}
      showCloseButton={false}
      title="Demo 演示场景选择"
      visible={visible}
    />
  );
}
