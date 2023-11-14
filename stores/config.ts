import type { MapboxComponentOptions } from 'nuxt-mapbox'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const mapboxOptions = $ref<MapboxComponentOptions>({
    style: 'mapbox://styles/cirnoqvq/cloydvrgb00bh01rbglgeauda',
    center: [114.125789, 22.675122],
    minZoom: 8,
    zoom: 11,
    boxZoom: false,
    logoPosition: 'bottom-left',
    attributionControl: false,
    pitchWithRotate: false,
    touchPitch: false,
    renderWorldCopies: false,
  })

  return $$({
    mapboxOptions,
  })
})
