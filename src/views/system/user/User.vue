<template>
  <div class="p-2">
    <winter-table :columns="columns" :data="data" :search-items="searchItems" @search="search" />
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { NAvatar, NButton, NIcon, NTag, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import WinterTable from '@/components/table/WinterTable.vue'
import { SearchItem, SearchOptions } from '@/types/component/table'
import { getPagedUsers } from '@/api/base/user'
import { AdminUserPageItem } from '@/types/response/user'
import { EditOutlined, DeleteOutlined } from '@vicons/antd'
import { Ban } from '@vicons/ionicons5'

const message = useMessage()

type SearchParam = {
  username: string
  mobile: string
  nickname: string
}

const data = ref<AdminUserPageItem[]>([])

const searchItems: SearchItem[] = [
  {
    label: '用户名',
    path: 'username',
    placeholder: '用户名搜索'
  },
  {
    label: '昵称',
    path: 'nickname',
    placeholder: '昵称搜索'
  },
  {
    label: '手机号',
    path: 'mobile',
    placeholder: '手机号搜索'
  }
]

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
    render: (row) => [
      <NButton
        strong
        secondary
        type="primary"
        size="small"
        class="mr-2"
        onClick={() => {
          message.info(` edit ${row.id}`)
        }}
      >
        {{
          default: () => '编辑',
          icon: () => <NIcon>{{ default: () => <EditOutlined /> }}</NIcon>
        }}
      </NButton>,
      <NButton
        strong
        secondary
        type="error"
        size="small"
        class="mr-2"
        onClick={() => {
          message.info(`delete  ${row.id}`)
        }}
      >
        {{
          default: () => '删除',
          icon: () => <NIcon>{{ default: () => <DeleteOutlined /> }}</NIcon>
        }}
      </NButton>,
      <NButton
        strong
        secondary
        type="warning"
        size="small"
        class="mr-2"
        onClick={() => {
          message.info(`ban ${row.id}`)
        }}
      >
        {{
          default: () => '禁用',
          icon: () => <NIcon>{{ default: () => <Ban /> }}</NIcon>
        }}
      </NButton>
    ]
  }
]

function search(searchOptions: SearchOptions<SearchParam>) {
  getPagedUsers(searchOptions).then((res) => {
    data.value = res.data?.list ?? []
  })
}
</script>

<style scoped lang="scss">
.more-condition {
  margin: 0;
}
</style>
