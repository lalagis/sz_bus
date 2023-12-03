<script setup lang="ts">
import type { Feature } from 'geojson'
import { useDrawRelatedStops } from '~/hooks/useDrawRelatedStops'

// 仓库中的数据
const config = useConfigStore()
const stopStore = useStopStore()
const { stops } = $(storeToRefs(stopStore))

// 复用的方法，用于绘制一个站点的相关站点与线路
const drawRelatedStops = useDrawRelatedStops()

// 提示框相关，是否显示，偏移量，站点名称
let showTooltip = $ref(false)
let tooltipoOffset = $ref<[number, number]>()
let tooltipText = $ref('')

// 当页面被挂载时
onMounted(() => {
  // 得到mapbox实例
  useMapbox('base', (map) => {
    // 加载两张png图片，用于mapbox绘制在canvas上
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

    // 事件
    // 拿到canvas实例
    const canvas = map.getCanvas()
    // 当鼠标进入站点时，改变鼠标样式
    map.on('mouseenter', ['stops-layer'], () => {
      canvas.style.cursor = 'pointer'
    })
    // 只要重叠的最后一个站点
    let last: Feature | null = null
    // 当鼠标在canvas上移动时
    map.on('mousemove', (e) => {
      // 拿到鼠标坐标
      const { point } = e
      // 同时就是提示框的偏移量
      tooltipoOffset = [e.point.x, e.point.y]
      // 在这个点上的，已被渲染的要素们
      const features = map.queryRenderedFeatures(point, {
        layers: ['stops-layer'],
        validate: false,
      })
      // 如果有的话
      if (features.length && map.getZoom() < 16 && !map.isMoving()) {
        // 如果有站点，且不是上一个站点
        if (last && features[0].properties?.station_id === last.properties?.station_id)
          return
        // 显示提示框
        last = features[0]
        tooltipText = last.properties?.station_name
        showTooltip = true
      }
      else if (last) {
        // 否则重置
        last = null
      }
    })
    // 当鼠标离开站点时，进行重置
    map.on('mouseleave', ['stops-layer'], () => {
      canvas.style.cursor = ''
      showTooltip = false
      tooltipoOffset = [0, 0]
      tooltipText = ''
    })
    // 当鼠标点击站点的时候
    map.on('click', ['stops-layer'], (e) => {
      const { point } = e
      const features = map.queryRenderedFeatures(point, {
        layers: ['stops-layer'],
        validate: false,
      })
      if (features.length) {
        // 在全部站点stops里面拿到它，并计算与它相关的全部站点
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
  <!-- 容器 -->
  <div class="w-screen h-screen m-0 relative">
    <!-- mapbox底图 -->
    <mapbox-map
      map-id="base"
      class="absolute inset-0"
      :options="config.mapboxOptions"
    >
      <!-- 数据源和图层列表  -->
      <sources-and-layers />
    </mapbox-map>
    <!-- 选择面板 components->select-panel -->
    <select-panel />
    <!-- 跟随鼠标的浮动提示框 components->following-tooltip -->
    <following-tooltip :show="showTooltip" :text="tooltipText" :offset="tooltipoOffset" />
  </div>
</template>
