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
    initiate() {
      this.socket = new WebSocket(`${useRuntimeConfig().public.wsUrl}?token=${useMainStore().authToken}`)

      this.socket.addEventListener('open', () => {
        this.isConnected = true
        this.reconnectAttempts = 0
        this.socket?.addEventListener('message', this.handleMessage)
      })

      this.socket.addEventListener('close', () => {
        this.disconnect()
        this.reconnect()
      })

      this.socket.addEventListener('error', this.handleError)
    },
    disconnect() {
      this.socket?.close()
      this.isConnected = false
      this.reconnectAttempts = 0
    },
    reconnect() {
      if (this.reconnectAttempts < 20) { // limit the number of reconnection attempts
        setTimeout(() => {
          this.reconnectAttempts++
          this.initiate()
        }, this.reconnectInterval)
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
        console.error('Error parsing message data:', error)
      }
    },
    handleError(error: Event) {
      showNotification('error', 'An error occurred with the websocket connection')
      this.reconnect()
    }
  }
})
