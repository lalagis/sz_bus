import { defineStore } from 'pinia'

export const useLayersStore = defineStore('layers', () => {
  const points = $ref({})

  return $$({
    points,
  })
})
