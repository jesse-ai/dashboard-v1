import { defineStore } from 'pinia'
import { useMainStore } from './mainStore'
import socketActions from '@/utils/socketActions'


export const useSocketStore = defineStore('socket', {
  state: () => ({
    isConnected: false,
    socket: {} as WebSocket
  }),
  actions: {
    initiate () {
      this.socket = new WebSocket(`${useRuntimeConfig().public.wsUrl}?token=${useMainStore().authToken}`)
      this.socket.addEventListener('open', () => {
        this.isConnected = true

        this.socket.addEventListener('message', async (message) => {
          const parsedData = JSON.parse(message.data)
          const event = parsedData.event
          const data = parsedData.data
          const id = parsedData.id
          const actions = socketActions().get(event)

          if (actions !== undefined) {
            actions.forEach((action) => {
              action(id, data)
            })
          }
        })
      })
    },
    disconnect () {
      this.socket.close()
      this.isConnected = false
    }
  }
})
