// 站点类型
interface Stop {
  route_id: string
  line_name: string
  route_name: string
  station_index: string
  station_id: string
  station_name: string
  lng: string
  lat: string
}

// 线路类型
interface Busline {
  route_id: string
  line_name: string
  route_name: string
  start_time: string
  end_time: string
  first_station: string
  last_station: string
  company: string
  coord_arr: string
}
