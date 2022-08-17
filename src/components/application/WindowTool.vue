<template>
  <div></div>
</template>
<script setup lang="ts">
import { useDialog, useLoadingBar, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

window.$dialog = useDialog()
window.$loading = useLoadingBar()
window.$message = useMessage()
window.$i18n = useI18n()
</script>
