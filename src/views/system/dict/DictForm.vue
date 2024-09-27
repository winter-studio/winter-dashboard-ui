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
          {{ t('general.save') }}
        </n-button>
        <n-popconfirm @positive-click="reset">
          <template #trigger>
            <n-button :disabled="!isModified" secondary>
              {{ t('general.reset') }}
            </n-button>
          </template>
          {{ t('views.dictionary.leaveConfirm') }}
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
      <n-form-item :label="t('views.dictionary.dictCode')" path="code">
        <n-input
          v-model:value="form.code"
          :placeholder="t('views.dictionary.dictCodePlaceholder')"
        />
      </n-form-item>
      <n-form-item :label="t('views.dictionary.dictName')" path="name">
        <n-input
          v-model:value="form.name"
          :placeholder="t('views.dictionary.dictNamePlaceholder')"
        />
      </n-form-item>
      <n-form-item :label="t('views.dictionary.dictItems')" path="items">
        <n-dynamic-input
          v-model:value="form.items"
          item-style="margin-bottom: 0;"
          preset="pair"
          :key-placeholder="t('views.dictionary.dictItemKey')"
          :value-placeholder="t('views.dictionary.dictItemValue')"
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
                :placeholder="t('views.dictionary.dictItemKey')"
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
                :placeholder="t('views.dictionary.dictItemValue')"
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
                :placeholder="t('views.dictionary.dictItemExtra')"
                @keydown.enter.prevent
              />
            </n-form-item>
          </div>
        </n-dynamic-input>
      </n-form-item>
    </n-form>
    <n-result v-else status="info" :description="t('views.dictionary.hint.description')" />
  </n-card>
</template>

<script setup lang="ts">
import { FormRules, useMessage } from 'naive-ui'
import { computed, ref, unref, watch } from 'vue'
import { clone, cloneDeep, isEmpty, isEqual } from 'lodash-es'
import { DictItem, DictModel } from '@/types/modules/dict'
import { getDictByCode, saveDict } from '@/api/dict'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue?: string | null
}
const { t } = useI18n()
const props = defineProps<Props>()
const emits = defineEmits(['afterChange', 'update:modelValue'])
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
        return new Error(t('views.dictionary.messages.code'))
      }

      if (value.length > 100) {
        return new Error(t('views.dictionary.messages.codeLength'))
      }

      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return new Error(t('views.dictionary.messages.codeName'))
      }
      return true
    }
  },
  name: { required: true, message: t('views.dictionary.messages.name'), trigger: 'blur' },
  items: {
    required: true,
    trigger: 'blur',
    validator(_: unknown, value: Array<DictItem>) {
      if (value.length === 0) {
        return new Error(t('views.dictionary.messages.item'))
      }

      return true
    }
  },
  dictKey: {
    trigger: 'input',
    validator(_: unknown, value: string) {
      if (isEmpty(value)) {
        return new Error(t('views.dictionary.messages.itemKey'))
      }

      if (value.length > 100) {
        return new Error(t('views.dictionary.messages.itemKeyLength'))
      }

      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return new Error(t('views.dictionary.messages.itemKeyName'))
      }
      return true
    }
  },
  dictValue: {
    trigger: 'input',
    validator(_: unknown, value: string) {
      if (isEmpty(value)) {
        return new Error(t('views.dictionary.messages.itemValue'))
      }

      if (value.length > 200) {
        return new Error(t('views.dictionary.messages.itemValueLength'))
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
        return new Error(t('views.dictionary.messages.itemExtraLength'))
      }
      return true
    }
  }
}

async function edit(key: string | null | undefined) {
  if (key === editingKey.value) {
    return
  }
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
      message.error(t('views.dictionary.messages.failed'))
      return
    }

    saveLoading.value = true

    saveDict(unref(form)!)
      .then(() => {
        message.success(t('views.dictionary.messages.saveSuccess'))
        formCache.value = cloneDeep(unref(form))
        emits('afterChange')
        saveLoading.value = false
        editingKey.value = form.value!.code
        emits('update:modelValue', form.value!.code)
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
    form.value = { code: '', name: '', items: [] }
  }
  formRef.value?.restoreValidation()
}
</script>

<style scoped></style>
