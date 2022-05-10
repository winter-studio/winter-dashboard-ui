<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition :name="getTransitionName" mode="out-in" appear>
        <keep-alive :include="Array.from(keepAliveComponents)">
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
    // 需要缓存的路由组件

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
