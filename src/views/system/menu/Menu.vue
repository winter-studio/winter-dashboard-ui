<template>
  <div>
    <n-grid cols="3" responsive="screen" :x-gap="12">
      <n-gi span="1">
        <menu-left
          v-model:checked="checkedKeys"
          :menus="menus"
          :loading="loading"
          @after-change="loadMenuTree"
          @edit-menu="editMenuConfirm"
        />
      </n-gi>
      <n-gi span="2">
        <menu-right
          v-model:modified="isModified"
          v-model:editing-key="editingKey"
          :menus="menus"
          @after-change="loadMenuTree"
        />
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { TreeSelectOption, useDialog } from 'naive-ui'
import { getMenuById, getMenuList } from '@/api/basis/menu'
import { MenuType, MenuTree } from '@/router/types'
import MenuLeft from '@/views/system/menu/MenuLeft.vue'
import MenuRight from '@/views/system/menu/MenuRight.vue'

import { clone } from 'lodash-es'
import { MenuTreeOptions } from '@/views/system/menu/types'
const dialog = useDialog()
const loading = ref(true)

//选中菜单Keys
const checkedKeys = ref<Array<number>>([])

const initForm = { type: 1, title: '', path: '' }
//菜单树
const menus = ref<Array<MenuTreeOptions>>([])
const dirMenus = ref<Array<TreeSelectOption> | undefined>([])

const editingKey = ref<number | undefined>(undefined)

const isModified = ref(false)

onMounted(async () => {
  loadMenuTree()
})

function editMenuConfirm(keys: Array<number> | undefined) {
  if (keys && keys.length === 0) {
    menuForm.value = undefined
    editMenuCache.value = undefined
    return
  }
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

async function editMenu(keys: Array<number> | undefined) {
  if (keys && keys[0]) {
    editingKey.value = keys[0]
    const { data } = await getMenuById(keys[0])
    menuForm.value = data
    editMenuCache.value = clone(data)
  } else {
    editingKey.value = undefined
    menuForm.value = clone(initForm)
    editMenuCache.value = clone(initForm)
  }
  formRef.value?.restoreValidation()
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
  loading.value = true
  try {
    const { data: menuTrees } = await getMenuList()
    menus.value = buildTreeOptions(menuTrees!)
    dirMenus.value = buildDirTreeOptions(menuTrees!)
  } finally {
    loading.value = false
  }
}
</script>
