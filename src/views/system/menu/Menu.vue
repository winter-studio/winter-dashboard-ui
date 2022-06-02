<template>
  <div>
    <n-grid cols="3" responsive="screen" :x-gap="12">
      <n-gi span="1">
        <n-card :segmented="{ content: 'hard' }" :bordered="false" size="small">
          <template #header>
            <n-button secondary type="primary" class="mr-2" @click="packHandle">
              <template #icon>
                <n-icon v-if="expandedKeys.length"><vertical-align-center-twotone /></n-icon>
                <n-icon v-else><expand-round /></n-icon>
              </template>
              全部{{ expandedKeys.length ? '收起' : '展开' }}
            </n-button>
            <n-button secondary type="success" class="mr-2" @click="addMenu">
              <template #icon>
                <n-icon><add-box-outlined /></n-icon>
              </template>
              添加菜单
            </n-button>
            <n-button :disabled="checkedKeys.length === 0" secondary type="error" class="mr-2">
              <template #icon>
                <n-icon><delete-outline-filled /></n-icon>
              </template>
              删除菜单
            </n-button>
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
                  :virtual-scroll="true"
                  :pattern="search"
                  :data="menus"
                  :expanded-keys="expandedKeys"
                  style="max-height: 650px; overflow: hidden"
                  @update:checked-keys="onUpdateCheckedKeys"
                  @update:selected-keys="onUpdateSelectedKeys"
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
            <n-space style="line-height: 34px">
              <n-icon size="22">
                <edit-regular />
              </n-icon>
              <span>{{ isEditing ? (editingKey ? '编辑' : '添加') : '添加/编辑' }}菜单</span>
            </n-space>
          </template>
          <n-form
            v-if="isEditing"
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
                :show-path="true"
                :options="dirMenus"
                @on-update:value="onUpdateParent"
              />
            </n-form-item>
            <n-form-item label="菜单" path="type">
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
              <n-input v-model:value="menuForm.path" placeholder="请输入路径" />
            </n-form-item>
            <n-form-item label="页面组件/链接" path="data">
              <n-input v-model:value="menuForm.data" placeholder="请输入路径" />
            </n-form-item>
            <n-form-item label="图标" path="icon">
              <icon-select v-model:value="menuForm.icon" />
            </n-form-item>
            <n-form-item label="标记" path="extra">
              <n-input v-model:value="menuForm.extra" placeholder="请输入标记" />
            </n-form-item>
            <n-form-item label="是否隐藏" path="hidden">
              <n-switch v-model:value="menuForm.hidden" />
            </n-form-item>
            <n-form-item label="是否缓存" path="keepAlive">
              <n-switch v-model:value="menuForm.keepAlive" />
            </n-form-item>
            <n-form-item label="可匿名访问" path="permitAll">
              <n-switch v-model:value="menuForm.permitAll" />
            </n-form-item>
            <n-form-item path="auth" style="margin-left: 100px">
              <n-space>
                <n-button :loading="saveLoading" @click="formSubmit">保存修改</n-button>
                <n-button @click="handleReset">重置</n-button>
              </n-space>
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
import { onMounted, ref, unref } from 'vue'
import { TreeOption, TreeSelectOption, useMessage } from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import { getMenuById, getMenuList, Menu } from '@/api/base/menu'
import { MenuTree, MenuType } from '@/router/types'
import {
  AddBoxOutlined,
  DeleteOutlineFilled,
  ExpandRound,
  VerticalAlignCenterTwotone
} from '@vicons/material'
import { EditRegular } from '@vicons/fa'
import IconSelect from '@/components/menu/IconSelect.vue'

const message = useMessage()
const loading = ref(true)
const saveLoading = ref(false)
const search = ref('')
//展开菜单Keys
const expandedKeys = ref<Array<string | number>>([])
//选中菜单Keys
const checkedKeys = ref<Array<string | number>>([])
//表单校验规则
const rules = {
  label: {
    required: true,
    message: '请输入标题',
    trigger: 'blur'
  },
  path: {
    required: true,
    message: '请输入路径',
    trigger: 'blur'
  }
}
//form引用
const formRef: any = ref(null)
//菜单树
const menus = ref<Array<TreeOption>>([])
const dirMenus = ref<Array<TreeSelectOption> | undefined>([])
//是否正在编辑
const isEditing = ref(false)
// 编辑时的key，添加时为空
const editingKey = ref<string | number | undefined>(undefined)
const menuForm = ref<Menu>({})

function onUpdateCheckedKeys(keys: Array<string | number>) {
  checkedKeys.value = keys
}

async function onUpdateSelectedKeys(keys: Array<string | number>) {
  if (keys && keys[0]) {
    isEditing.value = true
    editingKey.value = keys[0]
    menuForm.value = (await getMenuById(keys[0])) as Menu
  }
}

async function handleReset() {
  if (editingKey.value) {
    menuForm.value = (await getMenuById(editingKey.value)) as Menu
  } else {
    menuForm.value = {}
  }
}

function addMenu() {
  isEditing.value = true
  editingKey.value = undefined
  menuForm.value = {}
}

function formSubmit() {
  formRef.value.validate((errors: boolean) => {
    if (!errors) {
      message.error('抱歉，您没有该权限')
    } else {
      message.error('请填写完整信息')
    }
  })
}

function packHandle() {
  if (expandedKeys.value.length) {
    expandedKeys.value = []
  } else {
    expandedKeys.value = unref(menus).map((item: any) => item.key as string) as []
  }
}

interface MenuTreeOptions extends TreeOption {
  key: string
  label: string
}

function buildTreeOptions(menuTrees: Array<MenuTree>): Array<MenuTreeOptions> {
  return menuTrees.map((item: MenuTree) => {
    return {
      key: item.id,
      label: item.title,
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

onMounted(async () => {
  const menuTrees = (await getMenuList()) as Array<MenuTree>
  menus.value = buildTreeOptions(menuTrees)
  dirMenus.value = buildDirTreeOptions(menuTrees)
  loading.value = false
})

function onUpdateExpandedKeys(keys: Array<string | number>) {
  expandedKeys.value = keys
}

function onUpdateParent(value: number) {
  menuForm.value.parentId = value
}
</script>
