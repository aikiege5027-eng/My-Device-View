# Mobile Design System 维护约定

## 变更流程

1. 从 `design-system.md` 的注册表找到对应 Figma file key 和 node ID，读取最新定义。
2. 先更新集中式 Token 或通用 SVG，再更新组件；业务值不得进入组件 API。
3. 只在 `src` 修改实现。消费项目不得复制组件源码后单独维护。
4. 同步更新 `design-system.md`、公共类型和 README；破坏性 API 变更必须提高主版本。
5. 提交 PR 前执行：

```bash
pnpm --filter @kone/mobile-design-system typecheck
pnpm run typecheck
pnpm run build:web
```

App 通过 TypeScript 源码消费本包，上面三条不依赖构建产物。需要校验发布产物时再执行 `pnpm --filter @kone/mobile-design-system build`（CI 会在最后跑这一步）。

## 版本策略

- patch：不改变公共 API 的缺陷修复、可访问性修复或与既有 Figma 定义对齐。
- minor：向后兼容的新组件、variant、Token 或公开类型。
- major：删除/重命名导出、改变必填 Props、Token 结构或最低 peer 版本。

每个消费项目使用明确版本，不依赖 `latest` 或开放范围；升级应通过独立 PR 完成并验证 iOS、Android，适用时验证 Web。

## 评审要求

至少确认：Figma 节点、Light/Dark 能力边界、动态字体、触控热区、辅助技术语义、原生 peer 兼容性和 SVG 资产来源。新增第三方依赖需说明必要性并固定版本。
