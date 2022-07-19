export const DefaultSettings = {
  //深色主题
  darkTheme: false,
  //系统主题色
  appTheme: '#2d8cf0',
  //导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
  navMode: 'vertical',
  //导航风格 dark 暗色侧边栏 light 白色侧边栏 header-dark 暗色顶栏
  navTheme: 'light',
  //顶部
  showHeaderReload: true,
  //多标签
  multiTabsEnabled: true,
  //菜单
  menuSetting: {
    //最小宽度
    minMenuWidth: 64,
    //菜单宽度
    menuWidth: 250,
    //固定菜单
    fixed: true,
    //分割菜单
    mixMenu: false,
    collapsed: false
  },
  //面包屑
  showCrumbIcon: true,
  //是否开启路由动画
  tabAnimationEnabled: true,
  //路由动画类型
  pageAnimateType: 'zoom-fade'
}

// app theme preset color
export const AppThemeList: string[] = [
  '#2d8cf0',
  '#0960bd',
  '#0084f4',
  '#009688',
  '#536dfe',
  '#ff5c93',
  '#ee4f12',
  '#0096c7',
  '#9c27b0',
  '#ff9800',
  '#FF3D68',
  '#00C1D4',
  '#71EFA3',
  '#171010',
  '#78DEC7',
  '#1768AC',
  '#FB9300',
  '#FC5404'
]

export const AppAnimates = [
  { value: 'zoom-fade', label: '渐变' },
  { value: 'zoom-out', label: '闪现' },
  { value: 'fade-slide', label: '滑动' },
  { value: 'fade', label: '消退' },
  { value: 'fade-bottom', label: '底部消退' },
  { value: 'fade-scale', label: '缩放消退' }
]
