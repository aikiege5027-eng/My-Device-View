import React from 'react';

import { Dialog } from './Dialog';
import { type StepItem, Steps } from './Steps';

const deviceDynamics: readonly StepItem[] = [
  { id: 'door-open-1712', title: '开门', meta: '17:12', description: '1F 开门完成，用时 2.1s', status: 'finish' },
  { id: 'load-1708', title: '称重变化', meta: '17:08', description: '292 kg → 286 kg', status: 'finish' },
  { id: 'door-close-1702', title: '关门', meta: '17:02', description: '10F 关门完成，用时 2.4s', status: 'finish' },
  { id: 'running-1658', title: '电梯运行', meta: '16:58', description: '12F → 10F，运行时长 9s', status: 'finish' },
  { id: 'hall-call-1651', title: '外呼登记', meta: '16:51', description: '12F 呼叫，来自 10F', status: 'finish' },
  { id: 'load-1633', title: '称重变化', meta: '16:33', description: '246 kg → 368 kg', status: 'finish' },
  { id: 'door-open-1628', title: '开门', meta: '16:28', description: '12F 开门完成，用时 2.3s', status: 'finish' },
  { id: 'load-1624', title: '称重变化', meta: '16:24', description: '368 kg → 246 kg', status: 'finish' },
  { id: 'door-close-1619', title: '关门', meta: '16:19', description: '1F 关门完成，用时 2.2s', status: 'finish' },
  { id: 'running-1614', title: '电梯运行', meta: '16:14', description: '1F → 12F，运行时长 11s', status: 'finish' },
  { id: 'hall-call-1610', title: '外呼登记', meta: '16:10', description: '1F 呼叫，来自 12F', status: 'finish' },
  { id: 'load-1606', title: '称重变化', meta: '16:06', description: '120 kg → 246 kg', status: 'finish' },
  {
    id: 'fault-0048',
    title: '故障记录',
    meta: '16:42',
    description: 'Fault Code 0048',
    errorDescription: '故障代码 0048',
    status: 'error',
  },
];

export function DeviceDynamicsDialog({ onClose, visible }: { onClose: () => void; visible: boolean }) {
  return (
    <Dialog
      accessibilityLabel="设备动态对话框"
      contentBehavior="scroll"
      onClose={onClose}
      title="设备动态"
      visible={visible}
    >
      <Steps items={deviceDynamics} layout="vertical" readOnly theme="dot" />
    </Dialog>
  );
}
