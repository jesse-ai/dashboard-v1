import { defineStore } from 'pinia'
import _ from 'lodash'
import helpers from '@/utils/helpers'

function newTab() {
  return _.cloneDeep({
    id: helpers.uuid(),
    form: {
      start_date: '2021-01-01',
      exchange: '',
      symbol: '',
    },
    results: {
      showResults: false,
      executing: false,
      progressbar: {
        current: 0,
        estimated_remaining_seconds: 0
      },
      metrics: [],
      infoLogs: '',
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

export const useCandlesStore = defineStore('candles', {
  state: () => ({
    tabs: {} as CandleTabs
  }),
  persist: {
    storage: persistedState.localStorage,
  },
  actions: {
    async init(activeWorkers: Set<string>) {
      for (const key in this.tabs) {
        const tab = this.tabs[key]
        if (tab.results.executing && !tab.results.exception.error) {
          // if the tab is executing, we need to sync the tab with the server
          if (!activeWorkers.has(tab.id)) {
            // if the tab is not in the active workers list, we need to cancel it
            await this.cancel(tab.id)
          }
        }
      }
    },
    async addTab() {
      const tab = newTab()
      this.tabs[tab.id] = tab
      await navigateTo(`/candles/${tab.id}`)
    },
    closeTab(id: string) {
      delete this.tabs[id]
      navigateTo('/candles')
    },
    startInNewTab(id: string) {
      const tab = newTab()
      tab.form = _.cloneDeep(this.tabs[id].form)
      this.tabs[tab.id] = tab
      this.start(tab.id)
    },
    async start(id: string) {
      this.tabs[id].results.progressbar.current = 0
      this.tabs[id].results.executing = true
      this.tabs[id].results.infoLogs = ''
      this.tabs[id].results.exception.traceback = ''
      this.tabs[id].results.exception.error = ''
      this.tabs[id].results.alert.message = ''

      const { data, error } = await usePostApi('/import-candles', { id, exchange: this.tabs[id].form.exchange, symbol: this.tabs[id].form.symbol, start_date: this.tabs[id].form.start_date }, true)

      if (error.value && error.value.statusCode !== 200) {
        showNotification('error', error.value.message)
        return
      }
    },
    async cancel(id: string) {
      if (this.tabs[id].results.exception.error) {
        this.tabs[id].results.executing = false
        return
      }

      const { data, error } = await usePostApi('/cancel-import-candles', { id }, true)

      if (error.value && error.value.statusCode !== 200) {
        showNotification('error', error.value.message)
        return
      }

      this.tabs[id].results.executing = false
    },

    progressbarEvent(id: string, data: ProgressBar) {
      this.tabs[id].results.progressbar = data

      if (this.tabs[id].results.progressbar.current < 100 && this.tabs[id].results.executing === false) {
        this.tabs[id].results.executing = true
      }
    },
    alertEvent(id: string, data: Alert) {
      this.tabs[id].results.alert = data

      // session is finished:
      this.tabs[id].results.progressbar.current = 100
      this.tabs[id].results.executing = false
      this.tabs[id].results.exception.traceback = ''
      this.tabs[id].results.exception.error = ''
    },
    infoLogEvent(id: string, data: { timestamp: number, message: string }) {
      this.tabs[id].results.infoLogs += `[${helpers.timestampToTime(
        data.timestamp
      )}] ${data.message}\n`
    },
    exceptionEvent(id: string, data: Exception) {
      this.tabs[id].results.exception.error = data.error
      this.tabs[id].results.exception.traceback = data.traceback
    },
    terminationEvent(id: string) {
      if (this.tabs[id].results.executing) {
        this.tabs[id].results.executing = false
        showNotification('success', 'Session terminated successfully')
      }
    }
  }
})
