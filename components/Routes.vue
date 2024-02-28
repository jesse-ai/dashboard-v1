<template>
    <div id="routes-section" class="select-none">
        <DividerWithButtons title="Routes">
            <div class="w-full flex justify-center">
                <button type="button" class="inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 dark:border-gray-900 text-sm leading-5 font-medium rounded-l-full text-gray-700 dark:text-gray-100 bg-white dark:bg-backdrop-dark hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none" @click="addRoute">
                    <PlusIcon class="-ml-1.5 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>Trading Route</span>
                </button>
                <button type="button" class="inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 dark:border-gray-900 text-sm leading-5 font-medium rounded-r-full text-gray-700 dark:text-gray-100 bg-white dark:bg-backdrop-dark hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none" @click="addExtraRoute">
                    <PlusIcon class="-ml-1.5 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>Extra Route</span>
                </button>
            </div>
        </DividerWithButtons>

        <!--
       ================================
        Trading Routes
       ================================
      -->
        <div v-for="(r, i) in form.routes" :key="r.exchange + i" class="w-full flex border dark:bg-backdrop-dark dark:border-gray-900 rounded-lg my-4">
            <select v-model="r.exchange" class="bg-white dark:bg-gray-900 cursor-pointer w-full pl-3.5 py-2.5 border-0 border-r border-gray-300 dark:border-gray-700 focus:outline-none  rounded-l-lg">
                <option v-for="item in exchanges" :key="item.name" :disabled="!allowedToTradeIn(item.name)">{{ item.name }} {{ allowedToTradeIn(item.name) ? '' : ' (premium only)' }}</option>
            </select>

            <!-- symbol -->
            <input v-model="r.symbol" type="text" class="bg-white dark:bg-gray-900 w-full pl-3.5 py-2.5 border-0 border-r border-gray-300 dark:border-gray-700 focus:outline-none  " placeholder="ex: BTC-USDT">

            <!-- timeframe -->
            <select v-model="r.timeframe" class="bg-white dark:bg-gray-900 cursor-pointer w-full pl-3.5 py-2.5 border-0 border-r border-gray-300 dark:border-gray-700 focus:outline-none  ">
                <option v-for="item in getSupportedTimeframes(r.exchange)" :key="item">{{ item }}</option>
            </select>

            <select v-model="r.strategy" class="bg-white dark:bg-gray-900 cursor-pointer w-full pl-3.5 py-2.5 border-0 border-r border-gray-300 dark:border-gray-700 focus:outline-none  ">
                <option v-for="item in strategies" :key="item">{{ item }}</option>
            </select>

            <!-- More Button -->
            <div class="flex flex-col items-center justify-center cursor-pointer bg-white dark:bg-gray-900 rounded-r-lg">
                <Menu as="div" class="relative block h-full w-full">
                    <MenuButton class="px-5 block text-left h-full w-full focus:outline-none">
                        <EllipsisVerticalIcon class="h-8 w-8 text-gray-400" />
                    </MenuButton>

                    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                        <MenuItems class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-backdrop-dark z-10 ring-1 ring-black dark:ring-gray-900 ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-900 focus:outline-none">
                            <div class="py-1">
                                <MenuItem @click="deleteRoute(r)">
                                <a :name="'trading-delete-menu' + i" :class="[(form.routes.length > 1) ? 'dark:hover:bg-gray-700' : 'text-gray-200 dark:text-gray-600 cursor-not-allowed', 'group flex items-center px-4 py-2 text-sm']">
                                    <TrashIcon :class="[(form.routes.length > 1) ? 'text-gray-400 group-hover:text-gray-500' : 'text-gray-200 group-hover:text-gray-200 dark:text-gray-600 dark:group-hover:text-gray-600', 'mr-3 h-5 w-5']" aria-hidden="true" />
                                    Delete
                                </a>
                                </MenuItem>
                                <MenuItem v-slot="{ active }" @click="duplicateRoutes(r)">
                                <a :name="'trading-duplicate-menu' + i" :class="[active ? 'bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300', 'group flex items-center px-4 py-2 text-sm']">
                                    <DocumentDuplicateIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                    Duplicate
                                </a>
                                </MenuItem>
                            </div>
                            <div class="py-1">
                                <MenuItem @click="moveUpRoutes(r)">
                                <a :name="'trading-moveup-menu' + i" :class="[form.routes.indexOf(r) !== 0 ? 'dark:hover:bg-gray-700' : 'text-gray-200 dark:text-gray-600 cursor-not-allowed', 'group flex items-center px-4 py-2 text-sm']">
                                    <ArrowUpCircleIcon :class="[form.routes.indexOf(r) !== 0 ? 'text-gray-400 group-hover:text-gray-500' : 'text-gray-200 group-hover:text-gray-200 dark:text-gray-600 dark:group-hover:text-gray-600', 'mr-3 h-5 w-5']" aria-hidden="true" />
                                    Move Up
                                </a>
                                </MenuItem>
                                <MenuItem @click="moveDownRoutes(r)">
                                <a :name="'trading-movedown-menu' + i" :class="[form.routes.indexOf(r) !== (form.routes.length - 1) ? 'dark:hover:bg-gray-700' : 'text-gray-200 dark:text-gray-600 cursor-not-allowed', 'group flex items-center px-4 py-2 text-sm']">
                                    <ArrowDownCircleIcon :class="[form.routes.indexOf(r) !== (form.routes.length - 1) ? 'text-gray-400 group-hover:text-gray-500' : 'text-gray-200 group-hover:text-gray-200 dark:text-gray-600 dark:group-hover:text-gray-600', 'mr-3 h-5 w-5']" aria-hidden="true" />
                                    Move Down
                                </a>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
            </div>
        </div>

        <!--
       ================================
        Extra Routes
       ================================
      -->
        <Divider v-if="form.extra_routes.length" class="mt-8 mb-4" title="Extra Routes" />

        <div v-for="(r, i) in form.extra_routes" :key="r.exchange + i + r.timeframe" class="flex border dark:bg-backdrop-dark dark:border-gray-900 rounded-lg mb-4">
            <!-- exchange -->
            <select v-model="r.exchange" class="dark:bg-backdrop-dark dark:hover:bg-gray-700 hover:bg-gray-50 cursor-pointer w-full pl-3 pr-10 py-6 border-0 border-r border-gray-200 dark:border-gray-900 focus:outline-none   rounded-l-lg">
                <option v-for="item in exchanges" :key="item.name" :disabled="!allowedToTradeIn(item.name)">{{ item.name }} {{ allowedToTradeIn(item.name) ? '' : ' (premium only)' }}</option>
            </select>

            <!-- symbol -->
            <input v-model="r.symbol" type="text" class="dark:bg-backdrop-dark dark:hover:bg-gray-700 hover:bg-gray-50 w-full pl-3 pr-10 py-6 border-0 border-r border-gray-200 dark:border-gray-900 focus:outline-none  " placeholder="ex: BTC-USDT">

            <!-- timeframe -->
            <select v-model="r.timeframe" class="dark:bg-backdrop-dark dark:hover:bg-gray-700 hover:bg-gray-50 cursor-pointer w-full pl-3 pr-10 py-6 border-0 border-r border-gray-200 dark:border-gray-900 focus:outline-none  ">
                <option v-for="item in getSupportedTimeframes(r.exchange)" :key="item">{{ item }}</option>
            </select>

            <!-- More Button -->
            <div class="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-lg">
                <Menu as="div" class="relative block h-full w-full">
                    <MenuButton class="px-5 block text-left h-full w-full focus:outline-none">
                        <EllipsisVerticalIcon class="h-8 w-8 text-gray-400" />
                    </MenuButton>

                    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                        <MenuItems class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-backdrop-dark dark:border-gray-900 z-10 ring-1 ring-black dark:ring-gray-900 ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-900 focus:outline-none">
                            <div class="py-1">
                                <MenuItem @click="deleteExtraRoute(r)">
                                <a :name="'extra-delete-menu' + i" class="dark:hover:bg-gray-700 group flex items-center px-4 py-2 text-sm">
                                    <TrashIcon class="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" aria-hidden="true" />
                                    Delete
                                </a>
                                </MenuItem>
                                <MenuItem v-slot="{ active }" @click="duplicateExtraRoutes(r)">
                                <a :name="'extra-duplicate-menu' + i" :class="[active ? 'bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300', 'group flex items-center px-4 py-2 text-sm']">
                                    <DocumentDuplicateIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                    Duplicate
                                </a>
                                </MenuItem>
                            </div>
                            <div class="py-1">
                                <MenuItem @click="moveUpExtraRoutes(r)">
                                <a :name="'extra-moveup-menu' + i" :class="[form.extra_routes.indexOf(r) !== 0 ? 'dark:hover:bg-gray-700' : 'text-gray-200 dark:text-gray-600 cursor-not-allowed', 'group flex items-center px-4 py-2 text-sm']">
                                    <ArrowUpCircleIcon :class="[form.extra_routes.indexOf(r) !== 0 ? 'text-gray-400 group-hover:text-gray-500' : 'text-gray-200 group-hover:text-gray-200 dark:text-gray-600 dark:group-hover:text-gray-600', 'mr-3 h-5 w-5']" aria-hidden="true" />
                                    Move Up
                                </a>
                                </MenuItem>
                                <MenuItem @click="moveDownExtraRoutes(r)">
                                <a :name="'extra-movedown-menu' + i" :class="[form.extra_routes.indexOf(r) !== (form.extra_routes.length - 1) ? 'dark:hover:bg-gray-700' : 'text-gray-200 dark:text-gray-600 cursor-not-allowed', 'group flex items-center px-4 py-2 text-sm']">
                                    <ArrowDownCircleIcon :class="[form.extra_routes.indexOf(r) !== (form.extra_routes.length - 1) ? 'text-gray-400 group-hover:text-gray-500' : 'text-gray-200 group-hover:text-gray-200 dark:text-gray-600 dark:group-hover:text-gray-600', 'mr-3 h-5 w-5']" aria-hidden="true" />
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
    PlusIcon, EllipsisVerticalIcon,
    DocumentDuplicateIcon,
    TrashIcon,
    ArrowUpCircleIcon,
    ArrowDownCircleIcon
} from '@heroicons/vue/24/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useAuthStore } from '@/stores/authState'
import { ref, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps<{
    form: BacktestForm | OptimizationForm | FormLiveTab,
    results: BacktestResults | OptimizationResults | ResultsLiveTab,
    totalRoutesError: string[]
}>()

const authStore = useAuthStore();
const copiedExtraRoutes = ref({ extra_routes: props.form.extra_routes });
const copiedRoutes = ref({ routes: props.form.routes });
const ERRORS = reactive({
    uniqueRoutesErrorMessage: 'each exchange-symbol pair can be traded only once! More info: https://docs.jesse.trade/docs/routes.html#trading-multiple-routes',
    maxSymbolLengthErrorMessage: 'Maximum symbol length is exceeded!',
    mustContainDashErrorMessage: 'Symbol parameter must contain "-" character!',
    timeframeMustBeDifferentErrorMessage: 'Extra routes timeframe and routes timeframe must be different',
    emptyParameter: 'You must fill all the parameters',
    invalidSymbol: 'Symbol is invalid'
})
const isLive = computed(() => route.name === 'Live');

const strategies = computed(() => authStore.strategies);

const exchanges = computed(() => {
    const arr = [];
    for (const key in authStore.exchangeInfo) {
        if (isLive.value) {
            if (authStore.exchangeInfo[key].modes.live_trading) {
                arr.push(authStore.exchangeInfo[key]);
            }
        } else {
            if (authStore.exchangeInfo[key].modes.backtesting) {
                arr.push(authStore.exchangeInfo[key]);
            }
        }
    }
    arr.sort((a, b) => {
        if (a.name.startsWith('Bitget')) {
            return -1;
        } else if (b.name.startsWith('Bitget')) {
            return 1;
        } else {
            return a.name.localeCompare(b.name);
        }
    });
    return arr;
});

watchEffect(() => {
    copiedExtraRoutes.value = { extra_routes: props.form.extra_routes };
    copiedRoutes.value = { routes: props.form.routes };
    initiate();
    checkRoutes()
});

function allowedToTradeIn(exchangeName: string) {
    if (!isLive.value) return true;
    if (authStore.planInfo.plan === 'premium') {
        return true;
    }
    return authStore.exchangeInfo[exchangeName].required_live_plan === 'free';
}

function initiate() {
    if (props.form.routes.length) {
        return;
    }
    props.form.routes.push({
        exchange: exchanges.value[0].name,
        symbol: 'BTC-USDT',
        timeframe: authStore.jesseSupportedTimeframes[0],
        strategy: authStore.strategies[0],
    });
}

function checkRoutes() {
    props.totalRoutesError.splice(0, props.totalRoutesError.length);
    // check routes symbols
    for (const item of props.form.routes) {
        CheckRoutesSymbol(item);
    }
    // check extra routes symbols
    if (props.form.extra_routes.length > 0) {
        for (const item of props.form.extra_routes) {
            CheckRoutesSymbol(item);
        }
    }

    let checkBreakLoop = false
    const tempRoutes = props.form.routes
    for (const item of tempRoutes.slice(0, -1)) {
        if (props.totalRoutesError.includes(ERRORS.uniqueRoutesErrorMessage) || checkBreakLoop)
            break

        for (const item1 of tempRoutes.slice(tempRoutes.indexOf(item) + 1,)) {
            if (item.exchange === item1.exchange && item.strategy === item1.strategy && item.symbol === item1.symbol && item.symbol.length !== 0) {
                props.totalRoutesError.push(ERRORS.uniqueRoutesErrorMessage)
                checkBreakLoop = false
                break
            }
        }
    }

    let checkBreakExtraLoop = false
    const tempExtraRoutes = props.form.extra_routes
    for (const item of tempExtraRoutes.slice(0, -1)) {
        if (props.totalRoutesError.includes(ERRORS.uniqueRoutesErrorMessage) || checkBreakExtraLoop)
            break

        for (const item1 of tempExtraRoutes.slice(tempExtraRoutes.indexOf(item) + 1)) {
            if (item.exchange === item1.exchange && item.timeframe === item1.timeframe && item.symbol === item1.symbol) {
                props.totalRoutesError.push(ERRORS.uniqueRoutesErrorMessage)
                checkBreakExtraLoop = true
                break
            }
        }
    }

    checkBreakExtraLoop = false
    if (props.form.extra_routes.length > 0) {
        for (const item of tempExtraRoutes) {
            if (props.totalRoutesError.includes(ERRORS.timeframeMustBeDifferentErrorMessage) || checkBreakLoop)
                break

            for (const item1 of props.form.routes) {
                if (item.exchange === item1.exchange && item.symbol === item1.symbol && item.timeframe === item1.timeframe) {
                    props.totalRoutesError.push(ERRORS.timeframeMustBeDifferentErrorMessage)
                    checkBreakExtraLoop = true
                    break
                }
            }
        }
    }
}

function CheckRoutesSymbol(item: Route | ExtraRoute) {
    if (!props.totalRoutesError.includes(ERRORS.emptyParameter) && (item.symbol.length == 0 || item.exchange.length == 0 || item.timeframe.length == 0))
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
        exchange: props.form.routes[props.form.routes.length - 1].exchange,
        symbol: '',
        timeframe: authStore.jesseSupportedTimeframes[0],
        strategy: authStore.strategies[0],
    });
}

function addExtraRoute() {
    props.form.extra_routes.push({
        exchange: props.form.routes[props.form.routes.length - 1].exchange,
        symbol: '',
        timeframe: authStore.jesseSupportedTimeframes[0],
    });
}

function deleteRoute(item: Route) {
    const index = props.form.routes.indexOf(item);
    if (props.form.routes.length !== 1 && index > -1) {
        props.form.routes.splice(index, 1);
    }
}

function deleteExtraRoute(item: Route) {
    const index = props.form.extra_routes.indexOf(item);
    if (props.form.extra_routes.length !== 0 && index > -1) {
        props.form.extra_routes.splice(index, 1);
    }
}

function duplicateRoutes(item: Route) {
    const itemIndex = props.form.routes.indexOf(item);
    const newItem = {
        exchange: item.exchange,
        strategy: item.strategy,
        symbol: '',
        timeframe: item.timeframe,
    };
    props.form.routes.splice(itemIndex + 1, 0, newItem);
}

function duplicateExtraRoutes(item: Route) {
    const itemIndex = props.form.extra_routes.indexOf(item);
    const newItem = {
        exchange: item.exchange,
        strategy: item.strategy,
        symbol: '',
        timeframe: item.timeframe,
    };
    props.form.extra_routes.splice(itemIndex + 1, 0, newItem);
}

function moveUpRoutes(item: Route) {
    const itemIndex = props.form.routes.indexOf(item);
    if (itemIndex !== 0) {
        const lastItem = props.form.routes[itemIndex - 1];
        props.form.routes[itemIndex] = lastItem;
        props.form.routes[itemIndex - 1] = item;
    }
}

function moveUpExtraRoutes(item: Route) {
    const itemIndex = props.form.extra_routes.indexOf(item);
    if (itemIndex !== 0) {
        const lastItem = props.form.extra_routes[itemIndex - 1];
        props.form.extra_routes[itemIndex] = lastItem;
        props.form.extra_routes[itemIndex - 1] = item;
    }
}

function moveDownRoutes(item: Route) {
    const itemIndex = props.form.routes.indexOf(item);
    if (itemIndex !== props.form.routes.length - 1) {
        const followingItem = props.form.routes[itemIndex + 1];
        props.form.routes[itemIndex] = followingItem;
        props.form.routes[itemIndex + 1] = item;
    }
}

function moveDownExtraRoutes(item: Route) {
    const itemIndex = props.form.extra_routes.indexOf(item);
    if (itemIndex !== props.form.extra_routes.length - 1) {
        const followingItem = props.form.extra_routes[itemIndex + 1];
        props.form.extra_routes[itemIndex] = followingItem;
        props.form.extra_routes[itemIndex + 1] = item;
    }
}

function getSupportedTimeframes(exchange: string) {
    if (!exchange) {
        return [];
    }

    if (route.name !== 'Live') {
        return authStore.jesseSupportedTimeframes;
    }
    if (authStore.settings.live.generate_candles_from_1m) {
        return authStore.jesseSupportedTimeframes;
    }
    if (!authStore.exchangeInfo[exchange]) {
        return [];
    }

    return authStore.exchangeInfo[exchange].supported_timeframes;


}
</script>