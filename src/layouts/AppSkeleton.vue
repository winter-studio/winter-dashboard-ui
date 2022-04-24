<template>
  <el-container direction="vertical" style="height: 100%">
    <app-header />
    <el-container style="height: 100%">
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import AppHeader from '@/components/app/AppHeader.vue'
</script>

<style scoped lang="scss"></style>
