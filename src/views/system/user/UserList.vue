<template>
  <div class="p-2">
    <winter-table :columns="columns" :page-data="data" :search-items="searchItems" @search="search">
      <template #table-header>
        <n-space>
          <n-button type="primary" @click="add">{{ t('views.user.add') }}</n-button>
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
        <user-form :user-id="editUserId" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { NAvatar, NButton, NIcon, NPopconfirm, NTag, useMessage, NSpace } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import WinterTable from '@/components/table/WinterTable.vue'
import { SearchOptions } from '@/types/component/table'
import { getPagedUsers, deleteUser, changeUserStatus } from '@/api/user'
import { AdminUserPageItem } from '@/types/modules/user'
import { EditOutlined, DeleteOutlined } from '@vicons/antd'
import { Ban } from '@vicons/ionicons5'
import { SearchParam, searchItems } from './support'
import UserForm from './UserForm.vue'
import { PageRes } from '@/types/component/request'
import { useI18n } from 'vue-i18n'

const message = useMessage()
const showEdit = ref(false)
const { t } = useI18n()
const data = ref<PageRes<AdminUserPageItem>>()
const editUserId = ref<number | undefined>(undefined)

const columns: DataTableColumns<AdminUserPageItem> = [
  {
    title: () => t('views.user.common.avatar'),
    key: 'avatar',
    render: (row) => {
      return <NAvatar src={row.avatar} size="medium" color="#ccc6" />
    }
  },
  {
    title: () => t('views.user.common.username'),
    key: 'username'
  },
  {
    title: () => t('views.user.common.nickname'),
    key: 'nickname'
  },
  {
    title: () => t('views.user.common.tel'),
    key: 'mobile'
  },
  {
    title: () => t('views.user.common.status'),
    key: 'status',
    render: (row) => {
      let text = 'views.user.common.available'
      let type: 'success' | 'error' = 'success'
      if (row.status === '1') {
        text = 'views.user.common.banned'
        type = 'error'
      }
      return <NTag type={type}>{t(text)}</NTag>
    }
  },
  {
    title: () => t('views.user.common.createTime'),
    key: 'createTime'
  },
  {
    title: () => t('views.user.common.operation'),
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
  getPagedUsers(searchOptions).then((res) => {
    data.value = res.data
  })
}

function onEdit(id?: number) {
  showEdit.value = true
  editUserId.value = id
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
    <NPopconfirm onPositiveClick={() => onChangeStatus(row.id, row.status === '0' ? '1' : '0')}>
      {{
        default: () =>
          t(row.status === '0' ? 'views.user.disableConfirm' : 'views.user.enableConfirm'),
        trigger: () => (
          <NButton
            strong
            secondary
            type={row.status === '0' ? 'warning' : 'success'}
            size="small"
            class="mr-2"
          >
            {{
              default: () =>
                row.status === '0' ? t('views.user.disable') : t('views.user.enable'),
              icon: () => <NIcon>{{ default: () => <Ban /> }}</NIcon>
            }}
          </NButton>
        )
      }}
    </NPopconfirm>
  ]
}

function onDelete(id: number) {
  deleteUser(id).then(() => {
    message.success(t('general.removeSuccess'))
    refresh()
  })
}

function onChangeStatus(id: number, status: string) {
  changeUserStatus(id, status).then(() => {
    message.success(t('views.user.opsSuccess'))
    refresh()
  })
}

function add() {
  onEdit()
}
</script>

<style scoped lang="scss"></style>
