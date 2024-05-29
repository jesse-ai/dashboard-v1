import { defineStore } from 'pinia'
import _ from 'lodash'
import helpers from '@/utils/helpers'
import { useMainStore } from '~/stores/mainStore'


export const useOptimizationStore = defineStore('optimization', {
  state: () => ({
    form: {
      start_date: '2021-01-01',
      finish_date: '2021-06-01',
      debug_mode: false,
      export_csv: false,
      export_json: false,
      routes: [] as OptimizationRoute[],
      data_routes: [] as DataRoute[],
      optimal_total: 50,
    },
    results: {
      showResults: false,
      executing: false,
      logsModal: false,
      progressbar: {
        current: 0,
        estimated_remaining_seconds: 0
      },
      routes_info: [] as any[],
      best_candidates: [] as any[],
      metrics: [] as any[],
      generalInfo: [] as any[],
      infoLogs: '',
      info: [] as any[],
      exception: {
        error: '',
        traceback: ''
      },
      alert: {
        message: '',
        type: ''
      }
    }
  }),
  persist: {
    storage: persistedState.localStorage,
  },
  actions: {
    async init(activeWorkers: Set<string>) {
      if (this.results.executing && !this.results.exception.error) {
        // if the tab is executing, we need to sync the tab with the server
        if (!activeWorkers.has('optimization')) {
          // if the tab is not in the active workers list, we need to cancel it
          await this.cancel()
        }
      }
    },
    async start() {
      this.results.progressbar.current = 0
      this.results.executing = true
      this.results.infoLogs = ''
      this.results.exception.traceback = ''
      this.results.exception.error = ''
      this.results.alert.message = ''
      this.results.alert.type = ''
      this.results.metrics = []
      this.results.generalInfo = []
      this.results.best_candidates = []
      this.results.routes_info = []
      this.results.showResults = false

      const mainStore = useMainStore()

      // make sure symbols are uppercase
      this.form.routes = this.form.routes.map((route) => {
        route.symbol = route.symbol.toUpperCase()
        return route
      })
      // also for data_routes
      this.form.data_routes = this.form.data_routes.map((route) => {
        route.symbol = route.symbol.toUpperCase()
        return route
      })

      const params = {
        id: 'optimization',
        routes: this.form.routes,
        data_routes: this.form.data_routes,
        config: mainStore.settings.optimization,
        start_date: this.form.start_date,
        finish_date: this.form.finish_date,
        optimal_total: this.form.optimal_total,
        debug_mode: this.form.debug_mode,
        export_csv: this.form.export_csv,
        export_json: this.form.export_json,
      }

      const { data, error } = await usePostApi(
        '/optimization', params, true
      )
      if (error.value && error.value.statusCode !== 200) {
        showNotification('error', error.value.data.message)
        return
      }
    },
    async cancel() {
      // this.results.executing = false
      if (this.results.exception.error) {
        this.results.executing = false
        return
      }
      this.results.executing = false

      const { data, error } = await usePostApi('/cancel-optimization', {
        id: 'optimization'
      }, true)
      if (error.value && error.value.statusCode !== 200) {
        showNotification('error', error.value.data.message)
        return
      }
    },
    rerun() {
      this.results.showResults = false
      this.start()
    },
    candlesInfoEvent(id: string, data: CandlesInfoEvent) {
      this.results.info = [
        ['Period', data.duration],
        [
          'Starting-Ending Date',
          `${helpers.timestampToDate(
            data.starting_time
          )} => ${helpers.timestampToDate(data.finishing_time)}`
        ]
      ]
    },
    routesInfoEvent(id: string, data: RoutesInfoEvent[]) {
      const arr: RouteInfo[][] = []
      data.forEach((item) => {
        arr.push([
          { value: item.exchange, style: '' },
          { value: item.symbol, style: '' },
          { value: item.timeframe, style: '' },
          { value: item.strategy_name, style: '' },
        ])
      })
      this.results.routes_info = arr
    },
    progressbarEvent(id: string, data: ProgressBar) {
      this.results.progressbar = data
    },
    infoLogEvent(id: string, data: any) {
      this.results.infoLogs += `[${helpers.timestampToTime(
        data.timestamp
      )}] ${data.message}\n`
    },
    exceptionEvent(id: string, data: Exception) {
      this.results.exception.error = data.error
      this.results.exception.traceback = data.traceback
    },
    generalInfoEvent(id: string, data: OptimizationGeneralInfoEvent) {
      if (!this.results.executing) {
        this.results.executing = true
      }

      this.results.generalInfo = [
        ['Started at', data.started_at],
        ['Index', data.index],
        ['Average strategy execution time', `${_.round(data.average_execution_seconds, 2)} seconds`],
        ['Trading route', data.trading_route],
      ]
      if ('population_size' in data) {
        this.results.generalInfo.push(['Population size', data.population_size ? data.population_size : ''])
      }
      if ('iterations' in data) {
        this.results.generalInfo.push(['Iterations', data.iterations ? data.iterations : ''])
      }
      if ('solution_length' in data) {
        this.results.generalInfo.push(['Solution length', data.solution_length ? data.solution_length : ''])
      }
    },
    metricsEvent(id: string, data: MetricsEvent) {
      // no trades were executed
      if (data === null) {
        this.results.metrics = []
        return
      }

      this.results.metrics = [
        ['Total Closed Trades', data.total],
        ['Total Net Profit', `${_.round(data.net_profit, 2)} (${_.round(data.net_profit_percentage, 2)}%)`],
        ['Starting => Finishing Balance', `${_.round(data.starting_balance, 2)} => ${_.round(data.finishing_balance, 2)}`],
        ['Open Trades', data.total_open_trades],
        ['Total Paid Fees', _.round(data.fee, 2)],
        ['Max Drawdown', _.round(data.max_drawdown, 2)],
        ['Annual Return', `${_.round(data.annual_return, 2)}%`],
        ['Expectancy', `${_.round(data.expectancy, 2)} (${_.round(data.expectancy_percentage, 2)}%)`],
        ['Avg Win | Avg Loss', `${_.round(data.average_win, 2)} | ${_.round(data.average_loss, 2)}`],
        ['Ratio Avg Win / Avg Loss', _.round(data.ratio_avg_win_loss, 2)],
        ['Win-rate', `${_.round(data.win_rate * 100, 2)}%`],
        ['Longs | Shorts', `${_.round(data.longs_percentage, 2)}% | ${_.round(data.shorts_percentage, 2)}%`],
        ['Avg Holding Time', data.average_holding_period],
        ['Winning Trades Avg Holding Time', data.average_winning_holding_period],
        ['Losing Trades Avg Holding Time', data.average_losing_holding_period],
        ['Sharpe Ratio', _.round(data.sharpe_ratio, 2)],
        ['Calmar Ratio', _.round(data.calmar_ratio, 2)],
        ['Sortino Ratio', _.round(data.sortino_ratio, 2)],
        ['Omega Ratio', _.round(data.omega_ratio, 2)],
        ['Winning Streak', data.winning_streak],
        ['Losing Streak', data.losing_streak],
        ['Largest Winning Trade', _.round(data.largest_winning_trade, 2)],
        ['Largest Losing Trade', _.round(data.largest_losing_trade, 2)],
        ['Total Winning Trades', data.total_winning_trades],
        ['Total Losing Trades', data.total_losing_trades]
      ]
    },
    terminationEvent(id: string,) {
      if (this.results.executing) {
        this.results.executing = false
        showNotification('success', 'Session terminated successfully')
      }
    },
    bestCandidatesEvent(id: string, data: bestCandidatesEvent[]) {
      const arr: multiplesTablesValue[][] = []
      data.forEach((item: bestCandidatesEvent) => {
        arr.push([
          { value: `#${item.rank}`, style: '' },
          { value: item.dna, style: '', tag: 'code' },
          { value: item.fitness, style: '' },
          { value: `${item.training_win_rate}% | ${item.testing_win_rate}%`, style: '' },
          { value: `${item.training_total_trades} | ${item.testing_total_trades}`, style: '' },
          { value: `${item.training_pnl}% | ${item.testing_pnl}%`, style: '' },
        ])
      })
      this.results.best_candidates = arr
    },
    alertEvent(id: string, data: Alert) {
      this.results.alert = data
      this.results.executing = false
      this.results.showResults = true
    },
  }
})
