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
          v-model="editingKey"
          :menus="menus"
          :dir-menus="dirMenus"
          @after-change="loadMenuTree"
        />
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { TreeSelectOption } from 'naive-ui'
import { getMenuList } from '@/api/basis/menu'
import { MenuType, MenuTree } from '@/router/types'
import MenuLeft from '@/views/system/menu/MenuLeft.vue'
import MenuRight from '@/views/system/menu/MenuRight.vue'
import { MenuTreeOptions } from '@/views/system/menu/types'

const loading = ref(true)

//选中菜单Keys
const checkedKeys = ref<Array<number>>([])
//菜单树
const menus = ref<Array<MenuTreeOptions>>([])
//菜单目录树
const dirMenus = ref<Array<TreeSelectOption> | undefined>([])
//正在编辑的菜单
const editingKey = ref<number | undefined>(undefined)

onMounted(() => {
  loadMenuTree()
})

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

/**
 *点击编辑菜单
 **/
function editMenuConfirm(keys: Array<number> | undefined) {
  editingKey.value = keys?.[0]
}

/**
 * 构建菜单树
 */
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

/**
 * 构建菜单目录树
 */
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
</script>
