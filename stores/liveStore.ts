import { defineStore } from 'pinia'
import _ from 'lodash'
import helpers from '@/utils/helpers'
import { useMainStore } from '~/stores/mainStore'

let idCounter = 0

function newTab(): LiveTab {
    return _.cloneDeep({
        id: ++idCounter,
        session_id: '',
        name: 'Tab 0',
        form: {
            debug_mode: true,
            paper_mode: true,
            routes: [],
            extra_routes: []
        },
        results: {
            showResults: false,
            booting: false,
            monitoring: false,
            finished: false,
            terminating: false,
            progressbar: {
                current: 0,
                estimated_remaining_seconds: 0
            },
            routes_info: [],
            routes: [],
            metrics: [],
            generalInfo: {},
            positions: [],
            orders: [],
            watchlist: [],
            candles: [],
            currentCandles: {},
            infoLogs: '',
            errorLogs: '',
            exception: {
                error: '',
                traceback: ''
            },
            charts: {
                equity_curve: []
            },
            info: []
        }
    })
}

export const useLiveStore = defineStore('Live', {
    state: () => ({
        tabs: {
            1: newTab()
        } as LiveTabs
    }),
    actions: {
        async addTab() {
            const tab = newTab()
            this.tabs[tab.id] = tab
            await navigateTo(`/live/${tab.id}`)
        },
        startInNewTab(id: number) {
            const tab = newTab()
            tab.form = _.cloneDeep(this.tabs[id].form)
            this.tabs[tab.id] = tab
            this.start(tab.id)
        },
        reset(id: number) {
            this.tabs[id].results.progressbar.current = 0
            this.tabs[id].results.booting = true
            this.tabs[id].results.finished = false
            this.tabs[id].results.infoLogs = ''
            this.tabs[id].results.errorLogs = ''
            this.tabs[id].results.exception.traceback = ''
            this.tabs[id].results.exception.error = ''
            this.tabs[id].results.routes_info = []
            this.tabs[id].results.metrics = []
            this.tabs[id].results.generalInfo = {}
            this.tabs[id].results.positions = []
            this.tabs[id].results.orders = []
            this.tabs[id].results.candles = []
            this.tabs[id].results.currentCandles = {}
            this.tabs[id].results.watchlist = []
        },
        async start(id: number) {
            this.reset(id)

            const mainStore = useMainStore()

            // make sure symbols are uppercase
            this.tabs[id].form.routes = this.tabs[id].form.routes.map((route: Route) => {
                route.symbol = route.symbol.toUpperCase()
                return route
            })
            // also for extra_routes
            this.tabs[id].form.extra_routes = this.tabs[id].form.extra_routes.map((route: ExtraRoute) => {
                route.symbol = route.symbol.toUpperCase()
                return route
            })
            const { data, error } = await usePostApi('/live', { id, routes: this.tabs[id].form.routes, extra_routes: this.tabs[id].form.extra_routes, config: mainStore.settings.live, debug_mode: this.tabs[id].form.debug_mode, paper_mode: this.tabs[id].form.paper_mode }, true)

            if (error.value && error.value.statusCode !== 200) {
                showNotification('error', error.value.data.message)
                return
            }
        },
        async cancel(id: number) {
            const { data, error } = await usePostApi('/cancel-live', { id, paper_mode: this.tabs[id].form.paper_mode }, true)

            if (error.value && error.value.statusCode !== 200) {
                showNotification('error', error.value.data.message)
                return
            }

            this.tabs[id].results.booting = false
        },
        async stop(id: number) {
            const { data, error } = await usePostApi('/cancel-live', { id, paper_mode: this.tabs[id].form.paper_mode }, true)

            if (error.value && error.value.statusCode !== 200) {
                showNotification('error', error.value.data.message)
                return
            }
            this.tabs[id].results.terminating = true
        },
        newLive(id: number) {
            this.tabs[id].results.monitoring = false
            this.tabs[id].results.finished = false
        },
        candlesInfoEvent(id: number, data: CandlesInfoEvent) {
            this.tabs[id].results.info = [
                ['Period', data.duration],
                ['Starting-Ending Date', `${helpers.timestampToDate(data.starting_time)} => ${helpers.timestampToDate(data.finishing_time)}`]
            ]
        },
        routesInfoEvent(id: number, data: RoutesInfoEvent[]) {
            const arr: RouteInfo[][] = []
            data.forEach(item => {
                arr.push([
                    { value: item.exchange, style: '' },
                    { value: item.symbol, style: '' },
                    { value: item.timeframe, style: '' },
                    { value: item.strategy_name, style: '' },
                ])
            })
            this.tabs[id].results.routes_info = arr
        },
        progressbarEvent(id: number, data: ProgressBar) {
            this.tabs[id].results.progressbar = data
        },
        infoLogEvent(id: number, data: { timestamp: number, message: string }) {
            this.tabs[id].results.infoLogs += `[${helpers.timestampToTime(
                data.timestamp
            )}] ${data.message}\n`
        },
        errorLogEvent(id: number, data: { id: string, timestamp: number, message: string }) {
            showNotification('error', data.message)

            this.tabs[id].results.errorLogs += `[${helpers.timestampToTime(
                data.timestamp
            )}] ${data.message}\n`
        },
        exceptionEvent(id: number, data: Exception) {
            this.tabs[id].results.exception.error = data.error
            this.tabs[id].results.exception.traceback = data.traceback
        },
        generalInfoEvent(id: number, data: LiveGeneralInfoEvent) {
            this.tabs[id].results.generalInfo = data

            // set routes in both form.routes (maybe page was refreshed)
            this.tabs[id].form.routes = this.tabs[id].results.generalInfo.routes
            // and results.routes which is where the table is read from
            this.tabs[id].results.routes = []
            for (const item of this.tabs[id].form.routes) {
                this.tabs[id].results.routes.push([
                    { value: item.exchange, style: '' },
                    { value: item.symbol, style: '' },
                    { value: item.timeframe, style: '' },
                    { value: item.strategy, style: '' },
                ])
            }

            // turn on monitoring dashboard if haven't yet
            if (!this.tabs[id].results.monitoring) {
                this.tabs[id].results.booting = false
                this.tabs[id].results.monitoring = true
                this.fetchCandles(id)
                this.fetchLogs(id)
            }
        },
        async fetchCandles(id: number) {
            const { data, error } = await usePostApi('/get-candles', { id, exchange: this.tabs[id].form.routes[0].exchange, symbol: this.tabs[id].form.routes[0].symbol, timeframe: this.tabs[id].form.routes[0].timeframe }, true)
            if (error.value && error.value.statusCode !== 200) {
                showNotification('error', error.value.data.message)
                return
            }
            const res = data.value as GetCandlesResponse
            this.tabs[id].results.candles = res.data
        },
        async fetchLogs(id: number) {
            // info logs
            const { data, error } = await usePostApi('/get-logs', { id, session_id: this.tabs[id].results.generalInfo.session_id, type: 'info' }, true)

            if (error.value && error.value.statusCode !== 200) {
                showNotification('error', error.value.data.message)
                return
            }

            const res = data.value as GetLogsEvent
            const arr = res.data

            this.tabs[id].results.infoLogs = ''

            arr.forEach((data: LogsData) => {
                this.tabs[id].results.infoLogs += `[${helpers.timestampToTime(
                    data.timestamp
                )}] ${data.message}\n`
            })

            // error logs
            const { data: dataLog, error: errorLog } = await usePostApi('/get-logs', { id, session_id: this.tabs[id].results.generalInfo.session_id, type: 'error' }, true)

            if (errorLog.value && errorLog.value.statusCode !== 200) {
                showNotification('error', errorLog.value.data.message)
                return
            }

            const resLog = dataLog.value as GetLogsEvent
            const arrLog = resLog.data
            this.tabs[id].results.errorLogs = ''

            arrLog.forEach((data: LogsData) => {
                this.tabs[id].results.errorLogs += `[${helpers.timestampToTime(
                    data.timestamp
                )}] ${data.message}\n`
            })
        },
        currentCandlesEvent(id: number, data: CurrentCandlesObject) {
            this.tabs[id].results.currentCandles = data
        },
        watchlistEvent(id: number, data: [string, string][]) {
            this.tabs[id].results.watchlist = data
        },
        positionsEvent(id: number, data: positionsEvent[]) {
            this.tabs[id].results.positions = []

            for (const item of data) {
                const qty = item.type === 'close' ? '' : item.qty
                this.tabs[id].results.positions.push([
                    { value: item.symbol, style: '' },
                    { value: qty, style: helpers.colorBasedOnType(item.type), tooltip: `${item.value} ${item.currency}` },
                    { value: helpers.roundPrice(item.entry), style: '' },
                    { value: helpers.roundPrice(item.current_price), style: '' },
                    { value: item.liquidation_price ? helpers.roundPrice(item.liquidation_price) : '', style: '' },
                    { value: `${_.round(item.pnl, 2)} (${_.round(item.pnl_perc, 2)}%)`, style: helpers.colorBasedOnNumber(item.pnl) },
                ])
            }
        },
        ordersEvent(id: number, data: ordersEvent[]) {
            this.tabs[id].results.orders = data
        },
        metricsEvent(id: number, data: MetricsEvent) {
            this.tabs[id].results.metrics = [
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
        equityCurveEvent(id: number, data: EquityCurveEvent[]) {
            this.tabs[id].results.charts.equity_curve = []
            data.forEach((item: { balance: number, timestamp: number }) => {
                this.tabs[id].results.charts.equity_curve.push({
                    value: item.balance,
                    time: item.timestamp
                })
            })

            // live is finished, time to show charts:
            this.tabs[id].results.booting = false
            this.tabs[id].results.showResults = true
        },
        unexpectedTerminationEvent(id: number, data: { message: string }) {
            this.tabs[id].results.finished = true
        },
        terminationEvent(id: number) {
            if (!this.tabs[id].results.finished) {
                this.tabs[id].results.finished = true
                this.tabs[id].results.terminating = false
                showNotification('success', 'Session terminated successfully')
            }
        }
    }
})
