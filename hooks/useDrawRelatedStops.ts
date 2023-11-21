export function useDrawRelatedStops() {
  const stopStore = useStopStore()
  const { stops } = $(storeToRefs(stopStore))

  const buslineStore = useBuslineStore()
  const { buslines } = $(storeToRefs(buslineStore))

  return (stop: Stop) => {
    stopStore.selectedStop = stop
    if (!buslines)
      return
    const result: Busline[] = []
    stops.filter(item => item.station_id === stop.station_id).forEach((stop) => {
      buslines.forEach((busline) => {
        if (stop.route_id === busline.route_id)
          result.push(busline)
      })
    })
    buslineStore.selectedBuslines = result
  }
}
