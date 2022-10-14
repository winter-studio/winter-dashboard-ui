<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small">
    <template #header>
      <n-space>
        <n-button
          type="info"
          secondary
          :loading="saveLoading"
          :disabled="!isModified || !form"
          @click="save"
        >
          {{ t('views.role.save') }}
        </n-button>
        <n-popconfirm @positive-click="reset">
          <template #trigger>
            <n-button :disabled="!isModified || !form" secondary>
              {{ t('views.role.reset') }}
            </n-button>
          </template>
          {{ t('views.role.leaveConfirm') }}
        </n-popconfirm>
      </n-space>
    </template>
    <n-form
      v-if="form"
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      :label-width="100"
      class="py-4"
    >
      <n-form-item :label="t('views.role.roleCode')" path="code">
        <n-input v-model:value="form.code" :placeholder="t('views.role.roleCodePlaceholder')" />
      </n-form-item>
      <n-form-item :label="t('views.role.roleName')" path="name">
        <n-input v-model:value="form.name" :placeholder="t('views.role.roleNamePlaceholder')" />
      </n-form-item>
    </n-form>
    <n-result v-else status="info" :description="t('views.role.hint.description')" />
  </n-card>
</template>

<script setup lang="ts">
import { FormRules, useMessage } from 'naive-ui'
import { computed, ref, unref, watch } from 'vue'
import { RoleForm } from '@/types/modules/role'
import { clone, isEqual } from 'lodash-es'
import { addRole, getRoleById, updateRole } from '@/api/role'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue?: number
}
const { t } = useI18n()
const props = defineProps<Props>()
const emits = defineEmits(['afterChange', 'update:modelValue'])
const editingKey = ref<number | undefined>(undefined)
watch(
  () => props.modelValue,
  (value) => {
    if (value === undefined) {
      form.value = undefined
      return
    }
    if (value === editingKey.value) {
      return
    }
    edit(value)
  }
)

const message = useMessage()
const saveLoading = ref(false)
//form引用
const formRef: any = ref(null)
// 编辑时的key，添加时为空
const form = ref<RoleForm | undefined>(undefined)
const formCache = ref<RoleForm | undefined>(undefined)

//是否更改
const isModified = computed(() => {
  return !isEqual(unref(form), unref(formCache))
})
//表单校验规则
const rules: FormRules = {
  code: { required: true, message: t('views.role.roleCodePlaceholder'), trigger: 'blur' },
  name: { required: true, message: t('views.role.roleNamePlaceholder'), trigger: 'blur' }
}

async function edit(key: number) {
  editingKey.value = key
  if (key) {
    const { data } = await getRoleById(key)
    form.value = data!
    formCache.value = clone(data!)
  } else {
    form.value = { code: '', name: '' }
    formCache.value = { code: '', name: '' }
  }
  formRef.value?.restoreValidation()
}

function save() {
  formRef.value.validate((errors: boolean) => {
    if (errors) {
      message.error(t('views.role.messages.failed'))
      return
    }

    saveLoading.value = true

    if (!props.modelValue) {
      addRole(unref(form)!)
        .then((res) => {
          message.success(t('views.role.messages.saveSuccess'))
          formCache.value = clone(unref(form))
          emits('afterChange')
          editingKey.value = res.data!
          emits('update:modelValue', res.data!)
        })
        .finally(() => {
          saveLoading.value = false
        })
    } else {
      updateRole(props.modelValue, unref(form)!)
        .then(() => {
          message.success(t('views.role.messages.saveSuccess'))
          formCache.value = clone(unref(form))
          emits('afterChange')
          saveLoading.value = false
        })
        .finally(() => {
          saveLoading.value = false
        })
    }
  })
}

function reset() {
  if (props.modelValue) {
    form.value = clone(unref(formCache))
  } else {
    form.value = { code: '', name: '' }
  }
  formRef.value?.restoreValidation()
}
</script>

<style scoped></style>
