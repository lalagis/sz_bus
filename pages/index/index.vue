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
      <sources-and-layers />
    </mapbox-map>
    <select-panel />
    <stops-in-busline-panel />
  </div>
</template>
