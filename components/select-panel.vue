<script setup lang="ts">
// 线路仓库与站点仓库
const buslineStore = useBuslineStore()
const { buslines } = $(storeToRefs(buslineStore))

const stopStore = useStopStore()
const { stops } = $(storeToRefs(stopStore))

// 当前面板模式(线路/站点)
let mode = $ref<'buslines' | 'stops'>('buslines')

// 搜索相关，是否正在搜索，搜索关键词
let searching = $ref(false)
let query = $ref('')

// 线路搜索结果
const buslinesList = $computed(() => {
  if (!buslines)
    return []
  if (!query)
    return buslines
  return buslines.filter(item => item.line_name.includes(query) || item.first_station.includes(query) || item.last_station.includes(query))
})

// 站点搜索结果
const stopsList = $computed(() => {
  if (!stops)
    return []
  if (!query)
    return stops
  return stops.filter(item => item.station_name.includes(query))
})

// 当前页，当前页的线路/站点
let page = $ref(1)
let currentBuslines = $ref<Busline[]>([])
let currentStops = $ref<Stop[]>([])

// 一旦翻页了，就重新计算当前页的线路/站点
watchEffect(() => {
  if (page) {
    if (mode === 'buslines' && buslinesList.length)
      currentBuslines = buslinesList.slice((page - 1) * 6, page * 6)

    else if (mode === 'stops' && stopsList.length)
      currentStops = stopsList.slice((page - 1) * 12, page * 12)
  }
})

// 当点击重制时，进行一些重制
function onClickReset() {
  query = ''
  page = 1
  stopStore.selectedStop = undefined
  buslineStore.selectedBuslines = []
}

// 当切换模式时，也需要进行一些重制
function onToggleMode(incoming: 'buslines' | 'stops') {
  query = ''
  searching = false
  mode = incoming
  page = 1
  stopStore.selectedStop = undefined
  buslineStore.selectedBuslines = []
}
</script>

<template>
  <!-- 做了响应式显示，在不同的屏幕尺寸下，会有不同的样式应用 -->
  <div v-auto-animate class="fixed z-10 bg-white rounded-md sm:mt-16 sm:w-[50vw] w-full sm:min-w-xl lg:min-w-4xl lg:max-w-[60rem] inset-x-0 mx-auto px-8 py-6 sm:flex sm:flex-row sm:items-center shadow-md overflow-hidden">
    <!-- 面板模式，两个图标。当前模式在左上角，否则在右下角 -->
    <div v-auto-animate class="w-12 h-12 sm:w-18 sm:h-18 md:w-24 md:h-24 lg:w-30 lg:h-30 bg-emerald-100 rounded-md flex-none inline-flex">
      <!-- 线路模式 -->
      <div
        class="absolute cursor-pointer transition-all duration-300"
        :class="mode === 'buslines' ? 'top-0 left-0 w-full h-full p-0 hover:bg-emerald-400 rounded-md' : 'bottom-0 right-0 w-2/5 h-2/5 bg-emerald-300 rounded-rb-md hover:scale-110 z-10 p-1'"
        @click="onToggleMode('buslines')"
      >
        <div class="i-fluent-emoji-flat:bus w-full h-full" />
      </div>
      <!-- 站点模式 -->
      <div
        class="absolute cursor-pointer transition-all duration-300"
        :class="mode === 'stops' ? 'top-0 left-0 w-full h-full p-0 hover:bg-emerald-400 rounded-md' : 'bottom-0 right-0 w-2/5 h-2/5 bg-emerald-300 rounded-rb-md hover:scale-110 z-10 p-1'"
        @click="onToggleMode('stops')"
      >
        <div class="i-fluent-emoji-flat:bus-stop w-full h-full" />
      </div>
    </div>

    <!-- 工具箱 -->
    <div class="mx-8 sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:gap-y-4 sm:gap-x-6 sm:mr-6 sm:flex-none flex flex-row gap-x-6 inline-flex">
      <!-- 搜索 -->
      <div
        class="i-akar-icons:search w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-300 cursor-pointer hover:scale-105 hover:bg-emerald-400 transition-all duration-300"
        @click="searching = !searching"
      />
      <!-- 重制 -->
      <div
        class="i-akar-icons:arrow-counter-clockwise w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-300 cursor-pointer hover:scale-105 hover:bg-emerald-400 transition-all duration-300"
        @click="onClickReset"
      />
      <!-- 上一页，如果页码不是1的话，就会有上一页 -->
      <div
        v-if="page > 1"
        class="i-akar-icons:arrow-left-thick w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-300 cursor-pointer hover:scale-105 hover:bg-emerald-400 transition-all duration-300"
        @click="page--"
      />
      <!-- 下一页，如果当前数据列表长度允许 -->
      <div
        v-if="mode === 'buslines' ? (buslinesList && page * 6 + 1 <= buslinesList.length) : (stopsList && page * 12 + 1 <= stopsList.length)"
        class="i-akar-icons:arrow-right-thick w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-300 cursor-pointer hover:scale-105 hover:bg-emerald-400 transition-all duration-300"
        @click="page++"
      />
    </div>

    <!-- 线路组件，以3*2一页6个grid排列 -->
    <div
      v-if="mode === 'buslines' && buslinesList.length"
      v-auto-animate
      class="flex flex-row flex-wrap gap-y-2 sm:grid my-2 sm:my-0 sm:grid-rows-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3 sm:flex-1"
    >
      <busline-item v-for="busline in currentBuslines" :key="`busline${busline.route_id}`" :busline="busline" />
    </div>

    <!-- 站点组件，以3*4一页12个grid排列 -->
    <div
      v-if="mode === 'stops' && stopsList.length"
      v-auto-animate
      class="grid grid-rows-3 grid-cols-4 gap-x-6 gap-y-3 mx-auto"
    >
      <stop-item v-for="stop in currentStops" :key="`stop${stop.station_id}`" :stop="stop" />
    </div>

    <!-- 搜索栏，在面板右上角隐藏/显示 -->
    <div v-if="searching" class="absolute top-0 right-0 w-md rounded-rt-md rounded-lb-md bg-emerald-100 pl-6 pr-2 py-2 flex flex-row items-center">
      <input v-model="query" class="flex-1 bg-transparent focus:outline-none placeholder:text-sm text-sm text-gray-500" placeholder="请输入关键词...">
      <div class="i-fluent-emoji-flat:magnifying-glass-tilted-right flex-none ml-2 text-xl cursor-pointer hover:scale-110 transition-all duration-300" />
    </div>

    <!-- 脚标 -->
    <footer class="absolute right-0 bottom-0 mr-2 mb-1 flex flex-row items-center">
      <!-- 可能的图标分析html -->
      <a href="/analysis.html">
        <div class="i-akar-icons:align-bottom" />
      </a>
      <!-- github仓库 -->
      <a href="https://github.com/lalagis/sz_bus" class="ml-2">
        <div class="i-akar-icons:github-fill" />
      </a>
      <!-- copy right -->
      <p class="ml-2 text-gray text-sm cursor-default">
        sz_bus 2023 © lulala
      </p>
    </footer>
  </div>
</template>
