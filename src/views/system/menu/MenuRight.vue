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
          保存
        </n-button>
        <n-popconfirm @positive-click="reset">
          <template #trigger>
            <n-button :disabled="!isModified" secondary> 重置 </n-button>
          </template>
          确认放弃当前编辑的内容
        </n-popconfirm>

        <n-popconfirm @positive-click="deleteMenu">
          <template #trigger>
            <n-button :disabled="!modelValue" secondary type="error"> 删除 </n-button>
          </template>
          确认删除吗？将无法恢复
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
      <n-form-item label="父级目录">
        <n-tree-select
          v-model:value="menuForm.parentId"
          clearable
          :show-path="true"
          :options="dirMenus"
          @on-update:value="onUpdateParent"
        />
      </n-form-item>
      <n-form-item label="类型" path="type">
        <n-radio-group v-model:value="menuForm.type" name="type">
          <n-space>
            <n-radio :value="MenuType.DIR">菜单目录</n-radio>
            <n-radio :value="MenuType.VIEW">组件页面</n-radio>
            <n-radio :value="MenuType.IFRAME">内嵌外部链接</n-radio>
            <n-radio :value="MenuType.LINK">跳转外部链接</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="标题" path="title">
        <n-input v-model:value="menuForm.title" placeholder="请输入标题" />
      </n-form-item>
      <n-form-item label="路径" path="path">
        <n-input-group>
          <n-input-group-label :style="{ width: parentPaths.length * 12 + 'px' }">{{
            parentPaths
          }}</n-input-group-label>
          <n-input v-model:value="menuForm.path" placeholder="请输入路径" />
        </n-input-group>
      </n-form-item>
      <n-form-item
        v-if="menuForm.type !== MenuType.DIR"
        :label="menuForm.type === MenuType.VIEW ? '页面组件' : '链接'"
        path="data"
      >
        <n-input v-model:value="menuForm.data" placeholder="请输入信息" />
      </n-form-item>
      <n-form-item label="图标" path="icon">
        <icon-select v-model:value="menuForm.icon" />
      </n-form-item>
      <n-form-item label="标记" path="tags">
        <n-dynamic-tags v-model:value="menuFormTags" />
      </n-form-item>
      <n-form-item label="是否隐藏" path="hidden">
        <n-switch v-model:value="menuForm.hidden" />
      </n-form-item>
      <n-form-item v-if="menuForm.type === MenuType.VIEW" label="是否缓存" path="keepAlive">
        <n-switch v-model:value="menuForm.keepAlive" :default-value="true" />
      </n-form-item>
    </n-form>
    <n-result v-else status="info" title="提示" description="请点击菜单项或者添加按钮编辑菜单" />
  </n-card>
</template>

<script setup lang="ts">
import IconSelect from '@/components/menu/IconSelect.vue'
import { FormItemRule, FormRules, TreeSelectOption, useDialog, useMessage } from 'naive-ui'
import { MenuType } from '@/router/types'
import { clone, isEmpty, isEqual } from 'lodash-es'
import { computed, ref, unref, watch } from 'vue'
import { addMenu, getMenuById, removeMenu, updateMenu } from '@/api/basis/menu'
import { Menu } from '@/types/response/base'
import { MenuTreeOptions } from '@/types/view/menu'

interface Props {
  menus: Array<MenuTreeOptions>
  dirMenus?: Array<TreeSelectOption>
  modelValue?: number
}

const props = defineProps<Props>()
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
const initForm = { type: 1, title: '', path: '' }
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
    message: '请选择类型',
    trigger: 'change'
  },
  title: {
    required: true,
    message: '请输入标题',
    trigger: 'blur'
  },
  path: {
    required: true,
    message: '请输入路径',
    trigger: 'blur'
  },
  data: {
    required: true,
    validator(_: FormItemRule, value: string) {
      if (isEmpty(value)) {
        const menuType = unref(menuForm)?.type
        if (menuType === MenuType.VIEW) {
          return new Error('请输入页面组件')
        } else if (menuType === MenuType.LINK || menuType === MenuType.IFRAME) {
          return new Error('请输入链接')
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
  (value) => {
    if (value === undefined) {
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
        title: '未保存',
        content: '当前编辑内容已更改，确认放弃当前编辑的内容？',
        positiveText: '确认',
        negativeText: '取消',
        onPositiveClick() {
          editMenu(value)
        },
        onNegativeClick() {
          skipThisWatch = true
          emits('update:modelValue', editingKey.value)
        }
      })
    } else {
      editMenu(value)
    }
  }
)

async function editMenu(key: number | undefined) {
  if (key) {
    const { data } = await getMenuById(key)
    menuForm.value = data
    editMenuCache.value = clone(data)
  } else {
    menuForm.value = clone(initForm)
    editMenuCache.value = clone(initForm)
  }
  formRef.value?.restoreValidation()
}

function getParentPath(parentId: undefined | number): string {
  if (parentId === undefined) {
    return '/'
  }
  return '/' + (buildTreeOptionPaths(parentId, props.menus) ?? '')
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
      message.error('请填写完整信息')
      return
    }

    saveLoading.value = true

    if (!props.modelValue) {
      addMenu(unref(menuForm)!)
        .then((res) => {
          message.success('保存成功')
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
          message.success('保存成功')
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
