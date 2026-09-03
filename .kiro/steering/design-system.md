# 项目整体设计规范

本文件是本项目设计规范的统一入口，默认在项目会话中始终生效。后续新增的设计规范应继续登记在本文件中，或通过 `#[[file:<相对路径>]]` 引用拆分后的专题规范。

## 规范优先级

1. 下方登记的 Figma 节点是设计定义的唯一权威来源（Source of Truth）。
2. 实现设计稿前，应读取对应 Figma 节点的最新定义；不得仅依赖本文件中的摘要或历史截图。
3. 若代码现状、本文件摘要与 Figma 最新定义冲突，以 Figma 最新定义为准，并同步更新项目 token 和本文件摘要。
4. 不得臆造缺失的字体、颜色或状态值；无法获取定义时应明确说明并向用户确认。

## 规范来源注册表

| 分类 | 权威来源 | Figma 节点 | 当前基线 |
| --- | --- | --- | --- |
| 字体 Typography | [Design Token China · Typography](https://www.figma.com/design/vuD3onrb6PS5UtMrGdgbrA/Design-Token-China?node-id=184-1388&t=HO0LwfnZeh3k3axW-1) | `184:1388` | Figma 页面显示 Version 2.0.0，Last updated 2025-08-05 |
| 颜色 Color | [Design Token China · Color](https://www.figma.com/design/vuD3onrb6PS5UtMrGdgbrA/Design-Token-China?node-id=3477-5033&t=HO0LwfnZeh3k3axW-1) | `3477:5033` | Figma 页面显示 Version 2.0，Last updated 2025-06-07 |
| 图标 Icon | [Design Token China · Icon](https://www.figma.com/design/vuD3onrb6PS5UtMrGdgbrA/Design-Token-China?node-id=2371-26&t=HO0LwfnZeh3k3axW-1) | `2371:26` | 以 Figma 节点当前发布定义为准 |
| 弹窗 Dialog | [China Design System for Mobile · Dialog](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5278) | `24386:5278` | 以 Figma 节点当前发布定义为准 |
| 步骤条 Steps | [China Design System for Mobile · Steps](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5241) | `24386:5241` | 以 Figma 节点当前发布定义为准 |

Figma file keys：

- Design Token China：`vuD3onrb6PS5UtMrGdgbrA`
- China Design System for Mobile：`EwHKttY9aJIOS7TM3RqGoW`

## Steps

### 当前结构摘要

- Steps 支持 `horizontal` 水平与 `vertical` 垂直布局；当前组件集提供 2、3、4 步变体。
- 视觉类型包含 `default` 默认、`icon` 图标、`dot` 简略圆点；默认/icon 标记基准为 `22×22`，dot 标记基准为 `8×8`。
- 每一步支持 `default`（未开始）、`process`（进行中）、`finish`（已完成）、`error`（错误）状态。
- 水平 item 使用 `start` / `last`，垂直 item 使用 `last` 标识连接线端点；最后一步不显示指向下一步的连接线。
- 扩展类型包含自定义步骤内容、垂直自定义步骤条和 `Read-only Steps` 纯展示步骤条。自定义垂直内容可包含标题、描述和图片；可交互示例使用 chevron-right 表达进入下一层级。

### 组件规则

- IMPORTANT：项目中的流程进度必须复用统一 Steps 组件及 Figma 已定义的布局、视觉类型和状态，不得为不同业务流程各自绘制步骤条。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5241` 读取最新定义；本摘要不能替代 Figma 中的尺寸、间距、连线、排版和颜色 token。
- 组件 API 应围绕 `layout`（horizontal / vertical）、视觉类型（default / icon / dot）、步骤数据和每项 `status` 建模，并阻止 Figma 未定义的无效组合。
- `start` 和 `last` 是由步骤索引计算的内部布局状态，不应要求业务调用方手工维护；步骤数量变化时必须自动重算连接线。
- 连接线必须与步骤标记中心准确对齐，且末项不渲染后续连接线；不得用字符、文本边框或不相关图标模拟标记和连接线。
- `default`、`process`、`finish`、`error` 必须使用对应语义状态；不得只通过当前索引和透明度临时推导与 Figma 不一致的视觉效果。
- 默认/icon 标记和 dot 标记应保持 Figma 的几何尺寸与比例。若步骤可点击，视觉标记尺寸不等于触控热区，必须由 item 提供足够的可点击区域。
- 标题、描述使用 Typography token；标记、连接线、文本和错误状态使用 Color 语义 token；icon 与 chevron 必须来自 Icon 规范。
- 水平布局应根据设计在可用宽度内分配步骤，不得通过整体缩放、压缩字号或任意截断来容纳内容；长文案处理必须以对应 Figma 变体为准。
- 垂直布局高度应由 item 内容和间距自然计算，不得按 2/3/4 步示例硬编码整个容器高度。
- 自定义内容应作为受控内容区域扩展，可包含描述和设计指定图片，但不得绕过 Steps 的标记、状态和连接线结构。
- 带 chevron 或点击回调的 Steps 才表达可交互性；`Read-only Steps` 不得显示误导性的点击反馈或无效 chevron。
- 错误状态应作用于对应步骤并保留可读的错误信息；不得仅用红色表达错误。

### 可访问性与交互

- Steps 应按视觉顺序暴露为有序流程，每一步提供名称、当前位置和状态（未开始、进行中、已完成或错误）。
- 当前步骤应可被辅助技术识别；错误步骤应关联可读错误说明，不能只依赖颜色或图形。
- 标记、连接线等纯装饰元素应从无障碍树中隐藏，避免重复朗读。
- 可交互步骤必须具有明确的可访问角色和标签；只读步骤不得被错误地暴露为按钮。
- 不得允许跳转到某一步，除非业务规则和设计明确支持该交互；禁用或不可达状态若未定义，应先向用户确认。

### React Native / Expo 实现约束

- 使用稳定的 `items` 数据数组渲染步骤，并为每项提供稳定 key；不要为 2/3/4 步分别维护重复 JSX。
- 每项状态应由明确的数据或统一的当前步骤计算逻辑产生；存在 error 等例外状态时应支持显式覆盖，避免状态冲突。
- 横向 Steps 需考虑窄屏和动态字体，纵向 Steps 需支持可变高度内容；不得以固定屏幕坐标定位各步骤。
- 自定义图片必须使用设计指定资源和宽高比；步骤图标继续使用项目 SVG 与 `react-native-svg` 资产模式。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5241` 获取 Steps 最新组件结构与截图。
2. 确认 layout、default/icon/dot 类型、步骤数量及每项状态。
3. 确认是否为自定义内容、可交互垂直步骤或只读步骤，并选择对应 affordance。
4. 将字体、颜色、图标和图片映射到项目已有 token 与资产，按索引生成首尾连接关系。
5. 对照 Figma 验证标记尺寸、连接线、内容间距、所有状态及动态内容，并完成无障碍检查。

## Dialog

### 当前结构摘要

- Dialog 定义包含 `Feedback Dialog` 反馈类、`Confirmation Dialog` 确认类、`Dialog with Input` 输入类、`Dialog with Image` 带图片类。
- 样式包含 `Text Button` 文字按钮、`Horizontal Base Button` 水平基础按钮、`Vertical Base Button` 垂直基础按钮，以及可选关闭按钮。
- 当前移动端基准宽度为 `311`；内容区左右内边距为 `24`。这是该组件节点的基准值，适配其他视口时不得自行改变视觉比例，应以对应设计稿为准。
- 标题与正文内容可分别显示或隐藏；输入区域可选；图片可位于 `top` 或 `middle`。
- Footer 支持确认按钮和取消按钮分别显示或隐藏，双按钮支持 `horizontal` / `vertical` 布局，按钮主题支持 `base` / `text`。
- 长内容示例包含独立滚动区域；底部操作区应保持可访问，不得因正文溢出而被挤出弹窗。

### 组件规则

- IMPORTANT：项目中的弹窗必须复用统一 Dialog 组件及其既有变体，不得为反馈、确认、输入或图片场景分别复制一套弹窗结构。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5278` 读取最新定义；本摘要不能替代 Figma 中的尺寸、圆角、阴影、排版、颜色和间距 token。
- Dialog 应以可组合区域建模：title、content/description、input、image、footer、close button。未启用的区域不应保留空白占位。
- 图片位置仅使用 Figma 已定义的 `top` / `middle` 变体；如设计稿需要其他位置，应先确认或扩展设计系统定义。
- Footer 必须显式表达 `confirm`、`cancel`、`buttonLayout`（horizontal / vertical）和 `buttonTheme`（base / text），不得通过按钮数量或文案隐式猜测布局。
- 只有一个操作时使用对应的单按钮变体；有两个操作时按设计选择水平或垂直布局。不得为容纳长文案而随意缩小字号或压缩按钮间距。
- 标题、正文和按钮排版必须使用 Typography token；背景、遮罩、文本、边框和交互状态必须使用 Color 语义 token；关闭图标必须来自 Icon 规范。
- 输入类 Dialog 必须复用项目统一输入组件，并确保键盘弹出后当前输入和操作按钮仍可访问。
- 带图片 Dialog 必须复用设计指定图片资源和裁切方式，保持 Figma 中的宽高比；不得使用占位图或相似图片替代。
- 正文超出设计允许高度时，仅正文区域滚动，标题、关闭按钮和 Footer 的固定/滚动行为必须与 Figma 对应变体一致。
- 关闭按钮是显式变体。未显示关闭按钮不代表可以默认点击遮罩关闭；遮罩点击、系统返回键和其他 dismiss 行为若设计未说明，必须向用户确认，不能自行假设。
- 异步确认操作应避免重复提交，并为 loading/disabled/error 状态使用设计系统已有状态；若 Figma 未定义对应状态，应先提出设计缺口。

### 可访问性与交互

- 打开 Dialog 时应将辅助技术焦点移动到弹窗；弹窗显示期间，背景内容不得被误操作。
- 标题应作为弹窗的可访问名称；无标题变体必须由调用方提供等价的 accessibility label。
- 所有操作按钮必须使用明确、可读的动作文案；不得只用颜色或图标区分确认与取消。
- 关闭图标按钮必须提供可访问标签，并使用足够的触控区域；`22×22` 图形示例不等于最终触控热区。
- 关闭或完成操作后，应把焦点合理返回触发弹窗的控件。

### React Native / Expo 实现约束

- 使用单一受控可见性状态管理 Dialog；关闭、取消、确认和系统返回事件应通过清晰的回调向调用方传递。
- 使用 React Native 可访问的 Modal/Dialog 语义与焦点管理，不要以普通绝对定位 View 代替完整模态行为。
- 适配安全区、软键盘和小屏幕；不得通过整体缩放 Dialog 来规避溢出。
- 组件 API 应围绕 Figma 变体建模，避免暴露可任意组合并破坏设计系统的底层样式参数。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5278` 获取 Dialog 最新组件结构与截图。
2. 确认场景类型、title/content/input/image/close 配置及 Footer 按钮组合。
3. 将字体、颜色、图标、按钮和输入框映射到项目已有设计 token 与组件。
4. 实现长内容、键盘、异步操作和关闭路径，不添加 Figma 未定义的视觉变体。
5. 对照 Figma 验证尺寸、布局、图片位置、按钮主题和所有启用状态，并完成可访问性检查。

## Icon

### 当前结构摘要

- Icon 集合以 `16×16` symbol 为基础规格，实际展示尺寸及触控区域应以具体组件设计为准。
- 当前按箭头、基础、电梯、设备/工具、角色、建筑、操作、开发、自然等类别组织。
- 集合包含 outline / filled、方向、交互状态、Wi-Fi 信号强弱、语言等成组变体，以及 KONE / GiantKONE 品牌标识资源。
- Figma 历史资产中存在大小写、空格及 `filed` / `filded` 等拼写差异。检索和导出时必须使用 Figma 中的精确名称或节点 ID，不得按猜测替换为相似图标。

### 使用规则

- IMPORTANT：实现前先在 Icon Figma 节点中查找并选择语义、方向、outline/filled 和状态完全匹配的现有图标；不得凭记忆手绘、使用字符代替或创建占位图标。
- IMPORTANT：不得为已有图标引入第三方 icon package。优先复用项目 `assets/` 中与 Figma 一致的 SVG；缺失时从 Figma 获取原始 SVG 并纳入项目资产。
- 同一图标的 filled、方向、信号强弱、语言或其他状态应建模为明确 variant，不要复制成无关联实现。
- Figma 原始名称是资产追溯依据。若代码命名需要规范化，可使用稳定的 camelCase/PascalCase 名称，但必须维护到 Figma 原名或节点 ID 的显式映射，且不得改变图标语义。
- 图标颜色必须使用 Color 章节定义的语义 token；不得在组件内硬编码颜色。品牌标识若包含固定品牌色，应保持原始资产颜色，不得随主题改色。
- `16×16` 是图形基准，不等于交互热区。按钮、列表项等交互组件应按具体设计提供足够的可点击区域，且不得通过非等比缩放扭曲图标。
- 装饰性图标应从无障碍树中隐藏；承载操作或状态含义的图标必须由所在控件提供可读的 accessibility label，不得只依赖图形传达含义。
- React Native / Expo 中优先使用项目既有的 SVG transformer 与 `react-native-svg` 资产模式；不要把仅适用于 Web 的 icon font 或 CSS mask 作为原生端唯一实现。
- 下载或新增资产前先检查 `assets/`，避免同一图标产生重复文件；文件内容和视图框必须与 Figma 原始 SVG 一致。

### Figma 读取与实现流程

1. 使用 file key `vuD3onrb6PS5UtMrGdgbrA` 和节点 `2371:26` 检索图标集合。
2. 按语义确认精确图标、variant 和组件/节点 ID，并与设计稿截图核对。
3. 检查项目中是否已有相同资产；有则复用，无则从 Figma 获取原始 SVG。
4. 将颜色映射到语义 color token，并保持 Figma 定义的 viewBox、比例和视觉细节。
5. 验证默认及状态变体、Light/Dark mode、交互热区和无障碍文本。

## Typography

### 当前结构摘要

Typography 采用语义层级组织：

- `Footer`：10px（Regular / Medium / Semibold，16px 行高）；12px（Regular / Medium / Semibold / Underline，20px 行高）。
- `Body`：14px（Regular / Medium / Semibold / Underline / Strikethrough，22px 行高）；另有 14px Dot 样式，20px 行高。
- `Title`：16px/24px、18px/26px，含 Regular / Medium / Semibold / Underline；20px/28px、24px/32px、28px/36px、30px/44px、38px/56px，含 Regular / Medium / Semibold。
- `Headline`：24px/32px、28px/36px、36px/44px，均为 Semibold。
- `Display`：48px/56px、64px/72px，均为 Semibold。

以上格式为“字号/行高”。字体家族、字重映射、字间距、文本装饰和各端差异必须以 Figma 节点最新值为准。

### 使用规则

- IMPORTANT：为文本选择语义样式（Footer / Body / Title / Headline / Display），不要只按视觉接近程度填写 `fontSize`。
- IMPORTANT：字号、行高、字重和文本装饰必须作为一个完整 typography token 使用，不得随意拆配。
- 相同语义和层级的文本必须复用同一 token；不要在组件内复制字体数值。
- React Native / Expo 实现应通过集中式 TypeScript token 或 theme 对象映射到 `TextStyle`；不要使用仅适用于 Web 的 CSS 变量作为原生端唯一实现。
- 若设计稿使用本摘要未覆盖的新样式，先读取 Figma 节点并扩展 token，再实现组件。

## Color

### 当前结构摘要

颜色采用语义 token，并提供 Light mode 与 Dark mode 映射。当前主要语义族包括：

- `brand`：默认、hover、active、disabled、light 及 light 状态、focus。
- `success`：默认、hover、active、disabled、light、focus。
- `warning`：默认、hover、active、disabled、light、focus。
- `error`：默认、hover、active、disabled、light、focus。
- `grey`：页面、容器、次级容器、组件背景，以及 hover / active / disabled、stroke、border 等界面结构语义。
- `text`：primary、secondary、placeholder、disabled、white、brand、link。

语义 token 在不同模式下映射到不同 primitive 色阶；实现代码应依赖语义 token，而非直接依赖 primitive 色阶或十六进制值。

### 使用规则

- IMPORTANT：组件和页面不得直接硬编码十六进制、RGB/HSL 或平台颜色值；必须使用与 Figma 同名、同语义的 color token。
- IMPORTANT：不得用 Light mode 的固定颜色代替 Dark mode 映射。主题切换应由同一语义 token 解析到对应模式值。
- 状态颜色必须使用对应的 hover、active、disabled、light 或 focus token，不得通过透明度临时推导。
- 文本颜色必须从 `text` 语义族选择；背景、边框和组件状态必须从对应语义族选择。
- 只有在 Figma 中确认不存在合适语义 token 时，才可提出新增 token；新增前需向用户说明缺口。
- React Native / Expo 实现应使用集中式 TypeScript theme/token 对象，为 Light/Dark mode 分别提供映射，并由组件消费语义名称。

## Figma 读取与实现流程

涉及字体或颜色的设计实现时：

1. 使用上述 file key 和精确 node ID 获取 Figma 最新数据；优先读取 variables/design context，必要时读取 screenshot 辅助核对。
2. 确认设计稿使用的语义 typography 与 color token，而不是只提取渲染后的裸值。
3. 检查项目是否已有对应 token；优先复用，缺失时在集中式 token/theme 层补充。
4. 在组件中只引用语义 token。
5. 对照 Figma 同时验证 Light/Dark mode、交互状态、字号、行高、字重及文本装饰。

## 后续规范补充约定

- 用户后续提供的新规范，应先加入“规范来源注册表”，记录分类、链接、节点 ID 和可确认的版本信息。
- 简短规范可直接追加到本文件；内容较大时拆分到 `.kiro/steering/` 下的专题文件，并从本文件使用 `#[[file:<相对路径>]]` 引用。
- 摘要只用于快速理解，不能替代权威来源；不要静态复制整套易变 token 值。
