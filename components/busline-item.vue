<!-- 单个线路的组件，展示名称，起终点站，以及选中它的方法 -->
<script setup lang="ts">
// 父组件提供的线路busline
const props = defineProps<{ busline: Busline }>()
// 根据它计算线路名称、起点站、终点站
const name = $computed(() => props.busline.line_name)
const from = $computed(() => props.busline.first_station)
const to = $computed(() => props.busline.last_station)

// 线路仓库与站点仓库
const buslineStore = useBuslineStore()
const stopStore = useStopStore()

// 点击时选中线路，取消选中站点
function onClickItem() {
  stopStore.selectedStop = undefined
  buslineStore.selectedBuslines = [props.busline]
}
</script>

<template>
  <!-- 容器 -->
  <div
    class="flex flex-row items-center justify-between text-sm w-fit mx-auto lg:mx-none lg:w-full text-center cursor-pointer hover:scale-105 transition-all duration-300"
    @click="onClickItem"
  >
    <!-- 线路名称 -->
    <div class="bg-emerald-100 rounded-md lg:rounded-l-md py-1 px-2 text-emerald whitespace-nowrap">
      <p class="select-none">
        {{ name }}
      </p>
    </div>
    <!-- 起点 -->
    <div class="bg-lime-100 p-1 text-gray whitespace-nowrap flex-1 hidden lg:block">
      <p class="select-none max-w-[80px] lg:max-w-[90px] 2xl:max-w-[100px] truncate">
        {{ from.length > 8 ? `${from.slice(0, 8)}...` : name.length > 5 ? `${from.slice(0, 4)}..` : from }}
      </p>
    </div>
    <!-- 箭头 -->
    <div class="bg-orange-100 p-1 text-gray hidden lg:block">
      <p class="select-none">
        →
      </p>
    </div>
    <!-- 终点 -->
    <div class="bg-teal-100 p-1 text-gray rounded-r-md whitespace-nowrap flex-1 hidden lg:block">
      <p class="select-none max-w-[80px] lg:max-w-[90px] 2xl:max-w-[100px] truncate">
        {{ to.length > 8 ? `${to.slice(0, 8)}...` : name.length > 5 ? `${to.slice(0, 4)}..` : to }}
      </p>
    </div>
  </div>
</template>
