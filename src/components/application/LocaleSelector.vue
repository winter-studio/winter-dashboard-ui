<template>
  <n-dropdown trigger="hover" :options="locales" @select="changeLocale">
    <n-button quaternary circle>
      <template #icon>
        <n-icon size="22"> <language /></n-icon>
      </template>
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import { Language } from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const { locale, t } = useI18n()

const locales = [
  { label: '中文', key: 'zh-CN' },
  { label: 'English', key: 'en-US' }
]

function changeLocale(key: string) {
  locale.value = key
  localStorage.setItem('winter-locale', key)
  document.title = t(route?.meta?.title as string)
}
</script>

<style lang="scss" scoped></style>
