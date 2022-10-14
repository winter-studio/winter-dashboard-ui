<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small">
    <template #header>
      <n-space>
        <n-button
          type="info"
          secondary
          :loading="saveLoading"
          :disabled="!isModified"
          @click="saveMenuForm"
        >
          {{ t('views.menu.save') }}
        </n-button>
        <n-popconfirm @positive-click="reset">
          <template #trigger>
            <n-button :disabled="!isModified" secondary>
              {{ t('views.menu.reset') }}
            </n-button>
          </template>
          {{ t('views.menu.leaveConfirm') }}
        </n-popconfirm>

        <n-popconfirm @positive-click="deleteMenu">
          <template #trigger>
            <n-button :disabled="!modelValue" secondary type="error">
              {{ t('views.menu.delete') }}
            </n-button>
          </template>
          {{ t('views.menu.deleteConfirm') }}
        </n-popconfirm>
      </n-space>
    </template>
    <n-form
      v-if="menuForm"
      ref="formRef"
      :model="menuForm"
      :rules="rules"
      label-placement="left"
      :label-width="100"
      class="py-4"
    >
      <n-form-item :label="t('views.menu.form.parent')">
        <n-tree-select
          v-model:value="menuForm.parentId"
          clearable
          :show-path="true"
          :options="dirMenus"
          @on-update:value="onUpdateParent"
        />
      </n-form-item>
      <n-form-item :label="t('views.menu.form.type')" path="type">
        <n-radio-group v-model:value="menuForm.type" name="type">
          <n-space>
            <n-radio :value="MenuType.DIR">{{ t('views.menu.types.dir') }}</n-radio>
            <n-radio :value="MenuType.VIEW">{{ t('views.menu.types.view') }}</n-radio>
            <n-radio :value="MenuType.IFRAME">{{ t('views.menu.types.iframe') }}</n-radio>
            <n-radio :value="MenuType.LINK">{{ t('views.menu.types.link') }}</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item :label="t('views.menu.form.title')" path="title">
        <n-input
          v-model:value="menuForm.title"
          :placeholder="t('views.menu.form.titlePlaceholder')"
        />
      </n-form-item>
      <n-form-item :label="t('views.menu.form.path')" path="path">
        <n-input-group>
          <n-input-group-label :style="{ width: parentPaths.length * 12 + 'px' }">{{
            parentPaths
          }}</n-input-group-label>
          <n-input
            v-model:value="menuForm.path"
            :placeholder="t('views.menu.form.pathPlaceholder')"
          />
        </n-input-group>
      </n-form-item>
      <n-form-item
        v-if="menuForm.type !== MenuType.DIR"
        :label="
          menuForm.type === MenuType.VIEW ? t('views.menu.form.view') : t('views.menu.form.link')
        "
        path="data"
      >
        <n-input
          v-model:value="menuForm.data"
          :placeholder="t('views.menu.form.viewPlaceholder')"
        />
      </n-form-item>
      <n-form-item :label="t('views.menu.form.icon')" path="icon">
        <icon-select v-model:value="menuForm.icon" />
      </n-form-item>
      <n-form-item :label="t('views.menu.form.tags')" path="tags">
        <n-dynamic-tags v-model:value="menuFormTags" />
      </n-form-item>
      <n-form-item :label="t('views.menu.form.hidden')" path="hidden">
        <n-switch v-model:value="menuForm.hidden" />
      </n-form-item>
      <n-form-item
        v-if="menuForm.type === MenuType.VIEW"
        :label="t('views.menu.form.cached')"
        path="keepAlive"
      >
        <n-switch v-model:value="menuForm.keepAlive" :default-value="true" />
      </n-form-item>
    </n-form>
    <n-result v-else status="info" :description="t('views.menu.hint.description')" />
  </n-card>
</template>

<script setup lang="ts">
import IconSelect from '@/components/menu/IconSelect.vue'
import { FormItemRule, FormRules, TreeSelectOption, useDialog, useMessage } from 'naive-ui'
import { MenuType } from '@/types/component/menu'
import { clone, isEmpty, isEqual } from 'lodash-es'
import { computed, ref, unref, watch } from 'vue'
import { addMenu, getMenuById, removeMenu, updateMenu } from '@/api/menu'
import { Menu } from '@/types/modules/base'
import { MenuTreeOptions } from '@/types/view/menu'
import { useI18n } from 'vue-i18n'

interface Props {
  menus: Array<MenuTreeOptions>
  dirMenus?: Array<TreeSelectOption>
  modelValue?: number
}

const props = defineProps<Props>()
const { t } = useI18n()
const emits = defineEmits(['afterChange', 'update:modelValue'])
const message = useMessage()
const dialog = useDialog()
const saveLoading = ref(false)
// 编辑时的key，添加时为空
const menuForm = ref<Menu | undefined>(undefined)
const editMenuCache = ref<Menu | undefined>(undefined)
//计算父级目录路径
const parentPaths = computed(() => {
  return getParentPath(menuForm.value?.parentId)
})
const initForm: Menu = { type: 1, title: '', path: '' }
//form引用
const formRef: any = ref(null)
//
const editingKey = ref<number | undefined>(undefined)

const menuFormTags = computed({
  get(): Array<string> {
    return unref(menuForm)?.tags?.split(',') ?? []
  },
  set(value: Array<string>) {
    unref(menuForm)!.tags = value.join(',')
  }
})
//是否更改
const isModified = computed(() => {
  return !isEqual(unref(menuForm), unref(editMenuCache))
})

//表单校验规则
const rules: FormRules = {
  type: {
    required: true,
    type: 'enum',
    enum: Object.values(MenuType),
    message: () => t('views.menu.form.rules.type'),
    trigger: 'change'
  },
  title: {
    required: true,
    message: () => t('views.menu.form.rules.title'),
    trigger: 'blur'
  },
  path: {
    required: true,
    message: () => t('views.menu.form.rules.path'),
    trigger: 'blur'
  },
  data: {
    required: true,
    validator(_: FormItemRule, value: string) {
      if (isEmpty(value)) {
        const menuType = unref(menuForm)?.type
        if (menuType === MenuType.VIEW) {
          return new Error(t('views.menu.form.rules.view'))
        } else if (menuType === MenuType.LINK || menuType === MenuType.IFRAME) {
          return new Error(t('views.menu.form.rules.link'))
        }
      }
      return true
    },
    trigger: 'blur'
  }
}
let skipThisWatch = false
watch(
  () => props.modelValue,
  (value, oldValue) => {
    if (value === undefined) {
      menuForm.value = undefined
      editMenuCache.value = undefined
      return
    }
    if (value === editingKey.value) {
      return
    }
    if (skipThisWatch) {
      skipThisWatch = false
      return
    }
    if (isModified.value) {
      dialog.info({
        title: t('views.menu.form.discard.title'),
        content: t('views.menu.form.discard.content'),
        onPositiveClick() {
          editMenu(value, oldValue)
        },
        onNegativeClick() {
          skipThisWatch = true
          emits('update:modelValue', editingKey.value)
        }
      })
    } else {
      editMenu(value, oldValue)
    }
  }
)

async function editMenu(key: number, oldValue?: number) {
  if (key) {
    const { data } = await getMenuById(key)
    menuForm.value = data
    editMenuCache.value = clone(data)
  } else {
    const newForm = clone(initForm)
    if (isDir(oldValue)) {
      newForm.parentId = oldValue
    }
    menuForm.value = clone(newForm)
    editMenuCache.value = clone(newForm)
  }
  formRef.value?.restoreValidation()
}

function getParentPath(parentId: undefined | number): string {
  if (parentId === undefined) {
    return '/'
  }
  return '/' + (buildTreeOptionPaths(parentId, props.menus) ?? '')
}

function isDir(id?: number) {
  if (!id) {
    return false
  }

  return find(id, props.dirMenus)
}

function find(id: number, menus?: TreeSelectOption[]) {
  if (!menus) {
    return false
  }

  for (const menu of menus) {
    if (menu.key === id) {
      return true
    }

    if (find(id, menu?.children)) {
      return true
    }
  }

  return false
}

function buildTreeOptionPaths(key: number, tree: Array<MenuTreeOptions>): string | undefined {
  for (const item of tree) {
    if (item.key === key) {
      return item.path + '/'
    }
    if (item.children) {
      const result = buildTreeOptionPaths(key, item.children)
      if (result) {
        return item.path + result + '/'
      }
    }
  }
}

function saveMenuForm() {
  formRef.value.validate((errors: boolean) => {
    if (errors) {
      message.error(t('views.menu.form.rules.failed'))
      return
    }

    saveLoading.value = true

    if (!props.modelValue) {
      addMenu(unref(menuForm)!)
        .then((res) => {
          message.success(t('views.menu.form.messages.saveSuccess'))
          editMenuCache.value = clone(unref(menuForm))
          emits('afterChange')
          saveLoading.value = false
          editingKey.value = res.data!
          emits('update:modelValue', res.data!)
        })
        .finally(() => {
          saveLoading.value = false
        })
    } else {
      updateMenu(props.modelValue, unref(menuForm)!)
        .then(() => {
          message.success(t('views.menu.form.messages.saveSuccess'))
          editMenuCache.value = clone(unref(menuForm))
          emits('afterChange')
          saveLoading.value = false
        })
        .finally(() => {
          saveLoading.value = false
        })
    }
  })
}

async function deleteMenu() {
  const value = props.modelValue
  if (value) {
    await removeMenu(value)
    emits('afterChange')
    menuForm.value = undefined
    editMenuCache.value = undefined
    skipThisWatch = true
    emits('update:modelValue', undefined)
  }
}

function reset() {
  if (props.modelValue) {
    menuForm.value = clone(unref(editMenuCache))
  } else {
    menuForm.value = {}
  }
  formRef.value?.restoreValidation()
}

function onUpdateParent(value: number) {
  if (menuForm.value) {
    menuForm.value.parentId = value
  }
}
</script>

<style lang="scss" scoped></style>
