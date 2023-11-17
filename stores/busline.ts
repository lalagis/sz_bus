import { defineStore } from 'pinia'

export const useBuslineStore = defineStore('busline', () => {
  let buslines = $ref<Busline[]>()
  const selectedBusline = $ref<Busline>()
  let loaded = $ref(false)

  onMounted(async () => {
    const csv = await queryContent('/buslines').findOne()
    if (csv.body)
      buslines = csv.body as unknown as Busline[]
    loaded = true
  })

  return $$({
    buslines,
    selectedBusline,
    loaded,
  })
})
