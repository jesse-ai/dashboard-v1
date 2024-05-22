import { CrosshairMode } from 'lightweight-charts'

export const settings = {
  width: 800,
  height: 380,
  crosshair: {
    mode: CrosshairMode.Normal
  },
}

export const lightTheme = {
  chart: {
    layout: {
      background: { color: '#ffffff' },
      textColor: 'rgba(33, 56, 77, 1)'
    },
    grid: {
      vertLines: {
        color: '#f1f1f1',
        visible: false,
      },
      horzLines: {
        color: '#f1f1f1',
        visible: false,
      }
    },
    priceScale: {
      borderColor: 'rgba(197, 203, 206, 0.6)'
    },
    timeScale: {
      borderColor: 'rgba(197, 203, 206, 0.6)',
      timeVisible: true,
      secondsVisible: false
    }
  },
  series: {
    color: '#4f46e5'
  }
}

export const darkTheme = {
  chart: {
    layout: {
      background: { color: '#333333' },
      textColor: '#D1D5DB'
    },
    grid: {
      vertLines: {
        color: '#525252',
        visible: false
      },
      horzLines: {
        color: '#525252',
        visible: false
      }
    },
    priceScale: {
      borderColor: '#525252'
    },
    timeScale: {
      borderColor: '#525252',
      timeVisible: true,
      secondsVisible: false
    }
  },
  series: {
    color: '#818CF8'
  }
}
