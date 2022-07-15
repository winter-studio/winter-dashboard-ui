<template>
  <n-tree
    block-line
    checkable
    :virtual-scroll="true"
    :data="menus"
    default-expand-all
    :checked-keys="checkedKeys"
    @update:checked-keys="onUpdateCheckedKeys"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/store/modules/application'
import { MenuTreeOptions } from '@/types/view/menu'
import { getRoleMenus } from '@/api/user/role'

interface Props {
  id: number
}

const props = defineProps<Props>()
const appStore = useAppStore()
const menus = ref<Array<MenuTreeOptions>>([])
const checkedKeys = ref<Array<number>>([])

onMounted(() => {
  // 根据角色ID查询菜单权限
  getRoleMenus(props.id).then((res) => {
    checkedKeys.value = res.data!
  })
  appStore.getMenuTreeOptions.then((res) => {
    menus.value = res
  })
})

function onUpdateCheckedKeys(keys: Array<number>) {
  checkedKeys.value = keys
}
</script>
