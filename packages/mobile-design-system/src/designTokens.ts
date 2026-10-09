import type { TextStyle } from 'react-native';

export const colorThemes = {
  light: {
    brand: {
      default: '#1450F5',
      hover: '#4373F7',
      active: '#1444C8',
      disabled: '#A1B9FB',
      light: '#F3F6FE',
    },
    background: {
      page: '#F5F7FA',
      container: '#FFFFFF',
      secondaryContainer: '#F5F7FA',
      component: '#F2F4F7',
      /**
       * Figma `Color/grey/bg-color-component-active`。`theme=default` 按钮的按压底色。
       * 与 `text.placeholder` 取值相同但语义不同。
       */
      componentActive: '#8F9195',
      transparent: 'transparent',
    },
    overlay: {
      modal: 'rgba(0, 0, 0, 0.60)',
    },
    border: {
      componentStroke: '#DFE1E8',
      componentBorder: '#C8CAD0',
    },
    dataTile: {
      realtimeIconBackground: '#E7EDFE',
      sensorIconBackground: '#E3E3FF',
    },
    home: {
      heroPink: '#FEF3F3',
      heroGreen: '#E8FBF1',
      pageBackground: '#F2F4F7',
      organizationText: '#3D464C',
      strongText: '#11161A',
      contractHeaderBackground: '#D0DCFD',
      protocolBackground: '#F1F1FF',
      protocolBorder: '#DDDDFE',
    },
    deviceEvents: {
      /**
       * My Device View `Light/Gray/Gray-5`。设备事件页签中时间范围未选中项的文案色。
       * 该文件使用自有 `Light/Gray` 色阶，与 China Design System 的 `text` 语义族不同源，
       * 因此无法直接复用 `text.secondary`（`#676A72`）。
       */
      rangeInactiveText: '#566066',
      /**
       * My Device View `Light/Gray/Gray-4`。设备事件分类卡片未选中项的文案色。
       * 与 `home.organizationText` 取值相同但语义不同，待两处设计稿统一后再合并。
       */
      categoryInactiveText: '#3D464C',
      /**
       * My Device View `color/grey/50`。故障代码统计条底色，
       * 搭配 `background.component`（`color/grey/200`）作 1px 描边。
       * 与 `projectDetails.scoreCardBackground` 取值相同但语义不同。
       */
      statBoxBackground: '#FAFBFC',
    },
    actionSheet: {
      /**
       * ActionSheet 宫格 media 槽的描边。Figma `item/4 columns` 与 `item/≤3 columns`
       * 的 image 槽使用裸值 `rgba(20, 20, 20, 0.06)`，未绑定任何颜色变量，
       * 因此在此登记为组件专属颜色而非语义 token。
       */
      gridMediaBorder: 'rgba(20, 20, 20, 0.06)',
    },
    table: {
      border: '#DFE1E8',
      headerBackground: '#F2F4F7',
      alternateRowBackground: '#F5F7FA',
    },
    error: {
      default: '#F51414',
      disabled: '#FBA1A1',
      light: '#FEF3F3',
    },
    success: {
      default: '#1ED273',
      strong: '#1FBA68',
      disabled: '#8CEEBA',
      light: '#DBFBEA',
    },
    warning: {
      default: '#F98600',
      accent: '#FDAA31',
      disabled: '#FFD18D',
      light: '#FFF1DB',
    },
    projectDetails: {
      statusHealthyBackground: 'rgba(31, 191, 107, 0.10)',
      statusAttentionBackground: 'rgba(253, 170, 49, 0.10)',
      statusRiskBackground: 'rgba(244, 85, 85, 0.10)',
      statusUnratedBackground: '#EAECF1',
      statusAttentionTagStart: '#FFC775',
      statusAttentionTagEnd: '#FDA92E',
      statusRiskTagStart: '#FF8484',
      statusRiskTagEnd: '#F45555',
      dailyReportBackground: '#E7EDFE',
      weeklyReportBackground: '#E3E3FF',
      monthlyReportBackground: '#F3EEE6',
      scoreCardBackground: '#FAFBFC',
    },
    text: {
      primary: '#141414',
      secondary: '#676A72',
      placeholder: '#8F9195',
      disabled: '#ABADB2',
      white: '#FFFFFF',
      brand: '#1450F5',
      link: '#1450F5',
    },
  },
  dark: {
    text: {
      link: '#1450F5',
    },
  },
} as const;

export const radiusTokens = {
  small: 4,
  medium: 6,
  /** Figma `radius/radius-large`; used by the CollapseGroup card theme. */
  large: 8,
  circle: 9999,
  tagRound: 128,
} as const;

export const typographyTokens = {
  data16Regular: {
    fontFamily: 'KONE Information',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '400',
  },
  data24Regular: {
    fontFamily: 'KONE Information',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '400',
  },
  footer10Regular: {
    fontFamily: 'PingFang SC',
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '400',
  },
  footer10Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '600',
  },
  status15Semibold: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  projectStatus11Regular: {
    fontFamily: 'PingFang SC',
    fontSize: 11,
    lineHeight: 18,
    fontWeight: '400',
  },
  footer12Regular: {
    fontFamily: 'PingFang SC',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '400',
  },
  footer12Medium: {
    fontFamily: 'PingFang SC',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  /** Typography 规范中的 `Footer` 12px/20 Semibold。 */
  footer12Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '600',
  },
  paragraph13Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  body14Regular: {
    fontFamily: 'PingFang SC',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  body14Medium: {
    fontFamily: 'PingFang SC',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  body14Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  title16Regular: {
    fontFamily: 'PingFang SC',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  title16Medium: {
    fontFamily: 'PingFang SC',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  title16Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title18Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },
  title20Medium: {
    fontFamily: 'PingFang SC',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500',
  },
  title30Medium: {
    fontFamily: 'PingFang SC',
    fontSize: 30,
    lineHeight: 44,
    fontWeight: '500',
  },
  title24Semibold: {
    fontFamily: 'PingFang SC',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
} as const satisfies Record<string, TextStyle>;

export const componentTokens = {
  dataPanel: {
    cardGap: 12,
    contentGap: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    radius: 12,
    titleGap: 8,
    titleAccentWidth: 4,
    titleAccentHeight: 14,
    titleAccentRadius: 1,
  },
  button: {
    /**
     * Figma 另有 small `32` 与 large `48`，尚未逐一读取其内边距与图标尺寸，
     * 因此只开放已确认的 extraSmall 与 medium。
     * 排版按尺寸切换：medium 用 `H7 16/Semibold`，extraSmall 用 `Body 14/Medium`。
     */
    sizes: {
      /**
       * Figma `size=extraSmall`。带文字按钮为 `61×28`、内边距 `8/3`（节点 `26544:4044`）；
       * `shape=square` + `singleIcon=true` 为 `28×28`、图标 `18×18`（节点 `26544:4056`）。
       */
      extraSmall: {
        minHeight: 28,
        paddingHorizontal: 8,
        paddingVertical: 3,
        squareSize: 28,
        iconSize: 18,
        radius: radiusTokens.medium,
      },
      /**
       * Figma `size=large`。高 `48`、内边距 `20/12`、排版 `H7 16/Semibold`。
       * 读取于 Calendar footer 的 Button 实例（节点 `27205:15150`），与 Button
       * 规范页摘要一致。`shape=square` + `singleIcon=true` 的图标槽尺寸尚未读取，
       * 因此该尺寸不提供 `squareSize` / `iconSize`，仅图标按钮不开放 `large`。
       */
      large: {
        minHeight: 48,
        paddingHorizontal: 20,
        paddingVertical: 12,
        radius: radiusTokens.medium,
      },
      /**
       * Figma `size=medium`。带文字按钮为 `83×40`、内边距 `16/8`；
       * `shape=square` + `singleIcon=true` 为 `40×40`、图标 `20×20`（节点 `26626:6269`）。
       */
      medium: {
        minHeight: 40,
        paddingHorizontal: 16,
        paddingVertical: 8,
        /** `shape=square` 的边长，等于 `minHeight`。 */
        squareSize: 40,
        /** `singleIcon=true` 时的图标槽尺寸。 */
        iconSize: 20,
        radius: radiusTokens.medium,
      },
    },
  },
  actionSheet: {
    /** 面板顶部圆角，与 Picker 一致。 */
    topRadius: 12,
    /**
     * `cancel=true` 时 cell 组与 cancel-cell 之间的 auto layout 间距。
     * 该间距透出容器底色 `background.component`，是列表型面板唯一的分组方式。
     */
    groupGap: 8,
    /** cell / description / cancel 之间的分割线宽度。 */
    dividerWidth: 0.5,
    cell: {
      /** 24 行高 + 上下各 16 内边距。 */
      minHeight: 56,
      padding: 16,
      /** 图标与文案之间的 auto layout 间距。 */
      contentGap: 8,
      iconSize: 24,
      /** 圆点徽标直径（列表型 `badge=true`）。 */
      badgeDotSize: 8,
      /** 圆点相对文案右边缘 / 上边缘的偏移，来自 Figma `left:-2 / top:-16`。 */
      badgeDotOffsetX: -2,
      badgeDotOffsetY: -16,
    },
    description: {
      /** 22 行高 + 上下各 12 内边距。 */
      minHeight: 46,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    cancel: {
      /** 24 行高 + 上下各 12 内边距。 */
      minHeight: 48,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    grid: {
      /**
       * `gird` 容器的上下内边距。`description=true` 时取消上内边距，
       * 由 description 行自身的 `12` 承担。
       */
      paddingVertical: 8,
      item: {
        paddingTop: 16,
        paddingBottom: 12,
        paddingHorizontal: 8,
        /** media 槽与标题之间的 auto layout 间距。 */
        gap: 8,
      },
      /** `item/4 columns`：4 列时的紧凑尺寸，标题用 `Foot 12/20`。 */
      compactMediaSize: 40,
      /** `item/≤3 columns`：2–3 列时的常规尺寸，标题用 `Body 14/22`。 */
      regularMediaSize: 48,
      /** icon 型 media 槽的内边距，内部图标为 24×24。 */
      mediaPadding: 8,
      mediaIconSize: 24,
      mediaRadius: radiusTokens.medium,
      mediaBorderWidth: 0.5,
      /** `align=left` 时 item 为固定宽度并左侧紧排，不再等宽填满行。 */
      leftItemWidth: 80,
      badge: {
        /** Figma `Badge 徽标`：高 16、左右内边距 4、最小内容宽 8、全圆角。 */
        minHeight: 16,
        paddingHorizontal: 4,
        minContentWidth: 8,
        radius: 999,
        /**
         * 徽标中心相对 media 槽右上角的偏移，来自 Figma
         * `left:calc(50% + 18) / top:calc(50% - 33)` 在 93.75×96 item 内的解析结果。
         */
        offsetX: -2,
        offsetY: -1,
      },
      swiper: {
        padding: 12,
        gap: 8,
        dotSize: 8,
      },
      /** Figma 宫格每行最多 4 列。 */
      maxColumns: 4,
      minColumns: 2,
    },
  },
  calendar: {
    /**
     * Figma 面板高度是显式值（容器 `375×668`），与 `375` 的展示宽度不同。
     * 标题、星期表头与底部操作固定，月份列表自行滚动。
     */
    panelHeight: 668,
    topRadius: 12,
    title: {
      /** 26 行高 + 上下各 16 内边距。 */
      minHeight: 58,
      padding: 16,
      closeIconSize: 24,
      /** close-M 在 title 行内的绝对位置，来自 Figma `left:335 / top:17`（375 基准）。 */
      closeTop: 17,
      closeRight: 16,
    },
    weekdays: {
      /** 22 行高 + 上下各 12 内边距。 */
      rowHeight: 46,
      paddingHorizontal: 16,
      paddingVertical: 12,
      /** 与日期表格一致的列间距。 */
      columnGap: 4,
    },
    month: {
      paddingHorizontal: 16,
      /** 星期表头与首个月份、以及相邻月份之间的间距。 */
      gap: 16,
      /** 月份标题与日期表格之间的间距（标题 22 行高，表格起始 y=30）。 */
      labelGap: 8,
      /** 日期行之间的间距。 */
      rowGap: 8,
      columnGap: 4,
    },
    date: {
      height: 60,
      paddingVertical: 4,
      radius: radiusTokens.medium,
      /** 日期数字行高（`H7 16/Semibold`）。 */
      lineHeight: 24,
      /** prefix / suffix 行高（`10/16 Regular`）。 */
      affixLineHeight: 16,
      /**
       * Figma 在 prefix / 日期行上使用 `margin-bottom: -2`，让三行内容在 `60`
       * 的格子里收紧，不是行高本身的变化。
       */
      affixOverlap: -2,
      /**
       * `hight-light` 与区间两端向列间隙延伸的宽度，使区间底色跨列连续。
       * 来自 Figma 的 `inset-[0_-4px]` / `right:-4` / `left:-4`，等于列间距。
       */
      bandOverhang: 4,
    },
    footer: {
      /** Button 48 高 + 上下各 16 内边距。 */
      minHeight: 80,
      padding: 16,
    },
    timePicker: {
      /** 与 Picker / DateTimePicker 相同的 header 高度，但只有居中标题。 */
      headerHeight: 58,
      /** 3 × 24 option + 2 × 16 间距 = 104。 */
      contentHeight: 104,
      /** indicator 在 timePicker 块内的绝对 y。 */
      indicatorTop: 90,
      maskHeight: 32,
    },
  },
  cascader: {
    /**
     * Figma 面板高度是显式值（容器 `h-[580px]`），与 `375` 的展示宽度不同，
     * 不是「仅供参考的画布尺寸」。宿主必须保证可用高度，内容区自行滚动。
     */
    panelHeight: 580,
    topRadius: 12,
    dividerWidth: 0.5,
    title: {
      /** 26 行高 + 上下各 16 内边距。 */
      minHeight: 58,
      padding: 16,
      gap: 16,
      closeIconSize: 24,
      /** close-M 在 Title 行内的绝对位置，来自 Figma `left:335 / top:17`（375 基准）。 */
      closeTop: 17,
      closeRight: 16,
    },
    steps: {
      paddingHorizontal: 16,
      /** 有标题时 Steps 的上内边距为 `8`；标题层隐藏时为 `16`。 */
      paddingTopWithTitle: 8,
      paddingTopWithoutTitle: 16,
      paddingBottom: 16,
      /** stepper 圆点与内容之间的 auto layout 间距。 */
      gap: 16,
      dotSize: 8,
      /** 圆点上下留白，使圆点中心与 `22` 行高的标题中心对齐。 */
      dotPaddingVertical: 7,
      dotBorderWidth: 1,
      connectorWidth: 1,
      /** 已选层级在标题下方的留白，也是连接线的长度来源。 */
      completedPaddingBottom: 16,
      titleGap: 16,
      chevronSize: 16,
      /** Figma `step` 轴当前只定义 1–4 层。 */
      minStepCount: 1,
      maxStepCount: 4,
    },
    tabs: {
      height: 48,
      itemPaddingHorizontal: 16,
      /** 当前层级下方的指示条。 */
      trackHeight: 3,
      trackWidth: 16,
      trackRadius: 999,
    },
    subtitle: {
      /** 20 上内边距 + 22 行高 + 8 下内边距。 */
      minHeight: 50,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 8,
    },
    option: {
      /** 24 行高 + 上下各 16 内边距。 */
      minHeight: 56,
      paddingLeft: 16,
      paddingRight: 16,
      paddingVertical: 16,
      /** 文案与勾选槽之间的 auto layout 间距。 */
      gap: 16,
      indicatorSize: 24,
    },
  },
  checkbox: {
    rowMinHeight: 56,
    rowWithDescriptionMinHeight: 82,
    paddingHorizontal: 16,
    paddingVertical: 16,
    indicatorSize: 24,
    /**
     * `check circle` 圆形的视觉直径。填充态 SVG 在 `24×24` 视图框内绘制的圆为
     * 半径 `10.5`（`1.5`–`22.5`）即直径 `21`；未选中描边圆必须取同一直径并在
     * `24` 槽位内居中，否则勾选前后圆会出现 `3` 的尺寸跳变。
     */
    circleIndicatorDiameter: 21,
    indicatorContentGap: 8,
    titleDescriptionGap: 4,
    dividerWidth: 0.5,
    glyphStrokeWidth: 1.5,
    checkWidth: 18.5758,
    checkHeight: 12.7634,
    mixedWidth: 12,
    card: {
      minHeight: 52,
      paddingLeft: 24,
      paddingRight: 8,
      paddingVertical: 6,
      borderWidth: 1.5,
      radius: 6,
      indicatorSize: 28,
      gap: 6,
    },
  },
  collapse: {
    /** 24 行高 + 上下各 16 内边距 = 56，标题单行时的 header 基准高度。 */
    headerMinHeight: 56,
    /** header 与内容区共用的左内边距，位于面板容器上。 */
    paddingLeft: 16,
    /**
     * 右内边距。`expandicon=true` 时由 Operation 槽承担，
     * `expandicon=false` 时由 header 行本身承担；内容区始终自行承担。
     */
    paddingRight: 16,
    headerPaddingVertical: 16,
    /** 标题、操作说明与 chevron 之间的 auto layout 间距。 */
    headerGap: 4,
    /** chevron-down 图形尺寸；展开时旋转 180°。 */
    iconSize: 24,
    /** header 与展开内容区底部分割线宽度。 */
    dividerWidth: 0.5,
    contentPaddingVertical: 16,
    group: {
      /** `theme=card` 使用 `radius/radius-large` 并裁切子面板圆角。 */
      cardRadius: radiusTokens.large,
      /** Figma CollapseGroup 当前只定义 2–5 个面板。 */
      minItemCount: 2,
      maxItemCount: 5,
    },
  },
  divider: {
    /**
     * Figma 分割线线宽。所有变体（实线 / 虚线、水平 / 垂直、带文字段落）
     * 导出的 SVG 均为 `stroke-width="0.5"`，与 Checkbox / Collapse 的
     * `dividerWidth` 一致，不要退化为 `StyleSheet.hairlineWidth`。
     */
    strokeWidth: 0.5,
    /** 虚线样式的 dash 长度，来自 Figma `stroke-dasharray="2 2"`。 */
    dashLength: 2,
    /** 虚线样式的 dash 间隙，来自 Figma `stroke-dasharray="2 2"`。 */
    dashGap: 2,
    /**
     * 垂直分割线线长基准，来自 Figma 垂直分割线用例 `24387:6040`
     * （Body 14/22 文字行内线长 14）。组件本体不定义固定线长，
     * 调用方可按所在行高覆盖。
     */
    verticalLength: 14,
    content: {
      /** 带文字变体容器高度，等于 Foot 12/20 的行高。 */
      rowHeight: 20,
      /** 线段与文字之间的 auto layout 间距。 */
      gap: 8,
      /** `align=left` / `align=right` 时靠边一侧线段的固定长度。 */
      shortSegmentLength: 16,
    },
  },
  link: {
    /** Figma Link 容器圆角，见 Picker 内嵌 Link 实例。 */
    radius: 3,
    sizes: {
      /** 当前仅读取到 `size=medium`；其余尺寸未在已读节点中出现。 */
      medium: {
        /** Body 14/22 行高即 Link 的视觉高度（无内边距）。 */
        minHeight: 22,
        /** 视觉高度不等于触控热区，用 hitSlop 扩展且不改变布局。 */
        hitSlopHorizontal: 8,
        hitSlopVertical: 11,
      },
    },
  },
  picker: {
    topRadius: 12,
    paddingBottom: 16,
    headerHeight: 58,
    /**
     * Figma 当前 `4 columns + title=false` 变体为 375×256、header 56；
     * 其余 7 个变体为 375×258、header 58。保留该差异，不静默归一。
     */
    headerHeightWithoutTitleFourColumns: 56,
    headerPaddingHorizontal: 16,
    headerPaddingVertical: 16,
    headerGap: 4,
    /** indicator 在 375 基准面板中的绝对 y；8 个变体均固定为 130。 */
    indicatorTop: 130,
    /** 5 × optionHeight + 4 × optionGap = 184。 */
    contentHeight: 184,
    contentPaddingHorizontal: 16,
    visibleOptionCount: 5,
    optionHeight: 24,
    optionGap: 16,
    optionPaddingHorizontal: 8,
    /** optionHeight + optionGap，滚动吸附步距。 */
    snapInterval: 40,
    indicatorHeight: 40,
    maskHeight: 48,
    minColumnCount: 1,
    maxColumnCount: 4,
  },
  dateTimePicker: {
    /**
     * DateTimePicker（Figma `24386:5248`）的面板几何与 Picker 完全一致
     * （顶部圆角 12、内容区 184、option 24 + 间距 16、indicator 绝对 y=130、
     * 渐隐 mask 48、底部内边距 16），因此共用 `componentTokens.picker`。
     * 这里只登记该节点自己的轴。
     */
    /** 20 个变体（10 个 mode × title 有/无）的 header 均为 58，不存在 Picker 的 56 特例。 */
    headerHeight: 58,
    /** `mode=date with second` 为 6 列，是当前节点的最大列数。 */
    maxColumnCount: 6,
  },
  filterBar: {
    /** Figma row height for the filter trigger line (Frame 1000015803, 344x20). */
    rowMinHeight: 20,
    /** Auto-layout gap between filter triggers. */
    itemGap: 24,
    /** Gap between the selected-value label and the caret icon. */
    labelIconGap: 2,
    /** caret-down-small graphic size. */
    iconSize: 16,
    /** Minimum touch target; the 20px visual height is not the hit area. */
    minTouchSize: 44,
    /** Figma defines at most four triggers in one filter row. */
    maxItems: 4,
  },
  projectStatusTag: {
    width: 48,
    height: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    contentGap: 2,
    iconSize: 12,
    radius: 11,
  },
  tag: {
    borderWidth: 1,
    sizes: {
      extraLarge: {
        minHeight: 40,
        paddingHorizontal: 16,
        paddingVertical: 9,
        iconSize: 16,
        contentGap: 4,
        closeGap: 12,
        radius: 6,
      },
      large: {
        minHeight: 28,
        paddingHorizontal: 10,
        paddingVertical: 3,
        iconSize: 16,
        contentGap: 4,
        closeGap: 8,
        radius: 4,
      },
      medium: {
        minHeight: 24,
        paddingHorizontal: 8,
        paddingVertical: 2,
        iconSize: 14,
        contentGap: 4,
        closeGap: 8,
        radius: 4,
      },
      small: {
        minHeight: 20,
        paddingHorizontal: 6,
        paddingVertical: 2,
        iconSize: 12,
        contentGap: 2,
        closeGap: 4,
        radius: 4,
      },
    },
  },
  checkTag: {
    sizes: {
      extraLarge: {
        minHeight: 40,
        paddingHorizontal: 16,
        paddingVertical: 9,
        iconSize: 16,
        contentGap: 4,
        radius: 6,
      },
      large: {
        minHeight: 32,
        paddingHorizontal: 10,
        paddingVertical: 5,
        iconSize: 16,
        contentGap: 4,
        radius: 4,
      },
      medium: {
        minHeight: 24,
        paddingHorizontal: 8,
        paddingVertical: 2,
        iconSize: 14,
        contentGap: 4,
        radius: 4,
      },
      small: {
        minHeight: 20,
        paddingHorizontal: 6,
        paddingVertical: 2,
        iconSize: 12,
        contentGap: 2,
        radius: 4,
      },
    },
  },
} as const;
