import { defineStore } from 'pinia'
import { usePostApi } from "~/composables/useApi";
import { useThrottleFn } from '@vueuse/core';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        authToken: '',
        hasLivePluginInstalled: false,
        systemInfo: {} as any,
        updateInfo: {} as UpdateInfo,
        planInfo: {} as PlanInfo,
        settings: {} as Settings,
        strategies: [] as string[],
        exchangeInfo: {} as { [key: string]: Exchange },
        jesseSupportedTimeframes: [],
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
            // sort arr's items by name alphabetically
            return arr.sort()
        },
        isAuthenticated(): boolean {
            return this.authToken !== ''
        }
    },
    actions: {
        async initiate() {
            const { data, error } = await usePostApi('/general-info', {}, true)

            if (error.value && error.value.statusCode !== 200) {
                showNotification('error', error.value.data.message)
                return
            }

            const res = data.value as GeneralInfoResponse
            this.systemInfo = res.system_info
            this.updateInfo = res.update_info
            this.strategies = res.strategies
            this.exchangeInfo = res.exchanges
            this.jesseSupportedTimeframes = res.jesse_supported_timeframes
            this.hasLivePluginInstalled = res.has_live_plugin_installed
            this.planInfo = res.plan_info
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
                showNotification('error', postError.value.data.message)
                return
            }
            const resConfig = postData.value as GetConfigResponse
            // fetch and merge the user's settings from the database
            this.settings = resConfig.data.data
        },

        updateConfig: useThrottleFn(async () => {
            if (!useAuthStore().settings) return
            const { data, error } = await usePostApi('/update-config', { current_config: useAuthStore().settings }, true)

            if (error.value && error.value.statusCode !== 200) {
                showNotification('error', error.value.data.message)
            }
        }, 1000,
            true, true
        ),

        setAuthToken(token: string) {
            this.authToken = token
        },
    }
})
