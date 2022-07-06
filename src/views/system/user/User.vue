<template>
  <div class="p-2">
    <winter-table :columns="columns" :data="data" :search-items="searchItems" @search="search" />
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import WinterTable from '@/components/table/WinterTable.vue'
import { SearchItem, SearchOptions } from '@/types/component/table'

type UserTableItem = {
  id: number
  avatar: string
  username: string
  nickname: string
  mobile: string
  createTime: string
  status: string
  roles: string[]
}

const message = useMessage()

type SearchForm = {
  username: string
  mobile: string
  nickname: string
}

const searchForm = ref<SearchForm>({
  username: '',
  mobile: '',
  nickname: ''
})

const data = ref<UserTableItem[]>([])

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

const columns: DataTableColumns<UserTableItem> = [
  {
    title: '头像',
    key: 'avatar'
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
    key: 'status'
  },
  {
    title: '角色',
    key: 'roles'
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

function search(searchOptions: SearchOptions) {
  console.log('search', searchOptions)
  searchForm.value = searchOptions.search
}
</script>

<style scoped lang="scss">
.more-condition {
  margin: 0;
}
</style>
