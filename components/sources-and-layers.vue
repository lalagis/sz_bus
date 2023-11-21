<script setup lang="ts">
const stopStore = useStopStore()
const { stopsGeoJSON, selectedStopGeoJSON, loaded: stopsLoaded } = $(storeToRefs(stopStore))

const buslineStore = useBuslineStore()
const { selectedBuslinesGeoJSON, relatedStopsGeoJSON } = $(storeToRefs(buslineStore))
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
    v-if="selectedBuslinesGeoJSON"
    source-id="selected-buslines-source"
    :source="{
      type: 'geojson',
      data: selectedBuslinesGeoJSON,
      lineMetrics: true,
    }"
  />

  <mapbox-source
    v-if="relatedStopsGeoJSON"
    source-id="related-stops-source"
    :source="{
      type: 'geojson',
      data: relatedStopsGeoJSON,
    }"
  />

  <mapbox-layer
    v-if="selectedBuslinesGeoJSON"
    :layer="{
      id: 'selected-buslines-layer',
      source: 'selected-buslines-source',
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
          0.5,
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
    v-if="selectedBuslinesGeoJSON"
    :layer="{
      id: 'selected-buslines-arrows-layer',
      source: 'selected-buslines-source',
      type: 'symbol',
      minzoom: 12,
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 200,
        'text-field': '→',
        'text-size': 16,
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
        'text-keep-upright': false,
        'text-anchor': 'bottom',
        'text-padding': 0,
        'text-line-height': 1,
        'text-offset': [
          'interpolate',
          ['linear'],
          ['zoom'],
          12,
          ['literal', [0, 0]],
          22,
          ['literal', [0, -2]],
        ],
      },
      paint: {
        'text-color': '#5301a4',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': 2,
        // @ts-expect-error
        'text-opacity': [
          'case',
          ['boolean', ['feature-state', 'fadein'], false],
          0.1,
          1,
        ],
      },
    }"
  />

  <mapbox-layer
    v-if="selectedBuslinesGeoJSON"
    :layer="{
      id: 'selected-buslines-labels-layer',
      source: 'selected-buslines-source',
      type: 'symbol',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 300,
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
        'text-field': '{line_name}',
        'text-size': 14,
        'text-rotation-alignment': 'viewport',
        'text-padding': 0,
        'text-line-height': 1,
      },
      paint: {
        'text-color': '#3a6727',
        'text-halo-color': '#eeffd1',
        'text-halo-width': 2,
        'text-opacity': [
          'case',
          ['boolean', ['feature-state', 'fadein'], false],
          0.1,
          1,
        ],
      },
    }"
  />

  <!-- selected busline related stops -->
  <mapbox-layer
    v-if="relatedStopsGeoJSON"
    :layer="{
      id: 'related-stops-layer',
      source: 'related-stops-source',
      type: 'symbol',
      filter: ['any', ['>=', ['zoom'], 14], ['get', 'interchange']],
      layout: {
        'visibility': 'visible',
        'icon-image': 'stop',
        'icon-size': ['step', ['zoom'], 0.4, 15, 0.5, 16, 0.6],
        'icon-padding': 0.5,
        'icon-allow-overlap': true,
        'text-optional': true,
        'text-field': [
          'step',
          ['zoom'],
          '',
          15,
          [
            'format',
            ['get', 'line_name'],
            { 'font-scale': 0.8 },
            '\n',
            {},
            ['get', 'station_name'],
            { 'text-color': '#000' },
          ],
        ],
        'text-size': ['step', ['zoom'], 12, 16, 14],
        'text-justify': [
          'case',
          ['boolean', ['get', 'left'], false],
          'right',
          'left',
        ],
        'text-anchor': [
          'case',
          ['boolean', ['get', 'left'], false],
          'right',
          'left',
        ],
        'text-offset': [
          'case',
          ['boolean', ['get', 'left'], false],
          ['literal', [-1, 0]],
          ['literal', [1, 0]],
        ],
        'text-padding': 0.5,
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
        'text-max-width': 16,
        'text-line-height': 1.1,
      },
      paint: {
        'icon-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8,
          ['case', ['get', 'interchange'], 1, 0],
          14,
          1,
        ],
        'text-color': '#f01b48',
        'text-halo-width': 1,
        'text-halo-color': '#fff',
      },
    }"
  />

  <!-- selected stop -->
  <mapbox-layer
    v-if="selectedStopGeoJSON"
    :layer="{
      id: 'selected-stop-layer',
      source: 'selected-stop-source',
      type: 'symbol',
      layout: {
        'icon-image': 'stop-end',
        'icon-size': [
          'step',
          ['zoom'],
          0.3,
          10,
          0.45,
          15,
          0.6,
        ],
        'icon-anchor': 'center',
        'icon-padding': 0.5,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'text-optional': true,
        'text-justify': [
          'case',
          ['boolean', ['get', 'left'], false],
          'right',
          'left',
        ],
        'text-anchor': [
          'case',
          ['boolean', ['get', 'left'], false],
          'right',
          'left',
        ],
        'text-offset': [
          'case',
          ['boolean', ['get', 'left'], false],
          ['literal', [-1, 0]],
          ['literal', [1, 0]],
        ],
        'text-padding': 0.5,
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
        'text-max-width': 16,
        'text-line-height': 1.1,
        'text-field': ['get', 'station_name'],
        'text-size': 16,
      },
      paint: {
        'text-color': '#67848A',
        'text-halo-width': 1,
        'text-halo-color': '#fff',
      },
    }"
  />

  <!-- all stops -->
  <mapbox-layer
    v-if="stopsLoaded && !selectedStopGeoJSON && !selectedBuslinesGeoJSON"
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
