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
import { useAppPreferenceStore } from '@/store/modules/projectSetting'
import { computed } from 'vue'
import { lighten } from '@/utils'

const designStore = useAppPreferenceStore()

/**
 * @type import('naive-ui').GlobalThemeOverrides
 */
const getThemeOverrides = computed(() => {
  const appTheme = designStore.appTheme

  if (designStore.darkTheme) {
    const primaryColorHover = lighten(designStore.appTheme, 6)
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: primaryColorHover,
        primaryColorPressed: primaryColorHover,
        appTabsBgColor: '#000',
        appTabContentBgColor: '#18181C',
        appTabsBgColorPreActive: '#18181Caa',
        appTabsBgColorActive: '#18181C',
        layoutContentBgColor: '#2a2a31'
      }
    }
  } else {
    const primaryColorHover = lighten(designStore.appTheme, 6)
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: primaryColorHover,
        primaryColorPressed: primaryColorHover,
        appTabsBgColor: appTheme + '21',
        appTabsBgColorPreActive: '#ffffff99',
        appTabsBgColorActive: '#ffffff',
        appTabContentBgColor: '#fefefe',
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
