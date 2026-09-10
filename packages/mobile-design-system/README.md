# @kone/mobile-design-system

KONE Mobile 项目共享的 React Native / Expo 设计系统包。组件、Token、内置图标实现和 Kiro 设计规范在此包中统一维护；业务页面与业务资源不属于本包。

## 公共 API

当前 `0.1.x` 稳定导出：

- 基础组件：`Button`、`Link`、`Checkbox`、`CheckboxGroup`、`Tag`、`CheckTag`、`Divider`
- 组合组件：`FilterBar`、`Picker`、`PageTemplate`、`Dialog`、`BottomSheet`、`Steps`、`Collapse`、`CollapseGroup`
- Token：`colorThemes`、`typographyTokens`、`radiusTokens`、`componentTokens`
- 所有组件公开 Props 和数据类型均从包根入口导出

仅开放已经在 Figma 中读取并实现的组合。不要根据设计规范中的完整组件矩阵假设当前代码已经支持全部 variant。

## 在 Mobile 项目中安装

发布到组织 npm registry 后：

```bash
pnpm add @kone/mobile-design-system@0.1.0 react-native-safe-area-context@5.6.2 react-native-svg@15.12.1
```

`react` 和 `react-native` 由宿主应用提供；当前验证范围见 `peerDependencies`。包内图标已编译为 `react-native-svg` 组件，因此使用本包本身不要求宿主配置 raw SVG transformer；宿主自己的 `.svg` 导入仍按其项目配置处理。

使用示例：

```tsx
import {
  Button,
  PageTemplate,
  colorThemes,
  type PageFooterActions,
} from '@kone/mobile-design-system';
```

包通过 `types`、`react-native` 和 `browser` 三个 export condition 暴露 TypeScript 源码：tsc 直接读取源码类型，Metro 在原生端和 Web 端都直接转译源码，因此日常开发和 `expo export` 都不需要预先构建本包。`import` / `require` 仍指向 `dist`，供发布及非 Metro 消费方使用。

## 在本仓库中开发

仓库使用 pnpm workspace，当前 App 通过精确的 `workspace:0.1.0` 依赖消费本包：

```bash
pnpm install
pnpm run typecheck
```

`pnpm run build:design-system` 只在需要校验发布产物或真的要发布时执行，不是运行 App 的前置步骤。

组件源码只在 `src/components` 修改。根项目 `components` 下同名文件是迁移期兼容导出，不是第二份实现。

## 让其他 Kiro 项目共享设计规则

本包发布时包含 `design-system.md`。消费项目可创建 `.kiro/steering/design-system.md`：

```md
# 共享 Mobile Design System

#[[file:../../node_modules/@kone/mobile-design-system/design-system.md]]
```

这样 Figma 权威节点、实现约束和可访问性规则随包版本共同升级，不需要在每个项目复制维护。升级包版本后应重新检查设计规则的变更。

## 字体与主题约束

- 当前实现使用 `PingFang SC`、`KONE Information` 和 `SF Pro Text` token；本包不分发受许可约束的字体文件，宿主应用负责加载或提供平台 fallback。
- 当前组件保持现有 Light theme 基线。`colorThemes.dark` 尚不完整，因此本版本不宣称支持运行时主题切换。
- Dialog、Steps、Button 和 Link 目前仅实现项目已经验证的子集，新增组合前必须先读取对应 Figma 节点。

## 发布

当前包只被本仓库的 App 消费，因此入口以 TypeScript 源码为主。若之后真的要发布给其他项目，先做一步回退：把 `exports` 的 `types` 改回 `./dist/index.d.ts`、`./dist/designTokens.d.ts`，并移除 `browser` condition，让非 Metro 消费方走已编译的 `dist`。然后：

1. 按 `CONTRIBUTING.md` 完成 Figma 核对、版本变更和验证。
2. 配置组织 registry 与发布权限，例如 npm 的 `NPM_TOKEN`。
3. 执行 `pnpm --filter @kone/mobile-design-system build`。
4. 在包目录执行 `pnpm pack --dry-run` 检查发布内容。
5. 经维护者批准后执行 `pnpm --filter @kone/mobile-design-system publish`。

本次迁移不会自动发布；registry 地址、组织权限和 token 由团队基础设施配置。
