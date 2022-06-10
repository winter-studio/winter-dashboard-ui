<template>
  <div class="logo">
    <img src="@/assets/images/logo.png" alt="" :class="{ 'mr-2': !collapsed }" />
    <h2 v-show="!collapsed" class="m-0">Winter Dashboard</h2>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  white-space: nowrap;

  img {
    width: auto;
    height: 32px;
  }

  .title {
    margin-bottom: 0;
  }
}
</style>
