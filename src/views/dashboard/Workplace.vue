<template>
  <div>
    <div>
      <n-card :bordered="false" title="工作台">
        <n-grid cols="2 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen">
          <n-gi>
            <div class="flex items-center">
              <div>
                <n-avatar
                  circle
                  :size="64"
                  src="https://awss3.iamkyun.com:8443/profile/default_user_profile.svg"
                />
              </div>
              <div>
                <p class="px-4 text-xl">早安，{{ userInfo?.username }}，开始您一天的工作吧！</p>
                <p class="px-4 text-gray-400">今日阴转大雨，15℃ - 25℃，出门记得带伞哦。</p>
              </div>
            </div>
          </n-gi>
        </n-grid>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'

const { userInfo } = storeToRefs(useUserStore())
</script>

<style lang="scss" scoped></style>
