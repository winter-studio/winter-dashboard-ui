<template>
  <div class="p-2">
    <winter-table :columns="columns" :page-data="data" :search-items="searchItems" @search="search">
      <template #table-header>
        <n-space>
          <n-button type="primary" @click="add">新增</n-button>
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
      <n-drawer-content title="编辑" closable>
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

const message = useMessage()
const showEdit = ref(false)

const data = ref<PageRes<AdminUserPageItem>>()
const editUserId = ref<number | undefined>(undefined)

const columns: DataTableColumns<AdminUserPageItem> = [
  {
    title: '头像',
    key: 'avatar',
    render: (row) => {
      return <NAvatar src={row.avatar} size="medium" color="#ccc6" />
    }
  },
  {
    title: '用户名',
    key: 'username'
  },
  {
    title: '昵称',
    key: 'nickname'
  },
  {
    title: '手机号',
    key: 'mobile'
  },
  {
    title: '状态',
    key: 'status',
    render: (row) => {
      let text = '正常'
      let type: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error' = 'success'
      if (row.status === '1') {
        text = '禁用'
        type = 'error'
      }
      return <NTag type={type}>{text}</NTag>
    }
  },
  {
    title: '创建时间',
    key: 'createTime'
  },
  {
    title: '操作',
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
        default: () => '编辑',
        icon: () => <NIcon>{{ default: () => <EditOutlined /> }}</NIcon>
      }}
    </NButton>,
    <NPopconfirm onPositiveClick={() => onDelete(row.id)}>
      {{
        default: () => '确认要删除用户吗？',
        trigger: () => (
          <NButton strong secondary type="error" size="small" class="mr-2">
            {{
              default: () => '删除',
              icon: () => <NIcon>{{ default: () => <DeleteOutlined /> }}</NIcon>
            }}
          </NButton>
        )
      }}
    </NPopconfirm>,
    <NPopconfirm onPositiveClick={() => onChangeStatus(row.id, row.status === '0' ? '1' : '0')}>
      {{
        default: () => `确认${row.status === '0' ? '禁用' : '解禁'}用户吗？`,
        trigger: () => (
          <NButton
            strong
            secondary
            type={row.status === '0' ? 'warning' : 'success'}
            size="small"
            class="mr-2"
          >
            {{
              default: () => (row.status === '0' ? '禁用' : '解禁'),
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
    message.success('删除成功')
    refresh()
  })
}

function onChangeStatus(id: number, status: string) {
  changeUserStatus(id, status).then(() => {
    message.success('操作成功')
    refresh()
  })
}

function add() {
  onEdit()
}
</script>

<style scoped lang="scss"></style>
