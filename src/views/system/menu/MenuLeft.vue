<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small">
    <template #header>
      <n-button secondary type="primary" class="mr-2" @click="toggleCollapse">
        <template #icon>
          <n-icon v-if="expandedKeys.length"><vertical-align-center-twotone /></n-icon>
          <n-icon v-else><expand-round /></n-icon>
        </template>
        全部{{ expandedKeys.length ? '收起' : '展开' }}
      </n-button>
      <n-button secondary type="success" class="mr-2" @click="onSelectKeys([0])">
        <template #icon>
          <n-icon><add-box-outlined /></n-icon>
        </template>
        添加菜单
      </n-button>
      <n-popconfirm class="mr-2" @positive-click="deleteMenus">
        <template #trigger>
          <n-button :disabled="checkedKeys.length === 0" secondary type="error">
            <template #icon>
              <n-icon><delete-outline-filled /></n-icon>
            </template>
            删除菜单
          </n-button>
        </template>
        确认删除吗？将无法恢复
      </n-popconfirm>
    </template>
    <div class="w-full">
      <n-input v-model:value="search" type="text" placeholder="输入菜单名称搜索">
        <template #suffix>
          <n-icon size="18" class="cursor-pointer">
            <search-outlined />
          </n-icon>
        </template>
      </n-input>
      <div class="py-3 menu-list">
        <n-spin :show="loading">
          <n-tree
            block-line
            checkable
            draggable
            :virtual-scroll="true"
            :pattern="search"
            :data="props.menus"
            :expanded-keys="expandedKeys"
            style="max-height: 650px; overflow: hidden"
            @drop="handleDrop"
            @update:checked-keys="onUpdateCheckedKeys"
            @update:selected-keys="onSelectKeys"
            @update:expanded-keys="onUpdateExpandedKeys"
          />
        </n-spin>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, unref } from 'vue'
import { TreeDropInfo, TreeSelectOption } from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import {
  AddBoxOutlined,
  DeleteOutlineFilled,
  ExpandRound,
  VerticalAlignCenterTwotone
} from '@vicons/material'
import { moveMenu, removeMenus } from '@/api/basis/menu'

interface Props {
  menus: Array<TreeSelectOption>
  loading: boolean
}

const props = defineProps<Props>()
const emits = defineEmits(['afterChange', 'editMenu', 'update:checked'])

//展开菜单Keys
const expandedKeys = ref<Array<number>>([])
//选中菜单Keys
const checkedKeys = ref<Array<number>>([])

const search = ref('')

function toggleCollapse() {
  if (expandedKeys.value.length) {
    expandedKeys.value = []
  } else {
    expandedKeys.value = unref(props.menus).map((item: any) => item.key as string) as []
  }
}

function onUpdateExpandedKeys(keys: Array<number>) {
  expandedKeys.value = keys
}

function onUpdateCheckedKeys(keys: Array<number>) {
  checkedKeys.value = keys ?? []
}

function onSelectKeys(keys: Array<number> | undefined) {
  emits('editMenu', keys)
}

async function handleDrop(info: TreeDropInfo) {
  console.log(
    `${info.dragNode.label}[${info.dragNode.key}] --${info.dropPosition}-> ${info.node.label}[${info.node.key}]`
  )
  if (info.event.isTrusted) {
    await moveMenu(info.dragNode.key!, info.node.key!, info.dropPosition)
    emits('afterChange')
  }
}

async function deleteMenus() {
  if (checkedKeys.value.length > 0) {
    await removeMenus(checkedKeys.value)
    emits('afterChange')
  }
}
</script>

<style lang="scss" scoped></style>
