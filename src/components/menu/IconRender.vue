<template>
  <n-icon :size="size">
    <component :is="iconComponent" />
  </n-icon>
</template>

<script setup lang="ts">
import { onMounted, ref, DefineComponent, markRaw } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: false,
    default: 16
  }
})

const iconComponent = ref<DefineComponent | null>(null)
onMounted(() => {
  import('@vicons/antd').then((res: any) => {
    iconComponent.value = markRaw(res[props.icon])
  })
})
</script>

<style lang="scss" scoped></style>
