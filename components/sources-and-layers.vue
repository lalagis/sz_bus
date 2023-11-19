<script setup lang="ts">
const stopStore = useStopStore()
const { stopsGeoJSON, selectedStopGeoJSON, loaded: stopsLoaded } = $(storeToRefs(stopStore))

const buslineStore = useBuslineStore()
const { selectedBuslineGeoJSON } = $(storeToRefs(buslineStore))
</script>

<template>
  <mapbox-source
    v-if="stopsLoaded"
    source-id="stops-source"
    :source="{
      type: 'geojson',
      data: stopsGeoJSON,
    }"
  />

  <mapbox-source
    v-if="selectedStopGeoJSON"
    source-id="selected-stop-source"
    :source="{
      type: 'geojson',
      data: selectedStopGeoJSON,
    }"
  />

  <mapbox-source
    v-if="selectedBuslineGeoJSON"
    source-id="selected-busline-source"
    :source="{
      type: 'geojson',
      data: selectedBuslineGeoJSON,
      lineMetrics: true,
    }"
  />

  <mapbox-layer
    v-if="selectedBuslineGeoJSON"
    :layer="{
      id: 'selected-busline-layer',
      source: 'selected-busline-source',
      type: 'line',
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#f01b48',
        'line-gradient': [
          'interpolate',
          ['linear'],
          ['line-progress'],
          0,
          '#f01b48',
          0.5,
          '#972FFE',
          1,
          '#f01b48',
        ],
        'line-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          ['boolean', ['feature-state', 'fadein'], false],
          0.07,
          0.5, // default
        ],
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          12,
          2,
          16,
          5,
          22,
          10,
        ],
      },
    }"
  />

  <mapbox-layer
    v-if="selectedStopGeoJSON"
    :layer="{
      id: 'selected-stop-layer',
      source: 'selected-stop-source',
      type: 'circle',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10,
          4,
          14,
          8,
        ],
        'circle-color': '#fff',
        'circle-stroke-color': '#f01b48',
        'circle-stroke-width': 5,
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
          1,
          13.5,
          1,
          14,
          0.5,
        ],
      },
    }"
  />

  <mapbox-layer
    v-if="stopsLoaded && !selectedStopGeoJSON && !selectedBuslineGeoJSON"
    :layer="{
      id: 'stops-layer',
      source: 'stops-source',
      type: 'circle',
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
