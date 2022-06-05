<template>
  <div>
    <div class="icon-select-box">
      <div class="icon-select-box-cover" @click="showSelectPanel = !showSelectPanel">
        <n-icon :size="24">
          <edit-regular />
        </n-icon>
      </div>
      <icon-render v-if="value" :icon="value" :size="24" />
    </div>
    <transition name="bounce-in" class="icon-select-transition">
      <n-card
        v-if="showSelectPanel"
        title="图标选择"
        class="icon-select-panel"
        closable
        @close="showSelectPanel = false"
      >
        <n-tabs type="line" animated :closable="true">
          <n-tab-pane name="Outlined" tab="线框风格" display-directive="show:lazy">
            <icon-list :icons="outlinedIcons" remove-suffix="Outlined" @on-select="onSelect" />
          </n-tab-pane>
          <n-tab-pane name="Filled" tab="实底风格" display-directive="show:lazy">
            <icon-list :icons="filledIcons" remove-suffix="Filled" @on-select="onSelect" />
          </n-tab-pane>
          <n-tab-pane name="TwoTone" tab="双色风格" display-directive="show:lazy">
            <icon-list :icons="twoToneIcons" remove-suffix="Twotone" @on-select="onSelect" />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </transition>
  </div>
</template>

<script setup lang="ts">
import * as antd from '@vicons/antd'
import { EditRegular } from '@vicons/fa'
import { ref } from 'vue'

const showSelectPanel = ref(false)
defineProps({
  value: {
    type: String,
    required: false,
    default: null
  }
})

const emits = defineEmits(['update:value'])

const outlinedIcons = Object.keys(antd).filter((key) => key.includes('Outlined'))
const filledIcons = Object.keys(antd).filter((key) => key.includes('Filled'))
const twoToneIcons = Object.keys(antd).filter((key) => key.includes('Twotone'))

const onSelect = (item: String) => {
  emits('update:value', item)
  showSelectPanel.value = false
}
</script>
<style lang="scss" scoped>
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

.icon-select-transition {
  transform-origin: 0 0;
}

.icon-select-box {
  padding: 3px;
  border: 2px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  z-index: 1001;
  min-width: 24px;
  min-height: 24px;

  &:hover {
    .icon-select-box-cover {
      visibility: inherit;
      opacity: 1;
    }
  }

  .icon-select-box-cover {
    visibility: hidden;
    opacity: 0;
    display: flex;
    position: absolute;
    height: 100%;
    width: 100%;
    color: #bbbbbb;
    top: 0;
    left: 0;
    background: #f0f0f0;
    z-index: 1003;
    align-items: center;
    justify-content: center;
    align-content: center;
  }
}

.icon-select-panel {
  position: absolute;
  top: 100%;
  margin-top: 5px;
  z-index: 1005;
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.bounce-in-enter-active {
  animation: bounce-in 0.2s;
}

.bounce-in-leave-active {
  animation: bounce-in 0.2s reverse;
}
</style>
