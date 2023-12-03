// 站点仓库
import { defineStore } from 'pinia'
import type { Feature, FeatureCollection } from 'geojson'

export const useStopStore = defineStore('stop', () => {
  // 全部站点与geojson
  const stops = $ref<Stop[]>([])
  const stopsGeoJSON = $ref<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })
  // 数据是否加载完成
  let loaded = $ref(false)
  // 选中的站点与geojson
  const selectedStop = $ref<Stop>()
  // 一旦有选中的站点，就将站点信息设置到geojson中
  const selectedStopGeoJSON = $computed(() => {
    // geojson模板
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

  // 一旦有选中的站点，就将地图中心移动到选中的站点
  watch(() => selectedStopGeoJSON, () => {
    if (selectedStop && selectedStopGeoJSON) {
      useMapbox('base', (map) => {
        const { lng, lat } = selectedStop
        map.flyTo({
          center: [Number.parseFloat(lng), Number.parseFloat(lat)],
          zoom: 13,
        })
      })
    }
  })

  // 当被挂载时
  onMounted(async () => {
    // 从服务器获取站点数据
    const csv = await queryContent('/stops').findOne()
    if (csv.body) {
      // 用于去重
      const map = new Map<string, boolean>()
      // @ts-expect-error has body
      csv.body.forEach((stop: Stop) => {
        stops.push(stop)
        // check if the stop is already in the map
        if (map.has(stop.station_id))
          return
        map.set(stop.station_id, true)

        // 填入基本信息
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
    // 设置加载状态
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
