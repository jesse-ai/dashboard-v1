<template>
  <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9 w-full">
    <!-- CPU cores -->
    <Card>
      <Heading>CPU</Heading>
      <div>
        <UFormGroup
          :label="`CPU cores to use for optimization(${settings.optimization.cpu_cores} / ${systemInfo.cpu_cores})`"
          description="How many CPU cores of your machine would you like to be used for optimization?`"
        >
          <UInput v-model="settings.optimization.cpu_cores" type="number" placeholder="ex: 4" />
        </UFormGroup>
      </div>
    </Card>

    <!-- Fitness Function -->
    <Card>
      <Heading>Fitness Function</Heading>
      <RadioGroups v-model="settings.optimization.ratio" title="Ratio:" :options="['sharpe', 'calmar', 'sortino', 'omega']" />
    </Card>

    <!-- Data -->
    <Card>
      <Heading>Data</Heading>
      <div>
        <UFormGroup label="Warmup Candles" name="Warmup Candles">
          <template #description>
            Number of warmup candles that is loaded before starting each session
          </template>
          <template #default>
            <UInput v-model="settings.optimization.warm_up_candles" typ="number" placeholder="ex: 210" />
          </template>
        </UFormGroup>
      </div>
    </Card>

    <!-- exchange -->
    <Card>
      <Heading>Exchange</Heading>
      <p>
        Because the optimize mode is limited to one route only, it makes sense to have only one configuration section
        for the exchange values. Depending on the exchange you define in your route, these configurations will be
        used.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
        <UFormGroup label="Starting Capital" name="Starting Capital">
          <UInput v-model="settings.optimization.exchange.balance" typ="number" step="1000" />
        </UFormGroup>

        <UFormGroup :label="`Trading Fee (${_.round(settings.optimization.exchange.fee * 100, 2)}%)`">
          <UInput v-model="settings.optimization.exchange.fee" typ="number" step="0.0001" />
        </UFormGroup>
      </div>

      <br>

      <RadioGroups v-model="settings.optimization.exchange.type" title="Type:" :options="['spot', 'futures']" default="futures" />

      <br>

      <div v-if="settings.optimization.exchange.type === 'futures'">
        <RadioGroups v-model="settings.optimization.exchange.futures_leverage_mode" title="Leverage Mode:" :options="['cross', 'isolated']" default="isolated" />

        <br>

        <NumberInput v-model="settings.optimization.exchange.futures_leverage" title="Leverage (x):" :default="1" />
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'

const store = useMainStore()
const settings = computed(() => store.settings)
const systemInfo = computed(() => store.systemInfo)
</script>
