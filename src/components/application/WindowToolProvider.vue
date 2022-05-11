<template>
  <app-provider>
    <message-content></message-content>
    <dialog-content></dialog-content>
    <loading-content></loading-content>
  </app-provider>
</template>

<script setup lang="ts">
import { AppProvider } from './index'
import { MessageContent } from '@/components/MessageContent'
import { DialogContent } from '@/components/DialogContent'
import { LoadingContent } from '@/components/LoadingContent'
</script>

<style scoped></style>
