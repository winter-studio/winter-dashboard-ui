<template>
  <n-icon :size="size">
    <component :is="antd[icon]" />
  </n-icon>
</template>

<script setup lang="ts">
import * as antd from '@vicons/antd'

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
</script>

<style lang="scss" scoped></style>
