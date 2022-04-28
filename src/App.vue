<template>
  <n-config-provider :theme="darkTheme">
    <router-view />
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const darkTheme = ref(false)
</script>
