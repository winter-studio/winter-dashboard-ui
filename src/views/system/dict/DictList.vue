<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small">
    <template #header>
      <n-button secondary type="success" class="mr-2" @click="onSelectKeys(null)">
        <template #icon>
          <n-icon><add-box-outlined /></n-icon>
        </template>
        添加字典
      </n-button>
      <n-popconfirm class="mr-2" @positive-click="deleteDicts">
        <template #trigger>
          <n-button :disabled="checkedKeys.length === 0" secondary type="error">
            <template #icon>
              <n-icon><delete-outline-filled /></n-icon>
            </template>
            删除字典
          </n-button>
        </template>
        确认删除吗？将无法恢复
      </n-popconfirm>
    </template>
    <div class="w-full">
      <n-input v-model:value="search" type="text" placeholder="输入字典名称搜索">
        <template #suffix>
          <n-icon size="18" class="cursor-pointer">
            <search-outlined />
          </n-icon>
        </template>
      </n-input>
      <div class="py-3 menu-list">
        <n-spin :show="props.loading">
          <n-tree
            block-line
            checkable
            :virtual-scroll="true"
            :render-label="renderLabel"
            :pattern="search"
            :data="data"
            style="max-height: 650px; overflow: hidden"
            @update:checked-keys="onUpdateCheckedKeys"
            @update:selected-keys="onSelectKeys"
          />
        </n-spin>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="tsx">
import { NTag, NButton, TreeOption, TreeSelectOption } from 'naive-ui'
import { ref } from 'vue'
import { AddBoxOutlined, DeleteOutlineFilled } from '@vicons/material'
import { SearchOutlined } from '@vicons/antd'
import { removeDicts } from '@/api/basis/dict'

interface Props {
  data: Array<TreeSelectOption>
  loading: boolean
}

const emits = defineEmits(['afterChange', 'edit'])

const props = defineProps<Props>()

const search = ref('')
const checkedKeys = ref<Array<string>>([])

function onUpdateCheckedKeys(keys?: Array<string>) {
  checkedKeys.value = keys || []
}

function onSelectKeys(keys?: Array<string> | null) {
  emits('edit', keys)
}

const renderLabel = (item: { option: TreeOption; checked: boolean; selected: boolean }) => {
  return (
    <div>
      {item.option.name}
      <NTag class="ml-2" type="primary" size="small" bordered={false}>
        {item.option.key}
      </NTag>
    </div>
  )
}

async function deleteDicts() {
  if (checkedKeys.value.length > 0) {
    await removeDicts(checkedKeys.value)
    emits('afterChange')
  }
}
</script>

<style scoped></style>
