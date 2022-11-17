<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small" class="p-4">
    <template #header>
      <n-button attr-type="button" type="primary" @click="save"> {{ t('general.save') }}</n-button>
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
      <n-form-item :label="t('views.password.curPassword')" path="oldPassword">
        <n-input v-model:value="form.oldPassword" show-password-on="click" type="password" />
      </n-form-item>
      <n-form-item :label="t('views.password.newPassword')" path="newPassword">
        <n-input v-model:value="form.newPassword" show-password-on="click" type="password" />
      </n-form-item>
      <n-form-item :label="t('views.password.confirmPassword')" path="confirmPassword">
        <n-input v-model:value="form.confirmPassword" show-password-on="click" type="password" />
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
  oldPassword: [
    { required: true, message: () => t('views.password.curPasswordRequired'), trigger: 'blur' }
  ],
  newPassword: [
    {
      required: true,
      trigger: 'blur',
      validator(_: FormItemRule, value: string) {
        if (isEqual(value, form.value?.oldPassword)) {
          return new Error(t('views.password.newPasswordSame'))
        }

        if (!/^[a-zA-Z0-9_]{6,32}$/.test(value)) {
          return new Error(t('views.password.newPasswordInvalid'))
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
          return new Error(t('views.password.confirmPasswordSame'))
        }

        return true
      }
    }
  ]
}

function save() {
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error(t('general.dataRequiredMore'))
      return
    }

    changePassword(form.value!).then(() => {
      message.success(t('general.editSuccess'))
    })
  })
}
</script>

<style lang="scss" scoped></style>
