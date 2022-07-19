<template>
  <n-icon :size="size">
    <component :is="iconComponent" />
  </n-icon>
</template>

<script setup lang="ts">
import { onMounted, ref, DefineComponent, markRaw } from 'vue'

interface Props {
  size?: number
  icon: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 16
})

const iconComponent = ref<DefineComponent | null>(null)
onMounted(() => {
  import('@vicons/antd').then((res: any) => {
    iconComponent.value = markRaw(res[props.icon])
  })
})
</script>

<style lang="scss" scoped></style>
