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
    @update:value="clickMenuItem"
    @update:expanded-keys="menuExpanded"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, computed, watch, toRefs, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppPreferenceStore } from '@/store/modules/projectSetting'
import { buildMenu, buildMenuMix } from './menu-builder'
import { useAppStore } from '@/store/modules/application'
import { storeToRefs } from 'pinia'
import { MenuOption } from 'naive-ui'
import { MenuType } from '@/router/types'

export default defineComponent({
  name: 'AsideMenu',
  components: {},
  props: {
    mode: {
      // 菜单模式
      type: String,
      default: 'vertical'
    },
    collapsed: {
      // 侧边栏菜单是否收起
      type: Boolean
    },
    //位置
    location: {
      type: String,
      default: 'left'
    }
  },
  emits: ['update:collapsed'],
  setup(props, { emit }) {
    // 当前路由
    const currentRoute = useRoute()
    const router = useRouter()
    const settingStore = useAppPreferenceStore()
    const appStore = useAppStore()
    const menus = ref<any[]>([])
    const selectedKeys = ref<string>(currentRoute.name as string)
    const headerMenuSelectKey = ref<string>('')

    const { navMode } = toRefs(useAppPreferenceStore())

    // 获取当前打开的子菜单
    const matched = currentRoute.matched

    const getOpenKeys = matched && matched.length ? matched.map((item) => item.name) : []

    const state = reactive({
      openKeys: getOpenKeys
    })

    const inverted = computed(() => {
      return ['dark', 'header-dark'].includes(settingStore.navTheme)
    })

    const getSelectedKeys = computed(() => {
      let location = props.location
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
          emit('update:collapsed', !props.collapsed)
        }
      }
    )

    // 跟随页面路由变化，切换菜单选中状态
    watch(
      () => currentRoute.fullPath,
      () => {
        const matched = currentRoute.matched
        state.openKeys = matched.map((item) => item.name)
        const activeMenu: string = (currentRoute.meta?.activeMenu as string) || ''
        selectedKeys.value = activeMenu ? (activeMenu as string) : (currentRoute.name as string)
      }
    )

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
    function menuExpanded(openKeys: string[]) {
      if (!openKeys) return
      const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1)
      const isExistChildren = findChildrenLen(latestOpenKey as string)
      state.openKeys = isExistChildren ? (latestOpenKey ? [latestOpenKey] : []) : openKeys
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

    onMounted(() => {
      updateMenu()
    })

    return {
      ...toRefs(state),
      inverted,
      menus,
      selectedKeys,
      headerMenuSelectKey,
      getSelectedKeys,
      clickMenuItem,
      menuExpanded
    }
  }
})
</script>
