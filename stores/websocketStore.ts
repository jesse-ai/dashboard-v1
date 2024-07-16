import { defineStore } from 'pinia'
import { useMainStore } from './mainStore'
import socketActions from '@/utils/socketActions'

export const useSocketStore = defineStore('socket', {
  state: () => ({
    isConnected: false,
    socket: null as WebSocket | null,
    reconnectInterval: 2000,
    reconnectAttempts: 0
  }),
  actions: {
    handleError(errorMessage: string, error: any) {
      console.error(errorMessage, error)
      showNotification('error', errorMessage)
    },
    initiate() {
      try {
        let wsPath = ''
        if (useRuntimeConfig().public.appEnv === 'production') {
          wsPath = ((window.location.protocol === 'https:') ? 'wss://' : 'ws://') + window.location.host + '/ws'
        }
        else {
          wsPath = `${useRuntimeConfig().public.wsUrl}`
        }

        this.socket = new WebSocket(`${wsPath}?token=${useMainStore().authToken}`)

        this.socket.addEventListener('open', () => {
          this.isConnected = true
          if (this.reconnectAttempts > 0) {
            showNotification('success', 'Reconnected to the websocket server')
          }
          else {
            showNotification('success', 'Connected to the websocket server')
          }
          this.reconnectAttempts = 0
          this.socket?.addEventListener('message', this.handleMessage)
        })

        this.socket.addEventListener('close', () => {
          this.handleError('Websocket connection closed. Trying to reconnect...', null)
          this.disconnect()
          this.reconnect()
        })

        if (this.reconnectAttempts === 0) {
          this.socket.addEventListener('error', (event) => {
            this.handleError('An error occurred with the websocket', event)
          })
        }
      }
      catch (error) {
        this.handleError('An error occurred while initiating the websocket connection', error)
      }
    },
    disconnect() {
      try {
        this.socket?.close()
        this.isConnected = false
        this.reconnectAttempts = 0
      }
      catch (error) {
        this.handleError('An error occurred while disconnecting the websocket connection', error)
      }
    },
    reconnect() {
      try {
        if (this.reconnectAttempts < 10) { // limit the number of reconnection attempts
          setTimeout(() => {
            this.reconnectAttempts++
            this.initiate()
          }, this.reconnectInterval)
        }
        else {
          this.handleError('Failed to reconnect to the websocket server', null)
        }
      }
      catch (error) {
        this.handleError('An error occurred while reconnecting the websocket connection', error)
      }
    },
    handleMessage(message: MessageEvent) {
      try {
        const parsedData: WebSocketData = JSON.parse(message.data)
        const actions = socketActions().get(parsedData.event)

        if (actions !== undefined) {
          actions.forEach((action) => {
            action(parsedData.id, parsedData.data)
          })
        }
      }
      catch (error) {
        this.handleError('Error parsing websocket message data:', error)
      }
    }
  }
})
