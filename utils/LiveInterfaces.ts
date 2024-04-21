interface LiveTabs {
  [id: string]: LiveTab
}

interface LiveTab {
  id: string
  session_id: string
  name: string
  form: FormLiveTab
  results: ResultsLiveTab
}

interface FormLiveTab {
  debug_mode: boolean
  paper_mode: boolean
  routes: Route[]
  extra_routes: ExtraRoute[]
}

interface ResultsLiveTab {
  showResults: boolean
  booting: boolean
  monitoring: boolean
  finished: boolean
  terminating: boolean
  progressbar: ProgressBar
  routes_info: RouteInfo[][]
  routes: any[]
  metrics: any[]
  generalInfo: any
  positions: multiplesTablesValue[][]
  orders: ordersEvent[]
  watchlist: [string, string][]
  candles: LiveCandleData[]
  currentCandles: CurrentCandlesObject
  infoLogs: string
  errorLogs: string
  exception: Exception
  charts: {
    equity_curve: EquityCurve[]
  }
  info: (string | number)[][]
}

interface ordersEvent {
  canceled_at: number | null
  created_at: number
  exchange_id: string
  executed_at: number | null
  filled_qty: number
  id: string
  price: number
  qty: number
  session_id: string | null
  side: string
  status: string
  symbol: string
  type: string
}

interface LiveGeneralInfoEvent {
  started_at: number
  current_time: number
  started_balance: number
  current_balance: number
  debug_mode: boolean
  count_error_logs: number
  count_info_logs: number
  count_active_orders: number
  open_positions: number
  pnl: number
  pnl_perc: number
  count_trades: number
  count_winning_trades: number
  count_losing_trades: number
  routes: Route[] // Replace 'any' with the actual type of the items in the 'routes' array if known
}

interface positionsEvent {
  currency: string
  current_price: number
  entry: number
  leverage: number
  liquidation_price: number | null
  opened_at: number
  pnl: number
  pnl_perc: number
  qty: number
  strategy_name: string
  symbol: string
  type: string
  value: number
}


interface LogsData {
  id: string
  timestamp: number
  message: string
}

interface GetLogsEvent {
  id: string
  data: LogsData[]
}

interface KeyValueObject {
  key: string
  value: string | number
}

interface LiveCandleData {
  time: number
  open: number
  close: number
  high: number
  low: number
  volume: number
}

interface CurrentCandlesObject {
  [key: string]: LiveCandleData
}

interface GetCandlesResponse {
  id: string
  data: LiveCandleData[]
}

interface WebSocketData {
  id: string
  event: string
  data: any
}
