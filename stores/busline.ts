import { defineStore } from 'pinia'
import type { Feature, FeatureCollection } from 'geojson'

export const useBuslineStore = defineStore('busline', () => {
  const stopStore = useStopStore()
  const { stops, selectedStop } = $(storeToRefs(stopStore))

  let buslines = $ref<Busline[]>()
  let loaded = $ref(false)
  const selectedBuslines = $ref<Busline[]>([])
  const selectedBuslinesGeoJSON = $computed(() => {
    const base: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }
    if (selectedBuslines.length) {
      selectedBuslines.forEach((busline) => {
        const feature: Feature = {
          type: 'Feature',
          properties: busline,
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        }
        busline.coord_arr.split('|').forEach((lnglat) => {
          const [lng, lat] = lnglat.split('_')
          // @ts-expect-error geometry coordinates
          feature.geometry.coordinates.push([Number.parseFloat(lng), Number.parseFloat(lat)])
        })
        base.features.push(feature)
      })
      return base
    }
    return undefined
  })
  const relatedStopsGeoJSON = $computed(() => {
    const base: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }
    if (selectedBuslines.length) {
      selectedBuslines.forEach((busline) => {
        stops.forEach((stop) => {
          if (stop.route_id === busline.route_id) {
            base.features.push({
              type: 'Feature',
              properties: stop,
              geometry: {
                type: 'Point',
                coordinates: [Number.parseFloat(stop.lng), Number.parseFloat(stop.lat)],
              },
            })
          }
        })
      })
      return base
    }
    return undefined
  })

  watch(() => selectedBuslinesGeoJSON, () => {
    if (selectedBuslinesGeoJSON && !selectedStop) {
      const len = selectedBuslinesGeoJSON.features.length
      useMapbox('base', (map) => {
        map.flyTo({
          // @ts-expect-error geometry coordinates
          center: selectedBuslinesGeoJSON.features[len - 1].geometry.coordinates[0],
          zoom: 14,
        })
      })
    }
  })

  onMounted(async () => {
    const csv = await queryContent('/buslines').findOne()
    if (csv.body)
      buslines = csv.body as unknown as Busline[]
    loaded = true
  })

  return $$({
    buslines,
    selectedBuslines,
    selectedBuslinesGeoJSON,
    relatedStopsGeoJSON,
    loaded,
  })
})
