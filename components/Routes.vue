<template>
  <div id="routes-section" class="select-none">
    <DividerWithButtons title="Routes">
      <div class="w-full flex justify-center">
        <button
          type="button"
          class="inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 dark:border-gray-900 text-sm leading-5 font-medium rounded-l-full text-gray-700 dark:text-gray-100 bg-white dark:bg-backdrop-dark hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
          @click="addRoute">
          <PlusIcon class="-ml-1.5 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          <span>Trading Route</span>
        </button>
        <button
          type="button"
          class="inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 dark:border-gray-900 text-sm leading-5 font-medium rounded-r-full text-gray-700 dark:text-gray-100 bg-white dark:bg-backdrop-dark hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
          @click="addDataRoute">
          <PlusIcon class="-ml-1.5 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          <span>Data Route</span>
        </button>
      </div>
    </DividerWithButtons>

    <!--
   ================================
    Trading Routes
   ================================
  -->
    <div
      v-for="(r, i) in form.routes" :key="r.symbol + i"
      class="flex mt-4"
    >
      <!-- symbol -->
      <USelectMenu
        v-model="r.symbol"
        v-model:query="typedSymbol"
        class="w-full"
        :ui="{ rounded: 'rounded-none rounded-l' }"
        searchable
        searchable-placeholder="Search symbols..."
        size="lg"
        :options="displayedSymbols"
        placeholder="Select a symbol...">
        <template #empty>Start typing...</template>
      </USelectMenu>

      <!-- timeframe -->
      <USelectMenu
        v-model="r.timeframe"
        class="w-full"
        :ui="{ rounded: 'rounded-none' }"
        size="lg"
        :options="timeframes"
      />

      <USelectMenu
        v-model="r.strategy"
        class="w-full"
        :ui="{ rounded: 'rounded-none rounded-r' }"
        size="lg"
        :options="strategies"
        searchable
      />

      <!--  buttons    -->
      <UButton
        v-if="form.routes.length > 1"
        class=""
        size="lg"
        variant="link"
        color="gray"
        icon="i-heroicons-trash"
        :disabled="form.routes.length === 1"
        @click="deleteRoute(r)"
      />
      <UButton
        v-if="form.routes.length > 1"
        class=""
        size="lg"
        variant="link"
        color="gray"
        icon="i-heroicons-document-duplicate"
        :disabled="form.routes.length === 1"
        @click="duplicateRoutes(r)"
      />
      <UButton
        v-if="form.routes.length > 1"
        class=""
        size="lg"
        variant="link"
        color="gray"
        icon="i-heroicons-arrow-down"
        :disabled="form.routes.indexOf(r) === (form.routes.length - 1)"
        @click="moveDownRoutes(r)"
      />
      <UButton
        v-if="form.routes.length > 1"
        class=""
        size="lg"
        variant="link"
        color="gray"
        icon="i-heroicons-arrow-up"
        :disabled="form.routes.indexOf(r) === 0"
        @click="moveUpRoutes(r)"
      />
    </div>

    <!--
     ================================
      Data Routes
     ================================
    -->
    <Divider v-if="form.data_routes.length" class="mt-8 mb-4" title="Data Routes" />

    <div
      v-for="(r, i) in form.data_routes"
      :key="r.symbol + i + r.timeframe"
      class="flex mt-4"
    >
      <!-- symbol -->
      <USelectMenu
        v-model="r.symbol"
        v-model:query="typedSymbol"
        class="w-full"
        :ui="{ rounded: 'rounded-none rounded-l' }"
        searchable
        size="lg"
        :options="displayedSymbols"
        placeholder="Select a symbol...">
        <template #empty>Start typing...</template>
      </USelectMenu>

      <!-- timeframe -->
      <USelectMenu
        v-model="r.timeframe"
        class="w-full"
        :ui="{ rounded: 'rounded-none rounded-r' }"
        size="lg"
        :options="timeframes"
      />

      <!--  buttons    -->
      <UButton
        size="lg"
        variant="link"
        color="gray"
        icon="i-heroicons-trash"
        @click="deleteDataRoute(r)"
      />
      <UButton
        v-if="form.routes.length > 1"
        class=""
        size="lg"
        variant="link"
        color="gray"
        icon="i-heroicons-document-duplicate"
        @click="duplicateDataRoutes(r)"
      />
      <UButton
        v-if="form.data_routes.length > 1"
        class=""
        size="lg"
        variant="link"
        color="gray"
        icon="i-heroicons-arrow-down"
        :disabled="form.data_routes.indexOf(r) === (form.data_routes.length - 1)"
        @click="moveDownDataRoutes(r)"
      />
      <UButton
        v-if="form.data_routes.length > 1"
        class=""
        size="lg"
        variant="link"
        color="gray"
        icon="i-heroicons-arrow-up"
        :disabled="form.data_routes.indexOf(r) === 0"
        @click="moveUpDataRoutes(r)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
} from '@heroicons/vue/24/solid'
import { computed, ref, watchEffect } from 'vue'
import { useMainStore } from '~/stores/mainStore'


const props = defineProps<{
  mode: string
  timeframes: string[]
  symbols: string[]
  form: BacktestForm | OptimizationForm | LiveForm
  results: BacktestResults | OptimizationResults | LiveResults
  totalRoutesError: string[]
}>()
const displayedSymbols = ref<string[]>([])
const typedSymbol = ref('')
const mainStore = useMainStore()
const copiedDataRoutes = ref({ data_routes: props.form.data_routes })
const copiedRoutes = ref({ routes: props.form.routes })
const ERRORS = reactive({
  uniqueRoutesErrorMessage: 'each exchange-symbol pair can be traded only once! More info: https://docs.jesse.trade/docs/routes.html#trading-multiple-routes',
  maxSymbolLengthErrorMessage: 'Maximum symbol length is exceeded!',
  mustContainDashErrorMessage: 'Symbol parameter must contain "-" character!',
  timeframeMustBeDifferentErrorMessage: 'Data routes\' timeframe and trading routes\' timeframe must be different',
  emptyParameter: 'You must fill all the parameters',
  invalidSymbol: 'Symbol is invalid'
})

const strategies = computed(() => mainStore.strategies)


watchEffect(() => {
  copiedDataRoutes.value = { data_routes: props.form.data_routes }
  copiedRoutes.value = { routes: props.form.routes }
  initiate()
  checkRoutes()
})

function initiate() {
  if (props.form.routes.length) {
    return
  }
  props.form.routes.push({
    symbol: '',
    timeframe: mainStore.jesseSupportedTimeframes[0],
    strategy: mainStore.strategies[0],
  })
}

function checkRoutes() {
  props.totalRoutesError.splice(0, props.totalRoutesError.length)
  // check routes symbols
  for (const item of props.form.routes) {
    CheckRoutesSymbol(item)
  }
  // check extra routes symbols
  if (props.form.data_routes.length > 0) {
    for (const item of props.form.data_routes) {
      CheckRoutesSymbol(item)
    }
  }

  let checkBreakLoop = false
  const tempRoutes = props.form.routes
  for (const item of tempRoutes.slice(0, -1)) {
    if (props.totalRoutesError.includes(ERRORS.uniqueRoutesErrorMessage) || checkBreakLoop)
      break

    for (const item1 of tempRoutes.slice(tempRoutes.indexOf(item) + 1,)) {
      if (item.strategy === item1.strategy && item.symbol === item1.symbol && item.symbol.length !== 0) {
        props.totalRoutesError.push(ERRORS.uniqueRoutesErrorMessage)
        checkBreakLoop = false
        break
      }
    }
  }

  let checkBreakExtraLoop = false
  const tempDataRoutes = props.form.data_routes
  for (const item of tempDataRoutes.slice(0, -1)) {
    if (props.totalRoutesError.includes(ERRORS.uniqueRoutesErrorMessage) || checkBreakExtraLoop)
      break

    for (const item1 of tempDataRoutes.slice(tempDataRoutes.indexOf(item) + 1)) {
      if (item.timeframe === item1.timeframe && item.symbol === item1.symbol) {
        props.totalRoutesError.push(ERRORS.uniqueRoutesErrorMessage)
        checkBreakExtraLoop = true
        break
      }
    }
  }

  if (props.form.data_routes.length > 0) {
    for (const item of tempDataRoutes) {
      if (props.totalRoutesError.includes(ERRORS.timeframeMustBeDifferentErrorMessage) || checkBreakLoop)
        break

      for (const item1 of props.form.routes) {
        if (item.symbol === item1.symbol && item.timeframe === item1.timeframe) {
          props.totalRoutesError.push(ERRORS.timeframeMustBeDifferentErrorMessage)
          checkBreakExtraLoop = true
          break
        }
      }
    }
  }
}

function CheckRoutesSymbol(item: Route | DataRoute) {
  if (!props.totalRoutesError.includes(ERRORS.emptyParameter) && (item.symbol.length == 0 || item.timeframe.length == 0)) {
    props.totalRoutesError.push(ERRORS.emptyParameter)
  }
}

function addRoute() {
  props.form.routes.push({
    symbol: '',
    timeframe: mainStore.jesseSupportedTimeframes[0],
    strategy: mainStore.strategies[0],
  })
}

function addDataRoute() {
  props.form.data_routes.push({
    symbol: '',
    timeframe: mainStore.jesseSupportedTimeframes[0],
  })
}

function deleteRoute(item: Route) {
  const index = props.form.routes.indexOf(item)
  if (props.form.routes.length !== 1 && index > -1) {
    props.form.routes.splice(index, 1)
  }
}

function deleteDataRoute(item: DataRoute) {
  const index = props.form.data_routes.indexOf(item)
  if (props.form.data_routes.length !== 0 && index > -1) {
    props.form.data_routes.splice(index, 1)
  }
}

function duplicateRoutes(item: Route) {
  const itemIndex = props.form.routes.indexOf(item)
  const newItem = {
    strategy: item.strategy,
    symbol: '',
    timeframe: item.timeframe,
  }
  props.form.routes.splice(itemIndex + 1, 0, newItem)
}

function duplicateDataRoutes(item: DataRoute) {
  const itemIndex = props.form.data_routes.indexOf(item)
  const newItem = {
    symbol: '',
    timeframe: item.timeframe,
  }
  props.form.data_routes.splice(itemIndex + 1, 0, newItem)
}

function moveUpRoutes(item: Route) {
  const itemIndex = props.form.routes.indexOf(item)
  if (itemIndex !== 0) {
    props.form.routes[itemIndex] = props.form.routes[itemIndex - 1]
    props.form.routes[itemIndex - 1] = item
  }
}

function moveUpDataRoutes(item: DataRoute) {
  const itemIndex = props.form.data_routes.indexOf(item)
  if (itemIndex !== 0) {
    props.form.data_routes[itemIndex] = props.form.data_routes[itemIndex - 1]
    props.form.data_routes[itemIndex - 1] = item
  }
}

function moveDownRoutes(item: Route) {
  const itemIndex = props.form.routes.indexOf(item)
  if (itemIndex !== props.form.routes.length - 1) {
    props.form.routes[itemIndex] = props.form.routes[itemIndex + 1]
    props.form.routes[itemIndex + 1] = item
  }
}

function moveDownDataRoutes(item: DataRoute) {
  const itemIndex = props.form.data_routes.indexOf(item)
  if (itemIndex !== props.form.data_routes.length - 1) {
    props.form.data_routes[itemIndex] = props.form.data_routes[itemIndex + 1]
    props.form.data_routes[itemIndex + 1] = item
  }
}

watch(() => typedSymbol.value, (val) => {
  if (val.length == 0) {
    displayedSymbols.value = []
    return
  }

  const temp = []
  for (const symbol of props.symbols) {
    if (temp.length > 50) break

    if (symbol.toLowerCase().startsWith(val.toLowerCase())) {
      temp.push(symbol)
    }
  }

  displayedSymbols.value = temp
})
</script>
