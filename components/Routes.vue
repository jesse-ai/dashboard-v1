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
        class="w-full"
        :ui="{ rounded: 'rounded-none rounded-l' }"
        searchable
        size="lg"
        :options="['BTC-USDT', 'ETH-USDT']"
        placeholder="ex: BTC-USDT" />

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
      v-for="(r, i) in form.data_routes" :key="r.symbol + i + r.timeframe"
      class="w-full flex border shadow-sm dark:bg-backdrop-dark dark:border-gray-900 rounded-lg my-4">
      <!-- symbol -->
      <input
        v-model="r.symbol" type="text"
        class="bg-white dark:bg-gray-900 cursor-pointer w-full pl-3.5 py-2.5 border-0 border-r border-gray-300 dark:border-gray-700 focus:outline-none  rounded-l-lg"
        placeholder="ex: BTC-USDT">

      <!-- timeframe -->
      <select
        v-model="r.timeframe"
        class="bg-white dark:bg-gray-900 cursor-pointer w-full pl-3.5 py-2.5 border-0 border-r border-gray-300 dark:border-gray-700 focus:outline-none">
        <option v-for="item in timeframes" :key="item">{{ item }}</option>
      </select>

      <!-- More Button -->
      <div
        class="flex flex-col items-center justify-center cursor-pointer bg-white dark:bg-gray-900 rounded-r-lg">
        <Menu as="div" class="relative block h-full w-full">
          <MenuButton class="px-5 block text-left h-full w-full focus:outline-none">
            <EllipsisVerticalIcon class="h-8 w-8 text-gray-400" />
          </MenuButton>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems
              class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-backdrop-dark dark:border-gray-900 z-10 ring-1 ring-black dark:ring-gray-900 ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-900 focus:outline-none">
              <div class="py-1">
                <MenuItem @click="deleteDataRoute(r)">
                  <a
                    class="dark:hover:bg-gray-700 group flex items-center px-4 py-2 text-sm">
                    <TrashIcon class="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" aria-hidden="true" />
                    Delete
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }" @click="duplicateDataRoutes(r)">
                  <a
                    :class="[active ? 'bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300', 'group flex items-center px-4 py-2 text-sm']">
                    <DocumentDuplicateIcon
                      class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true" />
                    Duplicate
                  </a>
                </MenuItem>
              </div>
              <div class="py-1">
                <MenuItem @click="moveUpDataRoutes(r)">
                  <a
                    :class="[form.data_routes.indexOf(r) !== 0 ? 'dark:hover:bg-gray-700' : 'text-gray-200 dark:text-gray-600 cursor-not-allowed', 'group flex items-center px-4 py-2 text-sm']">
                    <ArrowUpCircleIcon
                      :class="[form.data_routes.indexOf(r) !== 0 ? 'text-gray-400 group-hover:text-gray-500' : 'text-gray-200 group-hover:text-gray-200 dark:text-gray-600 dark:group-hover:text-gray-600', 'mr-3 h-5 w-5']"
                      aria-hidden="true" />
                    Move Up
                  </a>
                </MenuItem>
                <MenuItem @click="moveDownDataRoutes(r)">
                  <a
                    :class="[form.data_routes.indexOf(r) !== (form.data_routes.length - 1) ? 'dark:hover:bg-gray-700' : 'text-gray-200 dark:text-gray-600 cursor-not-allowed', 'group flex items-center px-4 py-2 text-sm']">
                    <ArrowDownCircleIcon
                      :class="[form.data_routes.indexOf(r) !== (form.data_routes.length - 1) ? 'text-gray-400 group-hover:text-gray-500' : 'text-gray-200 group-hover:text-gray-200 dark:text-gray-600 dark:group-hover:text-gray-600', 'mr-3 h-5 w-5']"
                      aria-hidden="true" />
                    Move Down
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/vue/24/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '~/stores/mainStore'

const route = useRoute()

const props = defineProps<{
  mode: string
  timeframes: string[]
  form: BacktestForm | OptimizationForm | LiveForm
  results: BacktestResults | OptimizationResults | LiveResults
  totalRoutesError: string[]
}>()

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
  if (!props.totalRoutesError.includes(ERRORS.emptyParameter) && (item.symbol.length == 0 || item.timeframe.length == 0))
    props.totalRoutesError.push(ERRORS.emptyParameter)
  else if (!props.totalRoutesError.includes(ERRORS.emptyParameter)) {
    if (!props.totalRoutesError.includes(ERRORS.invalidSymbol) && item.symbol.length < 4)
      props.totalRoutesError.push(ERRORS.invalidSymbol)
    else if (!props.totalRoutesError.includes(ERRORS.mustContainDashErrorMessage) && !item.symbol.includes('-'))
      props.totalRoutesError.push(ERRORS.mustContainDashErrorMessage)

    if (!props.totalRoutesError.includes(ERRORS.maxSymbolLengthErrorMessage) && item.symbol.length > 9)
      props.totalRoutesError.push(ERRORS.maxSymbolLengthErrorMessage)
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
</script>
