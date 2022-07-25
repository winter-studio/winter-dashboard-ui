<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small" class="p-4">
    <template #header>
      <n-button attr-type="button" type="primary" @click="save"> 保存</n-button>
    </template>
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      class="w-1/3"
    >
      <n-form-item label="当前密码" path="oldPassword">
        <n-input
          v-model:value="form.oldPassword"
          show-password-on="click"
          type="password"
          placeholder="请输入当前密码"
        />
      </n-form-item>
      <n-form-item label="新密码" path="newPassword">
        <n-input
          v-model:value="form.newPassword"
          show-password-on="click"
          type="password"
          placeholder="请输入新密码密码"
        />
      </n-form-item>
      <n-form-item label="新密码确认" path="confirmPassword">
        <n-input
          v-model:value="form.confirmPassword"
          show-password-on="click"
          type="password"
          placeholder="请再输入一次新密码"
        />
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { FormInst, useMessage, FormRules, FormItemRule } from 'naive-ui'
import { ref } from 'vue'
import { changePassword } from '@/api/user'
import { UserPassword } from '@/types/modules/user'
import { isEqual } from 'lodash-es'

const message = useMessage()
const formRef = ref<FormInst | null>(null)

interface UserPasswordConfirm extends UserPassword {
  confirmPassword: string
}

const form = ref<UserPasswordConfirm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules: FormRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    {
      required: true,
      trigger: 'blur',
      validator(_: FormItemRule, value: string) {
        if (isEqual(value, form.value?.oldPassword)) {
          return new Error('新旧密码不能相同')
        }

        if (!/^[a-zA-Z0-9_]{6,32}$/.test(value)) {
          return new Error('密码只能由6-32位字母、数字、下划线组成')
        }

        return true
      }
    }
  ],
  confirmPassword: [
    {
      required: true,
      trigger: 'blur',
      validator(_: FormItemRule, value: string) {
        if (!isEqual(value, form.value?.newPassword)) {
          return new Error('两次输入的密码不一致')
        }

        return true
      }
    }
  ]
}

function save() {
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error('请完整填写表单')
      return
    }

    changePassword(form.value!).then(() => {
      message.success('修改成功')
    })
  })
}
</script>

<style lang="scss" scoped></style>
