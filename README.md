# My Device View

基于 Figma 设计稿实现的 Expo / React Native 原生 App 页面。

## Demo 流程

1. 在「工单明细」点击“别急着接单，先点这里远程瞅一眼”。
2. 在弹窗中点击「查看云管家」，进入临时调试用的设备详情。
3. 点击底部「远程呼梯」，选择“成功”或“失败”演示场景，再二次确认。
4. 成功场景经过 6 秒执行进度进入成功提示；失败场景在进度约 70% 时显示异常，并进入失败提示。
5. 在任一结果弹窗点击「我知道了」，「远程重启」按钮随即解锁。
6. 点击「远程重启」并二次确认，经过 6 秒重启进度后显示“重启成功”，确认后返回设备详情。
7. 完成任一远程操作后，SN 卡片右侧出现「操作记录」入口；进入后可按时间倒序查看呼梯、重启及其结果。初始无记录时不显示入口。

## 运行

```bash
npm install
npm run ios
```

也可以运行 `npm start` 后使用 Expo Go 扫码预览。

## 共享 Mobile Design System

通用 React Native 组件、Token、SVG 资产与设计规范已集中到 [`packages/mobile-design-system`](./packages/mobile-design-system)，包名为 `@kone/mobile-design-system`。当前 App 使用 pnpm workspace 依赖该包；根目录的同名组件文件仅作为旧相对导入路径的兼容层。

```bash
pnpm install
pnpm run typecheck
```

包入口通过 `types` / `react-native` / `browser` condition 指向 TypeScript 源码，tsc 与 Metro 直接消费源码，因此 `pnpm start`、`pnpm run web`、`pnpm run typecheck` 和 `pnpm run build:web` 都不需要先执行 `pnpm run build:design-system`。后者只用于校验发布产物或真的要发布时。

其他 Mobile 项目的安装、Metro SVG 配置、共享 Kiro steering 与发布流程见 [`packages/mobile-design-system/README.md`](./packages/mobile-design-system/README.md)。实际发布前还需由团队配置组织 npm registry 及发布凭证。
