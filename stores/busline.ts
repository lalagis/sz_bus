// 线路仓库
import { defineStore } from 'pinia'
import type { Feature, FeatureCollection } from 'geojson'

export const useBuslineStore = defineStore('busline', () => {
  // 站点仓库
  const stopStore = useStopStore()
  const { stops, selectedStop } = $(storeToRefs(stopStore))

  // 全部线路
  let buslines = $ref<Busline[]>()
  // 是否加载完成
  let loaded = $ref(false)
  // 选中的线路与geojson
  const selectedBuslines = $ref<Busline[]>([])
  // 一旦有选中的线路，就将线路信息设置到geojson中
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
  // 一旦有选中的线路，就将线路相关的站点信息设置到geojson中
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

  // 一旦有选中的线路，就将地图中心移动到选中的线路
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

  // 当被挂载时
  onMounted(async () => {
    // 从服务器获取线路数据
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
