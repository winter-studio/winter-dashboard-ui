<template>
  <div class="layout-header">
    <!-- top menu-->
    <div
      v-if="navMode === 'horizontal' || (navMode === 'horizontal-mix' && menuSetting.mixMenu)"
      class="flex justify-center items-center"
    >
      <div v-if="navMode === 'horizontal'" class="app-logo">
        <img src="@/assets/images/logo.png" alt="" class="app-img" />
        <h2 v-show="!collapsed" class="m-0">Winter Dashboard</h2>
      </div>
      <aside-menu
        v-model:location="getMenuLocation"
        :collapsed="collapsed"
        :inverted="getInverted"
        mode="horizontal"
        @update:collapsed="emits('update:collapsed', collapsed)"
      />
    </div>
    <!-- left menu -->
    <div v-else class="flex justify-center items-center ml-6">
      <!-- collapse -->
      <n-tooltip placement="bottom">
        <template #trigger>
          <div
            class="cursor-pointer flex justify-center items-center"
            @click="() => emits('update:collapsed', !collapsed)"
          >
            <n-icon v-if="collapsed" size="18">
              <menu-unfold-outlined />
            </n-icon>
            <n-icon v-else size="18">
              <menu-fold-outlined />
            </n-icon>
          </div>
        </template>
        <span>{{ t('components.header.collapse') }}</span>
      </n-tooltip>
      <!-- reload -->
      <n-tooltip placement="bottom">
        <template #trigger>
          <div
            v-if="showHeaderReload"
            class="mx-4 cursor-pointer flex justify-center items-center"
            @click="reloadPage"
          >
            <n-icon size="18">
              <refresh />
            </n-icon>
          </div>
        </template>
        <span>{{ t('components.header.reload') }}</span>
      </n-tooltip>

      <!-- breadcrumb -->
      <n-breadcrumb>
        <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
          <n-breadcrumb-item
            v-if="routeItem.virtual !== true && routeItem.name !== rootRoute"
            class="flex justify-center items-center"
          >
            <n-dropdown
              v-if="routeItem.children.length"
              class="mt-2"
              :options="routeItem.children"
              @select="dropdownSelect"
            >
              <span>
                <icon-render
                  v-if="showCrumbIcon && routeItem.meta.icon"
                  :icon="routeItem.meta.icon"
                />
                <span class="ml-1">{{ t(routeItem.meta.title) }}</span>
              </span>
            </n-dropdown>
            <span v-else>
              <icon-render
                v-if="showCrumbIcon && routeItem.meta.icon"
                :icon="routeItem.meta.icon"
              />
              <span class="ml-1">{{ t(routeItem.meta.title) }}</span>
            </span>
          </n-breadcrumb-item>
        </template>
      </n-breadcrumb>
    </div>
    <div class="flex justify-center items-center mr-6">
      <div class="mx-2">
        <locale-selector />
      </div>
      <div class="mx-2">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-button
              tag="a"
              href="https://github.com/winter-studio/winter-dashboard-ui"
              target="_blank"
              quaternary
              circle
            >
              <template #icon>
                <n-icon size="22"> <github-outlined /></n-icon>
              </template>
            </n-button>
          </template>
          Github
        </n-tooltip>
      </div>
      <!-- user profile -->
      <div class="mx-4 cursor-pointer">
        <n-dropdown trigger="hover" :options="avatarOptions" @select="avatarSelect">
          <n-avatar :bordered="true" color="#cccd" round :src="userInfo?.avatar" />
        </n-dropdown>
      </div>
    </div>
  </div>
  <!--preference-->
  <app-preference v-model:show="showPreference" />
</template>

<script setup lang="tsx">
import { ref, computed, unref, inject } from 'vue'
import { useRouter, useRoute, RouteLocationMatched } from 'vue-router'
import { MenuFoldOutlined, MenuUnfoldOutlined, GithubOutlined } from '@vicons/antd'
import { SettingsAdjust, Password, Logout, UserAvatar } from '@vicons/carbon'
import { useDialog, useMessage, NIcon } from 'naive-ui'
import { useUserStore } from '@/store/modules/user'
import AppPreference from './AppPreference.vue'
import AsideMenu from './AsideMenu.vue'
import { Refresh } from '@vicons/tabler'
import LocalStorageType from '@/constants/storage-types'
import { RouteNames } from '@/router/base'
import { useAppPreferenceStore } from '@/store/modules/preference'
import { storeToRefs } from 'pinia'
import IconRender from '@/components/menu/IconRender.vue'
import LocaleSelector from '@/components/application/LocaleSelector.vue'

import { useI18n } from 'vue-i18n'

interface Props {
  collapsed: boolean
  inverted: boolean
}

const props = defineProps<Props>()
const emits = defineEmits(['update:collapsed'])

const { t } = useI18n()
const userStore = useUserStore()
const message = useMessage()
const dialog = useDialog()
const { navMode, navTheme, showHeaderReload, menuSetting, showCrumbIcon } =
  storeToRefs(useAppPreferenceStore())

const rootRoute = RouteNames.ROOT.toString()

const { userInfo } = storeToRefs(userStore)

const showPreference = ref(false)

const getInverted = computed(() => {
  return ['light', 'header-dark'].includes(unref(navTheme)) ? props.inverted : !props.inverted
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
      label: () => t(item.meta.title),
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

const dropdownSelect = (key: string | number) => {
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
    title: () => t('views.logout.title'),
    content: () => t('views.logout.confirm'),
    onPositiveClick: () => {
      userStore.logout().then(() => {
        // 移除标签页
        localStorage.removeItem(LocalStorageType.TABS_ROUTES)
        router
          .replace({
            name: RouteNames.BASE_LOGIN_NAME,
            query: {
              redirect: route.fullPath
            }
          })
          .finally(() => message.success(t('views.logout.msg')))
      })
    },
    onNegativeClick: () => {}
  })
}

const avatarOptions = [
  {
    label: () => t('menus.profile'),
    icon: () => (
      <NIcon>
        <UserAvatar />
      </NIcon>
    ),
    key: 'user-setting'
  },
  {
    label: () => t('menus.changePassword'),
    icon: () => (
      <NIcon>
        <Password />
      </NIcon>
    ),
    key: 'change-password'
  },
  {
    label: () => t('menus.preference'),
    icon: () => (
      <NIcon>
        <SettingsAdjust />
      </NIcon>
    ),
    key: 'preference'
  },
  {
    label: () => t('menus.logout'),
    icon: () => (
      <NIcon>
        <Logout />
      </NIcon>
    ),
    key: 'logout'
  }
]

//头像下拉菜单
const avatarSelect = (key: string) => {
  switch (key) {
    case 'user-setting':
      router.push({ name: RouteNames.PERSONAL_SETTING })
      break
    case 'change-password':
      router.push({ name: RouteNames.CHANGE_PASSWORD })
      break
    case 'preference':
      showPreference.value = true
      break
    case 'logout':
      doLogout()
      break
  }
}
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

  .app-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 10px;

    .app-img {
      width: auto;
      height: 32px;
      margin-right: 10px;
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
</style>
