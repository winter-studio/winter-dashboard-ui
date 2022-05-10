<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <dialog-content />
      <n-notification-provider>
        <n-message-provider>
          <message-content />
          <slot></slot>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NLoadingBarProvider
} from 'naive-ui'
import { MessageContent } from '@/components/MessageContent'
import { DialogContent } from '@/components/DialogContent'

export default defineComponent({
  name: 'AppProvider',
  components: {
    NDialogProvider,
    NNotificationProvider,
    NMessageProvider,
    NLoadingBarProvider,
    MessageContent,
    DialogContent
  },
  setup() {
    return {}
  }
})
</script>
