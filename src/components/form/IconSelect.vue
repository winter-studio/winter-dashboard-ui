<template>
  <div>
    <div class="icon-select-box">
      <div class="icon-select-box-cover" @click="showSelectPanel = true">
        <n-icon size="24">
          <edit-regular />
        </n-icon>
      </div>
      <n-icon size="24">
        <left-outlined />
      </n-icon>
    </div>
    <n-card
      v-show="showSelectPanel"
      title="图标选择"
      class="icon-select-panel"
      closable
      @close="showSelectPanel = false"
    >
      <n-tabs type="line" animated :closable="true">
        <n-tab-pane name="oasis" tab="Oasis"> 线框风格 </n-tab-pane>
        <n-tab-pane name="the beatles" tab="the Beatles">实底风格</n-tab-pane>
        <n-tab-pane name="jay chou" tab="周杰伦"> 双色风格 </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined } from '@vicons/antd'
import { EditRegular } from '@vicons/fa'
import { ref } from 'vue'

const showSelectPanel = ref(false)
const props = defineProps({
  value: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['update:value'])

const onSelect = () => {
  emits('update:value', 22222)
}
</script>
<style lang="scss" scoped>
.icon-select-box {
  padding: 3px;
  border: 2px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  z-index: 1001;

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
</style>
