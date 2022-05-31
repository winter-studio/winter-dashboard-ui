<template>
  <div class="tabs-view">
    <div class="tabs-view-bg">
      <div class="tabs-view-main">
        <div ref="navWrap" class="tabs-card" :class="{ 'tabs-card-scrollable': scrollable }">
          <n-button v-show="scrollable" :bordered="false" class="px-2" @click="scrollPrev">
            <n-icon size="16">
              <left-outlined />
            </n-icon>
          </n-button>
          <div ref="navScroll" class="tabs-card-scroll">
            <draggable
              :list="tabsList"
              animation="300"
              item-key="fullPath"
              class="flex tabs-card-scroll-draggable"
            >
              <template #item="{ element, index }">
                <div
                  :id="`tag${element.fullPath.split('/').join('\/')}`"
                  class="tabs-card-scroll-item"
                  :class="{ 'active-item': activeKey === element.path }"
                  :style="{ right: `${index}px` }"
                  @click.stop="goPage(element)"
                  @contextmenu="handleContextMenu($event, element)"
                >
                  <span class="tabs-card-scroll-item-content">
                    <span class="title mr-1">{{ element.meta.title }}</span>
                    <n-button
                      v-if="!element.meta.affix"
                      quaternary
                      circle
                      size="tiny"
                      @click.stop="closeTabItem(element)"
                    >
                      <template #icon>
                        <n-icon>
                          <close />
                        </n-icon>
                      </template>
                    </n-button>
                  </span>
                </div>
              </template>
            </draggable>
          </div>
          <n-button v-show="scrollable" :bordered="false" class="px-2" @click="scrollNext">
            <n-icon size="16">
              <right-outlined />
            </n-icon>
          </n-button>
        </div>
        <div class="tabs-dropdown">
          <n-dropdown
            trigger="hover"
            placement="bottom-end"
            :options="TabsMenuOptions"
            @select="closeHandleSelect"
          >
            <n-button quaternary circle class="px-2" size="small">
              <n-icon>
                <down-outlined />
              </n-icon>
            </n-button>
          </n-dropdown>
        </div>
        <n-dropdown
          :show="showDropdown"
          :x="dropdownX"
          :y="dropdownY"
          placement="bottom-start"
          :options="TabsMenuOptions"
          @clickoutside="onClickOutside"
          @select="closeHandleSelect"
        /> </div
    ></div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs,
  unref,
  watch
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storage } from '@/utils/storage'
import StorageType from '@/enums/storageType'
import { RouteItem, useTabsViewStore } from '@/store/modules/tabsView'
import { useProjectSetting } from '@/hooks/setting/useProjectSetting'
import { useMessage, useThemeVars } from 'naive-ui'
import Draggable from 'vuedraggable'
import { PageEnum } from '@/enums/pageEnum'
import {
  ColumnWidthOutlined,
  DownOutlined,
  LeftOutlined,
  MinusOutlined,
  ReloadOutlined,
  RightOutlined
} from '@vicons/antd'
import { Close } from '@vicons/ionicons5'
import elementResizeDetectorMaker from 'element-resize-detector'
import { useDesignSetting } from '@/hooks/setting/useDesignSetting'
import { useProjectSettingStore } from '@/store/modules/projectSetting'
import { useGo } from '@/hooks/web/usePage'
import { renderIcon } from '@/utils/icon-utils'
import { useAppStore } from '@/store/modules/application'

export default defineComponent({
  name: 'AppTabs',
  components: {
    DownOutlined,
    Close,
    LeftOutlined,
    RightOutlined,
    Draggable
  },
  props: {
    collapsed: {
      type: Boolean
    }
  },
  setup(props) {
    const { getDarkTheme, getAppTheme } = useDesignSetting()
    const { getNavMode, getMenuSetting } = useProjectSetting()
    const settingStore = useProjectSettingStore()

    const message = useMessage()
    const route = useRoute()
    const router = useRouter()
    const tabsViewStore = useTabsViewStore()
    const navScroll: any = ref(null)
    const navWrap: any = ref(null)
    const isCurrent = ref(false)
    const go = useGo()

    const themeVars = useThemeVars()

    const appTabsBgColor = computed(() => themeVars.value.appTabsBgColor)
    const appTabsBgColorPreActive = computed(() => themeVars.value.appTabsBgColorPreActive)
    const appTabsBgColorActive = computed(() => themeVars.value.appTabsBgColorActive)
    const getBaseColor = computed(() => {
      return themeVars.value.textColor1
    })

    const state = reactive({
      activeKey: route.fullPath,
      scrollable: false,
      dropdownX: 0,
      dropdownY: 0,
      showDropdown: false
    })

    // 获取简易的路由对象
    const getSimpleRoute = (route): RouteItem => {
      const { fullPath, hash, meta, name, params, path, query } = route
      return { fullPath, hash, meta, name, params, path, query }
    }

    const isMixMenuNoneSub = computed(() => {
      const mixMenu = settingStore.menuSetting.mixMenu
      const currentRoute = useRoute()
      const navMode = unref(getNavMode)
      if (unref(navMode) != 'horizontal-mix') return true
      return !(unref(navMode) === 'horizontal-mix' && mixMenu && currentRoute.meta.isRoot)
    })

    //动态组装样式 菜单缩进
    const getChangeStyle = computed(() => {
      const { collapsed } = props
      const navMode = unref(getNavMode)
      const { minMenuWidth, menuWidth }: any = unref(getMenuSetting)
      let lenNum =
        navMode === 'horizontal' || !isMixMenuNoneSub.value
          ? 0
          : collapsed
          ? minMenuWidth
          : menuWidth

      return {
        left: lenNum + 'px',
        width: `calc(100% - ${lenNum + 30}px)`
      }
    })

    //tags 右侧下拉菜单
    const TabsMenuOptions = computed(() => {
      const isDisabled = unref(tabsList).length <= 1
      return [
        {
          label: '刷新当前',
          key: '1',
          icon: renderIcon(ReloadOutlined)
        },
        {
          label: `关闭当前`,
          key: '2',
          disabled: unref(isCurrent) || isDisabled,
          icon: renderIcon(Close)
        },
        {
          label: '关闭其他',
          key: '3',
          disabled: isDisabled,
          icon: renderIcon(ColumnWidthOutlined)
        },
        {
          label: '关闭全部',
          key: '4',
          disabled: isDisabled,
          icon: renderIcon(MinusOutlined)
        }
      ]
    })

    let cacheRoutes: RouteItem[] = []
    const simpleRoute = getSimpleRoute(route)
    try {
      const routesStr = storage.get(StorageType.TABS_ROUTES) as string | null | undefined
      cacheRoutes = routesStr ? JSON.parse(routesStr) : [simpleRoute]
    } catch (e) {
      cacheRoutes = [simpleRoute]
    }

    // 将最新的路由信息同步到 localStorage 中
    const routes = router.getRoutes()
    cacheRoutes.forEach((cacheRoute) => {
      const route = routes.find((route) => route.path === cacheRoute.path)
      if (route) {
        cacheRoute.meta = route.meta || cacheRoute.meta
        cacheRoute.name = (route.name || cacheRoute.name) as string
      }
    })

    // 初始化标签页
    tabsViewStore.initTabs(cacheRoutes)

    const appStore = useAppStore()
    const delKeepAliveCompName = () => {
      if (route.meta.keepAlive) {
        const name = router.currentRoute.value.matched.find((item) => item.name == route.name)
          ?.components?.default.name
        if (name) {
          appStore.keepAliveComponents = appStore.keepAliveComponents.filter((item) => item != name)
        }
      }
    }

    // 标签页列表
    const tabsList: any = computed(() => tabsViewStore.tabsList)
    const whiteList: string[] = [PageEnum.BASE_LOGIN_NAME, PageEnum.ERROR_PAGE_NAME]

    watch(
      () => route.fullPath,
      (to) => {
        if (whiteList.includes(route.name as string)) return
        state.activeKey = to
        tabsViewStore.addTabs(getSimpleRoute(route))
        updateNavScroll(true)
      },
      { immediate: true }
    )

    // 在页面关闭或刷新之前，保存数据
    window.addEventListener('beforeunload', () => {
      storage.set(StorageType.TABS_ROUTES, JSON.stringify(tabsList.value))
    })

    // 关闭当前页面
    const removeTab = (route) => {
      if (tabsList.value.length === 1) {
        return message.warning('这已经是最后一页，不能再关闭了！')
      }
      delKeepAliveCompName()
      tabsViewStore.closeCurrentTab(route)
      // 如果关闭的是当前页
      if (state.activeKey === route.fullPath) {
        const currentRoute = tabsList.value[Math.max(0, tabsList.value.length - 1)]
        state.activeKey = currentRoute.fullPath
        router.push(currentRoute)
      }
      updateNavScroll()
    }

    // 刷新页面
    const reloadRouter: VoidFunction = inject('reloadRouter')!
    const reloadPage = () => {
      delKeepAliveCompName()
      reloadRouter()
    }

    // 注入刷新页面方法
    provide('reloadPage', reloadPage)

    // 关闭左侧
    const closeLeft = (route) => {
      tabsViewStore.closeLeftTabs(route)
      state.activeKey = route.fullPath
      router.replace(route.fullPath)
      updateNavScroll()
    }

    // 关闭右侧
    const closeRight = (route) => {
      tabsViewStore.closeRightTabs(route)
      state.activeKey = route.fullPath
      router.replace(route.fullPath)
      updateNavScroll()
    }

    // 关闭其他
    const closeOther = (route) => {
      tabsViewStore.closeOtherTabs(route)
      state.activeKey = route.fullPath
      router.replace(route.fullPath)
      updateNavScroll()
    }

    // 关闭全部
    const closeAll = () => {
      tabsViewStore.closeAllTabs()
      router.replace(PageEnum.BASE_HOME)
      updateNavScroll()
    }

    //tab 操作
    const closeHandleSelect = (key) => {
      switch (key) {
        //刷新
        case '1':
          reloadPage()
          break
        //关闭
        case '2':
          removeTab(route)
          break
        //关闭其他
        case '3':
          closeOther(route)
          break
        //关闭所有
        case '4':
          closeAll()
          break
      }
      updateNavScroll()
      state.showDropdown = false
    }

    /**
     * @param value 要滚动到的位置
     * @param amplitude 每次滚动的长度
     */
    function scrollTo(value: number, amplitude: number) {
      const currentScroll = navScroll.value.scrollLeft
      const scrollWidth =
        (amplitude > 0 && currentScroll + amplitude >= value) ||
        (amplitude < 0 && currentScroll + amplitude <= value)
          ? value
          : currentScroll + amplitude
      navScroll.value && navScroll.value.scrollTo(scrollWidth, 0)
      if (scrollWidth === value) return
      return window.requestAnimationFrame(() => scrollTo(value, amplitude))
    }

    function scrollPrev() {
      const containerWidth = navScroll.value.offsetWidth
      const currentScroll = navScroll.value.scrollLeft

      if (!currentScroll) return
      const scrollLeft = currentScroll > containerWidth ? currentScroll - containerWidth : 0
      scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20)
    }

    function scrollNext() {
      const containerWidth = navScroll.value.offsetWidth
      const navWidth = navScroll.value.scrollWidth
      const currentScroll = navScroll.value.scrollLeft

      if (navWidth - currentScroll <= containerWidth) return
      const scrollLeft =
        navWidth - currentScroll > containerWidth * 2
          ? currentScroll + containerWidth
          : navWidth - containerWidth
      scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20)
    }

    /**
     * @param autoScroll 是否开启自动滚动功能
     */
    async function updateNavScroll(autoScroll?: boolean) {
      await nextTick()
      if (!navScroll.value) return
      const containerWidth = navScroll.value.offsetWidth
      const navWidth = navScroll.value.scrollWidth
      if (containerWidth < navWidth - 2) {
        state.scrollable = true
        if (autoScroll) {
          let tagList = navScroll.value.querySelectorAll('.tabs-card-scroll-item') || []
          ;[...tagList].forEach((tag: HTMLElement) => {
            // fix SyntaxError
            if (tag.id === `tag${state.activeKey.split('/').join('\/')}`) {
              tag.scrollIntoView && tag.scrollIntoView()
            }
          })
        }
      } else {
        state.scrollable = false
      }
    }

    function handleResize() {
      updateNavScroll(true)
    }

    function handleContextMenu(e, item) {
      e.preventDefault()
      isCurrent.value = PageEnum.BASE_HOME_REDIRECT === item.path
      state.showDropdown = false
      nextTick().then(() => {
        state.showDropdown = true
        state.dropdownX = e.clientX
        state.dropdownY = e.clientY
      })
    }

    function onClickOutside() {
      state.showDropdown = false
    }

    //tags 跳转页面
    function goPage(e) {
      const { fullPath } = e
      if (fullPath === route.fullPath) return
      state.activeKey = fullPath
      go(e, true)
    }

    //删除tab
    function closeTabItem(e) {
      const { fullPath } = e
      const routeInfo = tabsList.value.find((item) => item.fullPath == fullPath)
      removeTab(routeInfo)
    }

    onMounted(() => {
      onElementResize()
    })

    function onElementResize() {
      let observer
      observer = elementResizeDetectorMaker()
      observer.listenTo(navWrap.value, handleResize)
    }

    return {
      ...toRefs(state),
      navWrap,
      navScroll,
      route,
      tabsList,
      goPage,
      closeTabItem,
      closeLeft,
      closeRight,
      closeOther,
      closeAll,
      reloadPage,
      getChangeStyle,
      TabsMenuOptions,
      closeHandleSelect,
      scrollNext,
      scrollPrev,
      handleContextMenu,
      onClickOutside,
      getDarkTheme,
      getAppTheme,
      appTabsBgColor,
      appTabsBgColorPreActive,
      appTabsBgColorActive,
      getBaseColor
    }
  }
})
</script>

<style lang="scss" scoped>
.tabs-view {
  width: calc(100% - 20px);
  position: absolute;
  z-index: 5;
  top: 74px;
  height: 40px;
  margin: 0 10px;
  box-sizing: border-box;
  border-radius: 5px 5px 0 0;
  background-color: #fff;

  .tabs-view-bg {
    background-color: v-bind(appTabsBgColor);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    border-radius: 5px 5px 0 0;

    .tabs-view-main {
      height: 36px;
      display: flex;
      max-width: 100%;
      min-width: 100%;

      .tabs-card {
        flex-shrink: 1;
        overflow: hidden;
        position: relative;
        display: flex;

        .tabs-card-scroll {
          white-space: nowrap;
          overflow: hidden;
          padding: 0 14px;

          .tabs-card-scroll-item:hover,
          .tabs-card-scroll-item.active-item {
            border-radius: 10px 10px 0 0;
          }

          .tabs-card-scroll-item.active-item {
            background-color: v-bind(appTabsBgColorActive) !important;
            z-index: 103 !important;

            .tabs-card-scroll-item-content {
              border-color: v-bind(appTabsBgColorActive) !important;
            }

            &::before,
            &::after {
              box-shadow: 0 0 0 10px v-bind(appTabsBgColorActive) !important;
              z-index: 104 !important;
            }
          }

          .tabs-card-scroll-item {
            color: v-bind(getBaseColor);
            height: 32px;
            padding: 2px 0;
            cursor: pointer;
            position: relative;
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            z-index: 100;
            transition: background-color 0.3s, broder-color 0.3s;

            .tabs-card-scroll-item-content {
              padding: 0 12px 0 14px;
              height: 20px;
              border-left: 1px solid #999;
              border-right: 1px solid #999;
              min-width: 100px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              transition: background-color 0.3s, broder-color 0.3s;

              span.title {
                line-height: 20px;
              }
            }

            &:first-child .tabs-card-scroll-item-content {
              border-left: none;
            }

            &.sortable-chosen {
              background: v-bind(appTabsBgColor);
            }

            &::before,
            &::after {
              position: absolute;
              bottom: 0;
              content: '';
              width: 16px;
              height: 16px;
              border-radius: 100%;
              transform: translateZ(-1px);
            }

            &::before {
              left: -16px;
              clip-path: inset(50% 0 0 50%);
            }

            &::after {
              right: -16px;
              clip-path: inset(50% 50% 0 0);
            }

            &:hover {
              background-color: v-bind(appTabsBgColorPreActive);
              z-index: 101;

              .tabs-card-scroll-item-content {
                border-color: v-bind(appTabsBgColorPreActive);
              }

              &::before,
              &::after {
                box-shadow: 0 0 0 10px v-bind(appTabsBgColorPreActive);
                z-index: 102;
              }
            }
          }
        }
      }

      .tabs-card-scrollable {
        overflow: hidden;
      }
    }
  }

  .tabs-dropdown {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
  }
}
</style>
