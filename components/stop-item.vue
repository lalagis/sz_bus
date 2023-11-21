<script setup lang="ts">
const props = defineProps<{ stop: Stop }>()
const name = $computed(() => props.stop.station_name)

const stopStore = useStopStore()
const { stops } = $(storeToRefs(stopStore))

const buslineStore = useBuslineStore()
const { buslines } = $(storeToRefs(buslineStore))

function onClickItem() {
  stopStore.selectedStop = props.stop
  if (!buslines)
    return
  const result: Busline[] = []
  stops.filter(item => item.station_id === props.stop.station_id).forEach((stop) => {
    buslines.forEach((busline) => {
      if (stop.route_id === busline.route_id)
        result.push(busline)
    })
  })
  buslineStore.selectedBuslines = result
}
</script>

<template>
  <div
    class="flex flex-row items-center justify-between text-sm w-full text-center cursor-pointer hover:scale-105 transition-all duration-300"
    @click="onClickItem"
  >
    <!-- tag -->
    <div class="bg-emerald-100 rounded-md py-1 px-2 text-emerald whitespace-nowrap max-w-[120px] truncate">
      <p class="select-none">
        {{ name }}
      </p>
    </div>
  </div>
</template>
