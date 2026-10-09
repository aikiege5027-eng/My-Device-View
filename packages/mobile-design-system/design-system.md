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
| 选择器 Picker | [China Design System for Mobile · Picker](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5250) | `24386:5250` | 当前包含 1–4 列及有/无标题共 8 个变体，读取于 2026-09-04；项目实现见 `src/components/Picker.tsx` |
| 动作面板 ActionSheet | [China Design System for Mobile · ActionSheet](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5277) | 规范页 `24386:5277`、组件集 `27454:30291`、`item/action-cell` `27454:29041`、`item/action-des` `27454:29431` | 当前包含 64 个变体（`align` × `cancel` × `description` × `item` × `theme`），读取于 2026-10-09；项目实现见 `src/components/ActionSheet.tsx` |
| 时间选择器 DateTimePicker | [China Design System for Mobile · DateTimePicker](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5248) | 规范页 `24386:5248`、组件集 `27227:19113`、`item/datetime-option` `27227:18734` | 当前包含 10 个 `mode` × 有/无标题共 20 个变体，读取于 2026-10-09；项目实现见 `src/components/DateTimePicker.tsx` |
| 级联选择器 Cascader | [China Design System for Mobile · Cascader](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5246) | 规范页 `24386:5246`、组件集 `27500:27380` | 当前包含 32 个变体（`theme` × `step` × `subtitle` × `close-btn`），读取于 2026-10-09；项目实现见 `src/components/Cascader.tsx` |
| 日历 Calendar | [China Design System for Mobile · Calendar](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5262) | 规范页 `24386:5262`、组件集 `27213:17690`、`item/date` `27205:14790` | 当前包含 18 个变体（`type` × `format` × `timePicker`）与 38 个 `item/date` 状态组合，读取于 2026-10-09；项目实现见 `src/components/Calendar.tsx` |
| 标签 Tag | [China Design System for Mobile · Tag](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5275) | `24386:5275` | 以 Figma 节点当前发布定义为准，读取于 2026-09-04 |
| 折叠面板 Collapse | [China Design System for Mobile · Collapse](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5265) | `24386:5265` | 当前包含 Collapse 16 个变体与 CollapseGroup 8 个变体，读取于 2026-09-09；项目实现见 `src/components/Collapse.tsx` |
| 弹窗 Dialog | [China Design System for Mobile · Dialog](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5278) | `24386:5278` | 以 Figma 节点当前发布定义为准 |
| 分割线 Divider | [China Design System for Mobile · Divider](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24385-5233) | 规范页 `24385:5233`、组件集 `26625:6299`、用例说明 `24387:5960` | 当前包含 10 个变体（`dashed` × `layout` × `align` × `content`），读取于 2026-09-10；项目实现见 `src/components/Divider.tsx` |
| 步骤条 Steps | [China Design System for Mobile · Steps](https://www.figma.com/design/EwHKttY9aJIOS7TM3RqGoW/China-Design-system-for-mobile?node-id=24386-5241) | `24386:5241` | 以 Figma 节点当前发布定义为准 |
| 页面模板 Page Template | [My Device View · Page Temple](https://www.figma.com/design/HKQhWrp0DNySYHyfHRNMZ8/My-Device-View?node-id=20107-7271&t=UWZ88wXpC4izkJcg-1) | `20107:7271` | 当前包含 4 个移动端操作区模板，读取于 2026-09-04 |
| 筛选 Filter | [客户直通车 myKONE Mobile · 筛选触发项](https://www.figma.com/design/KtLWOchDRkeG5rEx7kCkLe/%E5%AE%A2%E6%88%B7%E7%9B%B4%E9%80%9A%E8%BD%A6myKONE-Mobile?node-id=1306-32232) | 触发项实例 `1306:32232`、主组件 `477:12232`、筛选行 `1306:32231` | 当前仅定义单一形态（选中值文案 + `caret-down-small`），无 variant 轴；读取于 2026-09-04；项目实现见 `src/components/FilterBar.tsx` |

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
- 触发文案必须成套使用 `footer12Regular` + `text.primary`，caret 必须复用包内 `src/icons.tsx` 的 `CaretDownSmallIcon` 并通过 `currentColor` 继承同一 token；不得硬编码 `#141414`，也不得改用 `chevron-down` 等语义不同的图标。
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
- 触发项展开的面板统一复用 `src/components/BottomSheet.tsx` 宿主（遮罩淡入、面板从底部滑入、安全区、系统返回），业务页面不得各自实现遮罩与动效，也不得直接用 `Modal` 的 `animationType="slide"` 把遮罩一起从底部抬起。动效时长与曲线目前 Figma 未定义，属于待补齐的设计缺口。

### Figma 读取与实现流程

1. 使用 file key `KtLWOchDRkeG5rEx7kCkLe` 和节点 `1306:32232` 获取触发项最新结构、变量与截图；必要时继续读取主组件 `477:12232` 与筛选行 `1306:32231`。
2. 确认本次筛选行的入口数量（1–4）、每个入口的稳定 id、当前值文案，以及展开后由哪个组件承载（Picker、Dialog 或业务面板）。
3. 将排版、颜色和 caret 映射到项目已有 token 与包内 `CaretDownSmallIcon`；缺失定义时先回到 Figma 核实。
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

### 项目实现现状

包内实现为 `src/components/Button.tsx`。Figma 组件集共 2160 个已发布变体，当前代码只覆盖已读取确认的子集，**不要假设上方结构摘要描述的能力都已可用**：

| 轴 | Figma 定义 | 代码已实现 |
| --- | --- | --- |
| `variant` | base / outline / dashed / text / ghost | 仅 `base` |
| `theme` | primary / light / default / danger | `primary` / `light` / `default` |
| `size` | large 48 / medium 40 / small 32 / extraSmall 28 | `extraSmall` / `medium` / `large`（`large` 仅文本形态） |
| `shape` | rectangle / round / square / circle | `rectangle` / `round` / `square` |
| 内容 | 纯文本 / prefixIcon / suffixIcon / 双图标 / singleIcon | 纯文本、`singleIcon` |
| 状态 | Normal / Press / Disabled / Loading | Normal / Press / Disabled |
| 其他 | Block、Button Group | `block` |

- `theme=default` 的三态取自节点 `26544:4027`（常态）、`26561:4373`（按压）、`26561:4531`（禁用）：底色 `background.component` → `background.componentActive` → `background.component`，前景 `text.primary` → `text.primary` → `text.disabled`。
- 两档尺寸的几何与排版：`medium` 为高 `40`、内边距 `16/8`、`shape=square` 时 `40×40` 配 `20×20` 图标槽、排版 `H7 16/Semibold`（节点 `26626:6269`）；`extraSmall` 为高 `28`、内边距 `8/3`、`shape=square` 时 `28×28` 配 `18×18` 图标槽、排版 `Body 14/Medium`（节点 `26544:4044` / `26544:4056`）。排版随尺寸切换，不得固定为单一 token。
- 内容与形状已用判别联合绑定：文本按钮只接受 `rectangle` / `round`，仅图标按钮只接受 `square` 且强制要求 `accessibilityLabel`。
- `size=large` 的文本形态已开放：高 `48`、内边距 `20/12`、排版 `H7 16/Semibold`，读取于 Calendar footer 的 Button 实例（节点 `27205:15150`），与 Button 规范页摘要一致。该尺寸的 `shape=square` 图标槽尚未读取，因此 `componentTokens.button.sizes.large` 不提供 `squareSize` / `iconSize`，props 的判别联合也阻止 `large` + 仅图标的组合。
- `size=small`（高 `32`、内边距 `12/5`）尚未从 Figma 逐一核实图标尺寸与状态值，故未开放。新增尺寸前必须先读取对应节点。
- 仅图标按钮的 `28×28` / `40×40` 均小于 44 的推荐触控尺寸。该尺寸由 Figma 指定，组件未自行加 `hitSlop`；若放在密集布局中，调用方需自行评估热区。

## Checkbox / CheckboxGroup

### 当前结构摘要

- Checkbox 主组件集为 `27502:32567`，indicator 组件集为 `26871:11521`，CheckboxGroup 组件集为 `27754:31622`；权威入口仍为节点 `24386:5247`。
- Checkbox 支持 `placement=left/right`、`checked`、`indeterminate`、`disabled`、是否显示扩展内容，以及 `check circle`、`check`、`customize` 三种 indicator theme。
- 普通行基准高度为 `56`，带描述行基准高度为 `82`；Figma 中的 `375` 是展示宽度，不是固定组件宽度。行左侧基准内边距为 `16`，indicator 为 `24×24`，indicator 与内容间距为 `8`，内容上下和右侧内边距为 `16`。
- 标题与描述间距为 `4`；标题使用 `Title 16/24 Regular`，描述使用 `Body 14/22 Regular`。内容区底部使用 `0.5` 分割线，分割线只属于内容区域，不穿过 indicator 区域。
- 标题、描述、禁用文字、分割线、indicator 默认/禁用状态分别映射到 `text/primary`、`text/secondary`、`text/disabled`、`Color/grey/component-stroke` 与品牌状态 token。
- 默认 check glyph 的基准包围盒约为 `18.5758×12.7634`；mixed glyph 基准为 `12×1.5`。`check circle` 使用 `24×24` indicator 槽位：unchecked 为描边圆，checked 使用品牌色 `check-circle-filled` 填充态，mixed 使用品牌色 `minus-circle-filled` 填充态。三种状态的圆必须等直径——填充态 SVG 在 `24×24` 视图框内画的是直径 `21` 的圆，因此 unchecked 描边圆取 `componentTokens.checkbox.circleIndicatorDiameter`（`21`）并在槽位内居中，不得直接用 `24` 撑满槽位。
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

### 项目实现现状

- 统一实现为 `src/components/Checkbox.tsx`，导出 `Checkbox` 与 `CheckboxGroup`；`variant` 支持 `row`（Figma 基准行）、`inline`（无行内边距与分割线的紧凑行，用于「全选」等行内控件）与 `card`（带描边、圆角与左上角勾选角标的卡片行）。尺寸来自 `componentTokens.checkbox`。
- `card` 与 `inline` 变体来自页面组合需要，Figma 未定义对应轴；扩展前请先回到 Figma 核实。

### BottomSheet 宿主

- 宿主实现为 `src/components/BottomSheet.tsx`，负责遮罩淡入、面板从底部滑入、`reduceMotion` 降级与系统返回；面板本体（Picker、ActionSheet、DateTimePicker、Cascader、Calendar 及业务面板）只负责静态内容。
- `surface` 决定宿主是否铺底色：`container`（默认）铺 `bg-color-container`，让面板与安全区留白连成一片白底；`transparent` 不铺底色。**面板自带顶部圆角时必须用 `transparent`**，否则宿主的直角白底会盖在圆角外侧，使圆角在遮罩上看不出来。
- 动效时长与曲线目前 Figma 未定义，属于待补齐的设计缺口。

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

- 统一实现为 `src/components/Picker.tsx`，尺寸与间距来自 `componentTokens.picker`，Cancel / Confirm 复用 `src/components/Link.tsx`。业务不得再自行绘制滚轮、indicator、渐隐 mask 或 header。
- 滚轮面板本体抽到 `src/components/internal/WheelPanel.tsx`，由 `Picker`、`DateTimePicker` 与 `Calendar` 的内嵌时间滚轮共用。`Picker` 只负责 1–4 列的类型约束与 `4 columns + title=false` 的 `headerHeight=56` 特例，面板几何不在 `Picker` 内重复定义。
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

### 项目实现现状

- 统一实现为 `src/components/Tag.tsx`，导出 `Tag` 与 `CheckTag`；尺寸来自 `componentTokens.tag` / `componentTokens.checkTag`，关闭图标复用 `src/icons.tsx` 的 `CloseMIcon`。
- `CheckTag` 的 `variant=light, checked=true` 按组件本体定义**不带描边**（节点 `26841:11318`）。若目标页面的实例在选中态额外加了品牌描边，应由调用方按选中态切换 `variant`（`lightOutline` / `light`）复现该实例覆盖，而不是改动组件的配色矩阵。
- `uncheckedBorder` 来自页面组合需要，Figma 未定义对应轴；扩展前请先回到 Figma 核实。
- `Tag` 的 `label` 是单段字符串，排版整套绑定在 `size` 上。需要「同一标签内两种字重」或「非 Tag 色板的前景色」时，Tag / CheckTag 无法表达，应先回到 Figma 补对应轴，或在页面侧按 Tag 的几何 token 实现并显式登记偏离。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5275` 获取 Tag 与 CheckTag 最新组件结构、变量和截图。
2. 对 Tag 确认 variant、theme、size、shape、prefix icon、closable、disabled；对 CheckTag 确认 variant、size、shape、prefix icon、checked、disabled。
3. 将四档高度、padding、图标尺寸、间距、圆角、排版和完整颜色矩阵映射到集中式 token。
4. 确认 prefix/close 图标来自 Icon 资产，并为关闭和选择交互提供正确角色、名称、状态与触控范围。
5. 对照 Figma 验证 Tag `40/28/24/20`、CheckTag `40/32/24/20`、mark 右侧圆角、所有颜色组合及 checked/disabled 状态。

## Collapse / CollapseGroup

### 当前结构摘要

- 权威入口为节点 `24386:5265`；Collapse 主组件集为 `27716:30544`，CollapseGroup 组件集为 `27740:32816`。设计说明为「可以折叠/展开的内容区域」。
- Collapse 有 4 个 variant 轴：`expand`（展开）、`header right content`（右侧操作说明）、`disabled`、`expandicon`（是否显示 chevron），共 16 个变体，全部已读取。
- CollapseGroup 有 `theme=default/card` 与 `count=2/3/4/5` 两个轴，共 8 个变体。`card` 使用 `radius/radius-large` 并裁切子面板圆角，`default` 为通栏样式且无圆角。
- Figma 另在 Type 章节给出三种用法：`Basic 基础折叠面板`、`with Operation Instructions 带操作说明`、`Accordion 手风琴式`；Style 章节给出 `Block Style 通栏样式`（375 通栏）与 `Card Style 卡片样式`（375 画布内 343 宽、左右 16 外边距）。`375` / `343` 是展示基准，不是组件固定宽度。
- 面板容器使用 `Color/grey/bg-color-container`，左内边距 `16`。`expandicon=true` 时右内边距 `16` 由 Operation 槽承担，`expandicon=false` 时由 header 行本身承担；展开内容区始终自行承担右内边距 `16`。
- header 行为横向 auto layout，`itemSpacing=4`、`items-center`、上下内边距 `16`，因此单行标题的基准高度为 `24 + 16 × 2 = 56`；底部有 `0.5` 分割线，颜色为 `Color/grey/component-stroke`。
- 标题使用 `H7 16/24 Regular` 与 `text/text-color-primary`，占据剩余宽度并按内容换行（`word-break`），未定义省略号方案。操作说明使用同一 `H7 16/24 Regular`、`text/text-color-placeholder`，不换行且不参与收缩。
- chevron 为 `chevron-down`，基准 `24×24`，颜色绑定 `text/text-color-placeholder`；`expand=true` 时旋转 `180°` 指向上方（Figma 中分别用 `rotate-180` 与垂直翻转表达，视觉结果一致）。
- 展开内容区图层名为 `自定义内容`：容器沿用容器背景色、左内边距 `16` 与底部 `0.5` 分割线，内部上下内边距 `16`、右内边距 `16`，文本使用 `Body 14/22 Regular` 与 `text/text-color-primary`。在 `375` 基准下正文可用宽度为 `343`，展开态整体高度示例为 `198`（header `56` + 内容 `142`）。
- `disabled=true` 时标题、操作说明、正文统一使用 `text/text-color-disabled`，chevron 同样解析为 `text/text-color-disabled`；容器背景与分割线不变。
- 每个面板（含展开内容区）都保留自身底部分割线，组内最后一个面板同样有分割线，这是当前 Figma 的显式定义，不得为「视觉更干净」而移除。
- 当前节点未定义展开/收起动画、按压态、hover 态、focus 态、header 图标槽、多级嵌套折叠、右侧自定义控件（如开关、按钮）以及标题长文案的省略方案。

### 组件规则

- IMPORTANT：项目中的折叠内容必须复用统一 Collapse / CollapseGroup，不得在详情页、表单或列表中各自用 `Pressable` + `Text` + chevron 拼出折叠行。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5265` 读取最新定义；本摘要不能替代 Figma 中的间距、排版、颜色和 variant 组合。
- Collapse API 应围绕 `expanded`、`actionText`、`disabled`、`expandIcon`、`title` 和内容槽建模，四个 variant 轴一一对应，不得新增 Figma 未定义的 variant 或 theme。
- 展开状态必须受控，由调用方持有；组件不得在调用方不知情的情况下保存或推导展开状态。`disabled` 时不触发切换回调。
- 内容只能通过「默认文本」或「自定义内容槽」二选一提供，类型上必须互斥；自定义内容不得绕过内容区的左右 `16`、上下 `16` 内边距与底部分割线结构。
- `expandicon=false` 表示不显示 chevron，但面板仍可展开；此时右内边距必须回到 header 行本身，不得保留空的 Operation 槽或让操作说明贴边。
- 操作说明是文本说明，不是第二个操作入口。它不得渲染为按钮、不得承载独立点击行为，也不得替代 chevron 表达展开方向。
- 标题、操作说明、正文、chevron 与分割线必须成套使用对应 Typography 与 Color 语义 token，`disabled` 必须使用 `text/text-color-disabled`，不得通过 opacity 派生禁用态。chevron 必须复用包内 `src/icons.tsx` 的 `ChevronDownIcon` 并通过 `currentColor` 继承 token。
- CollapseGroup 必须由带稳定 `id` 的 items 数据驱动，受控展开集合按 `id` 索引；不得使用数组下标作为标识。组级 `disabled` 与项级 `disabled` 合并，禁用项不得改变展开集合。
- `theme=card` 只改变容器圆角与裁切，不得同时修改面板内边距、分割线或排版；卡片左右外边距属于页面布局职责，组件本身填满父容器可用宽度。
- Figma 当前只定义 2–5 个面板的组；数量超出该范围时应先回到设计确认，实现层在 `__DEV__` 下告警。
- 手风琴式只改变「同一时间最多展开一个面板」的展开集合计算，不引入任何新的视觉状态；单个面板的样式必须与基础折叠面板完全一致。
- 组内最后一个面板保留底部分割线；`card` 主题下由容器裁切圆角，不得改为「最后一项去掉分割线」等 Figma 未定义的处理。
- 展开动画、按压态、hover / focus 态、header 图标、嵌套折叠和标题省略方案未在 Figma 定义，不得自行补值；需要时先读取对应设计或补充设计系统定义。

### 可访问性与交互

- header 必须暴露为按钮并具有可读名称，默认取标题文案；语义不清时由调用方提供明确的 accessibility label 与 hint。
- 展开与收起必须通过 `expanded` 可访问状态表达，不得只依赖 chevron 方向或分割线位置；`disabled` 必须同时向辅助技术暴露不可用状态并阻止回调。
- chevron 属于装饰元素，必须从无障碍树中隐藏，避免与按钮名称重复朗读。
- 展开内容必须紧随对应 header 出现在阅读顺序中；收起时内容不渲染，不得只用视觉隐藏留在无障碍树里。
- header 基准高度 `56` 已满足平台最小触控尺寸，但整行必须都可点击；不得只把 chevron 或标题作为热区。
- CollapseGroup 中每个面板必须保持独立可聚焦，不得把整组压成一个无法逐项操作的可访问元素。手风琴式收起其他面板时，焦点应留在被操作的 header 上。
- 自定义内容中的可交互元素由调用方负责语义和触控范围；`disabled` 时其内容的禁用表达同样由调用方处理，组件只统一默认文本的禁用色。

### React Native / Expo 实现约束

- header 使用单一 `Pressable` 渲染，标题、操作说明与 Operation 槽位于同一横向布局流；不要为 16 个变体或 2–5 个面板复制 JSX，也不得用绝对坐标还原 `375` / `343` 示例。
- 尺寸、内边距、图标尺寸与分割线宽度从 `componentTokens.collapse` 读取，颜色与排版只引用语义 token，卡片圆角引用 `radiusTokens.large`。
- 标题使用 `flex: 1` + `minWidth: 0` 参与收缩并允许换行，操作说明与 Operation 槽保持 `flexShrink: 0`；不得让 chevron 被长标题挤出可视区域。
- chevron 展开态通过 `transform: rotate('180deg')` 表达，旋转包裹在独立 View 中，不改变 Operation 槽的布局与右内边距。
- `0.5` 分割线使用 `borderBottomWidth`，因此会在布局高度上叠加 `0.5`（与 Checkbox 内容区一致）。基准 `56` / `198` 用于视觉验收，不应写死面板高度。
- 面板与组均使用 `alignSelf: 'stretch'` 填满父容器可用宽度；`card` 主题在组容器上设置 `overflow: 'hidden'` 与圆角，由容器裁切首尾面板的直角。
- 展开切换目前不带动画。若后续设计补充动效，应在统一组件内实现，不得由业务页面各自用 `LayoutAnimation` 或自定义高度动画覆盖。
- 内容区高度必须由内容与动态字体自然计算；不得为容纳长文案缩小字号、整体缩放或裁切内容。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5265` 获取最新结构、变量与截图；必要时继续读取组件集 `27716:30544` 与 `27740:32816`。
2. 确认本次使用的用法（基础、带操作说明、手风琴式）与样式（通栏、卡片），以及每个面板的稳定 id、标题、内容与禁用状态。
3. 确认 `expand`、`header right content`、`disabled`、`expandicon` 四个轴的取值，并排除设计未定义的组合与状态。
4. 将排版、颜色、chevron、圆角与分割线映射到项目已有语义 token 与包内 `ChevronDownIcon`；缺失定义时先回到 Figma 核实，不得自行补值。
5. 对照 Figma 验证 `56` header 高度、`16` 左右内边距、`4` header 间距、`24` chevron 与旋转方向、`0.5` 分割线、`142` 内容区高度、`343` 正文宽度、禁用态全部文本色、卡片 `8` 圆角，以及触控热区与无障碍状态。

### 项目实现现状

- 统一实现为 `src/components/Collapse.tsx`，导出 `Collapse` 与 `CollapseGroup`；尺寸与间距来自 `componentTokens.collapse`，chevron 来自 `src/icons.tsx` 的 `ChevronDownIcon`。
- 内容槽通过判别联合互斥：`children` 与 `contentText` 只能二选一；`CollapseGroupItem` 的 `content` 与 `contentText` 同样互斥。
- 展开状态受控：`Collapse` 使用 `expanded` + `onToggle`，`CollapseGroup` 使用 `value`（展开 id 集合）+ `onChange`，均不在组件内持久化业务状态。
- `CollapseGroup` 的 `accordion` 只改变展开集合计算（展开时返回单个 id，收起时返回空集合），不引入新视觉状态；items 数量不在 2–5 之间时在 `__DEV__` 下 `console.warn`。
- `theme=card` 通过 `overflow: 'hidden'` + `radiusTokens.large` 实现；卡片左右外边距由页面布局负责，组件本身 `alignSelf: 'stretch'`。
- 分割线的缩进由「边框画在哪个元素上」决定：`borderBottomWidth` 的边框盒不会被元素自身的内边距缩进。header 分割线画在 header 行上、左缩进来自父级 `surface` 的内边距，而右内边距落在 Operation 槽内部，因此表现为左缩进、右通栏；内容区分割线与左内边距同在 `content` 上，因此左右均为通栏。这是当前实现与 Figma 基准的一致状态，不要为个别页面的缩进偏好改动它。
- 已知设计缺口，扩展前必须先回到 Figma 核实：展开/收起动画、按压态、hover / focus 态、header 图标槽、右侧自定义控件、嵌套折叠与标题长文案省略方案。

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

## Divider

### 当前结构摘要

- 权威组件集为 `26625:6299`，variant 轴为 `dashed=false|true`、`layout=horizontal|vertical`、`align=none|left|center|right`、`content=false|true`，当前共 10 个已发布组合。
- `content=false` 时 `align` 固定为 `none`，即纯线条形态；`align=left|center|right` 只在 `layout=horizontal` 且 `content=true` 时存在。Figma 当前没有 `layout=vertical, content=true` 变体。
- 所有变体线宽均为 `0.5`，线色为 `Color/grey/component-stroke`（`#DFE1E8`）。虚线样式为 `stroke-dasharray="2 2"`，即 `2` 实线段配 `2` 间隙。
- 带文字变体容器高度为 `20`，线段与文字的 auto layout 间距为 `8`，容器裁切溢出内容。文字使用 `Foot 12/Regular` 与 `text/text-color-placeholder`（`#8F9195`），居中对齐。
- `align=left` 为「短线段 `16` + 文字 + 自适应线段」，`align=right` 为其镜像，`align=center` 两侧均为自适应线段。短线段长度固定 `16`，不随容器宽度变化。
- 组件本体不定义线长：水平变体撑满调用方宽度；垂直变体线长由所在行决定，用例 `24387:6040` 在 `Body 14/22` 文字行内使用线长 `14`。
- Figma 中的 `375` 是带文字变体的展示宽度，不是固定组件宽度。

### 组件规则

- IMPORTANT：项目中的分割线必须复用统一 Divider 组件，不得继续在页面里用 `borderBottomWidth` 或裸 `View` 手写线条。已有页面级实现（如 `App.tsx`、`ProjectDetailsView.tsx` 中的局部 divider 样式）属于迁移前存量，新增代码不得沿用。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24385:5233` 读取最新定义；本摘要不能替代 Figma 中的线宽、dash 参数、间距和颜色 token。
- 线宽必须使用 `componentTokens.divider.strokeWidth`（`0.5`），不得退化为 `StyleSheet.hairlineWidth`——后者在不同像素密度下解析结果不等于 `0.5`。
- 虚线必须使用 `dashLength` / `dashGap`（均为 `2`）。不得用 React Native 的 `borderStyle: 'dashed'` 代替，该属性无法控制 dash 长度，且在 `0.5` 线宽下各端表现不一致。
- 线色只使用 `border.componentStroke`，文字只使用 `text.placeholder`；不得为「更淡一点」自行叠加透明度。
- 带文字分割线的文字必须使用 `footer12Regular`。文字过长时由容器裁切，不得压缩字号或改变 `16` 短线段长度来容纳文案。
- 垂直分割线的线长属于所在行的布局决定，通过 `length` 传入并由父级 `alignItems: 'center'` 居中；不要用整行高度替代设计给出的线长。
- Figma 未定义分割线的按压态、hover 态、Dark mode 映射，以及垂直带文字形态。需要这些能力时先提出设计缺口，不得在组件内补值。

### 可访问性与交互

- 纯线条分割线是装饰元素，必须从无障碍树中隐藏，不得让辅助技术逐条朗读线条。
- 带文字分割线承载分组语义，文字必须保持可读；`accessibilityLabel` 仅用于文案本身不足以说明分组时的补充。
- React Native 没有 `separator` 语义角色。若某处分割线承担了结构含义，应由所在容器（如带可访问名称的分组 View）表达，不能只依赖线条视觉。
- 分割线不是可交互元素，不得挂载 `onPress`；需要可点击的行分隔请使用列表项组件自身的边框。

### React Native / Expo 实现约束

- 实线使用 `0.5` 高（或宽）的 `View` 加 `border.componentStroke` 背景色；虚线使用 `react-native-svg` 的 `Line` 加 `strokeDasharray`，保持 `0.5` 描边。
- 水平虚线的 `Svg` 不设置 `viewBox`，用户单位即 pt，`x2="100%"` 由已布局的画布宽度解析，dash 长度不会被缩放。设置 `viewBox` 会让 dash 随宽度拉伸，属于错误实现。
- 带文字行的两侧线段对应 Figma `flex-[1_0_0]`：`flexGrow: 1`、`flexShrink: 0`、`flexBasis: 0`，配合容器 `overflow: 'hidden'` 复现 Figma 的裁切行为。
- 组件 API 围绕 Figma variant 轴建模（`layout`、`dashed`、`align`、`children`），不暴露可任意覆盖线宽、颜色的底层样式参数。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24385:5233` 获取规范页；组件集定义读取 `26625:6299`，用例排版读取 `24387:5960`。
2. 确认所需 variant 组合（`layout`、`dashed`、`align`、`content`），并核对该组合在 Figma 中确实存在。
3. 从变体导出的 SVG 读取线宽与 dash 参数，从 variables 读取线色、文字色和字体 token，映射到包内 `componentTokens.divider` 与语义 color / typography token。
4. 复用 `Divider`；确认无法覆盖时先扩展组件与本摘要，不在业务页面另写一份线条实现。
5. 对照 Figma 验证线宽、dash 节奏、`16` 短线段、`8` 间距、`20` 行高与文字颜色，并确认装饰性线条已从无障碍树隐藏。

### 项目实现现状

- 包内实现为 `src/components/Divider.tsx`，覆盖上述 10 个 Figma 组合；`components/Divider.tsx` 是迁移期兼容导出。
- 存量页面仍有手写分割线样式（`App.tsx`、`ProjectDetailsView.tsx` 等），尚未统一替换为 `Divider`。改动这些区域时应顺带迁移，不要复制既有写法。

## ActionSheet

### 当前结构摘要

- 权威入口为节点 `24386:5277`（图层名 `ActionSheet 动作面板`），主组件集为 `27454:30291`，`item/action-cell` 组件集为 `27454:29041`，`item/action-des` 组件集为 `27454:29431`。
- 主组件有 5 个 variant 轴：`theme=list|gird`、`align=center|left`、`cancel=true|false`、`description=true|false`、`item`（列表 2/4/6，宫格 2/4/6/8 与 `>8(only gird)`），共 64 个变体。Figma 图层名把「宫格」拼作 `gird`，代码统一使用 `grid` 并在此登记映射。
- 面板顶部圆角为 `12`，`375` 是展示宽度而非固定组件宽度。
- `theme=list` + `cancel=true`：容器底色为 `Color/grey/bg-color-component`，cell 组与 cancel-cell 之间有 `8` 的 auto layout 间距，该间距透出容器底色，是列表型唯一的分组方式。`cancel=false` 时没有该间距，容器底色也不参与视觉。
- `item/action-cell` 基准高度为 `56`（`24` 行高 + 上下各 `16` 内边距），底色 `Color/grey/bg-color-container`，底部 `0.5` 分割线使用 `Color/grey/component-stroke`；组内最后一项为 `no-border=true`，不画分割线。
- cell 的 `theme` 决定文案色：`default` → `text/text-color-primary`、`primary` → `Color/brand/brand-color`、`error` → `Color/error/error-color`；`disabled=true` 统一解析为 `text/text-color-disabled`。Figma 当前只为 `theme=default` 定义了 `disabled=true`。
- cell 的 `icon=true` 在文案前增加 `24×24` 图标槽，内容间距为 `8`。`align=center` 时内容整体居中、文案占满剩余宽度并单行省略；`align=left` 时内容靠左。
- cell 的 `badge=true` 是文案右上角的 `8×8` error 圆点（无文案），通过 `size-0` 锚点以 `left:-2 / top:-16` 定位。该状态下文案不再占满行宽，整体内容按 `align` 排列，徽标紧随文案。
- `item/action-des` 基准高度为 `46`（`22` 行高 + 上下各 `12` 内边距），文案使用 `Body 14/22 Regular` 与 `text/text-color-placeholder`。列表型说明行为 `no-border=false`（带分割线），宫格型为 `no-border=true`（不带分割线）。
- cancel-cell 基准高度为 `48`（`24` 行高 + 上下 `12`、左右 `16` 内边距），文案使用 `H7 16/24 Regular` 与 `text/text-color-primary`。
- `theme=gird` 的容器底色即 cell 底色（`bg-color-container`），分组靠 `gird` 容器底部的 `0.5` 分割线。`gird` 容器上下内边距为 `8`；`description=true` 时取消上内边距，由说明行自身的 `12` 承担。
- 宫格有两档 item：`item/4 columns` 为 `40` media 槽 + `Foot 12/20 Regular` 标题、基准行高 `96`；`item/≤3 columns` 为 `48` media 槽 + `Body 14/22 Regular` 标题、基准行高 `106`。两档的 item 内边距均为上 `16`、下 `12`、左右 `8`，media 与标题间距 `8`。
- Figma 按 item 数选择列数与档位：`2`→2 列（`≤3 columns`）、`4`→4 列（`4 columns`）、`6`→2 行 × 3 列（`≤3 columns`）、`8`→2 行 × 4 列（`4 columns`）、`>8`→4 列。`align=left` 的宫格 item 改为固定 `80` 宽并在行内左侧紧排，始终使用 `4 columns` 档。
- media 槽圆角为 `radius/radius-medium`。image 形态为 `cover` 图片 + `0.5` 描边，描边使用裸值 `rgba(20, 20, 20, 0.06)`（Figma 未绑定颜色变量）；icon 形态为 `Color/grey/bg-color-component` 底色 + `8` 内边距 + `24×24` 图标。
- 宫格的徽标是带文案的 `Badge 徽标`（示例 `NEW`）而不是列表的圆点：高 `16`、左右内边距 `4`、最小内容宽 `8`、全圆角、error 底色、`Foot 10/Semibold` 白色文案，中心位于 media 槽右上角偏移 `(-2, -1)`。
- Figma 另给出三种宫格用法：`Multiple Rows Scrolling 多行滚动宫格`、`with Swiper 带翻页宫格`（`27478:26787`）、`with Description And Scrolling 带描述多行滚动宫格`。`swiper` 行为 `p=12`、`gap=8`、`8×8` 圆点，当前页圆点为 `Color/brand/brand-color`，其余为 `Color/grey/component-stroke`。
- Figma 中部分 `align=center` 宫格变体的高度比同结构变体多 `10` / `20`，来源是该变体使用了 `item/≤3 columns` 档（行高 `106` 而非 `96`），不是额外的结构或状态。
- 当前节点未定义：遮罩、弹出/收起动画、点击遮罩关闭、系统返回、安全区、cell 的按压态与 hover 态、`theme=primary|error` 的禁用态、宫格 item 的禁用态、翻页的页大小与吸附规则。

### 组件规则

- IMPORTANT：项目中的底部动作面板必须复用统一 ActionSheet，不得在页面里各自用 `Pressable` + `Text` 拼出「操作列表 + 取消」结构。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5277` 读取最新定义；本摘要不能替代 Figma 中的间距、排版、颜色与 variant 组合。
- 组件 API 必须围绕 `theme`、`align`、`cancel`、`description` 四个轴与 item 数据建模，并以判别联合阻止 Figma 未定义的组合：`cancel=true` 必须同时提供取消回调；列表 item 与宫格 item 的数据形状不得互换。
- item 必须提供稳定 `id`，不得使用数组索引或显示文案兼作标识。
- 列表 cell 的 `theme` 表达语义而非配色偏好：破坏性操作用 `error`，主操作用 `primary`，其余用 `default`。`disabled` 必须阻止回调，并使用 `text/text-color-disabled` 而不是整体 opacity。
- 列表徽标是圆点、宫格徽标是带文案的 Badge，两者不得互换实现，也不得用字符或业务 SVG 仿制。Figma 的 `Badge 徽标` 目前没有独立权威节点登记在本文件，组件内实现只覆盖 ActionSheet 用到的形态；需要在其他场景使用徽标时应先读取其权威节点并抽成统一组件。
- 宫格列数必须落在 Figma 定义的 2–4 列内。缺省时按 item 数推导（2→2、4→4、6→3、8→4、`>8`→4），数量不在该集合内时必须显式传入列数，实现层在 `__DEV__` 下告警。
- media 槽只使用 image 或 icon 两种形态，尺寸随列数档位切换，不得在 4 列布局里使用 `48` 的 media 或在 2–3 列布局里使用 `40` 的 media。
- 翻页宫格与多行滚动宫格只改变容器的滚动方式，不改变 item 几何、列数或徽标位置；swiper 圆点只反映当前页，不承载额外状态。
- 分组方式不得自行替换：列表型用 `8` 间距 + 容器底色，宫格型用 `0.5` 分割线。不得为「更干净」给宫格也加间距，或给列表也加分割线。
- 未在 Figma 定义的遮罩、动效、按压态、宫格禁用态不得自行补值；需要时先读取对应设计或补充设计系统定义。

### 可访问性与交互

- 每个 cell 与宫格 item 必须暴露为按钮并具有可读名称，默认取文案；`disabled` 必须同时向辅助技术暴露不可用状态并阻止回调。
- 图标槽与 media 槽属于装饰元素，必须从无障碍树中隐藏，避免与按钮名称重复朗读。
- 列表的圆点徽标没有文案，若承载「有新内容」等含义，必须由调用方提供可读说明并合并到按钮名称中；宫格徽标的文案必须进入按钮的可读名称。
- 取消入口必须是独立按钮并有明确动作名称；`cancel=false` 时宿主必须提供等价的关闭路径（遮罩点击、系统返回等），不得让面板没有退出方式。
- `56` 与 `96` / `106` 均已满足平台最小触控尺寸，但整行 / 整格必须都可点击，不得只把文案或图标作为热区。
- swiper 圆点是装饰元素，必须从无障碍树隐藏；翻页状态应通过滚动容器本身的语义表达。

### React Native / Expo 实现约束

- cell 与宫格 item 均使用单一 `Pressable` 渲染，不要为 64 个变体复制 JSX，也不得用绝对坐标还原 `375` 示例。
- 尺寸、内边距、media 尺寸、徽标几何与分割线宽度从 `componentTokens.actionSheet` 读取；颜色与排版只引用语义 token，media 描边使用 `colorThemes.light.actionSheet.gridMediaBorder`。
- 徽标使用 `0×0` + `alignItems/justifyContent: 'center'` 的锚点容器定位，对应 Figma 的 `size-0` 包裹层；不要使用百分比 `translate`，各端解析不一致。
- `align=center` 的宫格 item 使用 `flex: 1` + `minWidth: 0` 等宽分配，`align=left` 使用固定 `80` 宽 + `flexShrink: 0`；不得按 `93.75` 写死列宽。
- Figma 的 `0.5` 分割线在该节点中是内描边（不占布局高度），而 React Native 的 `borderBottomWidth` 会叠加 `0.5` 到布局高度。基准 `280` / `256` 等整体高度用于视觉验收，不应写死面板或 cell 高度。
- 翻页使用横向 `ScrollView` + `pagingEnabled`，页宽由 `onLayout` 实测得到；多行滚动使用纵向 `ScrollView` 并按「可视行数 × 行高」限制高度。两者不得同时启用。
- 面板与 modal / bottom sheet presenter 分层实现，遮罩、动画、安全区与系统关闭行为由 `src/components/BottomSheet.tsx` 宿主负责。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5277` 获取最新结构、变量与截图；必要时继续读取 `27454:30291`、`27454:29041`、`27454:29431`。
2. 确认 `theme`、`align`、`cancel`、`description` 取值与 item 数量，并核对该组合在 Figma 中确实存在。
3. 确认每个 item 的稳定 id、文案、语义 theme、禁用状态、图标 / media 来源与徽标文案。
4. 将排版、颜色、圆角、media 几何与徽标映射到 `componentTokens.actionSheet` 与语义 token；缺失定义时先回到 Figma 核实。
5. 对照 Figma 验证 `56` cell 高度、`46` 说明行、`48` 取消行、`8` 分组间距、宫格 `96` / `106` 行高、`40` / `48` media、徽标位置、`align=left` 的 `80` 固定宽、swiper 圆点配色，以及触控热区与无障碍状态。

### 项目实现现状

- 统一实现为 `src/components/ActionSheet.tsx`，尺寸与间距来自 `componentTokens.actionSheet`。`theme=list` 与 `theme=grid` 通过判别联合区分，各自的 item 数据形状不可互换。
- `cancel` 为判别联合：`cancel=true` 必须提供 `onCancel`，`cancel` 缺省时不接收 `cancelText` / `onCancel`，不会留下取消行占位。
- 宫格列数由 `resolveGridColumns` 按 Figma 的 item 数映射推导，`align=left` 固定 4 列并使用 `80` 宽固定档；数量不在 `2/4/6/8/>8` 内时在 `__DEV__` 下 `console.warn` 并回落到 4 列。
- 列表徽标（`badge?: boolean`）与宫格徽标（`badge?: string`）按 Figma 的两种形态分别建模，不共用一套实现。
- 翻页通过 `rowsPerPage` 启用（横向 `pagingEnabled` + swiper 圆点），多行滚动通过 `maxVisibleRows` 启用（纵向滚动）。页大小与可视行数在 Figma 中没有数值定义，由调用方按场景传入。
- 已知设计缺口，扩展前必须先回到 Figma 核实：cell 的按压 / hover 态、`theme=primary|error` 的禁用态、宫格 item 的禁用态、`Badge 徽标` 的独立组件定义，以及面板的遮罩与动效。

## DateTimePicker

### 当前结构摘要

- 权威入口为节点 `24386:5248`（图层名 `DateTimePicker 时间选择器`），主组件集为 `27227:19113`，`item/datetime-option` 组件集为 `27227:18734`。
- 主组件有 2 个 variant 轴：`mode` 与 `title=true|false`，共 20 个变体。全部变体均为 `375×258`、header `58`，不存在 Picker 中 `4 columns + title=false` 的 `56` 特例。
- 面板几何与 Picker 完全一致：顶部圆角 `12`、底部内边距 `16`、header 上下内边距 `16`、内容区高 `184`、左右各留 `16`、option 高 `24` + 间距 `16`（吸附步距 `40`）、每列显示 5 个 option、indicator 固定在面板绝对 `y=130` 且为 `343×40` + `radius/radius-medium` + `Color/grey/bg-color-component`、上下各 `48` 渐隐 mask。
- Header 始终保留左侧 Cancel（`Body 14/22 Regular` + `text/text-color-secondary`）和右侧 Confirm（`Body 14/22 Regular` + `Color/brand/brand-color`）；`title=false` 只隐藏居中标题（`H6 18/26 Semibold` + `text/text-color-primary`），不隐藏 header 或两侧操作。
- `item/datetime-option` 的三种形态与 Picker 的 option 一致：普通项 `H7 16/24 Regular` + `text/text-color-secondary`，选中项 `H7 16/24 Semibold` + `text/text-color-primary`，`empty=true` 为不显示文字的对齐占位。
- `mode` 决定列构成，已逐一读取确认：`year`→年（1 列）、`month`→年 + 月（2 列）、`date`→年 + 月 + 日（3 列）、`date week`→年 + 月 + 日（3 列，日列文案含星期，示例 `10th Mon.`）、`date with hour`→4 列、`date with minute`→5 列、`date with second`→6 列、`hour`→1 列、`minute`→时 + 分（2 列）、`second`→时 + 分 + 秒（3 列）。6 列是当前节点的最大列数。
- Figma 示例文案为英文本地化示例（`2021`、`January`、`8th`、`10th Mon.`），不是组件定义的格式。节点未定义任何日期格式化规则、语言包或月末 / 闰年处理。
- 当前节点未定义：遮罩、弹出/收起动画、点击遮罩关闭、系统返回、安全区、disabled / loading / error 状态、异步 Confirm，以及可选时间范围的视觉表达。

### 组件规则

- IMPORTANT：项目中的日期 / 时间滚轮必须复用统一 DateTimePicker，不得为日报、周报、事件时间范围等场景分别复制滚轮、选中背景、渐隐 mask 或 header。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5248` 读取最新定义；本摘要不能替代 Figma 中的尺寸、排版、颜色与 `mode` 列构成。
- DateTimePicker 与 Picker 的面板几何完全相同，必须共用同一套滚轮实现与 token，不得为时间场景另写一份滚轮。
- 列构成只能由 `mode` 推导，不得让调用方任意拼列；不得开放 Figma 未定义的 `mode`，也不得把 `date week` 的星期拆成独立列。
- 受控值必须是单一时间点而非多个独立数字，避免出现「2 月 31 日」这类不存在的组合。改动年 / 月时必须按当月实际天数收敛日，不得依赖 `Date.setMonth` 的月末溢出行为。
- 可选范围必须由调用方显式给出：含年列的 `mode` 必须提供上下界，仅含时间列的 `mode` 在 Figma 中没有日期边界定义，不得自行推导默认范围或年份跨度。
- 列文案的本地化必须由调用方提供。组件默认只输出裸数值，不得内置语言包、月份名、序数词或星期缩写，也不得按运行环境猜测格式。
- Cancel / Confirm 必须复用统一 Link 组件的 `medium + default/primary + normal + no icon + no underline` 定义；滚动中的临时选择与 Confirm 后的提交必须分别回调，组件不得自行持久化业务值。
- `title=false` 时不保留标题占位，调用方必须提供等价的 accessibility label。
- 未在 Figma 定义的遮罩、动效、disabled / loading / error 与异步 Confirm 不得自行补值。

### 可访问性与交互

- 每一列暴露为独立的可调节控件，向辅助技术朗读当前值，并支持平台等价的前一项 / 后一项操作；多列不得合并成一个无法逐列操作的焦点。
- 每列必须有明确的可读名称（年、月、日、时、分、秒），不得让列成为无名称区域。
- 当前选中项必须通过可访问状态或值明确表达；indicator、渐隐 mask 与 `empty` 占位必须从无障碍树隐藏。
- 滚动停止并完成吸附后再公告稳定选中值，避免滚动过程中连续播报无效中间状态。
- 面板以 modal / bottom sheet 呈现时，宿主负责初始焦点、背景不可操作、关闭后的焦点恢复与系统返回路径。

### React Native / Expo 实现约束

- 使用与 Picker 相同的内部滚轮面板，按 `mode` 生成 1–6 列；不要为 10 个 `mode` 或有无标题复制 JSX。
- 每列使用 `ScrollView` + `snapToInterval={40}`，上下留白为 `(184 - 40) / 2 = 72`，使首末项也能进入中央选择位置。
- 多列容器使用 flex 等宽布局并裁切各列溢出；6 列时列宽约为 `57.17`，不得按 `375` 写死列宽。
- 受控值使用 `Date`，按稳定的单位 id（而非数组下标）索引滚轮位置；外部值更新时必须可靠同步到各列，且不得产生回调循环。
- 遮罩、动画、安全区与系统关闭行为由 `src/components/BottomSheet.tsx` 宿主负责。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5248` 获取最新结构、变量与截图；必要时继续读取 `27227:19113` 与 `27227:18734`。
2. 确认 `mode`、是否显示标题、标题文案，以及 Cancel / Confirm 的业务语义。
3. 确认可选范围的上下界与各列的本地化格式，并与对应设计稿核对文案样式。
4. 将容器、indicator、mask、标题、操作文案与 option 状态映射到 `componentTokens.picker` / `componentTokens.dateTimePicker` 与统一 Link 组件。
5. 对照 Figma 验证 10 个 `mode` 的列数、有/无标题、普通 / 选中 option 排版、`58` header、`130` indicator、`40` 吸附步距、渐隐 mask，以及触控、动态字体与无障碍操作。

### 项目实现现状

- 统一实现为 `src/components/DateTimePicker.tsx`。滚轮面板抽到 `src/components/internal/WheelPanel.tsx`，由 `Picker`、`DateTimePicker` 与 `Calendar` 的内嵌时间滚轮共用；`Picker` 的 `4 columns + title=false` 仍通过 `headerHeight=56` 保留 Figma 现状的 `2` 偏差。
- `mode` 到列构成的映射登记在 `modeUnits`，与上方摘要逐项对应；列数由 `mode` 决定，调用方无法任意拼列。
- 受控值为 `Date`。含年列的 `mode` 在类型上强制要求 `minDate` / `maxDate`；仅含时间列的 `mode` 在类型上不接收这两个属性。
- 每列候选值由 `unitRange` 按上层单位的当前取值收窄：只有落在边界年 / 月 / 日 / 时 / 分上时才收敛到边界分量。改动高位单位后统一用 `clampDate` 再夹一次区间，日按当月实际天数收敛。
- 列文案通过 `formatters` 注入，默认只输出裸数值（月份按 1–12 呈现，内部仍为 0–11）。`date week` 的星期后缀必须由调用方在 `formatters.day` 中基于回调传入的候选 `Date` 生成。
- 列的可读名称默认为英文（`Year`…`Second`），可通过 `columnLabels` 覆盖。
- 已知设计缺口，扩展前必须先回到 Figma 核实：遮罩、弹出动画、点击遮罩关闭、系统返回、安全区、disabled / loading / error、异步 Confirm，以及超出可选范围的 option 视觉表达。

## Cascader

### 当前结构摘要

- 权威入口为节点 `24386:5246`（图层名 `Cascader 级联选择器`），主组件集为 `27500:27380`。
- 主组件有 4 个 variant 轴：`theme=step|tab`、`step=1|2|3|4`、`subtitle=true|false`、`close-btn=true|false`，共 32 个变体。
- 面板为 `375×580`，顶部圆角 `12`，底色 `Color/grey/bg-color-container`，`overflow: hidden`。与 `375` 的展示宽度不同，`580` 是容器上的显式高度。
- Title 行基准高度 `58`（`26` 行高 + 上下各 `16` 内边距），标题居中并使用 `H6 18/26 Semibold` + `text/text-color-primary`；`close-M` 为 `24×24`，在 `375` 基准下绝对定位于 `left:335 / top:17`（即右内边距 `16`）。
- Figma Style 章节的「无标题级联选择器」是把整个 Title 层设为隐藏（`hidden=true`），不是独立的 variant 轴。因此关闭入口与标题同时存在或同时消失。
- `theme=step`：Steps 区块左右内边距 `16`、下内边距 `16`、底部 `0.5` 分割线；上内边距在有标题时为 `8`，标题层隐藏时为 `16`。
- Steps 的每一层为 `.master/vertical/dot`：圆点槽与内容的 auto layout 间距 `16`；圆点为 `8×8` 全圆角，上下留白 `7` 使其中心与 `22` 行高的标题中心对齐。已完成层级为 `Color/brand/brand-color` 描边空心圆点 + `1` 宽同色向下连接线 + `Body 14/22 Regular` + `text/text-color-primary` 文案 + 内容下内边距 `16`；当前层级为同色实心圆点、`Body 14/22 Semibold` + 品牌色文案、不渲染连接线也不加下内边距。每层标题行右侧都有 `16×16` 的 `chevron-right`。
- `theme=tab`：`Tabs 选项卡` 高 `48`、底色 `bg-color-container`、底部 `0.5` 分割线。每个 `item/normal-line` 高 `48`、左右内边距 `16`、文案居中；已完成层级为 `Body 14/22 Regular` + `text/text-color-primary`，当前层级为 `Body 14/22 Semibold` + 品牌色并在底部居中渲染 `16×3` 全圆角品牌色 `track`。`step=4` 的变体在容器上使用 `justify-end`，即层级溢出时靠右收拢以保证当前层级可见。
- Subtitle 区块基准高度 `50`（上内边距 `20` + `22` 行高 + 下内边距 `8`），左右内边距 `16`，文案使用 `Body 14/22 Regular` + `text/text-color-placeholder`。
- RadioGroup 的每行（`Radio 单选`）基准高度 `56`：左内边距 `16`，内部 Wrapper 右内边距 `16`、文案与勾选槽间距 `16`、`items-start`；文案区上下内边距 `16`，使用 `H7 16/24 Regular` + `text/text-color-primary`；勾选槽为 `24×24`，上内边距 `16`。行之间没有分割线。
- 行内勾选控件为 `item/unit/radio` 的 `theme=line`：选中态是品牌色勾形（`24` 视图框内的 `Union` 路径），未选中态导出为空图形。该 Radio 组件目前没有独立的权威节点登记在本文件中。
- 当前节点未定义：遮罩、弹出/收起动画、点击遮罩关闭、系统返回、安全区、行的按压态 / hover 态、选项的禁用态、加载态、`step>4`、`tab` 的滚动与溢出规则，以及最终提交入口（面板本身没有确认按钮）。

### 组件规则

- IMPORTANT：项目中的多级联动选择必须复用统一 Cascader，不得在页面里各自拼出「层级指示 + 单选列表」。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5246` 读取最新定义；本摘要不能替代 Figma 中的间距、排版、颜色与 variant 组合。
- 组件 API 必须围绕 `theme`、层级数组、`subtitle`、关闭入口与当前层级候选项建模。层级数量必须限制在 Figma 定义的 1–4 层内，不得开放更多层级。
- 关闭入口必须与标题绑定：没有标题时不得单独渲染 `close-M`，因为 Figma 的无标题形态是隐藏整个 Title 层。
- 层级推进、下一层数据加载、回退到上一层与最终提交由调用方受控。组件只渲染当前层级的候选项，不得在内部缓存层级栈或推断级联关系。
- 层级与候选项必须提供稳定 `id` 与稳定值，不得使用数组索引或显示文案兼作标识。
- `theme=step` 与 `theme=tab` 只改变层级指示的呈现方式，不得同时修改 Subtitle、RadioGroup 的间距与排版。
- 已完成层级与当前层级的区分必须同时体现在排版与颜色上（Regular + 主文本色 vs Semibold + 品牌色），不得只靠颜色或只靠字重。`step` 的连接线必须与圆点中心对齐，且当前层级不渲染后续连接线。
- 行内勾选控件必须使用 `theme=line` 的勾形，未选中时渲染同尺寸空槽位以保持行内对齐；不得改用圆形 radio、字符或业务 SVG 替代。该控件目前只在 Cascader 内实现，其他场景需要单选行时应先读取 Radio 的权威节点并抽成统一组件。
- 面板本身没有确认按钮。需要显式提交时应先确认对应设计，不得在组件内自行追加底部操作区。
- 未在 Figma 定义的遮罩、动效、按压态、禁用态、加载态不得自行补值。

### 可访问性与交互

- 面板必须有可读名称：有标题时取标题，无标题时由调用方提供等价的 accessibility label。
- 关闭入口必须是独立按钮并有明确动作名称；`24×24` 图形不等于触控热区，必须在不改变视觉布局的前提下扩展热区。
- 候选项必须暴露 `radio` 角色与选中状态，并保持逐项可聚焦；选中状态不得只依赖勾形图标的视觉。
- 可回退的层级必须暴露为可操作控件并有明确名称；不可回退的层级（通常是当前层级）不得被错误地暴露为可点击。
- `chevron-right` 与勾选图形属于装饰元素，必须从无障碍树中隐藏。
- 候选项列表溢出时必须可滚动，且 Title、层级指示与 Subtitle 不随列表滚出视口。

### React Native / Expo 实现约束

- 层级指示与候选项分别使用单一 `Pressable` 渲染，不要为 32 个变体复制 JSX，也不得用绝对坐标还原 `375` 示例。
- 尺寸、内边距、圆点几何、连接线宽度与指示条尺寸从 `componentTokens.cascader` 读取；颜色与排版只引用语义 token。
- 连接线使用 `flex: 1` 的 `1` 宽 `View` 填满圆点下方的剩余高度，由已完成层级的 `16` 下内边距提供长度；不得写死 `16` 的线长。
- `theme=tab` 使用横向 `ScrollView` 表达 Figma `justify-end` 的「保证当前层级可见」意图，不得按 `375` 写死行宽。
- 候选项列表使用 `flex: 1` 的 `ScrollView`；面板高度取 `componentTokens.cascader.panelHeight`（`580`），宿主必须保证可用高度。
- 遮罩、动画、安全区与系统关闭行为由 `src/components/BottomSheet.tsx` 宿主负责。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5246` 获取最新结构、变量与截图；必要时继续读取组件集 `27500:27380`。
2. 确认 `theme`、层级数量（1–4）、是否显示说明行与关闭入口，并核对该组合在 Figma 中确实存在。
3. 确认每个层级的稳定 id、显示文案（已选值或待选提示）、是否可回退，以及当前层级的候选项与受控选中值。
4. 将排版、颜色、圆点、连接线、指示条与勾选图形映射到 `componentTokens.cascader`、语义 token 与包内 `ChevronRightIcon` / `RadioLineCheckIcon`。
5. 对照 Figma 验证 `58` 标题行、Steps 的 `8` / `16` 上内边距、`8` 圆点与 `7` 留白、`16` 间距、`50` 说明行、`48` tab 高度与 `16×3` 指示条、`56` 行高、`24` 勾选槽，以及触控热区与无障碍状态。

### 项目实现现状

- 统一实现为 `src/components/Cascader.tsx`，尺寸与间距来自 `componentTokens.cascader`，图标来自 `src/icons.tsx` 的 `ChevronRightIcon`、`RadioLineCheckIcon` 与既有 `CloseMIcon`。
- `CloseMIcon` 复用既有的 `22` 视图框实现。该节点导出的是 `24` 视图框版本，但两者的 X 图形都占视图框的 `50%`，按 `24×24` 渲染结果一致，因此没有新增重复资产。
- 层级数量由 `CascaderSteps` 元组联合在类型层限制为 1–4；数组最后一项即当前层级。
- 标题与关闭入口通过判别联合绑定：没有 `title` 时无法传入 `onClose`，对应 Figma 隐藏整个 Title 层的处理。
- 当前层级的选中值受控（`value` + `onChange`），层级推进与数据加载由调用方负责；组件不保存层级栈。
- `theme=tab` 使用横向滚动承载 Figma `step=4` 变体的 `justify-end` 意图；`theme=step` 的连接线由已完成层级的下内边距撑开。
- 已知设计缺口，扩展前必须先回到 Figma 核实：行的按压 / hover 态、选项禁用态与加载态、`step>4`、Radio 的独立权威节点与完整状态矩阵，以及面板的遮罩、动效与提交入口。

## Calendar

### 当前结构摘要

- 权威入口为节点 `24386:5262`（图层名 `Calendar 日历`），主组件集为 `27213:17690`，`item/date` 组件集为 `27205:14790`。
- 主组件有 3 个 variant 轴：`type=single|multiple|range`、`format=default|suffix|prefix&suffix`、`timePicker=false|true`，共 18 个变体。`item/date` 有 9 个 variant 轴，当前发布 38 个状态组合。
- 面板为 `375×668`，顶部圆角 `12`，底色 `Color/grey/bg-color-container`。`668` 是容器上的显式高度；`375` 仍是展示宽度。
- title 行与 Cascader 一致：基准高度 `58`、内边距 `16`、标题 `H6 18/26 Semibold` + `text/text-color-primary` 居中、`close-M` 为 `24×24` 且在 `375` 基准下位于 `left:335 / top:17`。
- `days` 星期表头基准高度 `46`（`22` 行高 + 上下各 `12` 内边距），左右内边距 `16`、列间距 `4`，7 个 item 等宽；文案使用 `Body 14/22 Regular` + `text/text-color-secondary` 居中。Figma 当前从 `SUN` 起。
- 内容区按月连续排列并纵向滚动：星期表头与首个月份、以及相邻月份之间的间距为 `16`。每个 `month` 块左右内边距 `16`，月份标题（示例 `March 2023`）为 `Body 14/22 Regular` + `text/text-color-primary`，标题与 `table` 之间间距 `8`。
- `table` 在 `375` 基准下宽 `343`，行高 `60`、行间距 `8`、列间距 `4`，因此单格宽约 `45.57`（`(343 - 6 × 4) / 7`）。`item/date` 主组件标称 `44×60`，实例会被拉伸到列宽。
- `item/date` 为上下内边距 `4`、圆角 `radius/radius-medium` 的纵向容器：日期数字使用 `H7 16/24 Semibold`，prefix / suffix 使用 `10/16 Regular`。Figma 用 `margin-bottom: -2` 让多行内容在 `60` 的格子里收紧，只在后面还有一行内容时出现。
- `item/date` 的垂直对齐由实际行数决定：只有日期 → 居中（`27205:14789`）；日期 + suffix → 底部对齐（`27205:14788`）；prefix + 日期 + suffix → 居中（`27205:14787`）；prefix + 日期 → 顶部对齐（`27205:14927`）。
- `item/date` 的状态取值：默认文案 `text/text-color-primary`；`prefix=true` 时 prefix 与日期数字整体使用 `Color/error/error-color`（suffix 仍为 `text/text-color-disabled`）；`now=true` 日期数字使用 `Color/brand/brand-color`；`disabled=true` 文案使用 `text/text-color-disabled`；`empty=true` 为无底色、无文案的占位。
- 选中与区间：`select=true` 为 `Color/brand/brand-color` 底色 + 四角 `6` 圆角 + 白色文案；`select-start=true` 只保留左侧圆角并在右侧 `-4` 处补一条 `4` 宽 `brand-color-light`；`select-end=true` 镜像处理；`hight-light=true` 为 `brand-color-light` 底色、无圆角，并额外有一层 `inset: 0 -4px` 的同色背景。`4` 的延伸量等于列间距，作用是让区间底色跨列连续。
- footer 基准高度 `80`（Button `48` + 上下各 `16` 内边距），底色 `bg-color-container`，内含一个占满可用宽度的 Button（`size=large`、`variant=base`、`theme=primary`、`shape=round`，内边距 `20/12`、`H7 16/Semibold`、白色文案）。
- `timePicker=true` 在 footer 之上插入 `375×178` 的 `timePicker` 块：header `58` 只有居中标题（示例 `Time`），没有 Cancel / Confirm；内容区高 `104`（3 个 option）、2 列（时、分）、左右各留 `16`、列间距 `16`；indicator 位于块内绝对 `y=90`，为 `343×40`；上下渐隐 mask 各 `32`；块底部内边距 `16`。该块复用与 Picker 相同的 option 与吸附几何。
- 当前节点未定义：遮罩、弹出/收起动画、点击遮罩关闭、系统返回、安全区、格子的按压态 / hover 态、`select` 与 `now` / `disabled` 的组合、月份切换入口、周起始日切换、确认按钮的禁用 / loading 态，以及 `timePicker` 的分钟步进。

### 组件规则

- IMPORTANT：项目中的日期选择必须复用统一 Calendar，不得为单选、多选、区间或带时间的场景分别绘制月份表格、区间底色或底部操作。
- IMPORTANT：实现前使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5262` 读取最新定义；本摘要不能替代 Figma 中的格子几何、状态配色与 variant 组合。
- 组件 API 必须围绕 `type`、`format`、`timePicker` 三个轴与受控选中值建模，并用判别联合把每种 `type` 绑定到对应的值形状（单个日期 / 日期数组 / 区间对象），不得用一个松散对象覆盖三种语义。
- 月份范围必须由调用方显式给出上下界，组件不得自行决定渲染多少个月或默认年份跨度。
- 格子状态的解析顺序必须明确且不叠加：`empty` → `disabled` → 选中（含区间端点）→ `hight-light` → `now` → 默认。Figma 没有定义 `select` 与 `now`、`select` 与 `disabled` 的组合，不得自行合成这些视觉。
- 区间底色必须通过向列间隙延伸 `4` 来保持连续：中间段向左右各延伸，两端只向区间内侧延伸。不得改用负 margin 吞掉列间距，也不得去掉列间距来「省掉」延伸层。
- 区间端点的圆角必须按 Figma 裁切（起点只留左侧、终点只留右侧）；只选了起点时没有区间可衔接，应按完整圆角的 `select` 渲染。
- `format` 决定格子的行结构与垂直对齐，具体文案由每一天的数据提供。某一天没有对应文案时保留空行以维持行内对齐，不得让同一行的格子高度不一致。
- `prefix` 表达节日 / 特殊标记语义，会把 prefix 与日期数字整体改为 error 语义色；不得把它当作普通副标题使用，也不得单独给 prefix 上色而让日期保持主文本色。
- 月份标题与星期表头的本地化必须由调用方提供。组件不得内置语言包、月份名或星期缩写，也不得按运行环境猜测格式。
- 底部操作必须复用统一 Button 组件的 `large + round + base/primary + block`，不得在组件内重画按钮或改用其他尺寸。
- `timePicker` 必须复用与 Picker / DateTimePicker 相同的滚轮实现与 option 几何，只替换内容高度、mask 高度、indicator 位置并隐藏两侧操作；不得另画一套滚轮，也不得在该块内重复提交入口。
- 未在 Figma 定义的遮罩、动效、按压态、月份切换入口、确认按钮状态与分钟步进不得自行补值。

### 可访问性与交互

- 面板必须有可读名称：有标题时取标题，无标题时由调用方提供等价的 accessibility label。
- 每个可选日期必须暴露为按钮并具有可读名称与选中状态；`disabled` 必须同时暴露不可用状态并阻止回调，`empty` 占位必须从无障碍树中隐藏。
- 状态不得只依赖颜色：选中、区间、今天与禁用必须同时通过可访问状态或可读名称表达。
- 星期表头是表格的列说明，应从无障碍树中隐藏或作为列标题提供，不得逐个朗读成可操作元素。
- 月份标题应作为对应月份的区块标题，使辅助技术能在长列表中定位当前月份。
- `timePicker` 的时、分两列必须分别暴露为可调节控件并有明确名称；indicator 与渐隐 mask 必须从无障碍树隐藏。
- 底部确认按钮必须保持可达，不得因月份列表过长而被挤出视口；按钮须遵守 Button 的 disabled / loading 与防重复提交规则。

### React Native / Expo 实现约束

- 月份、周、格子均由数据驱动渲染，不要为 18 个变体复制 JSX，也不得用绝对坐标还原 `375×668` 示例。
- 尺寸、间距、格子几何、区间延伸量与 `timePicker` 几何从 `componentTokens.calendar` 读取；颜色与排版只引用语义 token。
- 格子使用 `flex: 1` + `minWidth: 0` 等宽分配并配合 `gap: 4`，不得按 `45.57` 写死列宽。
- 区间延伸层使用绝对定位的 `View`（`left/right: -4`）并设置为不拦截触摸；容器不得设置 `overflow: 'hidden'`，否则延伸层会被裁掉。
- 标题、星期表头、`timePicker` 与 footer 固定在滚动容器之外，只有月份列表使用 `flex: 1` 的 `ScrollView`；面板高度取 `componentTokens.calendar.panelHeight`（`668`），宿主必须保证可用高度。
- 日期比较必须按本地年 / 月 / 日比较，不得直接比较时间戳，避免同一天的不同时刻被判为不同日期。
- 遮罩、动画、安全区与系统关闭行为由 `src/components/BottomSheet.tsx` 宿主负责。

### Figma 读取与实现流程

1. 使用 file key `EwHKttY9aJIOS7TM3RqGoW` 和节点 `24386:5262` 获取最新结构、变量与截图；必要时继续读取组件集 `27213:17690` 与 `item/date` 组件集 `27205:14790`。
2. 确认 `type`、`format`、`timePicker` 取值，并核对该组合在 Figma 中确实存在。
3. 确认月份范围、周起始日、每一天的附加文案与禁用状态、今天的标记，以及月份标题与星期表头的本地化文案。
4. 将格子几何、状态配色、区间延伸、底部 Button 与 `timePicker` 映射到 `componentTokens.calendar`、语义 token 与统一 Button / 内部滚轮面板。
5. 对照 Figma 验证 `58` 标题行、`46` 星期表头、`16` 月份间距、`8` 标题间距、`60` 行高与 `8` / `4` 间距、四种 `format` 的垂直对齐、`select` / `select-start` / `select-end` / `hight-light` / `now` / `disabled` / `empty` 全部状态、`80` footer，以及 `timePicker` 的 `104` 内容区、`90` indicator 与 `32` mask。

### 项目实现现状

- 统一实现为 `src/components/Calendar.tsx`，尺寸与间距来自 `componentTokens.calendar`，关闭图标复用 `src/icons.tsx` 的 `CloseMIcon`。
- `type` 通过判别联合绑定值形状：`single` 为 `Date | undefined`，`multiple` 为 `readonly Date[]`，`range` 为 `{ start?, end? }`。选中值与时间值全部受控，组件不持久化业务值。
- 格子状态由 `resolveDateState` 按上方规则定序解析；区间中间段与两端的延伸层分别用 `bandFull` / `bandRight` / `bandLeft` 实现，延伸量取 `componentTokens.calendar.date.bandOverhang`（`4`，等于列间距）。
- 垂直对齐由 `alignByFormat` 按实际渲染的行数决定，而不是直接按 `format` 固定；`marginBottom: -2` 只加在后面还有一行内容的行上。
- 每一天的附加文案与禁用状态通过 `meta` 传入，键为本地时区的 `YYYY-MM-DD`；月份标题与星期表头文案由 `formatMonth` 与 `weekdayLabels` 注入，组件不内置任何语言包。
- 底部操作复用统一 `Button` 的 `size=large` + `shape=round` + `theme=primary` + `block`。该尺寸的几何（高 `48`、内边距 `20/12`、`H7 16/Semibold`）读取于本节点的 Button 实例 `27205:15150`，与 Button 规范页摘要一致；`large` 的仅图标形态仍未开放，详见 Button 的「项目实现现状」。
- `timePicker` 复用 `src/components/internal/WheelPanel.tsx`，只覆写 `contentHeight=104`、`maskHeight=32`、`indicatorTop=90`、`showActions=false`、`roundedTop=false`。分钟步进在 Figma 中没有定义，默认逐分钟并可由调用方覆盖。
- `firstDayOfWeek` 默认 `0`（周日起，与 Figma 当前定义一致），可切到周一起；切换时 `weekdayLabels` 的顺序必须由调用方同步调整。
- 已知设计缺口，扩展前必须先回到 Figma 核实：格子的按压 / hover 态、`select` 与 `now` / `disabled` 的组合、月份切换入口、确认按钮的禁用 / loading 态、`timePicker` 的分钟步进与可选时间范围，以及面板的遮罩与动效。

## Icon

### 当前结构摘要

- Icon 集合以 `16×16` symbol 为基础规格，实际展示尺寸及触控区域应以具体组件设计为准。
- 当前按箭头、基础、电梯、设备/工具、角色、建筑、操作、开发、自然等类别组织。
- 集合包含 outline / filled、方向、交互状态、Wi-Fi 信号强弱、语言等成组变体，以及 KONE / GiantKONE 品牌标识资源。
- Figma 历史资产中存在大小写、空格及 `filed` / `filded` 等拼写差异。检索和导出时必须使用 Figma 中的精确名称或节点 ID，不得按猜测替换为相似图标。

### 使用规则

- IMPORTANT：实现前先在 Icon Figma 节点中查找并选择语义、方向、outline/filled 和状态完全匹配的现有图标；不得凭记忆手绘、使用字符代替或创建占位图标。
- IMPORTANT：不得为已有图标引入第三方 icon package。设计系统组件优先复用包内 `src/icons.tsx` 中与 Figma 一致的 typed SVG 组件；业务图标优先复用消费项目中已确认来源的资产。缺失时从 Figma 获取原始 SVG，并转换为保持原始 viewBox 与几何的 `react-native-svg` 组件。
- 同一图标的 filled、方向、信号强弱、语言或其他状态应建模为明确 variant，不要复制成无关联实现。
- Figma 原始名称是资产追溯依据。若代码命名需要规范化，可使用稳定的 camelCase/PascalCase 名称，但必须维护到 Figma 原名或节点 ID 的显式映射，且不得改变图标语义。
- 图标颜色必须使用 Color 章节定义的语义 token；不得在组件内硬编码颜色。品牌标识若包含固定品牌色，应保持原始资产颜色，不得随主题改色。
- `16×16` 是图形基准，不等于交互热区。按钮、列表项等交互组件应按具体设计提供足够的可点击区域，且不得通过非等比缩放扭曲图标。
- 装饰性图标应从无障碍树中隐藏；承载操作或状态含义的图标必须由所在控件提供可读的 accessibility label，不得只依赖图形传达含义。
- React Native / Expo 中使用项目既有的 `react-native-svg` 组件模式；不要把仅适用于 Web 的 icon font 或 CSS mask 作为原生端唯一实现。
- 下载或新增资产前先检查包内 `src/icons.tsx` 和消费项目自己的资产目录，避免同一图标产生重复实现；图形内容和 viewBox 必须与 Figma 原始 SVG 一致。

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
- 规范默认继续维护在本文件；确需拆分时放入本包 `docs/` 并确保发布清单包含该文件，再从本文件使用 `#[[file:docs/<文件名>]]` 引用。
- 摘要只用于快速理解，不能替代权威来源；不要静态复制整套易变 token 值。
