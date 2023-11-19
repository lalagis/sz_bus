import { defineStore } from 'pinia'
import type { Feature, FeatureCollection } from 'geojson'

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

        const computedId = lnglat.replace('.', '')
        const stop = stops.find(row => row.station_id === computedId)
        if (stop) {
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
              lng,
              lat,
            },
            geometry: {
              type: 'Point',
              coordinates: [Number.parseFloat(lng), Number.parseFloat(lat)],
            },
          }
          base.features.push(item)
        }
      })
      console.log(base)
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
          zoom: 12,
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
    loaded,
  })
})
