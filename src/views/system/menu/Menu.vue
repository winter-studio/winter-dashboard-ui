<template>
  <div>
    <n-grid cols="3" responsive="screen" :x-gap="12">
      <n-gi span="1">
        <n-card :segmented="{ content: 'hard' }" :bordered="false" size="small">
          <template #header>
            <n-button secondary type="primary" class="mr-2" @click="toggleCollapse">
              <template #icon>
                <n-icon v-if="expandedKeys.length"><vertical-align-center-twotone /></n-icon>
                <n-icon v-else><expand-round /></n-icon>
              </template>
              全部{{ expandedKeys.length ? '收起' : '展开' }}
            </n-button>
            <n-button secondary type="success" class="mr-2" @click="editMenuConfirm">
              <template #icon>
                <n-icon><add-box-outlined /></n-icon>
              </template>
              添加菜单
            </n-button>
            <n-popconfirm class="mr-2" @positive-click="deleteMenus">
              <template #trigger>
                <n-button :disabled="checkedKeys.length === 0" secondary type="error">
                  <template #icon>
                    <n-icon><delete-outline-filled /></n-icon>
                  </template>
                  删除菜单
                </n-button>
              </template>
              确认删除吗？将无法恢复
            </n-popconfirm>
          </template>
          <div class="w-full">
            <n-input v-model:value="search" type="input" placeholder="输入菜单名称搜索">
              <template #suffix>
                <n-icon size="18" class="cursor-pointer">
                  <search-outlined />
                </n-icon>
              </template>
            </n-input>
            <div class="py-3 menu-list">
              <template v-if="loading">
                <div class="flex items-center justify-center py-4">
                  <n-spin size="medium" />
                </div>
              </template>
              <template v-else>
                <n-tree
                  block-line
                  cascade
                  checkable
                  draggable
                  :virtual-scroll="true"
                  :pattern="search"
                  :data="menus"
                  :expanded-keys="expandedKeys"
                  style="max-height: 650px; overflow: hidden"
                  @drop="handleDrop"
                  @update:checked-keys="onUpdateCheckedKeys"
                  @update:selected-keys="editMenuConfirm"
                  @update:expanded-keys="onUpdateExpandedKeys"
                />
              </template>
            </div>
          </div>
        </n-card>
      </n-gi>
      <n-gi span="2">
        <n-card :segmented="{ content: 'hard' }" :bordered="false" size="small">
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
              <n-button secondary :disabled="!isModified" @click="resetConfirm">重置</n-button>
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
                <n-input-group-label>{{ parentPaths }}</n-input-group-label>
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
              <n-switch v-model:value="menuForm.keepAlive" />
            </n-form-item>
          </n-form>
          <n-result
            v-else
            status="info"
            title="提示"
            description="请点击菜单项或者添加按钮编辑菜单"
          />
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, unref } from 'vue'
import {
  FormItemRule,
  FormRules,
  TreeDropInfo,
  TreeOption,
  TreeSelectOption,
  useDialog,
  useMessage
} from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import { addMenu, getMenuById, getMenuList, Menu, removeMenus, updateMenu } from '@/api/base/menu'
import { MenuTree, MenuType } from '@/router/types'
import {
  AddBoxOutlined,
  DeleteOutlineFilled,
  ExpandRound,
  VerticalAlignCenterTwotone
} from '@vicons/material'
import IconSelect from '@/components/menu/IconSelect.vue'
import { isEqual, clone, isEmpty, isNil } from 'lodash-es'
const dialog = useDialog()
const message = useMessage()
const loading = ref(true)
const saveLoading = ref(false)
const search = ref('')
//展开菜单Keys
const expandedKeys = ref<Array<string | number>>([])
//选中菜单Keys
const checkedKeys = ref<Array<string | number>>([])
//表单校验规则
const rules: FormRules = {
  type: {
    required: true,
    message: '请选择类型',
    trigger: 'blur'
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
    validator(rule: FormItemRule, value: string) {
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
//form引用
const formRef: any = ref(null)
//菜单树
const menus = ref<Array<MenuTreeOptions>>([])
const dirMenus = ref<Array<TreeSelectOption> | undefined>([])

// 编辑时的key，添加时为空
const editingKey = ref<string | number | undefined>(undefined)
const menuForm = ref<Menu | undefined>(undefined)
let editMenuCache = ref<Menu | undefined>(undefined)
//是否更改
const isModified = computed(() => {
  return !isEqual(unref(menuForm), unref(editMenuCache))
})
//计算父级目录路径
const parentPaths = computed(() => {
  return getParentPath(menuForm.value?.parentId)
})
//
const menuFormTags = computed({
  get(): Array<string> {
    return unref(menuForm)?.tags?.split(',') ?? []
  },
  set(value: Array<string>) {
    unref(menuForm)!.tags = value.join(',')
  }
})

function buildTreeOptionPaths(
  key: string | number,
  tree: Array<MenuTreeOptions>
): string | undefined {
  for (let item of tree) {
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

function getParentPath(parentId: undefined | number): string {
  if (parentId === undefined) {
    return '/'
  }
  return '/' + (buildTreeOptionPaths(parentId, unref(menus)) ?? '')
}

function onUpdateCheckedKeys(keys: Array<string | number>) {
  checkedKeys.value = keys
}

function handleDrop(info: TreeDropInfo) {
  console.log(info)
}

function editMenuConfirm(keys: Array<string | number>) {
  if (isModified.value) {
    dialog.info({
      title: '未保存',
      content: '当前编辑内容已更改，确认放弃当前编辑的内容？',
      positiveText: '确认',
      negativeText: '取消',
      onPositiveClick() {
        editMenu(keys)
      }
    })
  } else {
    editMenu(keys)
  }
}

async function editMenu(keys: Array<string | number>) {
  if (keys && keys[0]) {
    editingKey.value = keys[0]
    const { data } = await getMenuById(keys[0])
    menuForm.value = data
    editMenuCache.value = clone(data)
  } else {
    editingKey.value = undefined
    menuForm.value = {}
    editMenuCache.value = {}
  }
}

function resetConfirm() {
  if (isModified.value) {
    dialog.info({
      title: '重置确认',
      content: '确认放弃当前编辑的内容？',
      positiveText: '确认',
      negativeText: '取消',
      onPositiveClick() {
        reset()
      }
    })
  } else {
    dialog.info({
      title: '未更改',
      content: '表单内容还没有改变',
      positiveText: '确认'
    })
  }
}

function reset() {
  if (editingKey.value) {
    menuForm.value = clone(unref(editMenuCache))
  } else {
    menuForm.value = {}
  }
}

function saveMenuForm() {
  formRef.value.validate((errors: boolean) => {
    if (errors) {
      message.error('请填写完整信息')
      return
    }

    saveLoading.value = true

    let apiPromise
    if (isNil(editingKey.value)) {
      apiPromise = addMenu(unref(menuForm)!)
    } else {
      apiPromise = updateMenu(editingKey.value, unref(menuForm)!)
    }

    apiPromise
      .then(() => {
        message.success('保存成功')
        editMenuCache.value = clone(unref(menuForm))
        loadMenuTree()
        saveLoading.value = false
      })
      .catch(() => {
        message.error('保存失败')
        saveLoading.value = false
      })
  })
}

function toggleCollapse() {
  if (expandedKeys.value.length) {
    expandedKeys.value = []
  } else {
    expandedKeys.value = unref(menus).map((item: any) => item.key as string) as []
  }
}

interface MenuTreeOptions extends TreeOption {
  key: string
  label: string
  path: string
  children?: MenuTreeOptions[]
}

function buildTreeOptions(menuTrees: Array<MenuTree>): Array<MenuTreeOptions> {
  return menuTrees.map((item: MenuTree) => {
    return {
      key: item.id,
      label: item.title,
      path: item.path,
      children: item.children ? buildTreeOptions(item.children) : undefined
    }
  })
}

function buildDirTreeOptions(menuTrees: Array<MenuTree>): Array<TreeSelectOption> | undefined {
  const data = menuTrees
    .filter((i) => i.type == MenuType.DIR)
    .map((item: MenuTree) => {
      return {
        key: item.id,
        label: item.title,
        children: item.children ? buildDirTreeOptions(item.children) : undefined
      }
    })
  if (data.length == 0) {
    return undefined
  }
  return data
}

async function loadMenuTree() {
  const { data: menuTrees } = await getMenuList()
  menus.value = buildTreeOptions(menuTrees!)
  dirMenus.value = buildDirTreeOptions(menuTrees!)
}

onMounted(async () => {
  await loadMenuTree()
  loading.value = false
})

function onUpdateExpandedKeys(keys: Array<string | number>) {
  expandedKeys.value = keys
}

function onUpdateParent(value: number) {
  if (menuForm.value) {
    menuForm.value.parentId = value
  }
}

async function deleteMenus() {
  if (checkedKeys.value.length > 0) {
    await removeMenus(checkedKeys.value)
    loadMenuTree()
  }
}
</script>
