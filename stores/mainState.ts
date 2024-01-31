import { defineStore } from 'pinia'
import _ from 'lodash';

export const useMainStore = defineStore('main', {
    state: () => ({
        isInitiated: false
    }),
    actions: {
        initiate() {
            this.isInitiated = true
        }
    }
})