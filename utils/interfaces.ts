


// ==================== general info ====================
interface GeneralInfoResponse {
  exchanges: { [key: string]: Exchange }
  has_live_plugin_installed: boolean
  jesse_supported_timeframes: never[]
  plan_info: PlanInfo
  strategies: never[]
  system_info: SystemInfo
  update_info: UpdateInfo
}

interface SystemInfo {
  cpu_cores: number
  is_docker: boolean
  jesse_version: string
  operating_system: string
  python_version: string
  live_plugin_version?: string
}

interface PlanInfo {
  plan: string
}

interface UpdateInfo {
  is_update_info_available: boolean
  jesse_latest_version: string
  jesse_live_latest_version: string
}

// ==================== exchanges ====================
interface Exchange {
  fee: number
  modes: {
    backtesting: boolean
    live_trading: boolean
  }
  name: string
  required_live_plan: string
  supported_leverage_modes: string[]
  supported_timeframes: string[]
  type: string
  url: string
}

// ==================== settings ====================
interface Logging {
  order_submission: boolean
  order_cancellation: boolean
  order_execution: boolean
  position_opened: boolean
  position_increased: boolean
  position_reduced: boolean
  position_closed: boolean
  shorter_period_candles: boolean
  trading_candles: boolean
  balance_update: boolean
}

interface Notifications {
  enabled: boolean
  position_report_timeframe: string
  events: {
    errors: boolean
    started_session: boolean
    terminated_session: boolean
    submitted_orders: boolean
    cancelled_orders: boolean
    executed_orders: boolean
    opened_position: boolean
    updated_position: boolean
  }
}

interface Backtest {
  logging: Logging
  warm_up_candles: number
  exchanges: { [key: string]: ConfigExchange }
}

interface Live {
  persistency: boolean
  generate_candles_from_1m: boolean
  logging: Logging
  warm_up_candles: number
  exchanges: { [key: string]: ConfigExchange }
  notifications: Notifications
}

interface Optimization {
  cpu_cores: number
  ratio: string
  warm_up_candles: number
  exchange: ConfigExchange
}

interface Settings {
  backtest: Backtest
  live: Live
  optimization: Optimization
}
// ==================== get config ====================
interface GetConfigResponse {
  data: {
    data: Settings
  }
}

interface ActiveWorkersResponse {
  data: string[]
}

interface ExchangeSupportedSymbols {
  [key: string]: {
    updated_at: Date
    data: string[]
  }
}

interface ExchangeSupportedSymbolsResponse {
  data: string[]
}

interface ConfigExchange {
  name: string
  type?: string
  balance: number
  fee: number
  futures_leverage_mode?: string
  futures_leverage?: number
}
// ==================== auth Response ====================
interface AuthResponse {
  auth_token: string
}
// ==================== FAQ Response ====================
interface FAQ {
  id: number
  title: string
  slug: string
  description: string
  faq_category_id: number
  published: boolean
  created_at: Date
  updated_at: Date
  views: number
}
// ==================== API Responses ====================
interface MakeStrategyResponse {
  message: string
  status: string
}

interface ClearCandlesDatabaseCacheResponse {
  message: string
  status: string
}

interface Route {
  symbol: string
  timeframe: string
  strategy: string
}

interface DataRoute {
  symbol: string
  timeframe: string
}

interface ProgressBar {
  current: number
  estimated_remaining_seconds: number
}

interface Alert {
  message: string
  type: string
}

interface DashboardNotification {
  message: string
  type: 'error' | 'success'
}

type ArrayItem = [string, number | string]

interface ArrayItems extends Array<ArrayItem> { }

interface Exception {
  error: string
  traceback: string
}

interface EquityCurve {
  name: string
  color: string
  data: {
    timestamp: number
    balance: number
  }[]
}

interface RoutesInfoEvent {
  symbol: string
  timeframe: string
  strategy_name: string
}

interface RouteInfo {
  value: string
  style: string
}

interface MetricsEvent {
  total: number
  total_winning_trades: number
  total_losing_trades: number
  starting_balance: number
  finishing_balance: number
  win_rate: number
  ratio_avg_win_loss: number
  longs_count: number
  longs_percentage: number
  shorts_percentage: number
  shorts_count: number
  fee: number
  net_profit: number
  net_profit_percentage: number
  average_win: number
  average_loss: number
  expectancy: number
  expectancy_percentage: number
  expected_net_profit_every_100_trades: number
  average_holding_period: number
  average_winning_holding_period: number
  average_losing_holding_period: number
  gross_profit: number
  gross_loss: number
  max_drawdown: number
  annual_return: number
  sharpe_ratio: number
  calmar_ratio: number
  sortino_ratio: number
  omega_ratio: number
  serenity_index: number
  smart_sharpe: number
  smart_sortino: number
  total_open_trades: number
  open_pl: number
  winning_streak: number
  losing_streak: number
  largest_losing_trade: number
  largest_winning_trade: number
  current_streak: number
}

interface BacktestInfoEvent {
  duration: string
  starting_time: number
  finishing_time: number
  exchange: string
  exchange_type: string
  leverage: number
  leverage_mode: string
}

interface multiplesTablesValue {
  value: string | number
  style: string
  tag?: string
  tooltip?: string
}

interface FeedbackResponse {
  status: string
  message: string
}

interface StoreExchangeApiKeyResponse {
  status: string
  message: string
  data: ExchangeApiKey
}

interface StoreNotificationApiKeyResponse {
  status: string
  message: string
  data: NotificationApiKey
}

interface GetExchangeApiKeysResponse {
  status: string
  data: ExchangeApiKey[]
}

interface GetNotificationApiKeysResponse {
  status: string
  data: NotificationApiKey[]
}

interface ExchangeApiKey {
  id: string
  exchange: string
  name: string
  created_at: Date
  api_key: string
  api_secret: string

  // dydx and apex pro
  api_passphrase?: string
  wallet_address?: string
  stark_private_key?: string
}

interface NotificationApiKey {
  id: string
  name: string
  driver: string
  created_at: Date

  // telegram
  bot_token?: string
  chat_id?: string
  // discord and slack
  webhook?: string
}

// ==================== backtest ====================

interface BacktestResults {
  showResults: boolean
  executing: boolean
  logsModal: boolean
  progressbar: ProgressBar
  routes_info: RouteInfo[][]
  metrics: ArrayItems
  hyperparameters: ArrayItems
  generalInfo: BacktestGeneralInfo
  infoLogs: string
  exception: Exception
  charts: {
    equity_curve: EquityCurve[]
  }
  alert: Alert
  info: ArrayItems
}

interface BacktestForm {
  start_date: string
  finish_date: string
  debug_mode: boolean
  export_chart: boolean
  export_tradingview: boolean
  export_full_reports: boolean
  export_csv: boolean
  export_json: boolean
  fast_mode: boolean
  benchmark: boolean
  exchange: string
  routes: Route[]
  data_routes: DataRoute[]
  symbol?: string
}

interface BacktestTab {
  id: string
  form: BacktestForm
  results: BacktestResults
}

interface BacktestTabs {
  [id: string]: BacktestTab
}

interface BacktestGeneralInfo {
  debug_mode?: boolean
  session_id?: string
}

// ==================== Candle ====================


interface CandleTabs {
  [id: string]: CandleTab
}

interface CandleTab {
  id: string
  form: CandleTabForm
  results: CandleTabResults
}

interface CandleTabForm {
  start_date: string
  exchange: string
  symbol: string
  debug_mode?: boolean
}

interface CandleTabResults {
  showResults: boolean
  executing: boolean
  progressbar: ProgressBar
  metrics: any[] // Replace 'any' with the actual type of the items in the 'metrics' array if known
  infoLogs: string
  exception: Exception
  alert: Alert
}

// ==================== Live ====================
interface LiveTabs {
  [id: string]: LiveTab
}

interface LiveTab {
  id: string
  form: LiveForm
  results: LiveResults
}

interface LiveForm {
  debug_mode: boolean
  paper_mode: boolean
  exchange_api_key_id: string
  notification_api_key_id: string
  exchange: string
  routes: Route[]
  data_routes: DataRoute[]
}

interface LiveResults {
  showResults: boolean
  booting: boolean
  monitoring: boolean
  finished: boolean
  terminating: boolean
  progressbar: ProgressBar
  routes_info: RouteInfo[][]
  routes: any[]
  metrics: any[]
  generalInfo: LiveGeneralInfoEvent
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
  selectedRoute: Route
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
  exchange: string
  leverage: number
  leverage_type: string
  available_margin: number
  paper_mode: boolean
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

// ==================== Optimization ====================




interface OptimizationForm {
  start_date: string
  finish_date: string
  debug_mode: boolean
  export_csv: boolean
  export_json: boolean
  routes: OptimizationRoute[]
  data_routes: DataRoute[]
  optimal_total: number
  // add this because of the error
  symbol?: null
  fast_mode: boolean
}

interface OptimizationResults {
  showResults: boolean
  executing: boolean
  logsModal: boolean
  progressbar: {
    current: number
    estimated_remaining_seconds: number
  }
  routes_info: any[]
  best_candidates: any[]
  metrics: any[]
  generalInfo: ArrayItems
  infoLogs: string
  info: (string | number)[][]
  exception: Exception
  alert: Alert
}

interface OptimizationRoute {
  symbol: string
  timeframe: string
  strategy: string
}

interface OptimizationGeneralInfoEvent {
  started_at: string
  index: number
  average_execution_seconds: number
  trading_route: string
  population_size?: number
  iterations?: number
  solution_length?: number
}

interface bestCandidatesEvent {
  rank: number
  dna: string
  fitness: number
  training_win_rate: number
  training_total_trades: number
  training_pnl: number
  testing_win_rate: number
  testing_total_trades: number
  testing_pnl: number
}
