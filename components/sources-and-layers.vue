<script setup lang="ts">
const stopStore = useStopStore()
const { stopsGeoJSON, loaded } = $(storeToRefs(stopStore))
</script>

<template>
  <mapbox-source
    v-if="loaded"
    source-id="stops-source"
    :source="{
      type: 'geojson',
      data: stopsGeoJSON,
    }"
  />

  <mapbox-layer
    v-if="loaded"
    :layer="{
      id: 'stops-layer',
      source: 'stops-source',
      type: 'circle',
      // layout: {
      //   visibility: 'none',
      // },
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10,
          [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            4,
            0.75,
          ],
          14,
          4,
          15,
          ['case', ['boolean', ['feature-state', 'selected'], false], 12, 6],
        ],
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#fff',
          '#f01b48',
        ],
        'circle-stroke-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#f01b48',
          '#fff',
        ],
        'circle-stroke-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          5,
          1,
        ],
        'circle-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10,
          1,
          13.9,
          1,
          14,
          0.5,
        ],
        'circle-stroke-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10,
          ['case', ['boolean', ['feature-state', 'selected'], false], 1, 0],
          13.5,
          1,
          14,
          0.5,
        ],
      },
    }"
  />
</template>
