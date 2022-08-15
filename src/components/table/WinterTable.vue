<template>
  <div>
    <n-card v-if="searchEnabled" title="搜索条件">
      <template #header-extra>
        <div>
          <n-button type="primary" class="mr-4" @click="search"> 查询 </n-button>
          <n-button type="default" @click="reset"> 重置 </n-button>
        </div>
      </template>
      <n-form
        ref="formRef"
        :model="searchForm"
        label-placement="left"
        :label-width="searchLabelWidth"
        class="search-grid"
        :style="{ height: searchGridHeight }"
      >
        <n-grid id="height-probe" :cols="24" :x-gap="24" :collapsed-rows="1" :collapsed="collapsed">
          <n-form-item-gi
            v-for="(item, index) in searchItems"
            :key="index"
            :span="item.span ? item.span : 8"
            :label="item.label"
            :path="item.path"
          >
            <n-input
              v-if="!item.type || item.type === 'input'"
              v-model:value="searchForm[item.path]"
              :placeholder="item.placeholder"
            />
            <n-select
              v-if="item.type === 'select'"
              v-model:value="searchForm[item.path]"
              :options="getItemOptions(item.options)"
              clearable
            />
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <div v-if="searchItems.length > 3">
        <n-divider v-if="collapsed" class="more-condition">
          <n-button text @click="toggleCollapsed">
            <template #icon>
              <n-icon><angle-double-down /></n-icon>
            </template>
            更多条件
          </n-button>
        </n-divider>
        <n-divider v-else class="more-condition">
          <n-button text @click="toggleCollapsed">
            <template #icon>
              <n-icon><angle-double-up /></n-icon>
            </template>
            收起条件
          </n-button>
        </n-divider>
      </div>
    </n-card>
    <div class="mt-3 mb-2">
      <slot name="table-header"></slot>
    </div>
    <n-data-table
      :columns="columns"
      :data="data"
      :row-key="rowKey"
      :pagination="paginationEnabled ? pagination : false"
      :bordered="true"
      @update:checked-row-keys="handleCheck"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { AngleDoubleDown, AngleDoubleUp } from '@vicons/fa'
import { DataTableColumns, NButton, DataTableRowKey } from 'naive-ui'
import { CreateRowKey, RowData } from 'naive-ui/es/data-table/src/interface'
import { SearchItem, SearchItemOptions, SearchOptions } from '@/types/component/table'
import { clone } from 'lodash-es'
import { DictCode, useDictStore } from '@/store/modules/dict'
import { SelectMixedOption } from 'naive-ui/es/select/src/interface'

interface Props {
  columns: DataTableColumns<any>
  data: RowData[]
  searchLabelWidth?: string | number
  searchItems: SearchItem[]
  page?: number
  pageSize?: number
  initSearch?: boolean
  paginationEnabled?: boolean
  searchEnabled?: boolean
  selection?: boolean
  rowKey?: CreateRowKey<any>
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  pageSize: 10,
  searchLabelWidth: 'auto',
  initSearch: true,
  paginationEnabled: true,
  searchEnabled: true,
  selection: false,
  rowKey: undefined
})
const emits = defineEmits<{
  (e: 'search', search: SearchOptions<any>): void
  (e: 'update:checked-row-keys', rowKeys: DataTableRowKey[]): void
}>()

const searchForm = ref<any>({})
const collapsed = ref(true)
const searchGridHeight = ref('100%')

const dictStore = useDictStore()

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
  const probe = document.getElementById('height-probe')
  const offsetHeight = probe!.offsetHeight
  searchGridHeight.value = `${offsetHeight}px`

  if (props.initSearch) {
    search()
  }

  const dictCodes: DictCode[] = []
  for (const item of props.searchItems) {
    if (item.type === 'select' && typeof item.options === 'string') {
      dictCodes.push(item.options)
    }
  }
  if (dictCodes.length > 0) {
    dictStore.use(...dictCodes)
  }
})

function getItemOptions(options?: SearchItemOptions): SelectMixedOption[] {
  if (!options) {
    return []
  }
  if (typeof options === 'string') {
    return dictStore.getDictItems(options).map((item) => ({
      label: item.value,
      value: item.key
    }))
  } else {
    return options
  }
}

function reset() {
  for (const argumentsKey in searchForm.value) {
    searchForm.value[argumentsKey] = ''
  }
}

function search() {
  emits('search', {
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
    ...clone(searchForm.value)
  })
}

function handleCheck(rowKeys: DataTableRowKey[]) {
  emits('update:checked-row-keys', rowKeys)
}

async function toggleCollapsed() {
  collapsed.value = !collapsed.value
  await nextTick()
  const probe = document.getElementById('height-probe')
  const offsetHeight = probe!.offsetHeight
  searchGridHeight.value = `${offsetHeight}px`
}
</script>

<style scoped lang="scss">
.search-grid {
  transition: height 0.2s linear;
  height: v-bind(searchGridHeight);
  overflow: hidden;
}

.more-condition {
  margin: 0;
}
</style>
