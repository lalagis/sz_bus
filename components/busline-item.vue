<script setup lang="ts">
const props = defineProps<{ busline: Busline }>()
const name = $ref(props.busline.line_name)
const from = $ref(props.busline.first_station)
const to = $ref(props.busline.last_station)
</script>

<template>
  <div class="px-10 flex flex-row items-center font-500 text-[#94968D]">
    <!-- tag -->
    <div class="bg-emerald bg-opacity-50 rounded-md p-1 mr-5 text-[#3B6727]">
      <p>{{ name }}</p>
    </div>

    <p>{{ from }}</p>
    <p>-></p>
    <p>{{ to }}</p>
  </div>
</template>
