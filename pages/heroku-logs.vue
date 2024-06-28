<template>
  <NuxtPage page-key="friends" />
  <h1>Heroku Log Parsing</h1>
  <KCollapse v-for="(logLine, i) in herokuLog" :key="String(logLine.path)" class="path-group"
    :model-value="i === 0 ? false : true" :title="`${logLine.method}  ${logLine.path}`"
    trigger-label="Show all requests">
    <template #visible-content>
      <div class="path-row">
        <span class="path-row-count">{{ logLine.count }} x requests</span>
        <span class="path-row-bytes">{{ approxNum(logLine.bytesTotal / 1000), { capital: true } }}kb total</span>
        <span class="path-row-latency">Avg Latency: {{ approxNum(calcAvgLatency(logLine.requests)), { capital: true }
          }}ms</span>
      </div>
    </template>

    <!-- Content hidden in KCollapse -->
    <div v-for="(request, i) in logLine.requests" :key="i" class="request-row">
      <span class="request-status">{{ request.status }}</span>
      <span>{{ request.path }}</span>
    </div>
  </KCollapse>
</template>

<script setup lang="ts">
// Imports
import { onMounted, ref } from 'vue'
import { fetchRawLogs } from '@/utils/FetcherMethods'
import approxNum from 'approximate-number'
import type { Ref } from 'vue'
import type { LogLine, LogLineEnhanced } from '@/types'
import { KCollapse } from '@kong/kongponents'

//
const isCollapsed: Boolean = ref(false)
const herokuLog: Ref<LogLineEnhanced[]> = ref([])
const fetchData = async() => {
  const logUrl = 'https://gist.githubusercontent.com/bss/6dbc7d4d6d2860c7ecded3d21098076a/raw/244045d24337e342e35b85ec1924bca8425fce2e/sample.small.log'

  try {
    const response = await fetchRawLogs(logUrl)

    let LogStats: Map<string, LogLineEnhanced> = new Map()

    for (const line of response) {
      const logLine = parseHerokuLogLine(line)
      const path = logLine?.path || 'no_route'

      // Strip out user id
      const anonymizedPath = path.replace(/\/users\/(\d+)/, '/users/{id}')

      if (logLine) {
        const existingLogLine: LogLineEnhanced | undefined = LogStats.get(anonymizedPath)

        // If path already exists in our Map, increment the count
        // Else, it's the first time we've encountered this path
        if (existingLogLine) {
          const currCount = existingLogLine.count
          const currBytes = existingLogLine.bytesTotal || 0

          // Modify the Map object in place
          existingLogLine.count = currCount + 1
          existingLogLine.bytesTotal = currBytes + logLine.bytes
          existingLogLine.requests?.push(logLine)
        } else {
          LogStats.set(anonymizedPath, {
            path: anonymizedPath,
            method: logLine.method,   // Only needs to be set the first time around
            count: 1,
            requests: [ logLine ],
            bytesTotal: logLine.bytes,
          })
        }
      }
    }

    // do some sort of inserting based on path name as key into a Map?
    // const myMap = new Map(Object.entries(myObj));

    herokuLog.value = [...LogStats].map(([key, value]) => ({
      key,
      ...value
    }))

    console.log(herokuLog.value)

  } catch (error) {
    console.error('Failed to fetch log data:', error);
  }
}

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

const calcAvgLatency = ((requests: LogLine[]): number => {
  return requests.reduce((sum, val) => sum + val.latency, 0) / requests.length
})

onMounted(() => {
  fetchData()
})

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

  .path-row {
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    padding: 6px;
    background: #ccc;

    .path-row-count { width: 22ch; }
    .path-row-bytes { width: 20ch; }
    .path-row-latency { width: auto; }
  }

  .request-row {
    background: #fff;
    margin-top: 8px;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 300;

    .request-status {
      border: 1px solid #333;
      border-radius: 4px;
      margin-right: 6px;
      padding: 2px 4px;
    }
  }

}
</style>
