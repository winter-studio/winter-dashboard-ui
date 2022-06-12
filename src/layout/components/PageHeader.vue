<template>
  <div class="layout-header">
    <!--顶部菜单-->
    <div
      v-if="navMode === 'horizontal' || (navMode === 'horizontal-mix' && mixMenu)"
      class="layout-header-left"
    >
      <div v-if="navMode === 'horizontal'" class="logo">
        <img src="@/assets/images/logo.png" alt="" />
        <h2 v-show="!collapsed" class="m-0">Winter Dashboard</h2>
      </div>
      <aside-menu
        v-model:location="getMenuLocation"
        :collapsed="collapsed"
        :inverted="getInverted"
        mode="horizontal"
        @update:collapsed="$emit('update:collapsed', collapsed)"
      />
    </div>
    <!--左侧菜单-->
    <div v-else class="layout-header-left">
      <!-- 菜单收起 -->
      <div
        class="ml-1 layout-header-trigger layout-header-trigger-min"
        @click="() => $emit('update:collapsed', !collapsed)"
      >
        <n-icon v-if="collapsed" size="18">
          <menu-unfold-outlined />
        </n-icon>
        <n-icon v-else size="18">
          <menu-fold-outlined />
        </n-icon>
      </div>
      <!-- 刷新 -->
      <div
        v-if="headerSetting.isReload"
        class="mr-1 layout-header-trigger layout-header-trigger-min"
        @click="reloadPage"
      >
        <n-icon size="18">
          <refresh />
        </n-icon>
      </div>
      <!-- 面包屑 -->
      <n-breadcrumb>
        <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
          <n-breadcrumb-item v-if="routeItem.virtual !== true">
            <n-dropdown
              v-if="routeItem.children.length"
              :options="routeItem.children"
              @select="dropdownSelect"
            >
              <span class="link-text">
                <icon-render
                  v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                  :icon="routeItem.meta.icon"
                />
                {{ routeItem.meta.title }}
              </span>
            </n-dropdown>
            <span v-else class="link-text">
              <icon-render
                v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                :icon="routeItem.meta.icon"
              />
              {{ routeItem.meta.title }}
            </span>
          </n-breadcrumb-item>
        </template>
      </n-breadcrumb>
    </div>
    <div class="layout-header-right">
      <div
        v-for="item in iconList"
        :key="item.icon"
        class="layout-header-trigger layout-header-trigger-min"
      >
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="item.icon" v-on="item.eventObject || {}" />
            </n-icon>
          </template>
          <span>{{ item.tips }}</span>
        </n-tooltip>
      </div>
      <!--切换全屏-->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="fullscreenIcon" @click="toggleFullScreen" />
            </n-icon>
          </template>
          <span>全屏</span>
        </n-tooltip>
      </div>
      <!-- 个人中心 -->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-dropdown trigger="hover" :options="avatarOptions" @select="avatarSelect">
          <div class="avatar">
            <n-avatar round>
              {{ username }}
              <template #icon>
                <user-outlined />
              </template>
            </n-avatar>
          </div>
        </n-dropdown>
      </div>
      <!--设置-->
      <div class="layout-header-trigger layout-header-trigger-min" @click="openSetting">
        <n-tooltip placement="bottom-end">
          <template #trigger>
            <n-icon size="18" style="font-weight: bold">
              <setting-outlined />
            </n-icon>
          </template>
          <span>项目配置</span>
        </n-tooltip>
      </div>
    </div>
  </div>
  <!--项目配置-->
  <project-setting ref="drawerSetting" />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, computed, unref, inject } from 'vue'
import { useRouter, useRoute, RouteLocationMatched } from 'vue-router'
import {
  SettingOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  GithubOutlined,
  ReloadOutlined,
  LogoutOutlined,
  UserOutlined
} from '@vicons/antd'
import { NDialogProvider, useDialog, useMessage } from 'naive-ui'
import { useUserStore } from '@/store/modules/user'
import ProjectSetting from './ProjectSetting.vue'
import AsideMenu from './AsideMenu.vue'
import { useProjectSetting } from '@/hooks/setting/useProjectSetting'
import { Refresh } from '@vicons/tabler'
import LocalStorageType from '@/enums/storage-types'
import { PageEnum } from '@/enums/pageEnum'

export default defineComponent({
  name: 'PageHeader',
  components: {
    SettingOutlined,
    SearchOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    GithubOutlined,
    ReloadOutlined,
    LogoutOutlined,
    UserOutlined,
    NDialogProvider,
    ProjectSetting,
    AsideMenu,
    Refresh
  },
  props: {
    collapsed: {
      type: Boolean
    },
    inverted: {
      type: Boolean
    }
  },
  emits: ['update:collapsed'],
  setup(props) {
    const userStore = useUserStore()
    const message = useMessage()
    const dialog = useDialog()
    const { getNavMode, getNavTheme, getHeaderSetting, getMenuSetting, getCrumbsSetting } =
      useProjectSetting()

    const { username } = userStore?.info || {}

    const drawerSetting = ref()

    const state = reactive({
      username: username || '',
      fullscreenIcon: 'FullscreenOutlined',
      navMode: getNavMode,
      navTheme: getNavTheme,
      headerSetting: getHeaderSetting,
      crumbsSetting: getCrumbsSetting
    })

    const getInverted = computed(() => {
      const navTheme = unref(getNavTheme)
      return ['light', 'header-dark'].includes(navTheme) ? props.inverted : !props.inverted
    })

    const mixMenu = computed(() => {
      return unref(getMenuSetting).mixMenu
    })

    const getChangeStyle = computed(() => {
      const { collapsed } = props
      const { minMenuWidth, menuWidth }: any = unref(getMenuSetting)
      return {
        left: collapsed ? `${minMenuWidth}px` : `${menuWidth}px`,
        width: `calc(100% - ${collapsed ? `${minMenuWidth}px` : `${menuWidth}px`})`
      }
    })

    const getMenuLocation = computed(() => {
      return 'header'
    })

    const router = useRouter()
    const route = useRoute()

    const generator: any = (routerMap: RouteLocationMatched[]) => {
      return routerMap.map((item) => {
        const currentMenu = {
          ...item,
          label: item.meta.title,
          key: item.name,
          disabled: item.path === '/',
          virtual: item.meta.virtual
        }
        // 是否有子菜单，并递归处理
        if (item.children && item.children.length > 0) {
          // Recursion
          currentMenu.children = generator(item.children, currentMenu)
        }
        return currentMenu
      })
    }

    const breadcrumbList = computed(() => {
      return generator(route.matched)
    })

    const dropdownSelect = (key: string) => {
      router.push({ name: String(key) })
    }

    const reloadRouter: VoidFunction = inject('reloadRouter')!

    // 刷新页面
    const reloadPage = () => {
      /* router.push({
        path: '/redirect' + unref(route).fullPath
      }) */
      reloadRouter()
    }

    // 退出登录
    const doLogout = () => {
      dialog.info({
        title: '提示',
        content: '您确定要退出登录吗',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          userStore.logout().then(() => {
            // 移除标签页
            localStorage.removeItem(LocalStorageType.TABS_ROUTES)
            router
              .replace({
                name: PageEnum.BASE_LOGIN_NAME,
                query: {
                  redirect: route.fullPath
                }
              })
              .finally(() => message.success('已退出'))
          })
        },
        onNegativeClick: () => {}
      })
    }

    // 切换全屏图标
    const toggleFullscreenIcon = () =>
      (state.fullscreenIcon =
        document.fullscreenElement !== null ? 'FullscreenExitOutlined' : 'FullscreenOutlined')

    // 监听全屏切换事件
    document.addEventListener('fullscreenchange', toggleFullscreenIcon)

    // 全屏切换
    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    }

    // 图标列表
    const iconList = [
      {
        icon: 'SearchOutlined',
        tips: '搜索'
      },
      {
        icon: 'GithubOutlined',
        tips: 'github',
        eventObject: {
          click: () => window.open('https://github.com/winter-studio/winter-dashboard-ui')
        }
      }
    ]
    const avatarOptions = [
      {
        label: '个人设置',
        key: 1
      },
      {
        label: '退出登录',
        key: 2
      }
    ]

    //头像下拉菜单
    const avatarSelect = (key: number) => {
      switch (key) {
        case 1:
          router.push({ name: 'Setting' })
          break
        case 2:
          doLogout()
          break
      }
    }

    function openSetting() {
      const { openDrawer } = drawerSetting.value
      openDrawer()
    }

    return {
      ...toRefs(state),
      iconList,
      toggleFullScreen,
      doLogout,
      route,
      dropdownSelect,
      avatarOptions,
      getChangeStyle,
      avatarSelect,
      breadcrumbList,
      reloadPage,
      drawerSetting,
      openSetting,
      getInverted,
      getMenuLocation,
      mixMenu
    }
  }
})
</script>

<style lang="scss" scoped>
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: $header-height;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  transition: all 0.2s ease-in-out;
  width: 100%;
  z-index: 11;

  &-left {
    display: flex;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      line-height: 64px;
      overflow: hidden;
      white-space: nowrap;
      padding-left: 10px;

      img {
        width: auto;
        height: 32px;
        margin-right: 10px;
      }
    }

    ::v-deep(.ant-breadcrumb span:last-child .link-text) {
      color: #515a6e;
    }

    .n-breadcrumb {
      display: inline-block;
    }

    &-menu {
      color: var(--text-color);
    }
  }

  &-right {
    display: flex;
    align-items: center;
    margin-right: 20px;

    .avatar {
      display: flex;
      align-items: center;
      height: 64px;
    }

    > * {
      cursor: pointer;
    }
  }

  &-trigger {
    display: inline-block;
    width: 64px;
    height: 64px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    .n-icon {
      display: flex;
      align-items: center;
      height: 64px;
      line-height: 64px;
    }

    &:hover {
      background: hsla(0, 0%, 100%, 0.08);
    }

    .anticon {
      font-size: 16px;
      color: #515a6e;
    }
  }

  &-trigger-min {
    width: auto;
    padding: 0 12px;
  }
}

.layout-header-light {
  background: #fff;
  color: #515a6e;

  .n-icon {
    color: #515a6e;
  }

  .layout-header-left {
    ::v-deep(.n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link) {
      color: #515a6e;
    }
  }

  .layout-header-trigger {
    &:hover {
      background: #f8f8f9;
    }
  }
}

.layout-header-fix {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  z-index: 11;
}

//::v-deep(.menu-router-link) {
//  color: #515a6e;
//
//  &:hover {
//    color: #1890ff;
//  }
//}
</style>
