<template>
  <app-provider>
    <router-view v-if="isRouterActive" />
  </app-provider>
</template>

<script lang="ts" setup>
import { AppProvider } from '@/components/application'

import { ref, provide, nextTick } from 'vue'

const isRouterActive = ref(true)
provide('reloadRouter', () => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})
</script>

<style lang="scss">
@import '@/styles/index';
</style>
