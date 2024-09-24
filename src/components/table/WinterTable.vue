<template>
  <div class="winter-table">
    <n-card v-if="searchEnabled" class="search" :title="t('components.table.winterTable.criteria')">
      <template #header-extra>
        <div>
          <n-button type="primary" class="mr-4" @click="search">
            {{ t('components.table.winterTable.search') }}
          </n-button>
          <n-button type="default" @click="reset">
            {{ t('components.table.winterTable.reset') }}
          </n-button>
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
            :label-width="item.labelWidth"
            :label="t(item.label)"
            :path="item.path"
          >
            <n-input
              v-if="!item.type || item.type === 'input'"
              v-model:value="searchForm[item.path]"
              :placeholder="t(item.placeholder ?? '')"
            />
            <n-select
              v-if="item.type === 'select'"
              v-model:value="searchForm[item.path]"
              :options="getItemOptions(item.options)"
              clearable
            />
            <n-date-picker
              v-if="item.type === 'daterange'"
              v-model:formatted-value="searchForm[item.path]"
              class="w-full"
              type="daterange"
              value-format="yyyy-MM-dd"
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
            {{ t('components.table.winterTable.moreCriteria') }}
          </n-button>
        </n-divider>
        <n-divider v-else class="more-condition">
          <n-button text @click="toggleCollapsed">
            <template #icon>
              <n-icon><angle-double-up /></n-icon>
            </template>
            {{ t('components.table.winterTable.lessCriteria') }}
          </n-button>
        </n-divider>
      </div>
    </n-card>
    <div class="action mt-3 mb-2">
      <slot name="table-header"></slot>
    </div>
    <n-data-table
      class="data"
      :flex-height="flexHeight"
      :scroll-x="scrollX"
      :columns="columns"
      :data="pageData?.list ?? []"
      :row-key="rowKey"
      :pagination="paginationEnabled ? pagination : false"
      :bordered="true"
      :remote="true"
      @update:checked-row-keys="handleCheck"
    />
  </div>
</template>

<script setup lang="tsx">
import { nextTick, onMounted, ref, watch } from 'vue'
import { AngleDoubleDown, AngleDoubleUp } from '@vicons/fa'
import { DataTableColumns, NButton, DataTableRowKey, PaginationInfo } from 'naive-ui'
import { CreateRowKey } from 'naive-ui/es/data-table/src/interface'
import { SearchItem, SearchItemOptions, SearchOptions } from '@/types/component/table'
import { clone } from 'lodash-es'
import { DictCode, useDictStore } from '@/store/modules/dict'
import { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import { PageRes } from '@/types/component/request'
import { PaginationProps } from 'naive-ui/es/pagination'
import { useI18n } from 'vue-i18n'

interface Props {
  columns: DataTableColumns<any>
  pageData?: PageRes<any>
  searchLabelWidth?: string | number
  searchItems: SearchItem[]
  initSearch?: boolean
  paginationEnabled?: boolean
  searchEnabled?: boolean
  selection?: boolean
  rowKey?: CreateRowKey<any>
  scrollX?: number
  flexHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchLabelWidth: 'auto',
  initSearch: true,
  paginationEnabled: true,
  searchEnabled: true,
  selection: false,
  rowKey: undefined,
  flexHeight: false,
  pageData: undefined,
  scrollX: undefined
})
const emits = defineEmits<{
  (e: 'search', search: SearchOptions<any>): void
  (e: 'update:checked-row-keys', rowKeys: DataTableRowKey[]): void
}>()

const searchForm = ref<any>({})
const collapsed = ref(true)
const searchGridHeight = ref('100%')
const dictStore = useDictStore()
const { t } = useI18n()

const pagination = ref<PaginationProps>({
  page: 0,
  pageSize: 10,
  pageCount: 0,
  itemCount: 0,
  prefix: (info: PaginationInfo) => (
    <div>{t('components.table.winterTable.count', { count: info.itemCount })}</div>
  ),
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

watch(
  () => props.pageData,
  (cb) => {
    if (cb) {
      pagination.value.pageCount = cb.pages
      pagination.value.itemCount = cb.total
      pagination.value.page = cb.page
      pagination.value.pageSize = cb.size
    }
  },
  { immediate: true }
)

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
  // date iso
  const search = clone(searchForm.value)
  emits('search', {
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
    ...search
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
.winter-table {
  display: flex;
  flex-direction: column;
  height: 100%;

  .search {
    flex: 0;

    .search-grid {
      transition: height 0.2s linear;
      height: v-bind(searchGridHeight);
      overflow: hidden;
    }

    .more-condition {
      margin: 0;
    }
  }

  .action {
    flex: 0;
  }

  .data {
    flex: 1;
  }
}
</style>
