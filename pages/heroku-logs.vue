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

const parseHerokuLogLine = (line: string): LogLine | null => {
  const parts = line.split(' ')

  // Find the parts containing method and path
  const methodIndex = parts.findIndex((part) => part.startsWith('method='))
  const pathIndex = parts.findIndex((part) => part.startsWith('path='))
  const bytesIndex = parts.findIndex((part) => part.startsWith('bytes='))
  const statusIndex = parts.findIndex((part) => part.startsWith('status='))
  const connectIndex = parts.findIndex((part) => part.startsWith('connect='))

  if (methodIndex === -1 || pathIndex === -1 || bytesIndex === -1 || statusIndex === -1 || connectIndex === -1) {
    return null
  }

  const method = parts[methodIndex].split('=')[1]
  const path = parts[pathIndex].split('=')[1]
  const bytes = parts[bytesIndex].split('=')[1]
  const status = parts[statusIndex].split('=')[1]
  const connect = parts[connectIndex].split('=')[1].replace('ms', '')

  return {
    method,
    path,
    bytes: Number(bytes),
    status: Number(status),
    latency: Number(connect),
  }
}

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
