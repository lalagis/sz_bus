import { defineStore } from 'pinia'
import type { Feature, FeatureCollection } from 'geojson'

export const useStopStore = defineStore('stop', () => {
  const stops = $ref<Stop[]>([])
  const stopsGeoJSON = $ref<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })
  let loaded = $ref(false)

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
    stopsGeoJSON,
    loaded,
  })
})
