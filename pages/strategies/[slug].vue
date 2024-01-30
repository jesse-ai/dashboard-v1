<template>
  <BigContainer>
    <div class="grid grid-cols-1 md:grid-cols-4">
      <!-- left container -->
      <div class="md:mr-4 mb-4">
        <UCard class="mb-4">
          <h1 class="text-3xl mb-4 font-serif break-words">
            {{ strategy.name }}
          </h1>

          <p class="mb-4">
            {{ strategy.description }}
          </p>
        </UCard>

        <div class="mb-4">
          <div class="border-2 py-4 px-4 rounded border-dashed">
            <h2 class="mb-4 text-3xl font-serif text-center">
              Filter Metrics
            </h2>

            <p class="mb-4">
              Select the info for the backtest metrics that you want to see:
            </p>

            <div class="w-full">
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

        <div class="mt-4">
          <UButton block class="mb-2">Download Strategy</UButton>
          <UButton block class="mb-2" color="gray">Quantstats Metrics</UButton>
          <UButton block class="mb-2" color="gray">Logs</UButton>
        </div>
      </div>

      <!-- right container -->
      <div class="w-full col-span-3">
        <Loading v-if="loading" class="my-20">
          Loading...
        </Loading>

        <div v-else-if="!strategyMetrics.id" class="flex items-center justify-center my-[10%]">
          No metrics found for this strategy in the selected period, symbol and timeframe 🙁
        </div>

        <div v-else-if="strategyMetrics.id">
          <dl class="mb-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <UCard>
              <template #header>
                <h2 class="text-center font-serif font-semibold text-xl">
                  Performance Metrics
                </h2>
              </template>
              <div class="flex justify-between text-sm opacity-75 mb-4" v-for="item in performanceMetrics"
                   :key="item.name">
                <dt>{{ item.name }}:</dt>
                <dd>{{ item.stat }}</dd>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <h2 class="text-center font-serif font-semibold text-xl">
                  Risk Metrics
                </h2>
              </template>
              <div class="flex justify-between text-sm opacity-75 mb-4" v-for="item in riskMetrics"
                   :key="item.name">
                <dt>{{ item.name }}:</dt>
                <dd>{{ item.stat }}</dd>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <h2 class="text-center font-serif font-semibold text-xl">
                  Trade Metrics
                </h2>
              </template>
              <div class="flex justify-between text-sm opacity-75 mb-4" v-for="item in tradeMetrics"
                   :key="item.name">
                <dt>{{ item.name }}:</dt>
                <dd>{{ item.stat }}</dd>
              </div>
            </UCard>
          </dl>
        </div>
      </div>
    </div>
  </BigContainer>
</template>

<script setup lang="ts">
import {useFetchApi2} from "~/composables/useApi";

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
  period: periodOptions[0],
  symbol: 'BTC-USDT',
  timeframe: '1m',
})

const loading = ref(false);
const slug: string = useRoute().params.slug as string
const {data, error} = await useFetchApi2(`/strategies/${slug}`);
const strategy = ref(data.value as Strategy);
const strategyMetrics = ref(strategy.value.strategy_metrics);

const performanceMetrics = computed(() => [
  {
    name: 'PNL',
    stat: `${(strategyMetrics.value.net_profit).toFixed(2)} (${(strategyMetrics.value.net_profit_percentage).toFixed(2)}%)`
  },
  {name: 'Win rate', stat: `${(strategyMetrics.value.win_rate * 100).toFixed(2)}%`},
  {name: 'Sharpe ratio', stat: (strategyMetrics.value.sharpe_ratio).toFixed(2)},
  {name: 'Smart Sharpe', stat: (strategyMetrics.value.smart_sharpe).toFixed(2)},
  {name: 'Sortino ratio', stat: (strategyMetrics.value.sortino_ratio).toFixed(2)},
  {name: 'Smart Sortino', stat: (strategyMetrics.value.smart_sortino).toFixed(2)},
  {name: 'Calmar ratio', stat: (strategyMetrics.value.calmar_ratio).toFixed(2)},
  {name: 'Omega ratio', stat: (strategyMetrics.value.omega_ratio).toFixed(2)},
  {name: 'Serenity index', stat: (strategyMetrics.value.serenity_index).toFixed(2)},
  {name: 'Average win/loss', stat: (strategyMetrics.value.average_win_loss).toFixed(2)},
  {name: 'Average win', stat: (strategyMetrics.value.average_win).toFixed(2)},
  {name: 'Average loss', stat: (strategyMetrics.value.average_loss).toFixed(2)},
])

const tradeMetrics = computed(() => [
  {name: 'Total trades', stat: strategyMetrics.value.total_completed_trades},
  {name: 'Total winning trades', stat: strategyMetrics.value.total_winning_trades},
  {name: 'Total losing trades', stat: strategyMetrics.value.total_losing_trades},
  {name: 'Starting balance', stat: strategyMetrics.value.starting_balance.toFixed(2)},
  {name: 'Finishing balance', stat: strategyMetrics.value.finishing_balance.toFixed(2)},
  {name: 'Longs count', stat: strategyMetrics.value.longs_count},
  {name: 'Longs percentage', stat: strategyMetrics.value.longs_percentage.toFixed(2)},
  {name: 'Shorts percentage', stat: strategyMetrics.value.shorts_percentage.toFixed(2)},
  {name: 'Shorts count', stat: strategyMetrics.value.shorts_count},
  {name: 'Fee', stat: strategyMetrics.value.fee.toFixed(2)},
  {name: 'Total open trades', stat: strategyMetrics.value.total_open_trades},
  {name: 'Open PL', stat: strategyMetrics.value.open_pl.toFixed(2)},
])

const riskMetrics = computed(() => [
  {name: 'Total losing streak', stat: strategyMetrics.value.losing_streak},
  {name: 'Largest losing trade', stat: strategyMetrics.value.largest_losing_trade.toFixed(2)},
  {name: 'Largest winning trade', stat: strategyMetrics.value.largest_winning_trade.toFixed(2)},
  {name: 'Total winning streak', stat: strategyMetrics.value.winning_streak},
  {name: 'Current streak', stat: strategyMetrics.value.current_streak},
  {
    name: 'Expectancy',
    stat: `${strategyMetrics.value.expectancy.toFixed(2)} (${strategyMetrics.value.expectancy_percentage.toFixed(2)}%)`
  },
  {name: 'Expected net profit', stat: strategyMetrics.value.expected_net_profit.toFixed(2)},
  {name: 'Average holding period', stat: strategyMetrics.value.average_holding_period.toFixed(2)},
  {name: 'Gross profit', stat: strategyMetrics.value.gross_profit.toFixed(2)},
  {name: 'Gross loss', stat: strategyMetrics.value.gross_loss.toFixed(2)},
  {name: 'Max drawdown', stat: strategyMetrics.value.max_drawdown.toFixed(2)},
])

async function fetchMetrics() {
  loading.value = true;
  strategyMetrics.value = {} as StrategyMetrics;
  const {
    data, error
  } = await useFetchApi2(`/strategies/${slug}/metrics?period=${filters.value.period}&symbol=${filters.value.symbol}&timeframe=${filters.value.timeframe}`);
  loading.value = false;
  if (error.value) {
    showNotification('error', error.value.data.message)
    return;
  }
  strategyMetrics.value = data.value as StrategyMetrics;
}

// Watch for changes in filters
watch(filters, fetchMetrics, {deep: true});
</script>
