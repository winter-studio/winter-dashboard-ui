<template>
  <n-config-provider
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <slot></slot>
            <window-tool />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NLoadingBarProvider,
  zhCN,
  dateZhCN,
  darkTheme,
  NConfigProvider
} from 'naive-ui'
import { WindowTool } from './index'
import { useDesignSettingStore } from '@/store/modules/designSetting'
import { computed } from 'vue'
import { lighten } from '@/utils'

const designStore = useDesignSettingStore()

/**
 * @type import('naive-ui').GlobalThemeOverrides
 */
const getThemeOverrides = computed(() => {
  const appTheme = designStore.appTheme

  if (designStore.darkTheme) {
    return {
      common: {
        appTabsBgColor: '#000',
        appTabContentBgColor: '#18181C',
        appTabsBgColorPreActive: '#18181C',
        appTabsBgColorActive: '#2a2a31',
        layoutContentBgColor: '#2a2a31'
      }
    }
  } else {
    const lightenStr = lighten(designStore.appTheme, 6)
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
        appTabsBgColor: '#e9e9e9',
        appTabContentBgColor: '#fefefe',
        appTabsBgColorPreActive: '#efefef',
        appTabsBgColorActive: '#ffffff',
        layoutContentBgColor: '#f9f9f9'
      },
      LoadingBar: {
        colorLoading: appTheme
      }
    }
  }
})

const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined))
</script>
