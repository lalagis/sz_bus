import { defineStore } from 'pinia'
import type { Feature, FeatureCollection } from 'geojson'

export const useStopStore = defineStore('stop', () => {
  const stops = $ref<Stop[]>([])
  const stopsGeoJSON = $ref<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })
  let loaded = $ref(false)
  const selectedStop = $ref<Stop>()
  const selectedStopGeoJSON = $computed(() => {
    const base: FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [],
        },
      }],
    }
    if (selectedStop) {
      base.features[0].properties = selectedStop
      const { lng, lat } = selectedStop
      // @ts-expect-error geometry coordinates
      base.features[0].geometry.coordinates = [Number.parseFloat(lng), Number.parseFloat(lat)]
      return base
    }
    return undefined
  })

  watchEffect(() => {
    if (selectedStop && selectedStopGeoJSON) {
      useMapbox('base', (map) => {
        const { lng, lat } = selectedStop
        map.flyTo({
          center: [Number.parseFloat(lng), Number.parseFloat(lat)],
          zoom: 12,
        })
      })
    }
  })

  onMounted(async () => {
    const csv = await queryContent('/stops').findOne()
    if (csv.body) {
      // @ts-expect-error has body
      csv.body.forEach((stop: Stop) => {
        stops.push(stop)
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
        stopsGeoJSON.features.push(item)
      })
    }
    loaded = true
  })

  return $$({
    stops,
    selectedStop,
    selectedStopGeoJSON,
    stopsGeoJSON,
    loaded,
  })
})
