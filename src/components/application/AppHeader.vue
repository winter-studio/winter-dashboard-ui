<template>
  <n-page-header>
    <template #title>
      <n-gradient-text
        :gradient="{
          deg: 180,
          from: 'rgb(85, 85, 85)',
          to: 'rgb(170, 170, 170)'
        }"
        class="text-xl font-bold"
        >Winter Dashboard</n-gradient-text
      >
    </template>
    <template #avatar>
      <app-logo />
    </template>
    <template #extra>
      <n-space>
        <n-breadcrumb>
          <n-breadcrumb-item>播客</n-breadcrumb-item>
          <n-breadcrumb-item>精选</n-breadcrumb-item>
          <n-breadcrumb-item>超级精选</n-breadcrumb-item>
          <n-breadcrumb-item>Anyway.FM</n-breadcrumb-item>
        </n-breadcrumb>
      </n-space>
      <n-space>
        <n-button>催更</n-button>
        <n-dropdown :options="options" placement="bottom-start">
          <n-button :bordered="false" style="padding: 0 4px"> ··· </n-button>
        </n-dropdown>
      </n-space>
    </template>
    <template #footer> 截止到 2021 年 4 月 3 日 </template>
  </n-page-header>
</template>

<script setup lang="ts">
import AppLogo from '@/components/application/AppLogo.vue'

const options = [
  {
    label: '催更',
    key: '1'
  },
  {
    label: '催更',
    key: '2'
  },
  {
    label: '催更',
    key: '3'
  }
]
</script>
