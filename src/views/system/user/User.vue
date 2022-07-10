<template>
  <div class="p-2">
    <winter-table :columns="columns" :data="data" :search-items="searchItems" @search="search" />
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { NAvatar, NButton, NTag, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import WinterTable from '@/components/table/WinterTable.vue'
import { SearchItem, SearchOptions } from '@/types/component/table'
import { getPagedUsers } from '@/api/base/user'
import { AdminUserPageItem } from '@/types/response/user'

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
    render: (row) =>
      h(NAvatar, {
        src: row.avatar,
        size: 'medium',
        color: '#ccc6'
      })
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
    render(row) {
      return h(NTag, {
        type: row.status === '0' ? 'success' : 'error',
        innerText: row.status === '0' ? '正常' : '禁用'
      })
    }
  },
  {
    title: '创建时间',
    key: 'createTime'
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () => message.info(`edit ${row.id}`)
        },
        { default: () => '编辑' }
      )
    }
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
