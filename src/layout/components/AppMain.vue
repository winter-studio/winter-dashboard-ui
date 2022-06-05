<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition :name="getTransitionName" mode="out-in" appear>
        <keep-alive v-if="route.meta.keepAlive">
          <component :is="Component" :key="route.name" />
        </keep-alive>
        <component :is="Component" v-else :key="route.name" />
      </transition>
    </template>
  </router-view>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import { useProjectSetting } from '@/hooks/setting/useProjectSetting'

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

const { getIsPageAnimate, getPageAnimateType } = useProjectSetting()
// keep alive needs component's name to be set.
// wait for this PR to automatically set the component name for setup script.
// https://github.com/vuejs/core/pull/4997
const getTransitionName = computed(() => {
  return unref(getIsPageAnimate) ? unref(getPageAnimateType) : ''
})
</script>

<style lang="scss" scoped></style>
