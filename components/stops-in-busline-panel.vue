<script setup lang="ts">
const buslineStore = useBuslineStore()
const { relatedStopsGeoJSON } = $(storeToRefs(buslineStore))
const stops = $computed(() => relatedStopsGeoJSON?.features.map(feature => feature.properties as Stop) ?? [])
</script>

<template>
  <div v-if="stops && stops.length" id="container">
    <div
      v-for="(item, index) in stops"
      :key="index"
    >
      <p>{{ item.station_name }}</p>
    </div>
  </div>
</template>

<style scoped>
#container {
  position: fixed;
  background: white;
  padding: 20px;
  bottom: 20px;
  left: 20px;
  border-radius: 10px;
}
</style>
