<template>
  <div>
    <n-grid class="mt-4" cols="3" responsive="screen" :x-gap="12">
      <n-gi span="1">
        <n-card :segmented="{ content: 'hard' }" :bordered="false" size="small">
          <div class="w-full">
            <div class="flex">
              <n-input v-model:value="pattern" type="input" placeholder="输入菜单名称搜索">
                <template #suffix>
                  <n-icon size="18" class="cursor-pointer">
                    <search-outlined />
                  </n-icon>
                </template>
              </n-input>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button quaternary circle class="ml-2" @click="packHandle">
                    <template #icon>
                      <n-icon v-if="expandedKeys.length"><vertical-align-center-twotone /></n-icon>
                      <n-icon v-else><expand-round /></n-icon>
                    </template>
                  </n-button>
                </template>
                全部{{ expandedKeys.length ? '收起' : '展开' }}
              </n-tooltip>
            </div>
            <div class="py-3 menu-list">
              <template v-if="loading">
                <div class="flex items-center justify-center py-4">
                  <n-spin size="medium" />
                </div>
              </template>
              <template v-else>
                <n-tree
                  block-line
                  cascade
                  checkable
                  :virtual-scroll="true"
                  :pattern="pattern"
                  :data="treeData"
                  :expanded-keys="expandedKeys"
                  style="max-height: 650px; overflow: hidden"
                  @update:selected-keys="selectedTree"
                  @update:expanded-keys="onExpandedKeys"
                />
              </template>
            </div>
          </div>
        </n-card>
      </n-gi>
      <n-gi span="2">
        <n-card :segmented="{ content: 'hard' }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-icon size="18">
                <form-outlined />
              </n-icon>
              <span>编辑菜单{{ treeItemTitle ? `：${treeItemTitle}` : '' }}</span>
            </n-space>
          </template>
          <n-alert type="info" closable> 从菜单列表选择一项后，进行编辑</n-alert>
          <n-form
            v-if="isEditMenu"
            ref="formRef"
            :model="formParams"
            :rules="rules"
            label-placement="left"
            :label-width="100"
            class="py-4"
          >
            <n-form-item label="类型" path="type">
              <span>{{ formParams.type === 1 ? '侧边栏菜单' : '' }}</span>
            </n-form-item>
            <n-form-item label="标题" path="label">
              <n-input v-model:value="formParams.label" placeholder="请输入标题" />
            </n-form-item>
            <n-form-item label="副标题" path="subtitle">
              <n-input v-model:value="formParams.subtitle" placeholder="请输入副标题" />
            </n-form-item>
            <n-form-item label="路径" path="path">
              <n-input v-model:value="formParams.path" placeholder="请输入路径" />
            </n-form-item>
            <n-form-item label="打开方式" path="openType">
              <n-radio-group v-model:value="formParams.openType" name="openType">
                <n-space>
                  <n-radio :value="1">当前窗口</n-radio>
                  <n-radio :value="2">新窗口</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="菜单权限" path="auth">
              <n-input v-model:value="formParams.auth" placeholder="请输入权限，多个权限用，分割" />
            </n-form-item>
            <n-form-item path="auth" style="margin-left: 100px">
              <n-space>
                <n-button type="primary" :loading="subLoading" @click="formSubmit"
                  >保存修改</n-button
                >
                <n-button @click="handleReset">重置</n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>
      </n-gi>
    </n-grid>
    <create-drawer ref="createDrawerRef" :title="drawerTitle" />
  </div>
</template>
<script lang="ts" setup>
import { ref, unref, reactive, onMounted, computed } from 'vue'
import { TreeOption, useMessage } from 'naive-ui'
import { SearchOutlined, FormOutlined } from '@vicons/antd'
import { getMenuList } from '@/api/system/menu'
import CreateDrawer from './CreateDrawer.vue'
import { MenuTree } from '@/router/types'
import { ExpandRound, VerticalAlignCenterTwotone } from '@vicons/material'
const rules = {
  label: {
    required: true,
    message: '请输入标题',
    trigger: 'blur'
  },
  path: {
    required: true,
    message: '请输入路径',
    trigger: 'blur'
  }
}

const formRef: any = ref(null)
const createDrawerRef = ref()
const message = useMessage()

let treeItemKey = ref([])

let expandedKeys = ref<Array<string | number>>([])

const treeData = ref<Array<TreeOption>>([])

const loading = ref(true)
const subLoading = ref(false)
const isEditMenu = ref(false)
const treeItemTitle = ref('')
const pattern = ref('')
const drawerTitle = ref('')

const isAddSon = computed(() => {
  return !treeItemKey.value.length
})

const addMenuOptions = ref([
  {
    label: '添加顶级菜单',
    key: 'home',
    disabled: false
  },
  {
    label: '添加子菜单',
    key: 'son',
    disabled: isAddSon
  }
])

const formParams = reactive({
  type: 1,
  label: '',
  subtitle: '',
  path: '',
  auth: '',
  openType: 1
})

function selectAddMenu(key: string) {
  drawerTitle.value = key === 'home' ? '添加顶栏菜单' : `添加子菜单：${treeItemTitle.value}`
  openCreateDrawer()
}

function openCreateDrawer() {
  const { openDrawer } = createDrawerRef.value
  openDrawer()
}

function selectedTree(keys) {
  //TODO query menu from database
  /*if (keys.length) {
    const treeItem = getTreeItem(unref<TreeOption[]>(treeData), keys[0])
    treeItemKey.value = keys
    treeItemTitle.value = treeItem.label
    Object.assign(formParams, treeItem)
    isEditMenu.value = true
  } else {
    isEditMenu.value = false
    treeItemKey.value = []
    treeItemTitle.value = ''
  }*/
}

function handleReset() {
  //TODO query menu from database
  // const treeItem = getTreeItem(unref<TreeOption[]>(treeData), treeItemKey.value[0])
  // Object.assign(formParams, treeItem)
}

function formSubmit() {
  formRef.value.validate((errors: boolean) => {
    if (!errors) {
      message.error('抱歉，您没有该权限')
    } else {
      message.error('请填写完整信息')
    }
  })
}

function packHandle() {
  if (expandedKeys.value.length) {
    expandedKeys.value = []
  } else {
    expandedKeys.value = unref(treeData).map((item: any) => item.key as string) as []
  }
}

interface MenuTreeOptions extends TreeOption {
  key: string
  label: string
}

function buildTreeOptions(menuTrees: Array<MenuTree>): MenuTreeOptions[] {
  return menuTrees.map((item: MenuTree) => {
    return {
      key: item.id,
      label: item.title,
      children: item.children ? buildTreeOptions(item.children) : undefined
    }
  })
}

onMounted(async () => {
  const menuTrees = (await getMenuList()) as Array<MenuTree>
  treeData.value = buildTreeOptions(menuTrees)
  loading.value = false
})

function onExpandedKeys(keys: Array<string | number>) {
  console.log(keys)
  expandedKeys.value = keys
}
</script>
