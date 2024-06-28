<template>
  <Navigation />
  <!-- Nuxt page content -->
  <main class="nuxt-page">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import Navigation from '@/components/Navigation'
</script>
