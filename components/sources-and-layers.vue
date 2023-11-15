<script setup lang="ts">
import type { Feature, FeatureCollection } from 'geojson'

let loaded = $ref(false)
const stops = $ref<FeatureCollection>({
  type: 'FeatureCollection',
  features: [],
})
const { data: stopsCSV } = $(await useAsyncData('stops', () => queryContent('/stops').findOne()))
watchEffect(() => {
  if (stopsCSV && stopsCSV.body) {
    // @ts-expect-error has body
    stopsCSV.body.forEach((stop: Stop) => {
      const { route_id, line_name, route_name, station_index, station_id, station_name, lng, lat } = stop
      const item: Feature = {
        type: 'Feature',
        properties: {
          route_id,
          line_name,
          route_name,
          station_index,
          station_id,
          station_name,
        },
        geometry: {
          type: 'Point',
          coordinates: [Number.parseFloat(lng), Number.parseFloat(lat)],
        },
      }
      stops.features.push(item)
    })
    loaded = true
  }
})
</script>

<template>
  <mapbox-source
    v-if="loaded"
    source-id="stops-source"
    :source="{
      type: 'geojson',
      data: stops,
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
