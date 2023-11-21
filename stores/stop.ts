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

  watch(() => selectedStopGeoJSON, () => {
    if (selectedStop && selectedStopGeoJSON) {
      useMapbox('base', (map) => {
        const { lng, lat } = selectedStop
        map.flyTo({
          center: [Number.parseFloat(lng), Number.parseFloat(lat)],
          zoom: 14,
        })
      })
    }
  })

  onMounted(async () => {
    const csv = await queryContent('/stops').findOne()
    if (csv.body) {
      const map = new Map<string, boolean>()
      // @ts-expect-error has body
      csv.body.forEach((stop: Stop) => {
        stops.push(stop)
        // check if the stop is already in the map
        if (map.has(stop.station_id))
          return
        map.set(stop.station_id, true)

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
