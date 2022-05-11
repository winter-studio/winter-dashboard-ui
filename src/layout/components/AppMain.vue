<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition :name="getTransitionName" mode="out-in" appear>
        <keep-alive :include="keepAliveComponents">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </template>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, computed, unref } from 'vue'
import { useProjectSetting } from '@/hooks/setting/useProjectSetting'
import { useAppStore } from '@/store/modules/application'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'MainView',
  components: {},
  props: {
    notNeedKey: {
      type: Boolean,
      default: false
    },
    animate: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const { getIsPageAnimate, getPageAnimateType } = useProjectSetting()
    const { keepAliveComponents } = storeToRefs(useAppStore())
    // keep alive needs component's name to be set.
    // wait for this PR to automatically set the component name for setup script.
    // https://github.com/vuejs/core/pull/4997
    const getTransitionName = computed(() => {
      return unref(getIsPageAnimate) ? unref(getPageAnimateType) : ''
    })
    return {
      keepAliveComponents,
      getTransitionName
    }
  }
})
</script>

<style lang="scss" scoped></style>
