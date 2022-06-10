<template>
  <n-icon :size="size">
    <component :is="antd[icon]" />
  </n-icon>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

defineProps({
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

let antd: any
onMounted(() => {
  import('@vicons/antd').then((res) => {
    antd = res
  })
})
</script>

<style lang="scss" scoped></style>
