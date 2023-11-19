<script setup lang="ts">
const props = defineProps<{ busline: Busline }>()
const name = $computed(() => props.busline.line_name)
const from = $computed(() => props.busline.first_station)
const to = $computed(() => props.busline.last_station)

const buslineStore = useBuslineStore()

function onClickItem() {
  buslineStore.selectedBusline = props.busline
}
</script>

<template>
  <div
    class="flex flex-row items-center justify-between text-sm w-full text-center cursor-pointer hover:scale-105 transition-all duration-300"
    @click="onClickItem"
  >
    <!-- tag -->
    <div class="bg-emerald-100 rounded-l-md py-1 px-2 text-emerald whitespace-nowrap">
      <p class="select-none">
        {{ name }}
      </p>
    </div>
    <div class="bg-lime-100 p-1 text-gray whitespace-nowrap flex-1 max-w-[110px] truncate">
      <p class="select-none">
        {{ from }}
      </p>
    </div>
    <div class="bg-orange-100 p-1 text-gray">
      <p class="select-none">
        →
      </p>
    </div>
    <div class="bg-teal-100 p-1 text-gray rounded-r-md whitespace-nowrap flex-1 max-w-[110px] truncate">
      <p class="select-none">
        {{ to }}
      </p>
    </div>
  </div>
</template>
