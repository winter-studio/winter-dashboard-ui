<template>
  <n-layout class="layout" position="absolute" has-sider>
    <n-layout-sider
      v-if="isMixMenuNoneSub && (navMode === 'vertical' || navMode === 'horizontal-mix')"
      show-trigger="bar"
      position="absolute"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="leftMenuWidth"
      :native-scrollbar="false"
      :inverted="inverted"
      class="layout-sider"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <logo :collapsed="collapsed" />
      <aside-menu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
    </n-layout-sider>

    <n-layout :inverted="inverted">
      <n-layout-header :inverted="getHeaderInverted" position="absolute">
        <page-header v-model:collapsed="collapsed" :inverted="inverted" />
      </n-layout-header>

      <app-tabs v-if="multiTabsEnabled" v-model:collapsed="collapsed" />

      <n-layout-content
        class="layout-content"
        :class="{
          'layout-content-no-tabs': !multiTabsEnabled
        }"
        :content-style="{
          'background-color': appTabContentBgColor,
          'border-radius': '0 0 5px 5px'
        }"
      >
        <div class="layout-content-main">
          <app-main />
        </div>
      </n-layout-content>
      <n-back-top :right="100" />
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, unref, computed, onMounted, toRefs } from 'vue'
import { PageHeader, Logo, AppMain, AsideMenu, AppTabs } from './components'
import { useLoadingBar, useThemeVars } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useAppPreferenceStore } from '@/store/modules/preference'

const { navMode, menuSetting, multiTabsEnabled, navTheme } = toRefs(useAppPreferenceStore())

const collapsed = ref<boolean>(false)

const themeVars = useThemeVars()

const appTabContentBgColor = computed(() => themeVars.value.appTabContentBgColor)
const layoutContentBgColor = computed(() => themeVars.value.layoutContentBgColor)

const isMixMenuNoneSub = computed(() => {
  const mixMenu = unref(menuSetting).mixMenu
  const currentRoute = useRoute()
  if (unref(navMode) !== 'horizontal-mix') return true
  return !(unref(navMode) === 'horizontal-mix' && mixMenu && currentRoute.meta.isRoot)
})

const inverted = computed(() => {
  return ['dark', 'header-dark'].includes(unref(navTheme))
})

const getHeaderInverted = computed(() => {
  return ['light', 'header-dark'].includes(unref(navTheme)) ? unref(inverted) : !unref(inverted)
})

const leftMenuWidth = computed(() => {
  const { minMenuWidth, menuWidth } = unref(menuSetting)
  return collapsed.value ? minMenuWidth : menuWidth
})

const getMenuLocation = computed(() => {
  return 'left'
})

const watchWidth = () => {
  const Width = document.body.clientWidth
  if (Width <= 950) {
    collapsed.value = true
  } else collapsed.value = false
}

onMounted(() => {
  window.addEventListener('resize', watchWidth)
  useLoadingBar().finish()
})
</script>
<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: row;
  flex: auto;

  .layout-sider {
    min-height: 100vh;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 10%);
    position: relative;
    z-index: 13;
    transition: all 0.2s ease-in-out;
  }

  .layout-sider-fix {
    position: fixed;
    top: 0;
    left: 0;
  }

  .ant-layout {
    overflow: hidden;
  }

  .layout-right-fix {
    overflow-x: hidden;
    padding-left: 200px;
    min-height: 100vh;
    transition: all 0.2s ease-in-out;
  }

  .layout-content {
    flex: auto;
    height: 100vh;
    padding: 114px 10px 10px;
    background-color: v-bind(layoutContentBgColor);
  }

  .layout-content-no-tabs {
    padding: 74px 10px 10px;
  }

  .n-layout-header.n-layout-header--absolute-positioned {
    z-index: 11;
  }

  .n-layout-footer {
    background: none;
  }
}

.layout-content-main {
  position: relative;
  height: calc(100% - 16px);
}

.fluid-header {
  padding-top: 0;
}
</style>
