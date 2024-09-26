<template>
  <n-spin :show="formLoading">
    <template #description> {{ t('general.loading') }}...</template>
    <n-form
      ref="formRef"
      :model="form"
      :rules="formRules"
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
      <n-form-item :label="t('views.role.roleName')" path="roleName">
        <n-input v-model:value="form.roleName" />
      </n-form-item>
      <n-form-item :label="t('views.role.roleCode')" path="roleCode">
        <n-input v-model:value="form.roleCode" />
      </n-form-item>
    </n-form>
  </n-spin>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue'
import { FormInst, SelectOption, useMessage } from 'naive-ui'
import { editUser, getUser, addUser } from '@/api/user'
import { RoleFormModel, formRules } from './support'
import { useI18n } from 'vue-i18n'

interface Props {
  id?: number
}

const props = defineProps<Props>()
const { t } = useI18n()
const message = useMessage()
const formLoading = ref(false)
const formRef = ref<FormInst | null>(null)

const form = ref<RoleFormModel>({
  roleName: '',
  roleCode: ''
})

ref<Array<SelectOption>>([])
onMounted(async () => {
  form.value.id = props.id
  if (props.id) {
    formLoading.value = true
    getUser(props.id)
      .then((res) => {
        if (res.data) {
          form.value = res.data
        } else {
          message.error(t('general.requestFailed'))
        }
      })
      .finally(() => {
        formLoading.value = false
      })
  }
})
function save() {
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error(t('general.dataRequiredMore'))
      return
    }

    if (form.value.id) {
      // edit
      editUser(form.value.id, form.value)
      message.success(t('general.editSuccess'))
    } else {
      // add
      addUser(form.value).then((res) => {
        message.success(t('general.addSuccess'))
        form.value.id = res.data!
      })
    }
  })
}
</script>

<style lang="scss" scoped></style>
