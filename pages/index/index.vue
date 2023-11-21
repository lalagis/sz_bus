<script setup lang="ts">
import type { Feature } from 'geojson'
import { useDrawRelatedStops } from '~/hooks/useDrawRelatedStops'

const config = useConfigStore()

const stopStore = useStopStore()
const { stops } = $(storeToRefs(stopStore))

const drawRelatedStops = useDrawRelatedStops()

let showTooltip = $ref(false)
let tooltipoOffset = $ref<[number, number]>()
let tooltipText = $ref('')

onMounted(() => {
  useMapbox('base', (map) => {
    // load images
    map.loadImage('/stop.png', (e, img) => {
      if (e)
        console.error('load image error', e)
      if (img)
        map.addImage('stop', img)
    })
    map.loadImage('/stop-end.png', (e, img) => {
      if (e)
        console.error('load image error', e)
      if (img)
        map.addImage('stop-end', img)
    })

    // events
    const canvas = map.getCanvas()
    map.on('mouseenter', ['stops-layer'], () => {
      canvas.style.cursor = 'pointer'
    })
    let last: Feature | null = null
    map.on('mousemove', (e) => {
      const { point } = e
      tooltipoOffset = [e.point.x, e.point.y]
      const features = map.queryRenderedFeatures(point, {
        layers: ['stops-layer'],
        validate: false,
      })
      if (features.length && map.getZoom() < 16 && !map.isMoving()) {
        if (last && features[0].properties?.station_id === last.properties?.station_id)
          return
        last = features[0]
        tooltipText = last.properties?.station_name
        showTooltip = true
      }
      else if (last) {
        last = null
      }
    })
    map.on('mouseleave', ['stops-layer'], () => {
      canvas.style.cursor = ''
      showTooltip = false
      tooltipoOffset = [0, 0]
      tooltipText = ''
    })
    map.on('click', ['stops-layer'], (e) => {
      const { point } = e
      const features = map.queryRenderedFeatures(point, {
        layers: ['stops-layer'],
        validate: false,
      })
      if (features.length) {
        stops.some((stop) => {
          if (stop.station_id === features[0]?.properties?.station_id) {
            drawRelatedStops(stop)
            return true
          }
          return false
        })
      }
    })
  })
})
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
    <!-- <stops-in-busline-panel /> -->
    <following-tooltip :show="showTooltip" :text="tooltipText" :offset="tooltipoOffset" />
  </div>
</template>
