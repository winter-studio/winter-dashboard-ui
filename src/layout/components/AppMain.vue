<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition :name="getPageAnimateType" mode="out-in" appear>
        <keep-alive :include="getKeepAliveComponents">
          <component :is="Component" :key="route.name" />
        </keep-alive>
      </transition>
    </template>
  </router-view>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/application'
import { storeToRefs } from 'pinia'
import { useAppPreferenceStore } from '@/store/modules/projectSetting'

defineProps({
  notNeedKey: {
    type: Boolean,
    default: false
  },
  animate: {
    type: Boolean,
    default: true
  }
})

const { getKeepAliveComponents } = storeToRefs(useAppStore())
const { getPageAnimateType } = storeToRefs(useAppPreferenceStore())
</script>

<style lang="scss" scoped></style>
