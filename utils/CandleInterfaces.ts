// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
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
