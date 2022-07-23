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
      <n-form-item label="字典代码" path="code">
        <n-input v-model:value="form.code" placeholder="请输入代码" />
      </n-form-item>
      <n-form-item label="字典名称" path="name">
        <n-input v-model:value="form.name" placeholder="请输入名称" />
      </n-form-item>
      <n-form-item label="字典项" path="items">
        <n-dynamic-input
          v-model:value="form.items"
          item-style="margin-bottom: 0;"
          preset="pair"
          key-placeholder="字典项Key"
          value-placeholder="字典项Value"
          #="{ index }"
          show-sort-button
          @create="onCreate"
        >
          <div class="flex flex-1">
            <n-form-item
              class="w-1/5"
              ignore-path-change
              :show-label="false"
              :path="`items[${index}].key`"
              :rule="rules.dictKey"
            >
              <n-input
                v-model:value="form.items[index].key"
                placeholder="字典key"
                @keydown.enter.prevent
              />
            </n-form-item>
            <div style="width: 1rem"></div>
            <n-form-item
              class="flex-1"
              ignore-path-change
              :show-label="false"
              :path="`items[${index}].value`"
              :rule="rules.dictValue"
            >
              <n-input
                v-model:value="form.items[index].value"
                placeholder="字典value"
                @keydown.enter.prevent
              />
            </n-form-item>
            <div style="width: 1rem"></div>
            <n-form-item
              class="w-1/5"
              ignore-path-change
              :show-label="false"
              :path="`items[${index}].extra`"
              :rule="rules.dictExtra"
            >
              <n-input
                v-model:value="form.items[index].extra"
                placeholder="字典extra"
                @keydown.enter.prevent
              />
            </n-form-item>
          </div>
        </n-dynamic-input>
      </n-form-item>
    </n-form>
    <n-result v-else status="info" title="提示" description="请点击字典项或者添加按钮编辑字典" />
  </n-card>
</template>

<script setup lang="ts">
import { FormRules, useMessage } from 'naive-ui'
import { computed, ref, unref, watch } from 'vue'
import { clone, cloneDeep, isEmpty, isEqual } from 'lodash-es'
import { DictItem, DictModel } from '@/types/modules/dict'
import { getDictByCode, saveDict } from '@/api/basis/dict'

interface Props {
  modelValue?: string | null
}

const props = defineProps<Props>()
const emits = defineEmits(['afterChange'])
const editingKey = ref<string | null | undefined>(undefined)
watch(
  () => props.modelValue,
  (value) => {
    edit(value)
  }
)

const message = useMessage()
const saveLoading = ref(false)
//form引用
const formRef: any = ref(null)
// 编辑时的key，添加时为空
const form = ref<DictModel | undefined>(undefined)
const formCache = ref<DictModel | undefined>(undefined)

//是否更改
const isModified = computed(() => {
  return !isEqual(unref(form), unref(formCache))
})
//表单校验规则
const rules: FormRules = {
  code: {
    required: true,
    trigger: 'blur',
    validator(_: unknown, value: string) {
      if (isEmpty(value)) {
        return new Error('请输入字典代码')
      }

      if (value.length > 100) {
        return new Error('字典代码长度不能超过100')
      }

      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return new Error('字典代码只能包含字母、数字和下划线')
      }
      return true
    }
  },
  name: { required: true, message: '请输入字典名称', trigger: 'blur' },
  items: {
    required: true,
    trigger: 'blur',
    validator(_: unknown, value: Array<DictItem>) {
      if (value.length === 0) {
        return new Error('请添加字典项')
      }

      return true
    }
  },
  dictKey: {
    trigger: 'input',
    validator(_: unknown, value: string) {
      if (isEmpty(value)) {
        return new Error('请输入字典key')
      }

      if (value.length > 100) {
        return new Error('字典key长度不能超过100')
      }

      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return new Error('字典key只能包含字母、数字和下划线')
      }
      return true
    }
  },
  dictValue: {
    trigger: 'input',
    validator(_: unknown, value: string) {
      if (isEmpty(value)) {
        return new Error('请输入字典value')
      }

      if (value.length > 200) {
        return new Error('字典value长度不能超过200')
      }
      return true
    }
  },
  dictExtra: {
    trigger: 'input',
    validator(_: unknown, value: string) {
      if (isEmpty(value)) {
        return true
      }

      if (value.length > 200) {
        return new Error('字典项附加值长度不能超过200')
      }
      return true
    }
  }
}

async function edit(key: string | null | undefined) {
  editingKey.value = key
  if (key === undefined) {
    form.value = undefined
    formCache.value = undefined
    return
  }
  if (key) {
    const { data } = await getDictByCode(key)
    form.value = data!
    formCache.value = cloneDeep(data!)
  } else {
    form.value = { code: '', name: '', items: [] }
    formCache.value = { code: '', name: '', items: [] }
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

    saveDict(unref(form)!)
      .then(() => {
        message.success('保存成功')
        formCache.value = cloneDeep(unref(form))
        emits('afterChange')
        saveLoading.value = false
      })
      .finally(() => {
        saveLoading.value = false
      })
  })
}

function onCreate(): DictItem {
  return {
    key: '',
    value: ''
  }
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
