<template>
  <BigContainer>
    <div class="mb-8">
      <PageHeading title="Jesse Strategies"/>

      <p>
        Here, you can find a collection of strategies for Jesse, and view backtest results for all of them across
        various symbols, timeframes, and different periods. You can filter them based on your needs to find the best
        ones.
      </p></div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="mb-4">
        <div class="border-2 py-4 px-4 rounded border-dashed">
          <h2 class="mb-4 text-3xl font-serif text-center">
            Filters
          </h2>

          <div class="w-full">
            <UFormGroup label="Sort by" class="mb-4">
              <USelectMenu
                  searchable searchable-placeholder="Search period..." class="w-full mr-2"
                  placeholder="Select period"
                  :options="sortByOptions" v-model="filters.sortBy"
              />
            </UFormGroup>

            <UFormGroup label="Trading period" class="mb-4">
              <USelectMenu
                  searchable searchable-placeholder="Search period..." class="w-full mr-2"
                  placeholder="Select period"
                  :options="periodOptions" v-model="filters.period"
              />
            </UFormGroup>

            <UFormGroup label="Symbol" class="mb-4">
              <USelectMenu class="w-full mr-2" placeholder="Symbol" :options="symbolOptions"
                           v-model="filters.symbol"/>
            </UFormGroup>

            <UFormGroup label="Timeframe">
              <USelectMenu class="w-full" placeholder="Timeframe" :options="timeframeOptions"
                           v-model="filters.timeframe"/>
            </UFormGroup>
          </div>
        </div>
      </div>

      <div class="col-span-3">
        <EmptyBox v-if="!strategies.length && !loading" class="my-12">
          No strategies found
        </EmptyBox>

        <Loading v-if="loading" class="my-20">
          Loading strategies...
        </Loading>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Strategy v-for="s in strategies" :strategy="s"/>
        </div>
      </div>
    </div>
  </BigContainer>
</template>

<script setup lang="ts">
import {useFetchApi2} from "~/composables/useApi";
import PageHeading from "~/components/PageHeading.vue";

const sortByOptions = [
  'Sharpe Ratio', 'PNL', 'Sortino Ratio', 'Calmar Ratio', 'Win Rate'
];

// TODO: Make it dynamic. For now, it's hardcoded
const periodOptions = [
  'This month',
  'Last month',
  'This year (YTD)',
  // 'Q1 of 2024',
  '2023 - 2024',
  'Q1 of 2023',
  // 'Q2 of 2023',
  // 'Q3 of 2023',
  // 'Q4 of 2023',
  // '2022 - 2023',
  // 'Q1 of 2022',
  // 'Q2 of 2022',
];

const timeframeOptions = [
  '1m', '5m', '15m', '30m', '1h', '4h', '6h', '1D',
];

const symbolOptions = ['BTC-USDT', 'ETH-USDT'];

const filters = ref({
  sortBy: sortByOptions[0],
  period: periodOptions[0],
  symbol: 'BTC-USDT',
  timeframe: '1m',
})

let strategies = ref([] as Strategy[]);
const loading = ref(true);

const fetchStrategies = async () => {
  strategies.value = [];
  loading.value = true;
  const {data, error} = await useFetchApi2(
      `/strategies?period=${filters.value.period}&symbol=${filters.value.symbol}&timeframe=${filters.value.timeframe}&sort_by=${filters.value.sortBy}`
  )
  loading.value = false;
  if (error.value) {
    showNotification('error', error.value.message)
    return;
  }
  const res = data.value as StrategiesResponse;
  strategies.value = res.strategies || [];
}

// Initial fetch
await fetchStrategies();

// Watch for changes in filters
watch(filters, fetchStrategies, {deep: true});
</script>
