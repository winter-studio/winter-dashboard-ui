<template>
  <div></div>
</template>
<script setup lang="ts">
import { useDialog, useLoadingBar, useMessage } from 'naive-ui'

window.$dialog = useDialog()
window.$loading = useLoadingBar()
window.$message = useMessage()
</script>
