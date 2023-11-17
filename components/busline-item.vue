<script setup lang="ts">
const props = defineProps<{ busline: Busline }>()
const name = $computed(() => props.busline.line_name)
const from = $computed(() => props.busline.first_station)
const to = $computed(() => props.busline.last_station)
</script>

<template>
  <div class="flex flex-row items-center justify-between text-sm w-full text-center cursor-pointer hover:scale-105 transition-all duration-300">
    <!-- tag -->
    <div class="bg-emerald-100 rounded-l-md py-1 px-2 text-emerald whitespace-nowrap">
      <p>{{ name }}</p>
    </div>
    <div class="bg-lime-100 p-1 text-gray whitespace-nowrap flex-1 max-w-[110px] truncate">
      <p>{{ from }}</p>
    </div>
    <div class="bg-orange-100 p-1 text-gray">
      <p>→</p>
    </div>
    <div class="bg-teal-100 p-1 text-gray rounded-r-md whitespace-nowrap flex-1 max-w-[110px] truncate">
      <p>{{ to }}</p>
    </div>
  </div>
</template>
