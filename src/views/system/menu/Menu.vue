<template>
  <n-grid cols="3" responsive="screen" :x-gap="12">
    <n-gi span="1">
      <menu-left
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
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { TreeSelectOption } from 'naive-ui'
import { getMenuList } from '@/api/menu'
import MenuLeft from '@/views/system/menu/MenuLeft.vue'
import MenuRight from '@/views/system/menu/MenuRight.vue'
import { MenuTreeOptions } from '@/types/view/menu'
import { buildTreeOptions, buildDirTreeOptions } from '@/utils/menu'

const loading = ref(true)

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
</script>
