<template>
  <NuxtPage page-key="heroku-logs" />
  <h1>Heroku Log Parsing</h1>
  <KCollapse
    v-for="(logLine, i) in herokuLogs"
    :key="String(logLine.path)"
    :model-value="i === 0 ? false : true"
    :title="`${logLine.method}  ${logLine.path}`"
    trigger-label="Show all requests"
    class="path-group"
  >
    <!-- Header row, always visible -->
    <template #visible-content>
      <RequestRow :log-line="logLine" />
    </template>

    <!-- Content hidden in KCollapse -->
    <RequestDetails :requests="logLine.requests" />

  </KCollapse>
</template>

<script setup lang="ts">
// Imports
import type { LogLine, LogLineEnhanced } from '@/types'
import RequestRow from '@/components/RequestRow.vue'
import RequestDetails from '@/components/RequestDetails.vue'
import { KCollapse } from '@kong/kongponents'

const { data: herokuLogs } = await useFetch('/api/heroku-logs')

</script>

<style lang="scss" scoped>

.path-group {
  --kui-font-family-text: 'Source Code Pro', 'Courier New', Courier, monospace;
  margin: 4px 0;
  padding: 12px;
  background: #eee;
  border-radius: 4px;

  &:deep(.collapse-title) {
    font-size: 14px !important;
    font-weight: 300 !important;
    letter-spacing: -0.5px !important;
  }
}
</style>
