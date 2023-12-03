export function useDrawRelatedStops() {
  // 拿到仓库
  const stopStore = useStopStore()
  const { stops } = $(storeToRefs(stopStore))
  const buslineStore = useBuslineStore()
  const { buslines } = $(storeToRefs(buslineStore))

  // 返回一个需要传递stop的函数
  return (stop: Stop) => {
    // 先在stop仓库中选中stop
    stopStore.selectedStop = stop
    if (!buslines)
      return
    const result: Busline[] = []
    // 在全部站点stops中找到和当前stop相同的站点，然后在全部线路buslines中找到和当前站点相同的线路
    stops.filter(item => item.station_id === stop.station_id).forEach((stop) => {
      buslines.forEach((busline) => {
        if (stop.route_id === busline.route_id)
          result.push(busline)
      })
    })
    // 将找到的线路设置到仓库中
    buslineStore.selectedBuslines = result
  }
}
