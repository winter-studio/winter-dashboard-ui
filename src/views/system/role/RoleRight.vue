<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small">
    <template #header>
      <n-space>
        <n-button
          type="info"
          secondary
          :loading="saveLoading"
          :disabled="!isModified"
          @click="save"
        >
          保存
        </n-button>
        <n-popconfirm @positive-click="reset">
          <template #trigger>
            <n-button :disabled="!isModified" secondary> 重置 </n-button>
          </template>
          确认放弃当前编辑的内容
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
      <n-form-item label="角色代码" path="code">
        <n-input v-model:value="form.code" placeholder="请输入代码" />
      </n-form-item>
      <n-form-item label="角色名称" path="name">
        <n-input v-model:value="form.name" placeholder="请输入名称" />
      </n-form-item>
    </n-form>
    <n-result v-else status="info" title="提示" description="请点击角色项或者添加按钮编辑角色" />
  </n-card>
</template>

<script setup lang="ts">
import { FormRules, useMessage } from 'naive-ui'
import { computed, ref, unref, watch } from 'vue'
import { RoleForm } from '@/types/modules/role'
import { clone, isEqual } from 'lodash-es'
import { addRole, getRoleById, updateRole } from '@/api/user/role'

interface Props {
  modelValue?: number
}

const props = defineProps<Props>()
const emits = defineEmits(['afterChange', 'update:modelValue'])
const editingKey = ref<number | undefined>(undefined)
watch(
  () => props.modelValue,
  (value) => {
    if (value === undefined) {
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
  code: { required: true, message: '请输入角色代码', trigger: 'blur' },
  name: { required: true, message: '请输入角色名称', trigger: 'blur' }
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
      message.error('请填写完整信息')
      return
    }

    saveLoading.value = true

    if (!props.modelValue) {
      addRole(unref(form)!)
        .then((res) => {
          message.success('保存成功')
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
          message.success('保存成功')
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
