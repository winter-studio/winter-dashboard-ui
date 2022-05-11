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

const props = defineProps({
  from: {
    type: Number,
    required: true
  },
  to: {
    type: Number,
    default: 0
  },
  prefix: {
    type: String,
    default: undefined
  },
  suffix: {
    type: String,
    default: undefined
  }
})
const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)
const { from: fromPropRef, to: toPropRef } = toRefs(props)
</script>

<style scoped></style>
