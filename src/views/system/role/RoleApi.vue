<template>
  <n-card :segmented="{ content: true }" :bordered="false" size="small">
    <template #header>
      <n-button secondary type="primary" class="mr-2" @click="save">
        <template #icon>
          <n-icon><save-outlined /></n-icon>
        </template>
        {{ t('general.save') }}
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
      :render-label="renderLabel"
      @update:checked-keys="onUpdateCheckedKeys"
    />
  </n-card>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue'
import { MenuTreeOptions } from '@/types/view/menu'
import { updateRoleMenus } from '@/api/role'
import { SaveOutlined } from '@vicons/antd'
import { TreeOption, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { getApis } from '@/api/api'

interface Props {
  id: number
}

const props = defineProps<Props>()
const menus = ref<Array<MenuTreeOptions>>([])
const checkedKeys = ref<Array<number>>([])
const message = useMessage()
const { t } = useI18n()

onMounted(() => {
  getApis()
})

function onUpdateCheckedKeys(keys: Array<number>) {
  checkedKeys.value = keys
}

function save() {
  updateRoleMenus(props.id, checkedKeys.value).then(() => {
    message.success('保存成功')
  })
}

function renderLabel(item: { option: TreeOption; checked: boolean; selected: boolean }) {
  return <div>{t(item.option.label ?? '')}</div>
}
</script>
