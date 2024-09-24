<template>
  <n-scrollbar :style="{ 'max-height': maxHeight }">
    <div ref="iconContent" class="pb-1">
      <n-grid x-gap="12" :y-gap="12" cols="1 350:2 490:3 630:4 770:5 910:6">
        <n-gi v-for="(item, index) in iconComponents" :key="index">
          <div class="icon-select-btn" @click="selectIcon(item.name)">
            <n-icon size="24">
              <component :is="item" />
            </n-icon>
            <span class="icon-select-btn-text">
              {{ item.name.replace(removeSuffix, '') }}
            </span>
          </div>
        </n-gi>
      </n-grid>
    </div>
    <n-spin v-show="loading" size="large" />
  </n-scrollbar>
  <div ref="bottomHook"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, DefineComponent, markRaw } from 'vue'
interface Props {
  maxHeight?: string
  removeSuffix: string
  icons: string[]
}

const props = withDefaults(defineProps<Props>(), {
  maxHeight: '300px',
  removeSuffix: ''
})

const loading = ref(true)

const iconComponents = ref<DefineComponent[]>([])
const bottomHook = ref()
const iconContent = ref()

let antd: any
onMounted(() => {
  import('@vicons/antd').then((res) => {
    antd = res
    // iconComponents.value = props.icons.map((item) => antd[item])
    load()
  })
})

const emits = defineEmits(['onSelect'])

const selectIcon = (item: string) => {
  emits('onSelect', item)
}

function load() {
  loading.value = true
  props.icons.forEach((item: string) => iconComponents.value.push(markRaw(antd[item])))
  loading.value = false
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
