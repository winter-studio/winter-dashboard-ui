<template>
  <div class="p-2">
    <winter-table :columns="columns" :data="data" :search-items="searchItems" @search="search" />
    <n-drawer v-model:show="showEdit" :width="500" placement="right" :mask-closable="false">
      <n-drawer-content title="编辑" closable>
        <n-form
          ref="formRef"
          :model="userFormModel"
          :rules="userFormRules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="头像" path="avatar">
            <div class="flex flex-col">
              <n-image width="100" :src="userFormModel.avatar" />
              <n-button quaternary type="primary" @click="handleClickUpload"> 更换头像 </n-button>
              <input
                id="fileUploader"
                type="file"
                style="display: none"
                @change="afterUploadFile"
              />
            </div>
          </n-form-item>
          <n-form-item label="用户名" path="username">
            <n-input v-model:value="userFormModel.username" />
          </n-form-item>
          <n-form-item label="昵称" path="nickname">
            <n-input v-model:value="userFormModel.nickname" />
          </n-form-item>
        </n-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { NAvatar, NButton, NIcon, NPopconfirm, NTag, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import WinterTable from '@/components/table/WinterTable.vue'
import { SearchOptions } from '@/types/component/table'
import { getPagedUsers, getUser } from '@/api/user/user'
import { AdminUserPageItem } from '@/types/response/user'
import { EditOutlined, DeleteOutlined } from '@vicons/antd'
import { Ban } from '@vicons/ionicons5'
import { SearchParam, UserForm, searchItems, userFormRules } from '@/views/system/user/user'
import { uploadPublicFile } from '@/api/basis/file'

const message = useMessage()
const showEdit = ref(false)

const data = ref<AdminUserPageItem[]>([])

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
        onClick={() => edit(row.id)}
      >
        {{
          default: () => '编辑',
          icon: () => <NIcon>{{ default: () => <EditOutlined /> }}</NIcon>
        }}
      </NButton>,
      <NPopconfirm
        onPositiveClick={() => {
          message.info(`delete  ${row.id}`)
        }}
      >
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
      <NPopconfirm
        onPositiveClick={() => {
          message.info(`ban ${row.id}`)
        }}
      >
        {{
          default: () => '确认禁用用户吗？',
          trigger: () => (
            <NButton strong secondary type="warning" size="small" class="mr-2">
              {{
                default: () => '禁用',
                icon: () => <NIcon>{{ default: () => <Ban /> }}</NIcon>
              }}
            </NButton>
          )
        }}
      </NPopconfirm>
    ]
  }
]

const userFormModel = ref<UserForm>({
  avatar: '',
  username: '',
  nickname: '',
  mobile: '',
  status: '',
  roles: []
})

function search(searchOptions: SearchOptions<SearchParam>) {
  getPagedUsers(searchOptions).then((res) => {
    data.value = res.data?.list ?? []
  })
}

function edit(id: number) {
  getUser(id).then((res) => {
    if (res.data) {
      userFormModel.value = res.data
      showEdit.value = true
    } else {
      message.error('获取用户信息失败')
    }
  })
}

function handleClickUpload() {
  document.getElementById('fileUploader')!.click()
}

function afterUploadFile() {
  const ele = document.getElementById('fileUploader') as HTMLInputElement
  if (ele) {
    const file = ele.files![0]
    const formData = new FormData()
    formData.append('file', file)
    uploadPublicFile(formData).then((res) => {
      userFormModel.value.avatar = res.data!
      ele.value = ''
    })
  }
}
</script>

<style scoped lang="scss">
.more-condition {
  margin: 0;
}
</style>
