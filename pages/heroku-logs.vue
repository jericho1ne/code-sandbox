<template>
  <NuxtPage page-key="friends" />
  <h1>Heroku Log Parsing</h1>
  <div v-for="logLine in herokuLog" :key="String(logLine.path)" class="path-group" truncation-tooltip>
    <KCollapse :title="`${logLine.method }  ${ logLine.path }`" trigger-label="Show requests">
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
        <span>{{ request.path }}</span>
      </div>
    </KCollapse>
  </div>
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

<style lang="scss">

.path-group {
  --kui-font-family-text: 'Source Code Pro', 'Courier New', Courier, monospace;
  margin: 4px 0;
  padding: 12px;
  background: rgba(100,200,150, 0.5);
  border-radius: 4px;

  .path-row {
    border-radius: 4px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    padding: 6px;
    background: rgba(0, 0, 0, 0.15);

    .path-row-count { width: 22ch; }

    .path-row-title {
      max-width: 54ch;
      overflow: hidden;
      margin: auto auto auto 0;
      text-overflow: ellipsis;
      border: 2px px solid;
      font-weight: 500;
      letter-spacing: -0.5px;
    }

    .path-row-bytes {
      width: 20ch;
    }

    .path-row-latency {
      width: auto;
    }
  }

  .request-row {
    background: rgba(255,255,255, 0.5);
    margin-top: 8px;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
  }

}
</style>
