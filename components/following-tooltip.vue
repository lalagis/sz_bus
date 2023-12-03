<!-- 利用left和top来实现偏移量offset -->
<script setup lang="ts">
defineProps<{
  show: boolean
  text: string
  offset?: [number, number]
}>()
</script>

<template>
  <div
    v-if="show"
    v-auto-animate
    class="fixed z-10 px-2 py-1 bg-white bg-opacity-70 shadow-md text-gray-900 rounded-md transition-all duration-300 whitespace-nowrap text-sm"
    :style="{ left: `${offset?.[0] ?? +10 - 10}px`, top: `${offset?.[1] ?? -20 + 20}px` }"
  >
    <p class="text-[#f01b48] bg-[#f01b4822] rounded-sm p-1 text-sm inline-block">
      {{ text }}
    </p>
  </div>
</template>
