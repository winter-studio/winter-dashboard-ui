<template>
  <n-card title="搜索条件" class="mb-4">
    <template #header-extra>
      <div>
        <n-button type="primary" class="mr-4" @click="search"> 查询 </n-button>
        <n-button type="default" @click="reset"> 重置 </n-button>
      </div>
    </template>
    <n-form ref="formRef" :model="searchForm" label-placement="left" :label-width="80">
      <n-grid :cols="24" :x-gap="24" :collapsed-rows="2" :collapsed="collapsed">
        <n-form-item-gi
          v-for="(item, index) in searchItems"
          :key="index"
          :span="8"
          :label="item.label"
          :path="item.path"
        >
          <n-input v-model:value="searchForm[item.path]" :placeholder="item.placeholder" />
        </n-form-item-gi>
        <n-gi :span="24" suffix #="{ overflow }">
          <n-divider v-if="overflow" class="more-condition">
            <n-button text @click="collapsed = false">
              <template #icon>
                <n-icon><angle-double-down /></n-icon>
              </template>
              更多条件
            </n-button>
          </n-divider>
          <n-divider v-if="!collapsed" class="more-condition">
            <n-button text @click="collapsed = true">
              <template #icon>
                <n-icon><angle-double-up /></n-icon>
              </template>
              收起条件
            </n-button>
          </n-divider>
        </n-gi>
      </n-grid>
    </n-form>
  </n-card>
  <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="true" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AngleDoubleDown, AngleDoubleUp } from '@vicons/fa'
import { DataTableColumns } from 'naive-ui'
import { RowData } from 'naive-ui/es/data-table/src/interface'
import { SearchItem, SearchOptions } from '@/types/component/table'
import { clone } from 'lodash-es'

interface Props {
  columns: DataTableColumns
  data: RowData[]
  searchItems: SearchItem[]
  page?: number
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), { page: 1, pageSize: 10 })
const emits = defineEmits<{
  (e: 'search', search: SearchOptions): void
}>()

const searchForm = ref<any>({})
const collapsed = ref(true)

const pagination = ref({
  page: props.page,
  pageSize: props.pageSize,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    pagination.value.page = page
    search()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    search()
  }
})

onMounted(() => {
  search()
})

function reset() {
  for (const argumentsKey in searchForm.value) {
    searchForm.value[argumentsKey] = ''
  }
}

function search() {
  emits('search', {
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
    search: clone(searchForm.value)
  })
}
</script>

<style scoped></style>
