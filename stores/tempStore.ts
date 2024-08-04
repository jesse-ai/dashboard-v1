import { defineStore } from 'pinia'

export const useTempStore = defineStore('temp', {
  state: () => ({
    initiated: false
  })
})
