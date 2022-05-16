const setting = {
  //导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
  navMode: 'vertical',
  //导航风格 dark 暗色侧边栏 light 白色侧边栏 header-dark 暗色顶栏
  navTheme: 'light',
  // 是否处于移动端模式
  isMobile: false,
  //顶部
  headerSetting: {
    //显示重载按钮
    isReload: true
  },
  //多标签
  multiTabsSetting: {
    //是否显示
    show: true
  },
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
    //触发移动端侧边栏的宽度
    mobileWidth: 800,
    collapsed: false
  },
  //面包屑
  crumbsSetting: {
    //是否显示
    show: true,
    //显示图标
    showIcon: false
  },
  //是否开启路由动画
  isPageAnimate: true,
  //路由动画类型
  pageAnimateType: 'zoom-fade'
}
export default setting
