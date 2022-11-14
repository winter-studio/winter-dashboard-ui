<template>
  <n-spin :show="formLoading">
    <template #description> {{ t('general.loading') }}...</template>
    <n-form
      ref="formRef"
      :model="userForm"
      :rules="userFormRules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item>
        <n-space>
          <n-button attr-type="button" type="primary" @click="save">
            {{ t('general.save') }}</n-button
          >
        </n-space>
      </n-form-item>
      <n-form-item :label="t('views.user.common.avatar')" path="avatar">
        <div class="flex flex-col">
          <n-avatar
            class="bg-gray-300 bg-opacity-60 mb-2"
            circle
            :size="84"
            :src="userForm.avatar"
          />
          <n-button quaternary type="primary" @click="handleClickUpload">{{
            t('views.user.common.changeAvatar')
          }}</n-button>
          <input id="fileUploader" type="file" style="display: none" @change="afterUploadFile" />
        </div>
      </n-form-item>
      <n-form-item :label="t('views.user.common.username')" path="username">
        <n-input v-model:value="userForm.username" :disabled="isEdit" />
      </n-form-item>
      <n-form-item :label="t('views.user.common.password')" path="password">
        <n-input
          v-model:value="userForm.password"
          type="password"
          show-password-on="mousedown"
          :maxlength="32"
        />
      </n-form-item>
      <n-form-item :label="t('views.user.common.nickname')" path="nickname">
        <n-input v-model:value="userForm.nickname" />
      </n-form-item>
      <n-form-item :label="t('views.user.common.tel')" path="mobile">
        <n-input v-model:value="userForm.mobile" />
      </n-form-item>
      <n-form-item :label="t('views.user.common.status')" path="status">
        <n-select
          v-model:value="userForm.status"
          :options="statusOptions"
          :render-tag="renderTag"
        />
      </n-form-item>
      <n-form-item :label="t('views.user.common.role')" path="roles">
        <n-select v-model:value="userForm.roles" multiple :options="roleOptions" />
      </n-form-item>
    </n-form>
  </n-spin>
</template>

<script setup lang="tsx">
import { computed, onMounted, ref } from 'vue'
import { FormInst, SelectOption, SelectRenderTag, useMessage } from 'naive-ui'
import { editUser, getUser, uploadAvatar, addUser } from '@/api/user'
import { UserFormModel, userFormRules } from './support'
import { DictCode, useDictStore } from '@/store/modules/dict'
import { FormSelectOption } from '@/types/component/form'
import { useI18n } from 'vue-i18n'

interface Props {
  userId?: number
}

const props = defineProps<Props>()
const { t } = useI18n()
const message = useMessage()
const formLoading = ref(false)
const formRef = ref<FormInst | null>(null)
const isEdit = computed(() => {
  return userForm.value.id !== undefined
})

const userForm = ref<UserFormModel>({
  avatar: '',
  username: '',
  nickname: '',
  mobile: '',
  status: '',
  roles: []
})

const dictStore = useDictStore()
const roleOptions = ref<FormSelectOption[]>([])

const statusOptions = ref<Array<SelectOption>>([])

const renderTag: SelectRenderTag = ({ option }) => <div class={option.class}>{option.label}</div>
onMounted(async () => {
  await dictStore.use(DictCode.UserStatus)

  dictStore.getRoleOptions.then((roles) => {
    roleOptions.value = roles!
  })

  dictStore.getDictItems(DictCode.UserStatus).map((item) => {
    return {
      label: item.value,
      value: item.key,
      style: { color: item.extra }
    }
  })
  userForm.value.id = props.userId
  if (props.userId) {
    formLoading.value = true
    getUser(props.userId)
      .then((res) => {
        if (res.data) {
          userForm.value = res.data
        } else {
          message.error(t('general.requestFailed'))
        }
      })
      .finally(() => {
        formLoading.value = false
      })
  } else {
    // 给些默认值
    userForm.value.status = '0'
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
      message.error(t('general.dataRequiredMore'))
      return
    }

    if (userForm.value.id) {
      // 编辑
      editUser(userForm.value.id, userForm.value)
      message.success(t('general.editSuccess'))
    } else {
      // 新增
      addUser(userForm.value).then((res) => {
        message.success(t('general.addSuccess'))
        userForm.value.id = res.data!
      })
    }
  })
}
</script>

<style lang="scss" scoped></style>
