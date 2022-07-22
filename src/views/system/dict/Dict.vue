<template>
  <n-grid cols="10" responsive="screen" :x-gap="12">
    <n-gi span="4">
      <dict-list :data="data" :loading="loading" @edit="onEdit" @after-change="load" />
    </n-gi>
    <n-gi span="6">
      <dict-form v-model="editingKey" @after-change="load" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TreeSelectOption } from 'naive-ui'
import DictList from '@/views/system/dict/DictList.vue'
import { getDicts } from '@/api/basis/dict'
import DictForm from '@/views/system/dict/DictForm.vue'

const data = ref<Array<TreeSelectOption>>([])
const loading = ref(false)

const editingKey = ref<string | undefined | null>(undefined)

function load() {
  loading.value = true
  getDicts()
    .then((res) => {
      data.value = res.data!.map((item) => {
        return {
          key: item.code,
          name: item.name
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

function onEdit(keys: Array<string> | null) {
  editingKey.value = keys ? keys[0] : null
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
