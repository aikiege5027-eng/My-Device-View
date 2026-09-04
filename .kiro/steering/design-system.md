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
| 按钮 Button | [China Design System for Mobile · Button](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24317-5233) | `24317:5233` | 以 Figma 节点当前发布定义为准 |
| 多选框 Checkbox | [China Design System for Mobile · Checkbox](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5247) | `24386:5247` | 以 Figma 节点当前发布定义为准，读取于 2026-09-04 |
| 选择器 Picker | [China Design System for Mobile · Picker](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5250) | `24386:5250` | 当前包含 1–4 列及有/无标题共 8 个变体，读取于 2026-09-04；项目实现见 `components/Picker.tsx` |
| 标签 Tag | [China Design System for Mobile · Tag](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5275) | `24386:5275` | 以 Figma 节点当前发布定义为准，读取于 2026-09-04 |
| 弹窗 Dialog | [China Design System for Mobile · Dialog](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5278) | `24386:5278` | 以 Figma 节点当前发布定义为准 |
| 步骤条 Steps | [China Design System for Mobile · Steps](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5241) | `24386:5241` | 以 Figma 节点当前发布定义为准 |
| 页面模板 Page Template | [My Device View · Page Temple](https://www.figma.com/design/HKQhWrp0DNySYHyfHRNMZ8/My-Device-View?node-id=20107-7271&t=UWZ88wXpC4izkJcg-1) | `20107:7271` | 当前包含 4 个移动端操作区模板，读取于 2026-09-04 |
| 筛选 Filter | [客户直通车 myKONE Mobile · 筛选触发项](https://www.figma.com/design/KtLWOchDRkeG5rEx7kCkLe/%E5%AE%A2%E6%88%B7%E7%9B%B4%E9%80%9A%E8%BD%A6myKONE-Mobile?node-id=1306-32232) | 触发项实例 `1306:32232`、主组件 `477:12232`、筛选行 `1306:32231` | 当前仅定义单一形态（选中值文案 + `caret-down-small`），无 variant 轴；读取于 2026-09-04；项目实现见 `components/FilterBar.tsx` |

Figma file keys：

- Design Token China：`vuD3onrb6PS5UtMrGdgbrA`
- China Design System for Mobile：`EwHKttY9aJIOS7TM3RqGoW`
- My Device View：`HKQhWrp0DNySYHyfHRNMZ8`
- 客户直通车 myKONE Mobile：`KtLWOchDRkeG5rEx7kCkLe`

## Filter / FilterBar

### 当前结构摘要

- 权威入口为触发项实例 `1306:32232`，其主组件为 `477:12232`（Figma 图层名 `Frame 1000015406`），所在筛选行为 `1306:32231`。
- 主组件没有任何 variant 或组件属性轴，只有一种形态：横向 auto layout、`itemSpacing=2`、宽高均 hug、无内边距、无背景与边框。
- 触发项内容为「当前筛选结果文案 + `caret-down-small`」。文案使用 `Foot 12/Regular`（PingFang SC 12/20 Regular）与 `text/text-color-primary`；`caret-down-small` 基准 `16×16`，其 `Union` 矢量同样绑定 `text/text-color-primary`。
- 筛选行 `1306:32231` 为横向 auto layout，`itemSpacing=24`、`items-start`，在 `375` 画布中基准宽 `344`、高 `20`。当前放置 4 个同一主组件的实例，其中 2 个隐藏，因此一行最多 4 个筛选入口。
- 设计稿在该行上标注 Note：「展示筛选后的内容，固定长度，超出省略」。当前节点未给出具体固定宽度数值。
- 该节点只定义触发项与触发行本体，未定义展开态样式、按压态、禁用态、caret 旋转、下拉/弹层面板、清空入口或已选数量角标。

### 组件规则

- IMPORTANT：项目中的筛选入口必须复用统一 FilterBar / FilterTrigger，不得在列表页、详情页各自用 `Text` + 图标拼出筛选行。
- IMPORTANT：实现前使用 file key `KtLWOchDRkeG5rEx7kCkLe` 和节点 `1306:32232` 读取最新定义；本摘要不能替代 Figma 中的排版、间距、图标和 token。
- FilterBar 只负责渲染触发行。展开面板、选中值来源、级联和提交由调用方负责，选中结果通过 `items[].label` 回流；组件不得自行保存业务筛选状态。
- `items` 必须提供稳定 `id`，不得使用数组索引或显示文案兼作标识；一行超过 4 个入口时应先回到设计确认，实现层在 `__DEV__` 下告警。
- 触发文案必须成套使用 `footer12Regular` + `text.primary`，caret 必须复用 `assets/caret-down-small.svg` 并通过 `currentColor` 继承同一 token；不得硬编码 `#141414`，也不得改用 `chevron-down` 等语义不同的图标。
- 「固定长度，超出省略」通过单行 `tail` 省略实现：默认让文案在行内可用宽度内收缩，caret 不参与收缩；目标设计给出明确固定宽度时通过 `maxLabelWidth` 传入。不得换行、缩小字号或让 caret 被挤出可视区域。
- 未在 Figma 定义的展开态样式、caret 旋转、按压态、禁用态和清空入口不得自行补值，需要时先读取对应设计或补充设计系统定义。

### 可访问性与交互

- 每个触发项必须暴露为按钮并具有可读名称，默认取当前筛选值文案；语义不清时由调用方提供明确 accessibility label 与 hint。
- 面板打开时通过 `expanded` 可访问状态表达展开与收起，不得只依赖视觉。
- caret 属于装饰元素，必须从无障碍树中隐藏，避免与按钮名称重复朗读。
- `20` 是视觉行高而非触控热区；触控范围必须扩展到平台最小尺寸，且不得改变视觉高度或 `24` 的行内间距。
- 文案被省略时，完整值应可通过可访问名称获取，不能让辅助技术只读到截断后的片段。

### React Native / Expo 实现约束

- 使用单一 `Pressable` 渲染触发项，`FilterBar` 只做稳定 `items` 数组映射；不要为不同页面复制触发行 JSX。
- 尺寸、间距、图标尺寸和最小触控尺寸从 `componentTokens.filterBar` 读取，颜色与排版只引用语义 token。
- 触发项使用 `flexShrink: 1` + `minWidth: 0` 参与行内收缩，caret 保持不收缩；不得按 `344` 写死行宽或用绝对坐标定位触发项。
- caret 继续使用项目 `react-native-svg` 资产模式，通过 `color` 传入 token 值。
- 触发项展开的面板统一复用 `components/BottomSheet.tsx` 宿主（遮罩淡入、面板从底部滑入、安全区、系统返回），业务页面不得各自实现遮罩与动效，也不得直接用 `Modal` 的 `animationType="slide"` 把遮罩一起从底部抬起。动效时长与曲线目前 Figma 未定义，属于待补齐的设计缺口。

### Figma 读取与实现流程

1. 使用 file key `KtLWOchDRkeG5rEx7kCkLe` 和节点 `1306:32232` 获取触发项最新结构、变量与截图；必要时继续读取主组件 `477:12232` 与筛选行 `1306:32231`。
2. 确认本次筛选行的入口数量（1–4）、每个入口的稳定 id、当前值文案，以及展开后由哪个组件承载（Picker、Dialog 或业务面板）。
3. 将排版、颜色和 caret 映射到项目已有 token 与 `assets/caret-down-small.svg`；缺失定义时先回到 Figma 核实。
4. 由调用方受控选中值并回填 `items[].label`，为每个入口提供明确的 `onPress` 与可访问名称。
5. 对照 Figma 验证 `20` 行高、`24` 入口间距、`2` 文案与 caret 间距、`16` caret 尺寸、长文案省略、触控热区及无障碍状态。

## Page Template

### 当前结构摘要

- 节点在 Figma 中命名为 `Page Temple`，本文按其设计语义登记为 `Page Template`；当前提供 4 个 `375×812` 的 iOS 小程序页面基准模板。
- 四个模板共享相同页面骨架：顶部 `46` 高状态栏、其下 `48` 高小程序导航栏、中间业务内容区，以及底部操作区和 iOS Home Indicator 安全区。
- 在 `375×812` 基准画布中，业务内容从 `y=94` 延伸到 `y=710`；底部区域总高 `102`，由 `68` 高按钮操作区和 `34` 高 Home Indicator 区组成。这些坐标只用于基准验收，不代表其他设备上的固定屏幕坐标。
- 导航栏标题居中，当前节点使用 `Title/Large`（18/26 Semibold）；左侧使用 `24×24` 的 `chevron-left`，位于导航栏内 `x=12, y=12`。小程序右侧 capsule 在当前模板中隐藏。
- 底部操作区当前定义 4 种组合：两个次要按钮、左次要/右主要按钮、单个主要按钮、单个次要按钮。
- 按钮操作区的基准内容宽度为 `343`，左右边距 `16`，顶部偏移 `16`，按钮高度 `40`。双按钮等宽为 `163.5`，间距 `16`；单按钮占满 `343` 可用宽度。
- 当前按钮均为圆形语义的中号按钮：主要按钮使用品牌色背景与白色文字，次要按钮使用品牌浅色背景与品牌色文字。按钮文字必须复用 Button 对 `medium` 尺寸规定的完整 typography token；若页面模板节点暴露的历史样式名与 Button 权威节点不同，以 Button 最新定义为准。
- 页面背景、标题、按钮和圆角在该节点中引用 `color/grey/200`、`Color/grey/bg-color-white`、`text/*`、`Color/brand/*` 与 `radius/radius-circle` 等变量；实现时仍须映射到项目集中式语义 token，不得复制节点解析出的裸色值。

### 模板规则

- IMPORTANT：需要顶部导航、可滚动业务内容和底部固定操作的移动端页面，必须复用统一 Page Template，不得在业务页面中分别重画状态栏、导航栏、内容容器、按钮操作区或安全区。
- IMPORTANT：实现前使用 file key `HKQhWrp0DNySYHyfHRNMZ8` 和节点 `20107:7271` 读取最新结构、变量与截图；本摘要不能替代 Figma 中的约束、组件属性和 token。
- Page Template 应以可组合区域建模：`statusBar`、`navigationBar`、`content`、`footerActions` 和 `bottomSafeArea`。业务只能向 `content` 注入页面内容，不得绕过模板修改系统区域的层级关系。
- 底部操作配置必须显式选择 Figma 已定义的 4 种组合，例如 `dualSecondary`、`secondaryPrimary`、`singlePrimary`、`singleSecondary`；不得仅根据按钮数量猜测主次关系，也不得开放 Figma 未定义的双主要按钮等组合。
- 所有操作按钮必须复用统一 Button 组件。主要操作映射到 `medium + round + base/primary + block`，次要操作映射到 `medium + round + base/light + block`；双按钮由父级 flex 容器等宽分配并保持 `16` 间距。
- 单按钮模板应让可见按钮填满操作区可用宽度，不得保留隐藏按钮的空白占位；双次要按钮必须分别提供明确文案、行为和稳定标识。
- 底部操作区应固定在可视区域底部并位于系统安全区之上；仅业务内容区按页面需要滚动。操作区不得随长内容滚出视口，也不得遮挡内容、键盘或系统手势区域。
- `375×812`、`y=94`、`y=710` 是 Figma 的 iOS 基准画布与验收位置，不得作为所有设备的绝对尺寸。实现必须根据安全区、视口高度和键盘动态计算可用内容空间，同时保持基准画布上的视觉结果一致。
- 状态栏和 Home Indicator 属于平台区域；原生运行时应使用平台状态栏和安全区能力，Web 预览或设计验收层才可按 Figma 基准模拟，且不得在原生界面重复绘制系统元素。
- 导航标题、返回图标、内容背景、按钮和安全区背景必须使用相应 Typography、Icon、Color 与 Button 规范；不得在页面模板内硬编码字体、十六进制颜色或自行绘制 chevron。
- 当前模板只定义带返回入口、居中标题和底部操作的页面骨架。无返回按钮、右侧 capsule、无底部操作、沉浸式导航、Android 系统栏或其他结构均不应由业务自行推导，应先读取对应设计稿或补充模板定义。

### 可访问性与交互

- 页面标题应作为当前页面的可访问标题；返回操作必须暴露为按钮并提供明确标签，不得仅依赖 chevron 图形表达含义。
- 返回图标属于按钮内部装饰元素，应从无障碍树中隐藏；返回按钮须提供足够触控区域，`24×24` 仅是图形尺寸。
- 底部主要、次要操作必须有可读且能区分目的的名称，并遵守 Button 的 disabled、loading、busy 和防重复提交规则。
- 业务内容必须保持正确的阅读顺序；固定底部操作不应导致辅助技术跳过、重复或错误排序内容。
- 动态字体、横竖屏、小屏幕、键盘和安全区变化不得导致标题与按钮不可达。长标题或长按钮文案的处理若 Figma 未定义，应先向用户确认，不得擅自缩小字号。

### React Native / Expo 实现约束

- 使用单一 Page Template 组件组合项目统一的导航栏、Button 和 Safe Area 能力；不要为 4 个 footer 组合复制整页 JSX。
- 页面根容器使用可用视口与安全区布局；内容区使用 `flex: 1`，底部操作区按内容和安全区自然计算高度，不得以固定 `top`、`bottom` 或整屏绝对坐标还原 `375×812` 示例。
- 需要滚动时，仅将业务 `content` 放入合适的 ScrollView；导航栏与 footer 保持在滚动容器之外，并正确处理键盘避让。
- Footer 使用稳定的 action 数据和明确 variant 渲染；`disabled || loading` 时沿用统一 Button 的事件屏蔽和可访问状态。
- 在原生端使用 `StatusBar` 与安全区实现平台区域；Home Indicator 黑条只用于非原生视觉预览，不应作为应用 SVG 或 View 叠加在真实 iOS 系统条上。

### Figma 读取与实现流程

1. 使用 file key `HKQhWrp0DNySYHyfHRNMZ8` 和节点 `20107:7271` 获取 Page Template 最新结构、变量与截图。
2. 确认目标页面是否符合带返回入口、居中标题、业务内容区及底部操作的模板边界。
3. 显式选择 `dualSecondary`、`secondaryPrimary`、`singlePrimary` 或 `singleSecondary`，并确认每个操作的文案、回调、loading 与 disabled 状态。
4. 将导航、排版、颜色、图标、按钮和安全区映射到项目已有 token 与统一组件；缺失定义时先回到 Figma 核实，不得自行补值。
5. 分别在 `375×812` 基准、实际安全区设备、动态字体、长内容和键盘场景下验证导航、滚动边界、footer 布局及无障碍顺序。

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

## Button

### 当前结构摘要

- Button 的 `variant` 包含 `base`、`outline`、`dashed`、`text`、`ghost`；`theme` 包含 `primary`、`light`、`default`、`danger`。`text` 与 `ghost` 未定义 `light` 主题，不得开放该组合。
- 尺寸包含 `large`（48 高）、`medium`（40 高）、`small`（32 高）和 `extraSmall`（28 高）。`large`、`medium` 使用 `H7 16/Semibold`，`small`、`extraSmall` 使用 `Body 14/Medium`。
- 文本按钮使用 `rectangle` 或 `round`；`rectangle` 使用 `radius/radius-medium`，圆形语义使用 `radius/radius-circle`。仅图标按钮使用 `square` 或 `circle`，不得混用两组形状。
- 内容组合包含纯文本、`prefixIcon`、`suffixIcon`、前后双图标和 `singleIcon`；另有 Loading、Block Button 与 Button Group 示例。
- 交互状态包含 Normal、Press/Active、Disabled，对应组件属性为 `press` 与 `disabled`。Loading 示例为 `medium` 高度 40、图标 `20×20`、图标与文字间距 4。
- Block Button 表示占满父容器可用宽度；Figma 中的 375 宽示例是展示基准而非组件固定宽度。Button Group 示例为两个等宽按钮、间距 16，同样不得硬编码总宽 375。

### 组件规则

- IMPORTANT：项目中的按钮必须复用统一 Button 组件及 Figma 已定义的 variant、theme、size、shape、内容和状态，不得为不同业务场景复制按钮结构或在页面内重画按钮。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24317:5233` 读取最新定义；本摘要不能替代 Figma 中的尺寸、间距、圆角、排版、颜色和状态 token。
- 组件 API 应围绕 `variant`、`theme`、`size`、`shape`、`prefixIcon`、`suffixIcon`、`singleIcon`、`loading`、`disabled` 和 `block` 建模，并以类型或运行时校验阻止 Figma 未定义的组合。
- 普通文本按钮仅可使用 `rectangle` / `round`，仅图标按钮仅可使用 `square` / `circle`；`singleIcon` 不得同时渲染文本、prefix 或 suffix 内容，`text` / `ghost` 不得使用 `light` 主题。
- Normal、Press/Active、Disabled 必须映射到对应语义 token。Press/Active 是真实按压交互产生的瞬时状态，不应要求业务调用方长期手动设置；不得用透明度临时推导状态颜色。
- `large` 高 48，水平/垂直内边距为 20/12；`medium` 高 40，内边距为 16/8；`small` 高 32，内边距为 12/5；`extraSmall` 高 28，内边距为 8/3。不得通过整体缩放或临时改字号生成尺寸变体。
- `large`、`medium` 使用完整 `H7 16/Semibold` token；`small`、`extraSmall` 使用完整 `Body 14/Medium` token。不得拆配字号、字重和行高。
- 背景、边框、文字及 Normal/Active/Disabled 状态必须使用 `Color/brand/*`、`Color/error/*`、`Color/grey/*` 和 `text/*` 语义 token；圆角必须使用 `radius/radius-medium` 或 `radius/radius-circle`，不得在组件内硬编码颜色或自行派生状态值。
- `outline` / `dashed` 的边框样式、`text` / `ghost` 的背景与内容颜色必须逐一按 Figma 对应 theme 和状态解析；不得因单个代表实例读取失败而类推或臆造未确认值。
- 按钮图标必须来自 Icon 规范并保持设计中的方向、outline/filled、viewBox 与比例；不得使用字符、手绘图标、占位图或为已有图标引入第三方 icon package。
- Loading 必须保留可读动作标签并阻止重复提交；加载图形仅作装饰并从无障碍树隐藏。不得仅用替换文字、降低透明度或未定义动画模拟加载态。
- Block Button 应填满父容器可用宽度；非 Block 按内容自然计算宽度。Button Group 应由布局容器负责等宽分配和 Figma 定义的 16 间距，不得把示例中的 375 作为按钮或组的固定宽度。
- Button Group 中每个按钮仍须使用统一 Button 组件；按钮顺序、主次关系、theme 与横向/纵向布局必须以对应业务设计稿为准，不得只依据按钮数量猜测。

### 可访问性与交互

- Button 必须暴露为按钮角色并提供明确、可读的名称；仅图标按钮必须由调用方显式提供 accessibility label，不得依赖图形本身传达操作。
- Disabled 状态不得触发回调，并应同时向辅助技术暴露不可用状态；Loading 期间应暴露忙碌状态并阻止重复触发。
- 图标与 Loading 图形等装饰元素应从无障碍树隐藏，避免与按钮名称重复朗读；有独立状态含义时应把该含义合并到按钮的可读标签或状态说明。
- 视觉高度不等于触控热区，尤其 `small`、`extraSmall` 及仅图标按钮必须由外层交互控件提供足够的触控区域，且不得改变视觉尺寸和相邻按钮间距。
- Normal、Press/Active、Disabled 和 Loading 的区别不得仅依赖颜色；应结合可操作性、可访问状态及加载说明表达。

### React Native / Expo 实现约束

- 使用单一 `Pressable` Button 组件统一渲染所有合法组合；通过 `Pressable` 的 `pressed` 状态映射 Figma Active token，不要为 variant、theme 或 size 复制 JSX，也不要把 `press` 暴露为业务长期受控状态。
- 使用判别联合或等价类型约束内容与形状：文本内容对应 `rectangle` / `round`，仅图标内容对应 `square` / `circle`，并排除 `text` / `ghost` 与 `light` 主题等无效组合。
- `disabled || loading` 时必须屏蔽 `onPress`；异步回调的 loading 状态由调用方受控，组件只负责一致的视觉、交互与无障碍语义。
- `block` 应使用父容器宽度语义（如 `alignSelf: 'stretch'`），Button Group 使用 flex 布局、稳定 key 和设计定义的 gap；不得依赖固定屏幕坐标或把 375 写入组件样式。
- Loading 图形与按钮图标继续使用项目 SVG 与 `react-native-svg` 资产模式，并复用 Figma 指定资源；不得引入仅适用于 Web 的 icon font、CSS spinner 或 Tailwind 实现。
- 需适配动态字体和长文案；不得为避免换行而任意压缩字号、整体缩放按钮或破坏最小触控热区。长文案的截断、换行及 Button Group 布局若 Figma 未定义，应先向用户确认。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24317:5233` 获取 Button 最新组件结构、变量与截图。
2. 确认 `variant`、`theme`、`size`、`shape`、图标组合及 Normal/Press/Disabled 状态，并排除无效组合。
3. 确认是否为 Loading、Block Button、Button Group 或仅图标按钮，并核对对应宽度、间距、触控与可访问要求。
4. 将排版、颜色、圆角和图标映射到项目已有语义 token 与 SVG 资产；缺失定义时先回到 Figma 核实，不得自行补值。
5. 对照 Figma 验证四档高度与内边距、所有 variant/theme/state、图标位置、Loading、Block/Group 布局及无障碍行为。

## Checkbox / CheckboxGroup

### 当前结构摘要

- Checkbox 主组件集为 `27502:32567`，indicator 组件集为 `26871:11521`，CheckboxGroup 组件集为 `27754:31622`；权威入口仍为节点 `24386:5247`。
- Checkbox 支持 `placement=left/right`、`checked`、`indeterminate`、`disabled`、是否显示扩展内容，以及 `check circle`、`check`、`customize` 三种 indicator theme。
- 普通行基准高度为 `56`，带描述行基准高度为 `82`；Figma 中的 `375` 是展示宽度，不是固定组件宽度。行左侧基准内边距为 `16`，indicator 为 `24×24`，indicator 与内容间距为 `8`，内容上下和右侧内边距为 `16`。
- 标题与描述间距为 `4`；标题使用 `Title 16/24 Regular`，描述使用 `Body 14/22 Regular`。内容区底部使用 `0.5` 分割线，分割线只属于内容区域，不穿过 indicator 区域。
- 标题、描述、禁用文字、分割线、indicator 默认/禁用状态分别映射到 `text/primary`、`text/secondary`、`text/disabled`、`Color/grey/component-stroke` 与品牌状态 token。
- 默认 check glyph 的基准包围盒约为 `18.5758×12.7634`；mixed glyph 基准为 `12×1.5`。`check circle` 使用 `24×24` indicator：unchecked 为描边圆，checked 使用品牌色 `check-circle-filled` 填充态，mixed 使用品牌色 `minus-circle-filled` 填充态。
- CheckboxGroup 是稳定 items 数据驱动的一组 Checkbox，不是独立重画的组合控件；每一项继续保留自身标题、描述、禁用状态和可访问焦点。

### 组件规则

- IMPORTANT：项目中的多选行为必须复用统一 Checkbox 或 CheckboxGroup，不得在列表、表单或筛选页面中自行绘制勾选图形和行结构。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5247` 读取最新结构、变量与截图；本摘要不能替代 Figma 中的 indicator 几何、间距、排版和状态 token。
- Checkbox 使用受控 `checked`、`indeterminate`、`disabled` 和 `onChange`。mixed 必须作为明确状态传入，不得只通过图标或透明度推导；组件类型应阻止 `checked=false + indeterminate=true` 等无效组合。
- `placement` 只允许 `left` 或 `right`，切换位置时必须同步调整内容和 indicator 的排列及边距，不能通过绝对坐标移动图标。
- 普通行和带描述行应由内容自然达到 `56` / `82` 的基准高度；动态字体导致内容增高时不得裁切、缩放字号或固定整行高度。
- `check` 与 `check circle` 的 normal、mixed、disabled 状态必须使用集中式语义 token；不得复用带固定颜色的业务状态 SVG，也不得在组件内写裸色值。
- `customize` 必须通过受控 render prop 提供，并接收当前 checked、indeterminate、disabled 状态；调用方不得借此绕过行布局、触控或可访问语义。
- CheckboxGroup 必须接收带稳定 `id` 的 items、`string | number` 稳定值和受控选中值；不得使用数组索引作为 key，也不得以每次渲染重建的对象引用作为 value。组级 disabled 与项级 disabled 应合并，禁用项不得改变值。
- Group 只能复用单一 Checkbox 实现 indicator、行布局和状态，不得为分组场景复制 JSX 或维护另一套颜色与尺寸。

### 可访问性与交互

- Checkbox 必须暴露 `checkbox` 角色，并通过 accessibility state 表达 checked、mixed 和 disabled；mixed 不得只依赖横线或颜色传达。
- 可访问名称默认来自 label；业务可补充明确的 accessibility label 与 hint。description 不应造成标题重复朗读。
- indicator 及其 check/mixed glyph 属于装饰内容，应从无障碍树中隐藏；整行作为单一控件提供足够触控区域。
- disabled 状态不得触发 `onChange`。CheckboxGroup 的每一项必须保持独立可聚焦，不得把整组压成一个无法逐项操作的可访问元素。

### React Native / Expo 实现约束

- 使用单一 `Pressable` 渲染整行，indicator、标题和描述位于同一布局流中；不得用固定屏幕坐标还原 `375` 示例。
- indicator 几何应由集中式 component token 和项目 SVG/React Native 图形能力生成，颜色只来自主题 token；不得用字符或第三方 icon package 模拟 check、mixed。
- CheckboxGroup 使用稳定 items 数组渲染，并以值相等规则增删受控选中值；不得在组件内部保存与外部不同步的选择状态。
- 带描述、长文案、动态字体和左右 placement 均需保持内容可达；分割线应跟随内容区域增高而自然定位。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5247` 获取 Checkbox、indicator 与 CheckboxGroup 最新定义。
2. 确认 placement、checked、indeterminate、disabled、content 和 icon theme，并排除无效状态组合。
3. 将标题、描述、禁用色、品牌状态、分割线和 indicator 几何映射到集中式 token；自定义 indicator 必须确认设计来源。
4. 使用统一 Checkbox 组合 CheckboxGroup，并为每项提供稳定 id、可读名称和明确值。
5. 对照 Figma 验证 `56/82` 基准高度、`24` indicator、`8/16/4` 间距、`0.5` 分割线、左右布局及所有 normal/mixed/disabled 状态。

## Picker

### 当前结构摘要

- Picker 权威入口为节点 `24386:5250`，主组件集为 `27222:18084`，内部 `item/option` 组件集为 `27213:22629`。
- 主组件通过 `columns` 和 `title` 两个变体轴组合：支持 `1 column`、`2 columns`、`3 columns`、`4 columns`，每种列数均提供 `title=true/false`，共 8 个变体；标题文案通过 `titleText` 配置。
- 当前移动端基准宽度为 `375`，大多数变体高度为 `258`。`4 columns + title=false` 在当前 Figma 节点中为 `375×256`，header 高 `56`；其余已读取变体为 header 高 `58`、总高 `258`。这是当前节点的显式差异，不得在未确认设计更新前自行归一。
- Picker 由顶部圆角容器、header、滚轮内容区和底部 `16` 内边距组成。容器使用 `Color/grey/bg-color-container`；当前顶部圆角基准为 `12`，实现时应映射到集中式 radius/component token。
- Header 始终保留左侧 Cancel 和右侧 Confirm；`title=false` 只隐藏居中标题，不隐藏 header 或两侧操作。标题使用 `18/26 Semibold` 完整 typography token；Cancel / Confirm 使用 `Body 14/22 Regular`，分别映射 `text/text-color-secondary` 与 `Color/brand/brand-color`。
- 内容区基准高 `184`，左右各留 `16`；1–4 列在 `343` 可用宽度内无列间距等宽分配。每列显示 5 个 `24` 高 option，相邻 option 间距为 `16`，因此滚动吸附步距为 `40`。
- 中央第三项是当前选中项。跨列共用的 `picker-indicator` 基准位于 `x=16, y=130`，宽 `343`、高 `40`，使用 `Color/grey/bg-color-component` 和 `radius/radius-medium`；indicator 位于 option 文字下层，不应遮挡滚动或点击。当前 `4 columns + title=false` 的 header / content 比其他变体整体上移 `2`，但 indicator 仍固定在面板 `y=130`，因此该 Figma 变体的第三项文字中心与 indicator 中心存在 `2` 的显式偏差；实现须保持节点现状，不得自行归一。
- 内容区顶部和底部各有 `48` 高渐隐 mask，用容器背景色向透明过渡；mask 只负责视觉收束，不代表禁用区域或额外状态。
- `item/option` 定义 normal、selected 和 empty 三种有效形态。普通项使用 `H7 16/24 Regular` 与 `text/text-color-secondary`，选中项使用 `H7 16/24 Semibold` 与 `text/text-color-primary`；文字单行居中并在列宽不足时省略。empty 只用于保留多列数据的视觉对齐，不显示文字，且当前没有 `selected=true + empty=true` 组合。

### 组件规则

- IMPORTANT：项目中的滚轮选择必须复用统一 Picker 组件及 Figma 已定义的列数、标题和 option 状态，不得为日期、地区或业务枚举分别复制滚轮、选中背景、渐隐 mask 或 header。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5250` 读取最新结构、变量与截图；本摘要不能替代 Figma 中的尺寸、排版、颜色、圆角和组件属性。
- Picker API 应围绕稳定的 `columns` 数据、每列 options、受控选中值、`title` / `titleText`、选择变化、Cancel 和 Confirm 回调建模。列数必须由稳定数据明确产生并限制为 1–4，不能开放 0 列、5 列或横向滚动等 Figma 未定义结构。
- 每个 column 和 option 必须提供稳定 `id` 与稳定值；不得使用数组索引作为长期标识，也不得以显示文案兼作唯一值。业务级联关系由受控数据负责，Picker 不得根据示例中的省/市/区文案自行推断级联规则。
- 滚动中的临时选择与 Confirm 后的提交必须有清晰、可控的数据流；Cancel 和 Confirm 应分别触发明确回调，组件不得在调用方不知情的情况下提交、回滚或持久化业务值。
- `title=false` 只移除居中标题且不保留标题占位；左右 Link 操作仍按 Figma 对齐。标题启用时必须提供非空、可读的 `titleText`。
- Cancel / Confirm 必须复用统一 Link 组件的 `medium + default/primary + normal + no icon + no underline` 定义。若项目尚无 Link 实现，应先读取该嵌套组件的权威节点并补齐统一组件，不得用裸 Text、字符或页面内临时样式仿制。
- 1–4 列必须在内容可用宽度内等宽分配，列间不添加 Figma 未定义的 gap、分割线或边框；不得通过缩小字体或整体缩放容纳更多列。
- 每列应保持 `24` option 高、`16` 项间距和 `40` 吸附步距。除 Figma 当前明确保留的 `4 columns + title=false` 特殊偏差外，选中 option 中心应与统一 indicator 中心对齐；该特殊变体必须按面板绝对 `y=130` 渲染 indicator，不得因 header 高度变化将其上移。indicator 和上下 mask 由 Picker 统一渲染，不得为每列重复绘制。
- empty option 仅作为不可选、不可朗读的布局占位；类型或运行时校验必须阻止 empty 同时成为 selected。依赖列暂无数据时是否清空、保留或显示占位由业务规则明确传入，不得由组件猜测。
- 普通和选中 option 必须成套使用对应 Typography 与 Color token；不得通过 opacity、临时加粗、缩放或手写颜色推导状态。长 option 使用 Figma 当前定义的单行省略，不得换行破坏滚轮节距。
- `375` 是展示基准，不是固定屏幕宽度；实现应填满父容器可用宽度并保留左右 `16` 内容边距。当前 `4 columns + title=false` 的 `256/56` 尺寸差异必须在实现前与最新 Figma 对照，不得静默改成其他变体的 `258/58`。
- 当前节点只定义 Picker 面板本体，没有定义遮罩、弹出/收起动画、点击遮罩关闭、系统返回键、拖拽手势、安全区、disabled、loading、error 或异步 Confirm 状态；业务需要这些能力时应先确认对应设计或补充设计系统定义，不得自行臆造。

### 可访问性与交互

- 每一列应暴露为独立、带名称的可调节选择控件，向辅助技术朗读当前值，并支持平台等价的增大/减小或前一项/后一项操作；多列不得合并成一个无法逐列操作的焦点。
- 当前选中项必须通过可访问状态或值明确表达；视觉上同时使用 indicator、字重和文本色区分，不能只依赖颜色。empty option 必须从无障碍树中隐藏。
- Cancel 和 Confirm 必须暴露为按钮并提供明确动作名称；标题存在时应作为 Picker 的可访问名称或标题。`title=false` 时调用方必须提供等价的 accessibility label，不得让控件成为无名称区域。
- indicator、渐隐 mask 和非选中项的重复装饰信息应避免造成重复朗读；滚动停止并完成吸附后再公告稳定选中值，避免滚动过程中连续播报无效中间状态。
- 当 Picker 被宿主以 modal 或 bottom sheet 形式呈现时，宿主必须管理初始焦点、背景不可操作、关闭后的焦点恢复和系统返回路径；这些模态行为不能仅靠 Picker 面板中的视觉层模拟。
- 动态字体、长文案和本地化不得通过缩小字号处理。option 沿用单行省略；标题或操作文案可能与两侧操作重叠时，若目标设计未提供长文案方案，应先向用户确认。

### React Native / Expo 实现约束

- 使用单一受控 Picker 组件，根据稳定 columns 数组渲染 1–4 个滚轮；不要为不同列数、有无标题或具体业务场景维护重复 JSX。
- 每列可使用适合平台且可访问的原生滚轮能力，或使用 `ScrollView` / `FlatList` 实现等价滚动；自定义实现必须以 `40` 为吸附步距，在滚动停止后解析稳定选中值。常规 7 个变体保证中央 option 与 indicator 精确对齐；`4 columns + title=false` 按 Figma 当前绝对 `y=130` 保留 `2` 偏差。
- 多列容器使用 flex 等宽布局并裁切各列溢出；option 保持单行居中和省略。不得按 `375` 写死列宽，也不得以整屏绝对坐标定位 option。
- indicator 应在 columns 后方统一铺设，顶部/底部 mask 在前方统一覆盖，并设置为不拦截触摸和无障碍事件。渐变颜色必须来自容器语义 token，不得用固定白色、option opacity 或隐藏列表项模拟。
- 选择值由调用方受控；组件可维护仅服务于滚动手势的瞬时位置，但外部 value 更新时必须可靠同步到对应列，且不得产生回调循环。级联数据更新后应按稳定值重新定位，不得依赖旧数组索引。
- Picker 面板与 modal / bottom sheet presenter 分层实现；宿主负责遮罩、动画、安全区和系统关闭行为。不得把未在当前 Figma 节点定义的平台区域或 Home Indicator 直接画进 Picker。
- 需分别验证 iOS、Android 和 Web 预览中的吸附、惯性滚动、触控、键盘/辅助技术操作及动态字体；平台原生外观与 Figma 不一致时，应通过项目统一封装保持设计语义，而不是在业务页面各自覆盖样式。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5250` 获取 Picker 最新结构、变量与截图；必要时继续读取主组件集 `27222:18084` 和 `item/option` 组件集 `27213:22629`。
2. 确认列数、每列稳定数据与选中值、是否显示标题、标题文案，以及 Cancel / Confirm 的业务语义；明确是否存在级联关系。
3. 将容器、indicator、mask、标题、操作文案和 option 状态映射到项目已有语义 token 与统一 Link 组件；缺失定义时先回到 Figma 核实。
4. 实现受控滚动与 `40` 步距吸附，阻止无效 empty/selected 组合，并由独立宿主处理经设计确认的 modal、bottom sheet 和安全区能力。
5. 对照 Figma 验证 1–4 列、有/无标题、普通/选中/empty option、中央对齐、渐隐 mask、当前特殊尺寸差异，以及触控、动态字体和无障碍操作。

### 项目实现现状

- 统一实现为 `components/Picker.tsx`，尺寸与间距来自 `componentTokens.picker`，Cancel / Confirm 复用 `components/Link.tsx`。业务不得再自行绘制滚轮、indicator、渐隐 mask 或 header。
- 列数由 `PickerColumns` 元组联合在类型层限制为 1–4；`empty` 选项在类型上不带 `value`，因此无法成为选中项。标题通过判别联合约束：`title=true` 必须提供非空 `titleText`，`title` 缺省时必须提供 `accessibilityLabel`。
- 选中值为受控 `PickerValue`，按稳定 column id 索引而非数组下标；`onChange` 在吸附完成后触发，`onConfirm` 提交当前受控值，组件自身不持久化业务值。
- 滚轮用 `ScrollView` + `snapToInterval={40}` 实现，上下留白 `(184 - 40) / 2 = 72`，使首末项可进入中央选择位置。indicator 使用面板绝对 `y=130` token：常规 7 个变体与中央 option 对齐，`4 columns + title=false` 保留 Figma 当前 `2` 偏差。渐隐 mask 用 `react-native-svg` 渐变绘制，未引入新依赖。
- 吸附落到 `empty` 位置时回落到最近的可选项；这是"empty 不可选"的必要推论，不是新增视觉状态。
- 已知设计缺口，扩展前必须先回到 Figma 核实：Link 的 press/hover/disabled/underline/图标槽与其余尺寸尚未读取，故组件未开放；Picker 的遮罩、弹出动画、点击遮罩关闭、系统返回、安全区、disabled / loading / error 与异步 Confirm 同样未定义，须由宿主层按已确认设计实现。
- Link 的触控热区用 `hitSlop` 扩展到约 `44`，不改变 `22` 的视觉高度与相邻间距；这是可访问性要求，不改动 Figma 视觉尺寸。

## Tag / CheckTag

### 当前结构摘要

- Tag 主组件集为 `26737:7637`，CheckTag 组件集为 `26766:16970`；权威入口为节点 `24386:5275`。
- Tag 支持 `dark`、`light`、`outline`、`lightOutline` 视觉 variant，`default`、`primary`、`warning`、`danger`、`success` theme，`extraLarge`、`large`、`medium`、`small` size，以及 `square`、`round`、`mark` shape。
- Tag 可配置 prefix icon、closable 和 disabled。CheckTag 支持相同的 variant、size、shape 和 prefix icon，并增加 checked、disabled；CheckTag 没有 theme 轴，选中状态固定使用品牌语义。
- Tag 四档基准高度分别为 `40/28/24/20`；CheckTag 四档基准高度为 `40/32/24/20`，其中 CheckTag large 的 `32` 不得误用普通 Tag large 的 `28`。
- extraLarge Tag 代表实例使用水平/垂直内边距 `16/9`、内容内间距 `4`、关闭图标前间距 `12`、`16` 图标及 `6` 圆角；medium Tag 代表实例使用水平/垂直内边距 `8/2`、关闭图标前间距 `8`、`14` 关闭图标及 `4` 圆角。
- extraLarge / large 使用 `Body 14/22 Regular`，medium 使用 `Footer 12/20 Regular`，small 使用 `Footer 10/16 Regular`。
- `mark` 仅右上和右下使用圆形语义半径，左侧保持直角；`round` 四角均使用圆形语义半径，`square` 使用对应尺寸的普通圆角。
- primary、warning、danger、success 必须分别使用 brand、warning、error、success 的 default、disabled 和 light token。default 主题使用 grey 背景/边框与 text token；不得将组件 `dark` variant 误解为应用 Dark mode。

### 组件规则

- IMPORTANT：项目中的标签必须复用统一 Tag 或 CheckTag，不得为状态、筛选、分类等业务各自复制标签结构和颜色矩阵。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5275` 读取最新定义；本摘要不能替代 Figma 中的四类 variant、theme、尺寸、形状和状态组合。
- Tag 是只读内容容器，不能因具有颜色或圆角就整体暴露为按钮。只有 `closable=true` 时渲染独立关闭按钮，并同时要求 `onClose` 与明确的 close accessibility label。
- CheckTag 是受控可选控件，使用 `checked`、`disabled` 和 `onChange`；不得用多个互相冲突的 Tag boolean 拼装 CheckTag，也不得开放 Figma 未定义的 theme 轴。
- Tag API 必须将 variant、theme、size、shape、prefix icon、closable、disabled 建模为明确属性；closable 的判别联合应阻止缺少关闭回调或标签的配置。
- 四档高度和 typography token 必须成套使用。普通 Tag 与 CheckTag 的 large 高度不同，不得通过缩放或临时 padding 覆盖互相复用。
- `mark` 左侧必须保持直角，不能把 round 或 circle 样式应用到四个角；`square` 和 `round` 也不得通过图片裁切模拟。
- prefix icon 必须来自 Icon 规范并由调用方传入项目资产；组件只负责 Figma 定义的尺寸槽和间距，不得创建占位图标或引入第三方 icon package。
- 关闭图标必须复用项目 Icon 资产并通过 current color 映射当前 theme/state；不得使用字符 `×`、固定灰色副本或手绘替代。
- dark、light、outline、lightOutline 的背景、边框与文字颜色必须逐一映射语义 token。Disabled 必须使用对应 disabled token，不能通过整体 opacity 派生。

### 可访问性与交互

- 只读 Tag 保持文本阅读语义，不得错误暴露为 button。prefix icon 及纯装饰图形应从无障碍树中隐藏。
- closable Tag 的关闭入口必须是独立按钮，具有明确动作名称、disabled state 和足够触控热区；关闭按钮禁用时不得调用回调。
- CheckTag 必须暴露可操作角色和 checked、disabled 状态；选中状态需同时通过可访问状态与视觉样式表达，不能只依赖颜色。
- 紧凑视觉高度不等于触控热区。small、medium Tag 的关闭按钮和 CheckTag 必须在不改变视觉尺寸、间距及相邻组件布局的前提下扩展触控范围。

### React Native / Expo 实现约束

- Tag 使用 View 渲染只读容器，关闭入口单独使用 Pressable；CheckTag 使用单一 Pressable 渲染受控选择行为。不要为每种 variant/theme 复制 JSX。
- 尺寸、padding、图标槽、内容间距、边框和 shape 均从集中式 component token 读取；颜色和 typography 只引用语义 token。
- prefix icon 接收 ReactNode，但必须放入设计尺寸槽并隐藏装饰性可访问内容；关闭图标继续使用项目 `react-native-svg` 资产模式。
- 长文案和动态字体不得通过缩小字号或整体缩放处理；若截断、换行或 Tag Group 布局未在目标设计中定义，应先向用户确认。
- CheckTag 的 pressed 不得通过 opacity 或临时混色派生未定义状态；若业务需要 press/focus 状态，应先读取 Figma 对应定义。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5275` 获取 Tag 与 CheckTag 最新组件结构、变量和截图。
2. 对 Tag 确认 variant、theme、size、shape、prefix icon、closable、disabled；对 CheckTag 确认 variant、size、shape、prefix icon、checked、disabled。
3. 将四档高度、padding、图标尺寸、间距、圆角、排版和完整颜色矩阵映射到集中式 token。
4. 确认 prefix/close 图标来自 Icon 资产，并为关闭和选择交互提供正确角色、名称、状态与触控范围。
5. 对照 Figma 验证 Tag `40/28/24/20`、CheckTag `40/32/24/20`、mark 右侧圆角、所有颜色组合及 checked/disabled 状态。

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
