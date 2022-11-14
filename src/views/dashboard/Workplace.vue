<template>
  <div>
    <div>
      <n-card :bordered="false" :title="t('views.dashboard.workplace.title')">
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
                <p class="px-4 text-xl"
                  >{{ t('views.dashboard.workplace.hello') }}，{{
                    userInfo?.username
                  }}，Welcome！</p
                >
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
import { useI18n } from 'vue-i18n'

const { userInfo } = storeToRefs(useUserStore())
const { t } = useI18n()
</script>

<style lang="scss" scoped></style>
