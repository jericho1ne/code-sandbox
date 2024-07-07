<template>
  <div v-for="(request, i) in requests" :key="i" class="request-row">
    <span class="request-status" :style="{ backgroundColor: getStatusColor(request.status)}">
      {{ request.status }}
    </span>
    <span>{{ request.path }}</span>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { LogLine } from '@/types'

defineProps({
  requests: {
    type: Array as PropType<LogLine[]>,
    required: true,
  },
})

interface StatusCodeColor {
  [statusCode: string]: string;
}

const getStatusColor = ((code: number) => {
  // 1xx - 5xx color palette
  const statusColors: StatusCodeColor = {
    '1xx': '#3399FF', // blue
    '2xx': '#33CC33', // green
    '3xx': '#FFCC33', // yellow
    '4xx': '#FF9933', // orange
    '5xx': '#FF0000' // orange
  }

  if (typeof code !== "number") {
    throw new TypeError("Input must be a number");
  }

  // Validate code range (100 - 599)
  if (code < 100 || code> 599) {
    throw new RangeError("Invalid status code. Range: 100-599");
  }

  // Calculate bucket based on first digit (hundreds place)
  const bucket = `${Math.floor(code / 100)}xx`

  return statusColors[bucket]
})

</script>

<style lang="scss" scoped>
  .request-row {
    background: #fff;
    margin-top: 8px;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 300;

    .request-status {
      border-radius: 4px;
      margin-right: 6px;
      padding: 2px 4px;
      color: white;
      font-weight: 700;
    }
  }

</style>
