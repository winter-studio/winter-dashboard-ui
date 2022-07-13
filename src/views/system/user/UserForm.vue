<template>
  <n-spin :show="formLoading">
    <template #description> 加载中...</template>
    <n-form
      ref="formRef"
      :model="userFormModel"
      :rules="userFormRules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item>
        <n-space>
          <n-button attr-type="button" type="primary" @click="save"> 保存</n-button>
        </n-space>
      </n-form-item>
      <n-form-item label="头像" path="avatar">
        <div class="flex flex-col">
          <n-image width="100" :src="userFormModel.avatar" />
          <n-button quaternary type="primary" @click="handleClickUpload"> 更换头像</n-button>
          <input id="fileUploader" type="file" style="display: none" @change="afterUploadFile" />
        </div>
      </n-form-item>
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="userFormModel.username" />
      </n-form-item>
      <n-form-item label="昵称" path="nickname">
        <n-input v-model:value="userFormModel.nickname" />
      </n-form-item>
      <n-form-item label="手机号" path="mobile">
        <n-input v-model:value="userFormModel.mobile" />
      </n-form-item>
      <n-form-item label="状态" path="status">
        <n-select
          v-model:value="userFormModel.status"
          :options="statusOptions"
          :render-tag="renderTag"
        />
      </n-form-item>
      <n-form-item label="角色" path="roles">
        <n-select v-model:value="userFormModel.roles" multiple :options="roleOptions" />
      </n-form-item>
    </n-form>
  </n-spin>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue'
import { FormSelectOption } from '@/types/component/form'
import { FormInst, SelectOption, SelectRenderTag, useMessage } from 'naive-ui'
import { getRoleOptions } from '@/api/user/role'
import { getUser } from '@/api/user/user'
import { uploadPublicFile } from '@/api/basis/file'
import { UserFormModel, userFormRules } from '@/views/system/user/user-form'

interface Props {
  userId: number
}

const props = defineProps<Props>()
const message = useMessage()
const formLoading = ref(false)
const formRef = ref<FormInst | null>(null)

const userFormModel = ref<UserFormModel>({
  avatar: '',
  username: '',
  nickname: '',
  mobile: '',
  status: '',
  roles: []
})

const roleOptions = ref<Array<FormSelectOption>>([])
const statusOptions = ref<Array<SelectOption>>([
  {
    label: '正常',
    value: '0',
    style: { color: 'green' },
    class: 'text-green-600'
  },
  {
    label: '禁用',
    value: '1',
    style: { color: 'red' },
    class: 'text-red-600'
  }
])
const renderTag: SelectRenderTag = ({ option }) => <div class={option.class}>{option.label}</div>
onMounted(() => {
  formLoading.value = true
  getRoleOptions().then(({ data }) => (roleOptions.value = data!))

  if (props.userId) {
    getUser(props.userId)
      .then((res) => {
        if (res.data) {
          userFormModel.value = res.data
        } else {
          message.error('获取用户信息失败')
        }
      })
      .finally(() => {
        formLoading.value = false
      })
  }
})

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

function save() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log('验证通过')
    } else {
      console.log(errors)
    }
  })
}
</script>

<style lang="scss" scoped></style>
