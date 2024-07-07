<template>
  <div class="path-row">
    <span class="path-row-count">{{ logLine.count }} x requests</span>
    <span class="path-row-bytes">{{ approxNum(logLine.bytesTotal / 1000), { capital: true } }}kb total</span>
    <span class="path-row-latency">Avg Latency: {{ approxNum(calcAvgLatency(logLine.requests)), { capital: true }
      }}ms</span>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import approxNum from 'approximate-number'
import type { LogLine, LogLineEnhanced } from '@/types'

const props = defineProps({
  logLine: {
    type: Object as PropType<LogLineEnhanced>,
    required: true,
  },
})

const calcAvgLatency = ((requests: LogLine[]): number => {
  return requests.reduce((sum, val) => sum + val.latency, 0) / requests.length
})

</script>

<style lang="scss" scoped>
.path-row {
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  padding: 6px;
  background: #ccc;

  .path-row-count {
    width: 22ch;
  }

  .path-row-bytes {
    width: 20ch;
  }

  .path-row-latency {
    width: auto;
  }
}

</style>
