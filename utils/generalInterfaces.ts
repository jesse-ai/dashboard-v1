interface Route {
  exchange: string
  symbol: string
  timeframe: string
  strategy: string
}

interface ExtraRoute {
  exchange: string
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

type ArrayItem = [string, number | string]

interface ArrayItems extends Array<ArrayItem> { }

interface Exception {
  error: string
  traceback: string
}

interface EquityCurve {
  time: number
  value: number
}

interface RoutesInfoEvent {
  exchange: string
  symbol: string
  timeframe: string
  strategy_name: string
}

interface RouteInfo {
  value: string
  style: string
}

interface EquityCurveEvent {
  timestamp: number
  balance: number
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

interface CandlesInfoEvent {
  duration: string
  starting_time: number
  finishing_time: number
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

interface GetExchangeApiKeysResponse {
  status: string
  data: ExchangeApiKey[]
}

interface DeleteExchangeApiKeyResponse {
  status: string
  message: string
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
