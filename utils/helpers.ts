import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

const helpers = {
  timestampToTime(timestamp: number) {
    const date = new Date(Number(timestamp))
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day} ${date.toUTCString().slice(17, 25)}`
  },

  timestampToTimeOnly(timestamp: number) {
    const date = new Date(Number(timestamp))
    return `${date.toUTCString().slice(17, 25)}`
  },

  timestampToDate(timestamp: number) {
    const date = new Date(Number(timestamp))
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  currentTime() {
    return new Date().toISOString().slice(11, 19)
  },

  secondsToHumanReadable(seconds: number) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds - (hours * 3600)) / 60)
    const secondsLeft = _.round(
      seconds - (hours * 3600) - (minutes * 60),
      2
    )
    return `${hours}h ${minutes}m ${secondsLeft}s`
  },

  remainingTimeText(seconds: number) {
    if (Math.round(seconds) === 0) {
      return 'Please wait...'
    }

    if (seconds > 60) {
      const remainingSecondsInReadableFormat = this.secondsToHumanReadable(
        seconds
      )

      return `${remainingSecondsInReadableFormat} remaining...`
    }

    return `${Math.round(seconds)} seconds remaining...`
  },

  /**
     * A helper function that rounds the input to 2 decimals but only if the number is bigger than 1.
     * Used for displaying prices
     */
  roundPrice(price: number) {
    if (price > 1) {
      return _.round(price, 2)
    }

    return price
  },

  colorBasedOnSide(orderSide: string) {
    if (orderSide === 'buy') {
      return 'text-green-600 dark:text-green-400'
    }
    else if (orderSide === 'sell') {
      return 'text-red-500 dark:text-red-400'
    }
    else {
      return 'text-gray-900 dark:text-gray-200'
    }
  },

  colorBasedOnType(positionType: string) {
    if (positionType === 'long') {
      return 'text-green-600 dark:text-green-400'
    }
    else if (positionType === 'short') {
      return 'text-red-500 dark:text-red-400'
    }
    else {
      return 'text-gray-900 dark:text-gray-200'
    }
  },

  colorBasedOnNumber(num: number) {
    if (num > 0) {
      return 'text-green-600 dark:text-green-400'
    }
    else if (num < 0) {
      return 'text-red-500 dark:text-red-400'
    }
    else {
      return 'text-gray-900 dark:text-gray-200'
    }
  },

  uuid() {
    return uuidv4()
  }
}

export default helpers
