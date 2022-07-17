<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small" class="p-4">
    <template #header>
      <n-button attr-type="button" type="primary" @click="save"> 保存</n-button>
    </template>
    <n-spin :show="formLoading">
      <template #description> 加载中...</template>
      <n-form
        ref="formRef"
        :model="userForm"
        :rules="userFormRules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        class="w-1/3"
      >
        <n-form-item label="头像" path="avatar">
          <div class="flex flex-col">
            <n-avatar
              class="bg-gray-300 bg-opacity-60 mb-2"
              circle
              :size="84"
              :src="userForm.avatar"
            />
            <n-button quaternary type="primary" @click="handleClickUpload"> 更换头像</n-button>
            <input id="fileUploader" type="file" style="display: none" @change="afterUploadFile" />
          </div>
        </n-form-item>
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="userForm.nickname" />
        </n-form-item>
      </n-form>
    </n-spin>
  </n-card>
</template>

<script setup lang="ts">
import { FormInst, useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { getUser, updateUserInfo, uploadAvatar } from '@/api/user/user'
import { useUserStore } from '@/store/modules/user'
import { FormRules } from 'naive-ui/es/form/src/interface'
import { UserProfile } from '@/types/modules/user'

const userStore = useUserStore()
const message = useMessage()
const formLoading = ref(false)
const formRef = ref<FormInst | null>(null)

const userForm = ref<UserProfile>({
  avatar: '',
  nickname: ''
})

const userFormRules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 20, message: '昵称只能20个字符内', trigger: 'blur' }
  ]
}

onMounted(() => {
  getUser(userStore.userInfo!.userId).then((res) => {
    userForm.value.avatar = res.data!.avatar
    userForm.value.nickname = res.data!.nickname
  })
})

function handleClickUpload() {
  document.getElementById('fileUploader')!.click()
}

function afterUploadFile() {
  const ele = document.getElementById('fileUploader') as HTMLInputElement
  if (ele) {
    const file = ele.files![0]
    const formData = new FormData()
    formData.append('avatar', file)
    uploadAvatar(formData).then((res) => {
      userForm.value.avatar = res.data!
      ele.value = ''
    })
  }
}

function save() {
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error('请完整填写表单')
      return
    }
  })
  updateUserInfo(userForm.value).then(() => {
    message.success('修改成功')
  })

  userStore.updateUserInfo()
}
</script>

<style lang="scss" scoped></style>
