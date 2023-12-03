<!-- 单个站点的组件，显示名称，并支持选中与它相关的所有线路 -->
<script setup lang="ts">
import { useDrawRelatedStops } from '~/hooks/useDrawRelatedStops'

// 拿到父元素提供的站点stop
const props = defineProps<{ stop: Stop }>()
// 根据它计算站点名称
const name = $computed(() => props.stop.station_name)

// 复用的方法，用于绘制一个站点的相关站点与线路
const drawRelatedStops = useDrawRelatedStops()
</script>

<template>
  <!-- 容器与方法 -->
  <div
    class="flex flex-row items-center justify-between text-sm w-full text-center cursor-pointer hover:scale-105 transition-all duration-300"
    @click="drawRelatedStops(props.stop)"
  >
    <!-- 标签tag -->
    <div class="bg-emerald-100 rounded-md py-1 px-2 text-emerald whitespace-nowrap max-w-[120px] truncate">
      <p class="select-none">
        {{ name }}
      </p>
    </div>
  </div>
</template>
