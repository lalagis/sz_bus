<script setup lang="ts">
const buslineStore = useBuslineStore()
const { buslines, selectedBusline, loaded } = $(storeToRefs(buslineStore))

const mode = $ref<'buslines' | 'stops'>('buslines')

const searching = $ref(false)
const query = $ref('')
</script>

<template>
  <div v-auto-animate class="fixed z-10 bg-white rounded-md mt-16 w-[50vw] inset-x-0 mx-auto px-8 py-6 flex flex-row items-center shadow-md">
    <!-- mode -->
    <div v-auto-animate class="w-30 h-30 bg-emerald-100 rounded-md">
      <div
        class="absolute cursor-pointer transition-all duration-300"
        :class="mode === 'buslines' ? 'top-0 left-0 w-full h-full p-0 hover:bg-emerald-400 rounded-md' : 'bottom-0 right-0 w-2/5 h-2/5 bg-emerald-300 rounded-rb-md hover:scale-110 z-10 p-1'"
        @click="mode = 'buslines'"
      >
        <div class="i-fluent-emoji-flat:bus w-full h-full" />
      </div>
      <div
        class="absolute cursor-pointer transition-all duration-300"
        :class="mode === 'stops' ? 'top-0 left-0 w-full h-full p-0 hover:bg-emerald-400 rounded-md' : 'bottom-0 right-0 w-2/5 h-2/5 bg-emerald-300 rounded-rb-md hover:scale-110 z-10 p-1'"
        @click="mode = 'stops'"
      >
        <div class="i-fluent-emoji-flat:bus-stop w-full h-full" />
      </div>
    </div>

    <!-- tools -->
    <div class="ml-8 grid grid-cols-2 grid-rows-2 gap-y-4 gap-x-6">
      <div
        class="i-akar-icons:search w-12 h-12 bg-emerald-300 cursor-pointer hover:scale-105 hover:bg-emerald-400 transition-all duration-300"
        @click="searching = !searching"
      />
      <div class="i-akar-icons:arrow-left-thick w-12 h-12 bg-emerald-300 cursor-pointer hover:scale-105 hover:bg-emerald-400 transition-all duration-300" />
      <div class="i-akar-icons:arrow-counter-clockwise w-12 h-12 bg-emerald-300 cursor-pointer hover:scale-105 hover:bg-emerald-400 transition-all duration-300" />
      <div class="i-akar-icons:arrow-right-thick w-12 h-12 bg-emerald-300 cursor-pointer hover:scale-105 hover:bg-emerald-400 transition-all duration-300" />
    </div>

    <!-- searcher -->
    <div v-if="searching" class="absolute top-0 right-0 w-md rounded-rt-md rounded-lb-md bg-emerald-100 pl-6 pr-2 py-2 flex flex-row items-center">
      <input v-model="query" class="flex-1 bg-transparent focus:outline-none placeholder:text-sm text-sm text-gray-500" placeholder="请输入关键词...">
      <div class="i-fluent-emoji-flat:magnifying-glass-tilted-right flex-none ml-2 text-xl cursor-pointer hover:scale-110 transition-all duration-300" />
    </div>

    <!-- footer -->
    <footer class="absolute right-0 bottom-0 mr-2 mb-1 flex flex-row items-center">
      <a href="https://github.com/lalagis/sz_bus">
        <div class="i-akar-icons:github-fill" />
      </a>
      <p class="ml-2 text-gray text-sm cursor-default">
        sz_bus 2023 @ lulala
      </p>
    </footer>
  </div>
</template>
