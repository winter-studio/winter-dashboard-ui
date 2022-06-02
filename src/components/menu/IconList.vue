<template>
  <n-scrollbar :style="{ 'max-height': maxHeight }">
    <n-grid x-gap="12" :y-gap="12" cols="1 350:2 490:3 630:4 770:5 910:6">
      <n-gi v-for="item in icons" :key="item">
        <div class="icon-select-btn" @click="selectIcon(item)">
          <n-icon size="24">
            <component :is="antd[item]" />
          </n-icon>
          <span class="icon-select-btn-text">
            {{ item.replace(removeSuffix, '') }}
          </span>
        </div>
      </n-gi>
    </n-grid>
  </n-scrollbar>
</template>

<script setup lang="ts">
import * as antd from '@vicons/antd'

defineProps({
  maxHeight: {
    type: String,
    required: false,
    default: '300px'
  },
  removeSuffix: {
    type: String,
    required: false,
    default: null
  },
  icons: {
    type: Array,
    required: true
  }
})

const emits = defineEmits(['onSelect'])

const selectIcon = (item: String) => {
  emits('onSelect', item)
}
</script>

<style lang="scss" scoped>
.icon-select-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  border: 1px dashed #aaa;
  padding: 5px 0;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }

  .icon-select-btn-text {
    color: #666666;
  }
}
</style>
