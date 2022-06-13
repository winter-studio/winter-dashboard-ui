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
import { useAppPreferenceStore } from '@/store/modules/preference'
import { computed } from 'vue'
import Color from 'color'

const designStore = useAppPreferenceStore()

/**
 * @type import('naive-ui').GlobalThemeOverrides
 */
const getThemeOverrides = computed(() => {
  const appTheme = Color(designStore.appTheme)

  if (designStore.darkTheme) {
    return {
      common: {
        primaryColor: appTheme.string(),
        primaryColorHover: appTheme.darken(0.2).string(),
        primaryColorPressed: appTheme.darken(0.2).string(),
        appTabsBgColor: '#000',
        appTabContentBgColor: '#18181C',
        appTabsBgColorPreActive: '#18181Caa',
        appTabsBgColorActive: '#18181C',
        layoutContentBgColor: '#2a2a31'
      }
    }
  } else {
    return {
      common: {
        primaryColor: appTheme.string(),
        primaryColorHover: appTheme.lighten(0.2).string(),
        primaryColorPressed: appTheme.lighten(0.2).string(),
        appTabsBgColor: appTheme.alpha(0.1).string(),
        appTabsBgColorPreActive: '#ffffff99',
        appTabsBgColorActive: '#ffffff',
        appTabContentBgColor: '#fefefe',
        layoutContentBgColor: '#f9f9f9'
      },
      LoadingBar: {
        colorLoading: appTheme.string()
      }
    }
  }
})

const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : null))
</script>
