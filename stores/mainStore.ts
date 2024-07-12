import { defineStore } from 'pinia'
import { useThrottleFn } from '@vueuse/core'
import { usePostApi } from '~/composables/useApi'
import { handleError } from '~/composables/notifications'
import { useCandlesStore } from '~/stores/candleStore'
import { useBacktestStore } from '~/stores/backtestStore'
import { useOptimizationStore } from '~/stores/optimizationStore'
import { useLiveStore } from '~/stores/liveStore'

export const useMainStore = defineStore('main', {
  state: () => ({
    initiated: false,
    loadingVar: false,
    authToken: '',
    hasLivePluginInstalled: false,
    systemInfo: {} as SystemInfo,
    updateInfo: {} as UpdateInfo,
    plan: '',
    planLimits: {} as PlanLimits,
    settings: {
      backtest: {
        logging: {
          order_submission: true,
          order_cancellation: true,
          order_execution: true,
          position_opened: true,
          position_increased: true,
          position_reduced: true,
          position_closed: true,
          shorter_period_candles: false,
          trading_candles: true,
          balance_update: true,
        },
        warm_up_candles: 210,
        exchanges: {},
      },
      live: {
        persistency: true,
        generate_candles_from_1m: false,
        logging: {
          order_submission: true,
          order_cancellation: true,
          order_execution: true,
          position_opened: true,
          position_increased: true,
          position_reduced: true,
          position_closed: true,
          shorter_period_candles: false,
          trading_candles: true,
          balance_update: true,
        },
        warm_up_candles: 210,
        exchanges: {},
        notifications: {
          enabled: true,
          position_report_timeframe: '1h',
          events: {
            errors: true,
            started_session: true,
            terminated_session: true,
            submitted_orders: true,
            cancelled_orders: true,
            executed_orders: true,
            opened_position: true,
            updated_position: true,
          },
        },
      },
      optimization: {
        cpu_cores: 2,
        // sharpe, calmar, sortino, omega
        ratio: 'sharpe',
        warm_up_candles: 210,
        exchange: {
          balance: 10_000,
          fee: 0.001,
          type: 'futures',
          futures_leverage: 3,
          futures_leverage_mode: 'cross',
        },
      }
    } as Settings,
    strategies: [] as string[],
    exchangeInfo: {} as { [key: string]: Exchange },
    jesseSupportedTimeframes: [] as string[],
    exchangeSupportedSymbols: {} as ExchangeSupportedSymbols,
    skippedJesseVersions: [] as string[],
    skippedLivePluginVersions: [] as string[],
    activeWorkers: new Set<string>(),
    exchangeApiKeys: [] as ExchangeApiKey[],
    notificationApiKeys: [] as NotificationApiKey[],
  }),
  persist: {
    storage: persistedState.localStorage,
  },
  getters: {
    backtestingExchangeNames(): string[] {
      const arr = []
      for (const key in this.exchangeInfo) {
        if (this.exchangeInfo[key].modes.backtesting) {
          arr.push(key)
        }
      }
      // sort ar's items by name alphabetically
      return arr.sort()
    },
    liveTradingExchangeNames(): string[] {
      const arr = []
      for (const key in this.exchangeInfo) {
        if (this.exchangeInfo[key].modes.live_trading) {
          arr.push(key)
        }
      }
      // sort ar's items by name alphabetically
      return arr.sort()
    },
    isAuthenticated(): boolean {
      return this.authToken !== ''
    },
  },
  actions: {
    async initiate() {
      const { data, error } = await usePostApi('/general-info', {}, true)
      if (error && error.value && error.value.statusCode !== 200) {
        handleError(error)
        return
      }

      const res = data.value as GeneralInfoResponse
      this.systemInfo = res.system_info
      this.updateInfo = res.update_info
      this.strategies = res.strategies
      this.exchangeInfo = res.exchanges
      this.jesseSupportedTimeframes = res.jesse_supported_timeframes
      this.hasLivePluginInstalled = res.has_live_plugin_installed
      this.plan = res.plan
      this.planLimits = res.limits
      // create the list of exchanges by setting the default values (further down we
      // will override the default values with the user's settings fetched from the database)
      // loop through the this.exchangeInfo object
      for (const key in this.exchangeInfo) {
        const value = this.exchangeInfo[key]

        // for backtests
        if (value.modes.backtesting) {
          this.settings.backtest.exchanges[key] = {
            name: key,
            fee: value.fee,
            balance: 10000,
            type: value.type,
          }
          if (value.type === 'futures') {
            this.settings.backtest.exchanges[key].futures_leverage_mode = 'cross'
            this.settings.backtest.exchanges[key].futures_leverage = 2
          }
        }

        // for live trading
        if (value.modes.live_trading) {
          this.settings.live.exchanges[value.name] = {
            name: key,
            fee: value.fee,
            futures_leverage_mode: 'cross',
            futures_leverage: 2,
            balance: 10_000,
          }
        }
      }

      const { data: postData, error: postError } = await usePostApi('/get-config', { current_config: this.settings }, true)
      if (postError.value && postError.value.statusCode !== 200) {
        handleError(postError)
        return
      }
      const resConfig = postData.value as GetConfigResponse
      // fetch and merge the user's settings from the database
      this.settings = resConfig.data.data

      const { data: activeWorkersData, error: activeWorkersError } = await usePostApi('/active-workers', {}, true)
      if (activeWorkersError.value && activeWorkersError.value.statusCode !== 200) {
        handleError(activeWorkersError)
        return
      }
      const activeWorkersRes = activeWorkersData.value as ActiveWorkersResponse
      this.activeWorkers = new Set(activeWorkersRes.data)

      await this.syncOpenTabs()

      await this.fetchExchangeApiKeys()
      await this.fetchNotificationApiKeys()

      this.initiated = true
    },

    async syncOpenTabs() {
      // go through all the tabs and check if the current tab is open in another tab
      useCandlesStore().init(this.activeWorkers)
      useBacktestStore().init(this.activeWorkers)
      useOptimizationStore().init(this.activeWorkers)
      useLiveStore().init(this.activeWorkers)
    },

    updateConfig: useThrottleFn(async () => {
      if (!useMainStore().settings) return

      const { data, error } = await usePostApi('/update-config', { current_config: useMainStore().settings }, true)

      if (error.value && error.value.statusCode !== 200) {
        handleError(error)
      }
    }, 1000, true, true),

    async fetchExchangeApiKeys() {
      const { data, error } = await useFetchApi('/exchange-api-keys', true)
      if (error.value && error.value.statusCode !== 200) {
        handleError(error)
        return
      }

      const res = data.value as GetExchangeApiKeysResponse
      this.exchangeApiKeys = res.data
    },

    async fetchNotificationApiKeys() {
      const { data, error } = await useFetchApi('/notification-api-keys', true)
      if (error.value && error.value.statusCode !== 200) {
        handleError(error)
        return
      }

      const res = data.value as GetNotificationApiKeysResponse
      this.notificationApiKeys = res.data
    },

    setAuthToken(token: string) {
      this.authToken = token
    },

    async updateSupportedSymbols(exchange: string) {
      const { data, error } = await usePostApi('/exchange-supported-symbols', {
        exchange: exchange,
      }, true)

      if (error.value && error.value.statusCode !== 200) {
        showNotification('error', `[${error.value.statusCode}]: ${error.value.message}`)
        return
      }

      const res = data.value as ExchangeSupportedSymbolsResponse
      this.exchangeSupportedSymbols[exchange] = {
        data: res.data,
        updated_at: new Date(),
      }
    },

    async getExchangeSupportedSymbols(exchange: string) {
      // If it doesn't exist, first fetch it and then return it. If it does exist, check its updated add to see how long it's been. If it's been more than a day, again fetch it and then return it.
      if (!this.exchangeSupportedSymbols[exchange]) {
        await this.updateSupportedSymbols(exchange)
        return this.exchangeSupportedSymbols[exchange].data
      }

      const updatedAt = new Date(this.exchangeSupportedSymbols[exchange].updated_at)
      const now = new Date()
      const diff = now.getTime() - updatedAt.getTime()
      const diffDays = Math.ceil(diff / (1000 * 3600 * 24))

      if (diffDays > 1) {
        await this.updateSupportedSymbols(exchange)
      }

      return this.exchangeSupportedSymbols[exchange].data
    }
  }
})
