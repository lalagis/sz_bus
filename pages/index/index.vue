<script setup lang="ts">
const config = useConfigStore()
</script>

<template>
  <div class="w-screen h-screen m-0 relative">
    <mapbox-map
      map-id="base"
      class="absolute inset-0"
      :options="config.mapboxOptions"
    >
      <div />
    </mapbox-map>
  </div>
</template>
