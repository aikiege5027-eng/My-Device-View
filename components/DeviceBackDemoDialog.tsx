import React from 'react';

import { Dialog } from './Dialog';

type DeviceBackDemoDialogProps = {
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
          accessibilityHint: '关闭弹窗并显示云管家数据页',
          label: '返回云管家数据',
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
