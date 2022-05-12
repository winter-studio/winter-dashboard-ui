<template>
  <div>
    <span>{{ prefix }}</span>
    <n-number-animation ref="numberAnimationInstRef" :from="fromPropRef" :to="toPropRef" />
    <span>{{ suffix }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { NumberAnimationInst } from 'naive-ui'

interface Props {
  from: Number
  to: Number
  prefix?: String
  suffix?: String
}
const props = defineProps<Props>()
const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)
const { from: fromPropRef, to: toPropRef } = toRefs(props)
</script>

<style scoped></style>
