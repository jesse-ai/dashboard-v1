import { defineStore } from 'pinia'
import _ from 'lodash'
import helpers from '@/utils/helpers'
import { useAuthStore } from '@/stores/authState'

let idCounter = 0

function newTab(): OptimizationTab {
    return _.cloneDeep({
        id: ++idCounter,
        name: 'Tab 0',
        form: {
            start_date: '2021-01-01',
            finish_date: '2021-06-01',
            debug_mode: false,
            export_csv: false,
            export_json: false,
            routes: [],
            extra_routes: [],
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
            routes_info: [],
            best_candidates: [],
            metrics: [],
            generalInfo: [],
            infoLogs: '',
            info: [],
            exception: {
                error: '',
                traceback: ''
            },
            alert: {
                message: '',
                type: ''
            }
        }
    })
}

export const useOptimizationStore = defineStore('optimization', {
    state: () => ({
        tabs: {
            1: newTab()
        } as OptimizationTabs
    }),
    actions: {
        async addTab() {
            const tab = newTab()
            this.tabs[tab.id] = tab
            await navigateTo(`/optimization/${tab.id}`)
        },
        async startInNewTab(id: number) {
            const tab = newTab()
            tab.form = _.cloneDeep(this.tabs[id].form)
            this.tabs[tab.id] = tab
            this.start(tab.id)
        },
        async start(id: number) {
            this.tabs[id].results.progressbar.current = 0
            this.tabs[id].results.executing = true
            this.tabs[id].results.infoLogs = ''
            this.tabs[id].results.exception.traceback = ''
            this.tabs[id].results.exception.error = ''
            this.tabs[id].results.alert.message = ''
            this.tabs[id].results.alert.type = ''
            this.tabs[id].results.metrics = []
            this.tabs[id].results.generalInfo = []
            this.tabs[id].results.best_candidates = []
            this.tabs[id].results.routes_info = []
            this.tabs[id].results.showResults = false

            const authStore = useAuthStore()

            // make sure symbols are uppercase
            this.tabs[id].form.routes = this.tabs[id].form.routes.map(route => {
                route.symbol = route.symbol.toUpperCase()
                return route
            })
            // also for extra_routes
            this.tabs[id].form.extra_routes = this.tabs[id].form.extra_routes.map(route => {
                route.symbol = route.symbol.toUpperCase()
                return route
            })

            const params = {
                id,
                routes: this.tabs[id].form.routes,
                extra_routes: this.tabs[id].form.extra_routes,
                config: authStore.settings.optimization,
                start_date: this.tabs[id].form.start_date,
                finish_date: this.tabs[id].form.finish_date,
                optimal_total: this.tabs[id].form.optimal_total,
                debug_mode: this.tabs[id].form.debug_mode,
                export_csv: this.tabs[id].form.export_csv,
                export_json: this.tabs[id].form.export_json,
            }

            const { data, error } = await usePostApi('/optimization', params, true)
            if (error.value && error.value.statusCode !== 200) {
                showNotification('error', error.value.data.message)
                return
            }
        },
        async cancel(id: number) {
            // this.tabs[id].results.executing = false
            if (this.tabs[id].results.exception.error) {
                this.tabs[id].results.executing = false
                return
            }
            const { data, error } = await usePostApi('/cancel-optimization', { id }, true)
            if (error.value && error.value.statusCode !== 200) {
                showNotification('error', error.value.data.message)
                return
            }
        },
        rerun(id: number) {
            this.tabs[id].results.showResults = false
            this.start(id)
        },
        newOptimization(id: number) {
            this.tabs[id].results.showResults = false
        },

        candlesInfoEvent(id: number, data: any) {
            this.tabs[id].results.info = [
                ['Period', data.duration],
                [
                    'Starting-Ending Date',
                    `${helpers.timestampToDate(
                        data.starting_time
                    )} => ${helpers.timestampToDate(data.finishing_time)}`
                ]
            ]
        },
        routesInfoEvent(id: number, data: { exchange: string, symbol: string, timeframe: string, strategy_name: string }[]) {
            const arr: multiplesTablesValue[][] = []
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
        progressbarEvent(id: number, data: any) {
            this.tabs[id].results.progressbar = data
        },
        infoLogEvent(id: number, data: any) {
            this.tabs[id].results.infoLogs += `[${helpers.timestampToTime(
                data.timestamp
            )}] ${data.message}\n`
        },
        exceptionEvent(id: number, data: any) {
            this.tabs[id].results.exception.error = data.error
            this.tabs[id].results.exception.traceback = data.traceback
        },
        generalInfoEvent(id: number, data: GeneralInfoEvent) {
            if (!this.tabs[id].results.executing) {
                this.tabs[id].results.executing = true
            }

            this.tabs[id].results.generalInfo = [
                ['Started at', data.started_at],
                ['Index', data.index],
                ['Average strategy execution time', `${_.round(data.average_execution_seconds, 2)} seconds`],
                ['Trading route', data.trading_route],
            ]
            if ('population_size' in data) {
                this.tabs[id].results.generalInfo.push(['Population size', data.population_size ? data.population_size : ''])
            }
            if ('iterations' in data) {
                this.tabs[id].results.generalInfo.push(['Iterations', data.iterations ? data.iterations : ''])
            }
            if ('solution_length' in data) {
                this.tabs[id].results.generalInfo.push(['Solution length', data.solution_length ? data.solution_length : ''])
            }
        },
        metricsEvent(id: number, data: any) {
            // no trades were executed
            if (data === null) {
                this.tabs[id].results.metrics = []
                return
            }

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
        terminationEvent(id: number) {
            if (this.tabs[id].results.executing) {
                this.tabs[id].results.executing = false
                showNotification('success', 'Session terminated successfully')
            }
        },
        bestCandidatesEvent(id: number, data: bestCandidatesEvent[]) {
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
            this.tabs[id].results.best_candidates = arr
        },
        alertEvent(id: number, data: any) {
            this.tabs[id].results.alert = data
            this.tabs[id].results.executing = false
            this.tabs[id].results.showResults = true
        },
    }
})
