<template>
  <div>
    <div>
      <n-card :bordered="false" title="工作台">
        <n-grid cols="2 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen">
          <n-gi>
            <div class="flex items-center">
              <div>
                <n-avatar circle :size="64" :src="schoolboy" />
              </div>
              <div>
                <p class="px-4 text-xl">早安，{{ info?.username }}，开始您一天的工作吧！</p>
                <p class="px-4 text-gray-400">今日阴转大雨，15℃ - 25℃，出门记得带伞哦。</p>
              </div>
            </div>
          </n-gi>
          <n-gi>
            <div class="flex justify-end w-full">
              <div class="flex flex-1 flex-col justify-center text-right">
                <span class="text-secondary">项目数</span>
                <span class="text-2xl">16</span>
              </div>
              <div class="flex flex-1 flex-col justify-center text-right">
                <span class="text-secondary">待办</span>
                <span class="text-2xl">3/15</span>
              </div>
              <div class="flex flex-1 flex-col justify-center text-right">
                <span class="text-secondary">消息</span>
                <span class="text-2xl">35</span>
              </div>
            </div>
          </n-gi>
        </n-grid>
      </n-card>
    </div>
    <n-grid class="mt-4" cols="2 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen" :x-gap="12" :y-gap="9">
      <n-gi>
        <n-card
          :segmented="{ content: 'hard' }"
          content-style="padding: 0;"
          :bordered="false"
          size="small"
          title="快捷操作"
        >
          <div class="flex flex-wrap project-card">
            <n-card size="small" class="cursor-pointer project-card-item" hoverable>
              <div class="flex flex-col justify-center text-gray-500">
                <span class="text-center">
                  <n-icon size="30" color="#68c755">
                    <dashboard-outlined />
                  </n-icon>
                </span>
                <span class="text-lx text-center">主控台</span>
              </div>
            </n-card>
            <n-card size="small" class="cursor-pointer project-card-item" hoverable>
              <div class="flex flex-col justify-center text-gray-500">
                <span class="text-center">
                  <n-icon size="30" color="#fab251">
                    <profile-outlined />
                  </n-icon>
                </span>
                <span class="text-lx text-center">列表</span>
              </div>
            </n-card>
            <n-card size="small" class="cursor-pointer project-card-item" hoverable>
              <div class="flex flex-col justify-center text-gray-500">
                <span class="text-center">
                  <n-icon size="30" color="#1890ff">
                    <file-protect-outlined />
                  </n-icon>
                </span>
                <span class="text-lx text-center">表单</span>
              </div>
            </n-card>
            <n-card size="small" class="cursor-pointer project-card-item" hoverable>
              <div class="flex flex-col justify-center text-gray-500">
                <span class="text-center">
                  <n-icon size="30" color="#f06b96">
                    <apartment-outlined />
                  </n-icon>
                </span>
                <span class="text-lx text-center">权限管理</span>
              </div>
            </n-card>
            <n-card size="small" class="cursor-pointer project-card-item" hoverable>
              <div class="flex flex-col justify-center text-gray-500">
                <span class="text-center">
                  <n-icon size="30" color="#7238d1">
                    <setting-outlined />
                  </n-icon>
                </span>
                <span class="text-lx text-center">系统管理</span>
              </div>
            </n-card>
            <n-card size="small" class="cursor-pointer project-card-item" hoverable>
              <div class="flex flex-col justify-center text-gray-500">
                <span class="text-center">
                  <n-icon size="30" color="">
                    <dashboard-outlined />
                  </n-icon>
                </span>
                <span class="text-lx text-center">主控台</span>
              </div>
            </n-card>
          </div>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
import schoolboy from '@/assets/images/schoolboy.png'
import {
  DashboardOutlined,
  ProfileOutlined,
  FileProtectOutlined,
  SettingOutlined,
  ApartmentOutlined
} from '@vicons/antd'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'

const { info } = storeToRefs(useUserStore())
</script>

<style lang="scss" scoped>
.project-card {
  margin-right: -6px;

  &-item {
    margin: -1px;
    width: 33.333333%;
  }
}
</style>
