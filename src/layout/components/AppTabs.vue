<template>
  <div class="tabs-view">
    <div class="tabs-view-bg">
      <div class="tabs-view-main">
        <div ref="navWrap" class="tabs-card" :class="{ 'tabs-card-scrollable': scrollable }">
          <n-button
            v-show="scrollable"
            class="mx-2"
            secondary
            circle
            size="small"
            @click="scrollPrev"
          >
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
              <template #item="{ element }">
                <div
                  :id="`tag${element.fullPath.split('/').join('\/')}`"
                  class="tabs-card-scroll-item"
                  :class="{ 'active-item': activeKey === element.path }"
                  @click.stop="goPage(element)"
                  @contextmenu="handleContextMenu($event, element)"
                >
                  <span class="tabs-card-scroll-item-content">
                    <span class="title mr-1">{{ t(element.meta.title) }}</span>
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
          <n-button
            v-show="scrollable"
            class="mx-2"
            secondary
            circle
            size="small"
            @click="scrollNext"
          >
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

<script setup lang="tsx">
import { computed, inject, nextTick, onMounted, provide, ref, unref, watch } from 'vue'
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router'
import { RouteItem, useTabsViewStore } from '@/store/modules/tabsView'
import { useMessage, useThemeVars, NIcon } from 'naive-ui'
import Draggable from 'vuedraggable'
import { RouteNames } from '@/router/base'
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
import { isString } from 'lodash-es'
import { useI18n } from 'vue-i18n'

type RouteLocationRawEx = Omit<RouteLocationRaw, 'path'> & { path: RouteNames }

const { t } = useI18n()
const message = useMessage()
const route = useRoute()
const router = useRouter()
const tabsViewStore = useTabsViewStore()
const navScroll: any = ref(null)
const navWrap: any = ref(null)
const isCurrent = ref(false)

const themeVars = useThemeVars()

const appTabsBgColor = computed(() => themeVars.value.appTabsBgColor)
const appTabsBgColorPreActive = computed(() => themeVars.value.appTabsBgColorPreActive)
const appTabsBgColorActive = computed(() => themeVars.value.appTabsBgColorActive)
const getBaseColor = computed(() => themeVars.value.textColor1)

const activeKey = ref(route.fullPath)
const scrollable = ref(false)
const dropdownX = ref(0)
const dropdownY = ref(0)
const showDropdown = ref(false)

// 标签页列表
const tabsList: any = computed(() => tabsViewStore.tabsList)
const whiteList: string[] = [RouteNames.BASE_LOGIN_NAME, RouteNames.ERROR_PAGE_NAME]

// 获取简易的路由对象
const getSimpleRoute = (route: any): RouteItem => {
  const { fullPath, hash, meta, name, params, path, query } = route
  return { fullPath, hash, meta, name, params, path, query }
}

onMounted(() => {
  const simpleRoute = getSimpleRoute(route)
  // 初始化标签页
  tabsViewStore.initTabs([simpleRoute])
})

watch(
  () => route.fullPath,
  (to) => {
    if (whiteList.includes(route.name as string)) return
    activeKey.value = to
    tabsViewStore.addTabs(getSimpleRoute(route))
    updateNavScroll(true)
  },
  { immediate: true }
)

//tags 右侧下拉菜单
const TabsMenuOptions = computed(() => {
  const isDisabled = unref(tabsList).length <= 1
  return [
    {
      label: '刷新当前',
      key: '1',
      icon: () => <NIcon>{{ default: () => <ReloadOutlined /> }}</NIcon>
    },
    {
      label: `关闭当前`,
      key: '2',
      disabled: unref(isCurrent) || isDisabled,
      icon: () => <NIcon>{{ default: () => <Close /> }}</NIcon>
    },
    {
      label: '关闭其他',
      key: '3',
      disabled: isDisabled,
      icon: () => <NIcon>{{ default: () => <ColumnWidthOutlined /> }}</NIcon>
    },
    {
      label: '关闭全部',
      key: '4',
      disabled: isDisabled,
      icon: () => <NIcon>{{ default: () => <MinusOutlined /> }}</NIcon>
    }
  ]
})

// 关闭当前页面
const removeTab = (route: any) => {
  if (tabsList.value.length === 1) {
    return message.warning('这已经是最后一页，不能再关闭了！')
  }
  tabsViewStore.closeCurrentTab(route)
  // 如果关闭的是当前页
  if (activeKey.value === route.fullPath) {
    const currentRoute = tabsList.value[Math.max(0, tabsList.value.length - 1)]
    activeKey.value = currentRoute.fullPath
    router.push(currentRoute)
  }
  updateNavScroll()
}

// 刷新页面
const reloadRouter: VoidFunction = inject('reloadRouter')!
const reloadPage = () => {
  reloadRouter()
}

// 注入刷新页面方法
provide('reloadPage', reloadPage)

// 关闭其他
const closeOther = (route: any) => {
  tabsViewStore.closeOtherTabs(route)
  activeKey.value = route.fullPath
  router.replace(route.fullPath)
  updateNavScroll()
}

// 关闭全部
const closeAll = () => {
  tabsViewStore.closeAllTabs()
  router.replace(RouteNames.BASE_HOME)
  updateNavScroll()
}

//tab 操作
const closeHandleSelect = (key: string) => {
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
  showDropdown.value = false
}

/**
 * @param value 要滚动到的位置
 * @param amplitude 每次滚动的长度
 */
function scrollTo(value: number, amplitude: number): any {
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
    scrollable.value = true
    if (autoScroll) {
      const tagList = navScroll.value.querySelectorAll('.tabs-card-scroll-item') || []
      ;[...tagList].forEach((tag: HTMLElement) => {
        // fix SyntaxError
        if (tag.id === `tag${activeKey.value.split('/').join('\/')}`) {
          tag.scrollIntoView && tag.scrollIntoView()
        }
      })
    }
  } else {
    scrollable.value = false
  }
}

function handleResize() {
  updateNavScroll(true)
}

function handleContextMenu(e: any, item: any) {
  e.preventDefault()
  isCurrent.value = RouteNames.BASE_HOME_REDIRECT === item.path
  showDropdown.value = false
  nextTick().then(() => {
    showDropdown.value = true
    dropdownX.value = e.clientX
    dropdownY.value = e.clientY
  })
}

function onClickOutside() {
  showDropdown.value = false
}

//tags 跳转页面
function goPage(e: any) {
  const { fullPath } = e
  if (fullPath === route.fullPath) return
  activeKey.value = fullPath
  go(e, true)
}

function go(
  opt: RouteNames | RouteLocationRawEx | string = RouteNames.BASE_HOME,
  isReplace = false
) {
  if (!opt) {
    return
  }
  if (isString(opt)) {
    isReplace
      ? router.replace(opt).catch((e) => console.error(e))
      : router.push(opt).catch((e) => console.error(e))
  } else {
    const o = opt as RouteLocationRaw
    isReplace
      ? router.replace(o).catch((e) => console.error(e))
      : router.push(o).catch((e) => console.error(e))
  }
}

//删除tab
function closeTabItem(e: any) {
  const { fullPath } = e
  const routeInfo = tabsList.value.find((item: RouteItem) => item.fullPath == fullPath)
  removeTab(routeInfo)
}

onMounted(() => {
  onElementResize()
})

function onElementResize() {
  const observer = elementResizeDetectorMaker()
  observer.listenTo(navWrap.value, handleResize)
}
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
        align-items: center;

        .tabs-card-scroll {
          white-space: nowrap;
          overflow: hidden;
          padding: 0 14px;

          .tabs-card-scroll-item:hover,
          .tabs-card-scroll-item.active-item {
            border-radius: 10px 10px 0 0;

            & + .tabs-card-scroll-item .tabs-card-scroll-item-content {
              border-color: #00000000 !important;
            }
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
            transition: background-color 0.3s;

            .tabs-card-scroll-item-content {
              padding: 0 12px 0 14px;
              height: 20px;
              border-left: 1px solid #999;
              //border-right: 1px solid #999;
              min-width: 100px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              transition: border-color 0.3s;

              span.title {
                line-height: 20px;
              }
            }

            &:first-child .tabs-card-scroll-item-content {
              border-color: #00000000;
            }

            &:last-child .tabs-card-scroll-item-content {
              border-right: 1px solid #999;
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
