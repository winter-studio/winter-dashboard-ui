<template>
  <n-menu
    :options="menus"
    :inverted="inverted"
    :mode="mode"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :indent="24"
    :expanded-keys="openKeys"
    :value="getSelectedKeys"
    :render-label="renderLabel"
    @update:value="clickMenuItem"
    @update:expanded-keys="menuExpanded"
  />
</template>

<script lang="tsx" setup>
import { ref, onMounted, computed, watch, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppPreferenceStore } from '@/store/modules/preference'
import { useAppStore } from '@/store/modules/application'
import { storeToRefs } from 'pinia'
import { MenuOption, MenuGroupOption } from 'naive-ui'
import { MenuType } from '@/types/component/menu'
import { buildMenu, buildMenuMix } from '@/layout/components/menu-builder'
import { useI18n } from 'vue-i18n'

interface Props {
  mode?: 'vertical' | 'horizontal'
  collapsed?: boolean
  location?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'vertical',
  collapsed: false,
  location: 'left'
})

const emits = defineEmits(['update:collapsed'])

// 当前路由
const currentRoute = useRoute()
const router = useRouter()
const { t } = useI18n()
const settingStore = useAppPreferenceStore()
const appStore = useAppStore()
const menus = ref<any[]>([])
const selectedKeys = ref<string>(currentRoute.name as string)
const headerMenuSelectKey = ref<string>('')

const { navMode } = storeToRefs(useAppPreferenceStore())
// 获取当前打开的子菜单
const matched = currentRoute.matched

const getOpenKeys: string[] =
  matched && matched.length ? matched.map((item) => item.name!.toString()) : []

const openKeys = ref(getOpenKeys)

const inverted = computed(() => {
  return ['dark', 'header-dark'].includes(settingStore.navTheme)
})

const getSelectedKeys = computed(() => {
  const location = props.location
  return location === 'left' || (location === 'header' && unref(navMode) === 'horizontal')
    ? unref(selectedKeys)
    : unref(headerMenuSelectKey)
})

// 监听分割菜单
watch(
  () => settingStore.menuSetting.mixMenu,
  () => {
    updateMenu()
    if (props.collapsed) {
      emits('update:collapsed', !props.collapsed)
    }
  }
)

// 跟随页面路由变化，切换菜单选中状态
watch(
  () => currentRoute.fullPath,
  () => {
    const matched = currentRoute.matched
    openKeys.value = matched.map((item) => item.name!.toString())
    const activeMenu: string = (currentRoute.meta?.activeMenu as string) || ''
    selectedKeys.value = activeMenu ? (activeMenu as string) : (currentRoute.name as string)
  }
)

onMounted(() => {
  updateMenu()
})

function updateMenu() {
  const { menus: storeMenus } = storeToRefs(appStore)
  if (!settingStore.menuSetting.mixMenu) {
    menus.value = buildMenu(storeMenus?.value)
  } else {
    //混合菜单
    const firstRouteName: string = (currentRoute.matched[0].name as string) || ''
    menus.value = buildMenuMix(firstRouteName, props.location, storeMenus?.value)
    const activeMenu: string = currentRoute?.matched[0].meta?.activeMenu as string
    headerMenuSelectKey.value = (activeMenu ? activeMenu : firstRouteName) || ''
  }
}

// 点击菜单
function clickMenuItem(key: string, item: MenuOption) {
  if (item.type === MenuType.LINK) {
    window.open(item.data as string)
  } else {
    router.push({ name: key })
  }
  // emit('clickMenuItem' as any, key)
}

//展开菜单
function menuExpanded(keys: string[]) {
  if (!keys) return
  const latestOpenKey = keys.find((key) => openKeys.value.indexOf(key) === -1)
  const isExistChildren = findChildrenLen(latestOpenKey as string)
  openKeys.value = isExistChildren ? (latestOpenKey ? [latestOpenKey] : []) : keys
}

//查找是否存在子路由
function findChildrenLen(key: string) {
  if (!key) return false
  const subRouteChildren: string[] = []
  for (const { children, key } of unref(menus)) {
    if (children && children.length) {
      subRouteChildren.push(key as string)
    }
  }
  return subRouteChildren.includes(key)
}

function renderLabel(option: MenuOption | MenuGroupOption) {
  return t(option.label as string)
}
</script>
