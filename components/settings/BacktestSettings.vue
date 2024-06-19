<template>
  <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9 w-full">
    <Card>
      <Heading>Logs</Heading>
      <p>
        Below configurations are used to filter out the extra logging info that are displayed when the
        <code>"--debug"</code> flag is enabled.
      </p>
      <br>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UCheckbox v-model="settings.backtest.logging['order_submission']" label="Order Submission" />
        <UCheckbox v-model="settings.backtest.logging['order_cancellation']" label="Order Cancellation" />
        <UCheckbox v-model="settings.backtest.logging['order_execution']" label="Order Execution" />
        <UCheckbox v-model="settings.backtest.logging['position_opened']" label="Position Opened" />
        <UCheckbox v-model="settings.backtest.logging['position_increased']" label="Position Increased" />
        <UCheckbox v-model="settings.backtest.logging['position_reduced']" label="Position Reduced" />
        <UCheckbox v-model="settings.backtest.logging['position_closed']" label="Position Closed" />
        <UCheckbox v-model="settings.backtest.logging['shorter_period_candles']" label="1m candles" />
        <UCheckbox v-model="settings.backtest.logging['trading_candles']" label="Trading Candles" />
      </div>
    </Card>

    <Card>
      <Heading>Data</Heading>
      <div>
        <UFormGroup label="Warmup Candles" help="Number of warmup candles that is loaded before starting each session">
          <UInput v-model="settings.backtest.warm_up_candles" type="number" placeholder="ex: 210" />
        </UFormGroup>
      </div>
    </Card>

    <Card>
      <Heading>Exchanges</Heading>
      <p>
        Below you can modify configuration per each exchange. You can even choose to use a spot exchange's data for
        backtestig
        in futures mode (just because spot exchanges usually have more historical data), and vice versa.
      </p>
      <br>
      <br>

      <div v-for="(e, index) in settings.backtest.exchanges" :key="index">
        <Divider :title="e.name" class="mb-4" />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <UFormGroup label="Starting Capital" class="w-full">
            <UInput v-model="e.balance" type="number" step="1000" class="w-full" />
          </UFormGroup>

          <UFormGroup :label="`Trading Fee (${_.round(e.fee * 100, 2)}%)`" class="w-full">
            <UInput v-model="e.fee" type="number" step="0.0001" class="w-full" />
          </UFormGroup>
        </div>

        <br>

        <RadioGroups v-model="e.type" title="Type:" :options="['spot', 'futures']" />

        <br>

        <div v-if="e.type === 'futures'">
          <RadioGroups v-model="e.futures_leverage_mode" title="Leverage Mode:" :options="['cross', 'isolated']" default="isolated" />
          <br>
          <NumberInput v-if="e.type === 'futures'" v-model="e.futures_leverage" title="Leverage (x):" :default="1" />
          <br>
        </div>
      </div>
    </Card>
  </div>
</template>


<script setup lang="ts">
import _ from 'lodash'

const store = useMainStore()
const settings = computed(() => store.settings)
</script>
