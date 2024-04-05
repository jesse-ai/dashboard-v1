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
        <UCheckbox label="Order Submission" v-model="settings.backtest.logging['order_submission']"/>
        <UCheckbox label="Order Cancellation" v-model="settings.backtest.logging['order_cancellation']"/>
        <UCheckbox label="Order Execution" v-model="settings.backtest.logging['order_execution']"/>
        <UCheckbox label="Position Opened" v-model="settings.backtest.logging['position_opened']"/>
        <UCheckbox label="Position Increased" v-model="settings.backtest.logging['position_increased']"/>
        <UCheckbox label="Position Reduced" v-model="settings.backtest.logging['position_reduced']"/>
        <UCheckbox label="Position Closed" v-model="settings.backtest.logging['position_closed']"/>
        <UCheckbox label="1m candles" v-model="settings.backtest.logging['shorter_period_candles']"/>
        <UCheckbox label="Trading Candles" v-model="settings.backtest.logging['trading_candles']"/>
      </div>
    </Card>

    <Card>
      <Heading>Data</Heading>
      <div>
        <UFormGroup label="Warmup Candles">
          <template #description>
            Number of warmup candles that is loaded before starting each session
          </template>
          <template #default>
            <UInput v-model="settings.backtest.warm_up_candles" type="number" placeholder="ex: 210"/>
          </template>
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
        <Divider :title="e.name" class="mb-4"/>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <UFormGroup label="Starting Capital" class="w-full">
            <UInput v-model="e.balance" type="number" step="1000" class="w-full"/>
          </UFormGroup>

          <UFormGroup :label="`Trading Fee (${_.round(e.fee * 100, 2)}%)`" class="w-full">
            <UInput v-model="e.fee" type="number" step="0.0001" class="w-full"/>
          </UFormGroup>
        </div>

        <br>

        <RadioGroups title="Type:" v-model="e.type" :options="['spot', 'futures']"/>

        <br>

        <div v-if="e.type === 'futures'">
          <RadioGroups title="Leverage Mode:" v-model="e.futures_leverage_mode" :options="['cross', 'isolated']"
                       default="isolated"/>
          <br>
          <NumberInput v-if="e.type === 'futures'" title="Leverage (x):" v-model="e.futures_leverage" :default="1"/>
          <br>
        </div>
      </div>
    </Card>
  </div>
</template>


<script setup lang="ts">
import _ from 'lodash'
const store = usemainStore()
const settings = computed(() => store.settings)
</script>
