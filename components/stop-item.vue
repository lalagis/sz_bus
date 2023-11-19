<script setup lang="ts">
const props = defineProps<{ stop: Stop }>()
const name = $computed(() => props.stop.station_name)

const stopStore = useStopStore()

function onClickItem() {
  stopStore.selectedStop = props.stop
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
