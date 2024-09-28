<template>
  <div class="p-2">
    <winter-table :columns="columns" :page-data="data" :search-items="searchItems" @search="search">
      <template #table-header>
        <n-space>
          <n-button type="primary" @click="add">{{ t('general.add') }}</n-button>
        </n-space>
      </template>
    </winter-table>
    <n-drawer
      v-model:show="showEdit"
      :width="500"
      placement="right"
      :mask-closable="false"
      @after-leave="refresh"
    >
      <n-drawer-content :title="t('general.edit')" closable>
        <role-form :id="editId" />
      </n-drawer-content>
    </n-drawer>
    <n-drawer v-model:show="showDrawer" :width="500" placement="right" closable>
      <n-drawer-content :title="drawerTitle">
        <role-menu v-if="assigningKey" :id="assigningKey" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { NButton, NIcon, NPopconfirm, useMessage, NSpace } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import WinterTable from '@/components/table/WinterTable.vue'
import { SearchOptions } from '@/types/component/table'
import { getPagedRoles, deleteRole } from '@/api/role'
import { AdminUserPageItem } from '@/types/modules/user'
import { EditOutlined, DeleteOutlined } from '@vicons/antd'
import { SearchParam, searchItems } from './support'
import RoleForm from './RoleForm.vue'
import { PageRes } from '@/types/component/request'
import { useI18n } from 'vue-i18n'
import { Role } from '@/types/modules/role'
import RoleMenu from '@/views/system/role/RoleMenu.vue'

const message = useMessage()
const showEdit = ref(false)
const { t } = useI18n()
const data = ref<PageRes<Role>>()
const editId = ref<number | undefined>(undefined)
const showDrawer = ref(false)
const drawerTitle = ref('')
const assigningKey = ref<number | undefined>(undefined)

const columns: DataTableColumns<Role> = [
  {
    title: () => t('views.role.roleName'),
    key: 'name'
  },
  {
    title: () => t('views.role.roleCode'),
    key: 'code'
  },
  {
    title: () => t('views.role.operation'),
    key: 'actions',
    render: renderActions
  }
]

let curSearchOptions: SearchOptions<SearchParam> | undefined = undefined

function refresh() {
  search(curSearchOptions!)
}

function search(searchOptions: SearchOptions<SearchParam>) {
  curSearchOptions = searchOptions
  getPagedRoles(searchOptions).then((res) => {
    data.value = res.data
  })
}

function onEdit(id?: number) {
  showEdit.value = true
  editId.value = id
}

function renderActions(row: AdminUserPageItem) {
  return [
    <NButton
      strong
      secondary
      type="primary"
      size="small"
      class="mr-2"
      onClick={() => onEdit(row.id)}
    >
      {{
        default: () => t('general.edit'),
        icon: () => <NIcon>{{ default: () => <EditOutlined /> }}</NIcon>
      }}
    </NButton>,
    <NPopconfirm onPositiveClick={() => onDelete(row.id)}>
      {{
        default: () => t('general.removeConfirm'),
        trigger: () => (
          <NButton strong secondary type="error" size="small" class="mr-2">
            {{
              default: () => t('general.remove'),
              icon: () => <NIcon>{{ default: () => <DeleteOutlined /> }}</NIcon>
            }}
          </NButton>
        )
      }}
    </NPopconfirm>,
    <NButton strong secondary size="small" class="mr-2" onClick={() => assignMenu(row)}>
      {{
        default: () => t('views.role.configApi'),
        icon: () => <NIcon>{{ default: () => <EditOutlined /> }}</NIcon>
      }}
    </NButton>,
    <NButton strong secondary size="small" class="mr-2" onClick={() => assignMenu(row)}>
      {{
        default: () => t('views.role.configMenu'),
        icon: () => <NIcon>{{ default: () => <EditOutlined /> }}</NIcon>
      }}
    </NButton>
  ]
}

function onDelete(id: number) {
  deleteRole(id).then(() => {
    message.success(t('general.removeSuccess'))
    refresh()
  })
}

function add() {
  onEdit()
}

function assignMenu(row: Role) {
  showDrawer.value = true
  drawerTitle.value = `【${row.name}】${t('views.role.configMenu')}`
  assigningKey.value = row.id
}
</script>

<style scoped lang="scss"></style>
