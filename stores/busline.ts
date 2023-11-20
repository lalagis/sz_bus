import { defineStore } from 'pinia'
import type { FeatureCollection } from 'geojson'

export const useBuslineStore = defineStore('busline', () => {
  const stopStore = useStopStore()
  const { stops } = $(storeToRefs(stopStore))

  let buslines = $ref<Busline[]>()
  let loaded = $ref(false)
  const selectedBusline = $ref<Busline>()
  const selectedBuslineGeoJSON = $computed(() => {
    const base: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
      }],
    }
    if (selectedBusline) {
      base.features[0].properties = selectedBusline
      selectedBusline.coord_arr.split('|').forEach((lnglat) => {
        const [lng, lat] = lnglat.split('_')
        // @ts-expect-error geometry coordinates
        base.features[0].geometry.coordinates.push([Number.parseFloat(lng), Number.parseFloat(lat)])
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
    if (selectedBusline) {
      stops.forEach((stop) => {
        if (stop.route_id === selectedBusline.route_id) {
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
      return base
    }
    return undefined
  })

  watch(() => selectedBuslineGeoJSON, () => {
    if (selectedBuslineGeoJSON) {
      useMapbox('base', (map) => {
        map.flyTo({
          // @ts-expect-error geometry coordinates
          center: selectedBuslineGeoJSON.features[0].geometry.coordinates[0],
          zoom: 15,
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
    selectedBusline,
    selectedBuslineGeoJSON,
    relatedStopsGeoJSON,
    loaded,
  })
})
