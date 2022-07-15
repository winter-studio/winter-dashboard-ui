<template>
  <n-grid cols="2" responsive="screen" :x-gap="12">
    <n-gi span="1">
      <role-left :data="data" :loading="loading" @edit="onEdit" @after-change="load" />
    </n-gi>
    <n-gi span="1">
      <role-right v-model="editingKey" @after-change="load" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue'
import { getRoles } from '@/api/user/role'
import { TreeSelectOption } from 'naive-ui'
import RoleLeft from '@/views/system/role/RoleLeft.vue'
import RoleRight from '@/views/system/role/RoleRight.vue'

const data = ref<Array<TreeSelectOption>>([])
const loading = ref(false)

const editingKey = ref<number | undefined>(undefined)

function load() {
  loading.value = true
  getRoles()
    .then((res) => {
      data.value = res.data!.map((item) => {
        return {
          key: item.id,
          name: item.name,
          code: item.code
        }
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  load()
})

function onEdit(keys?: Array<number>) {
  editingKey.value = keys?.[0]
}
</script>

<style lang="scss">
.n-tree.n-tree--block-line .n-tree-node:not(.n-tree-node--disabled) {
  & .action-btn {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover .action-btn {
    opacity: 1;
  }
}
</style>
