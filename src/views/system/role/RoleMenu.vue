<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small">
    <template #header>
      <n-button secondary type="primary" class="mr-2" @click="save">
        <template #icon>
          <n-icon><save-outlined /></n-icon>
        </template>
        保存
      </n-button>
    </template>
    <n-tree
      block-line
      cascade
      checkable
      :virtual-scroll="true"
      :data="menus"
      default-expand-all
      :checked-keys="checkedKeys"
      @update:checked-keys="onUpdateCheckedKeys"
    />
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/store/modules/application'
import { MenuTreeOptions } from '@/types/view/menu'
import { getRoleMenus, updateRoleMenus } from '@/api/user/role'
import { SaveOutlined } from '@vicons/antd'
import { useMessage } from 'naive-ui'

interface Props {
  id: number
}

const props = defineProps<Props>()
const appStore = useAppStore()
const menus = ref<Array<MenuTreeOptions>>([])
const checkedKeys = ref<Array<number>>([])
const message = useMessage()

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

function save() {
  updateRoleMenus(props.id, checkedKeys.value).then(() => {
    message.success('保存成功')
  })
}
</script>
