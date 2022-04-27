<template>
  <v-snackbar v-model="snackbar">
    {{ message }}

    <template #action="{ attrs }">
      <v-btn color="pink" text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const snackbar = ref(true)

defineProps({
  message: { type: String, required: true }
})
</script>

<style scoped></style>
