<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      permanent
      class="app-drawer"
      color="grey-lighten-5"
      elevation="3"
    />

    <v-app-bar color="primary" elevation="0" :priority="-1" class="justify-start">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-responsive max-width="48">
        <v-img :src="logo" :aspect-ratio="1" />
      </v-responsive>
      <v-app-bar-title tag="h1" v-text="title" />
      <v-spacer />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer
      inset
      max-height="36"
      class="justify-center app-footer"
      color="grey-lighten-4"
      elevation="0"
      border
    >
      <span class="mr-5">&copy; 2022 <strong v-text="title"></strong></span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import logo from '@/assets/logo.png?url'

const drawer: Ref<boolean> = ref(true)
const title = 'Winter Dashboard'
</script>

<style lang="scss">
@import 'node_modules/vuetify/lib/styles/settings';

html {
  // Fix always scrollbar shown.
  overflow-y: auto;
  // Modern scrollbar style
  scrollbar-width: thin;
  scrollbar-color: map-get($grey, 'lighten-2') map-get($grey, 'base');
}

::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.1);
  background-color: map-get($grey, 'lighten-2');
}

::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: map-get($grey, 'base');
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.1);
}

// Fixed a bug that the theme color is interrupted when scrolling
.v-application {
  height: 100vh;
  overflow-y: auto;
}

.app-drawer {
  height: calc((100% - 64px) - 36px);
  margin-bottom: 36px;
}

.app-footer {
  z-index: 1008;
}

/*
// Color scheme of scroll bar according to the theme
.theme-- {
  &light {
    scrollbar-color: map-get($grey, 'lighten-2') map-get($grey, 'base');
    ::-webkit-scrollbar-track {
      background-color: map-get($grey, 'lighten-2');
    }
  }
  &dark {
    scrollbar-color: map-get($grey, 'darken-2') map-get($grey, 'base');

    ::-webkit-scrollbar-track {
      background-color: map-get($grey, 'darken-2');
    }
  }
}
*/
</style>
