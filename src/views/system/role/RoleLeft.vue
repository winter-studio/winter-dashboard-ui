<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small">
    <template #header>
      <n-button secondary type="success" class="mr-2" @click="onSelectKeys([0])">
        <template #icon>
          <n-icon><add-box-outlined /></n-icon>
        </template>
        {{ t('views.role.add') }}
      </n-button>
      <n-popconfirm class="mr-2" @positive-click="deleteRoles">
        <template #trigger>
          <n-button :disabled="checkedKeys.length === 0" secondary type="error">
            <template #icon>
              <n-icon><delete-outline-filled /></n-icon>
            </template>
            {{ t('views.role.remove') }}
          </n-button>
        </template>
        {{ t('views.role.removeConfirm') }}
      </n-popconfirm>
    </template>
    <div class="w-full">
      <n-input v-model:value="search" type="text" :placeholder="t('views.role.searchPlaceholder')">
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
            :render-suffix="renderSuffix"
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
  <n-drawer v-model:show="showDrawer" :width="500" placement="right" closable>
    <n-drawer-content :title="drawerTitle">
      <role-menu v-if="assigningKey" :id="assigningKey" />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="tsx">
import { NTag, NButton, TreeOption, TreeSelectOption } from 'naive-ui'
import { ref } from 'vue'
import { AddBoxOutlined, DeleteOutlineFilled } from '@vicons/material'
import { removeRoles } from '@/api/role'
import { SearchOutlined } from '@vicons/antd'
import RoleMenu from '@/views/system/role/RoleMenu.vue'
import { useI18n } from 'vue-i18n'

interface Props {
  data: Array<TreeSelectOption>
  loading: boolean
}

const emits = defineEmits(['afterChange', 'edit'])

const props = defineProps<Props>()
const { t } = useI18n()
const search = ref('')
const checkedKeys = ref<Array<number>>([])
const showDrawer = ref(false)
const drawerTitle = ref('')
const assigningKey = ref<number | undefined>(undefined)

function onUpdateCheckedKeys(keys?: Array<number>) {
  checkedKeys.value = keys || []
}

function onSelectKeys(keys?: Array<number>) {
  emits('edit', keys)
}

const renderLabel = (item: { option: TreeOption; checked: boolean; selected: boolean }) => {
  return (
    <div>
      {item.option.name}
      <NTag class="ml-2" type="success" size="small" bordered={false}>
        {item.option.code}
      </NTag>
    </div>
  )
}

const renderSuffix = (item: { option: TreeOption; checked: boolean; selected: boolean }) => {
  return (
    <NButton
      class="action-btn"
      type="primary"
      size="tiny"
      onClick={() => assignMenu(item.option.key as number, item.option.name as string)}
    >
      {t('views.role.configMenu')}
    </NButton>
  )
}

function assignMenu(id: number, name: string) {
  showDrawer.value = true
  drawerTitle.value = `【${name}】t('views.role.configMenu')`
  assigningKey.value = id
}

async function deleteRoles() {
  if (checkedKeys.value.length > 0) {
    await removeRoles(checkedKeys.value)
    emits('afterChange')
  }
}
</script>

<style scoped></style>
