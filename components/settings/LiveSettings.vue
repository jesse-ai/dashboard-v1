<template>
  <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9 w-full">
    <Card>
      <Heading>Persistency</Heading>
      <p>
        If persistency is <b>enabled</b>, on new live session, Jesse will try to <b>continue</b> the previous
        running session based on the existing positions and orders on the exchange.
        <br>
        <br>
        If it's <b>disabled</b>, Jesse will first <b>close</b> all existing positions and orders before
        <b>starting</b> or <b>terminating</b> live sessions.
      </p>

      <br>

      <ToggleButton v-model="settings.live.persistency" title="Enable Persistency"/>
    </Card>

    <Card>
      <Heading>Candle Generation</Heading>
      <p>
        If the bellow option is <b>disabled</b>, Jesse will fetch candles for all timeframes (based on your routes)
        from the exchange. This ensures faster session start times and similar result in Jesse's chart and the one you
        see on the exchange (or TradingView).
        <br>
        <br>
        If the bellow option is <b>enabled</b>, Jesse will fetch 1m candles from the exchange, and generate bigger
        timeframes by its own. Doing so, Jesse is able to offer timeframes that are not supported by the exchange. It
        also captures the real price action that a shady exchange might be covering up later. In such case, you'll see
        different candle chart in Jesse and the one you see on the exchange.
      </p>

      <br>

      <ToggleButton v-model="settings.live.generate_candles_from_1m" title="Generate Candles Locally"/>
    </Card>

    <Card>
      <Heading>Logs</Heading>
      <p>
        You can filter the types of events that you want to be logged. Logging is often useful for debugging
        and recommended. Hence, it doesn't hurt to enable them all:
      </p>
      <br>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UCheckbox label="Order Submission" v-model="settings.live.logging['order_submission']"/>
        <UCheckbox label="Order Cancellation" v-model="settings.live.logging['order_cancellation']"/>
        <UCheckbox label="Order Execution" v-model="settings.live.logging['order_execution']"/>
        <UCheckbox label="Position Opened" v-model="settings.live.logging['position_opened']"/>
        <UCheckbox label="Position Increased" v-model="settings.live.logging['position_increased']"/>
        <UCheckbox label="Position Reduced" v-model="settings.live.logging['position_reduced']"/>
        <UCheckbox label="Position Closed" v-model="settings.live.logging['position_closed']"/>
        <UCheckbox label="1m candles" v-model="settings.live.logging['shorter_period_candles']"/>
        <UCheckbox label="Trading Candles" v-model="settings.live.logging['trading_candles']"/>
      </div>
    </Card>

    <br>

    <Card>
      <Heading>Data</Heading>
      <div>
        <UFormGroup label="Warmup Candles"
                    description="Number of warmup candles that is loaded before starting each session">
          <UInput v-model="settings.live['warm_up_candles']" type="number" min="1" placeholder="ex: 210"/>
        </UFormGroup>
      </div>
    </Card>

    <br>

    <Card>
      <Heading>
        Notifications
      </Heading>
      <p>
        Jesse can notify every time something interesting happens so you don't have to monitor your bots 24/7.
        Currently, Telegram and Discord drivers are supported. <br><br>
        To enter API keys for Telegram or Discord, check out your project's <code>.env</code> file.
      </p>
      <br>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UCheckbox label="Enable Notifications" v-model="settings.live.notifications['enabled']"/>
      </div>
      <br>

      <div v-if="settings.live.notifications.enabled">
        <p>
          You can choose for which events you want to receive notifications:
        </p>
        <br>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UCheckbox label="Errors" v-model="settings.live.notifications.events['errors']"/>
          <UCheckbox label="Session Start" v-model="settings.live.notifications.events['started_session']"/>
          <UCheckbox label="Session Termination" v-model="settings.live.notifications.events['terminated_session']"/>
          <UCheckbox label="Order Submission" v-model="settings.live.notifications.events['submitted_orders']"/>
          <UCheckbox label="Order Cancellation" v-model="settings.live.notifications.events['cancelled_orders']"/>
          <UCheckbox label="Order Execution" v-model="settings.live.notifications.events['executed_orders']"/>
          <UCheckbox label="Opened Positions" v-model="settings.live.notifications.events['opened_position']"/>
          <UCheckbox label="Updated Position" v-model="settings.live.notifications.events['updated_position']"/>
        </div>

        <br>

        <Heading>
          Recurring Position Reports
        </Heading>

        <p>
          You will also receive recurring reports about your positions as notifications.
          This gives you a little ease of mind so you don't have to constantly check your positions.
        </p>

        <br>

        <p>You can choose the <strong>timeframe</strong> for how frequently you want to receive them:</p>

        <USelect v-model="settings.live.notifications.position_report_timeframe" :options="timeframes"/>

        <br>
      </div>
    </Card>

    <Card v-if="Object.keys(settings.live.exchanges).length">
      <Heading class="mb-8">Exchanges</Heading>

      <div v-for="(e, index) in settings.live.exchanges" :key="index">
        <Divider :title="e.name" class="mb-4"/>

        <RadioGroups v-if="store.exchangeInfo[e.name].type === 'futures'"
                     class="mb-4"
                     title="Leverage Mode:"
                     v-model="e.futures_leverage_mode"
                     :options="['cross', 'isolated']"/>

        <NumberInput
            v-if="store.exchangeInfo[e.name].type === 'futures'"
            class="mb-4"
            title="Leverage (x):" v-model="e.futures_leverage" :default="1"/>

        <p>Balances and fees will be fetched from the exchange in live trading. But for <b>paper trading</b> you can
          set them here:</p>

        <br>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <UFormGroup label="Starting Capital">
            <UInput v-model="e.balance" type="number" step="1000"/>
          </UFormGroup>

          <UFormGroup :label="`Trading Fee (${_.round(e.fee * 100, 2)}%)`">
            <UInput v-model="e.fee" type="number" step="0.0001"/>
          </UFormGroup>
        </div>

        <br>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";

const store = useAuthStore()
const settings = computed(() => store.settings)
const timeframes = ref(['1m', '3m', '5m', '15m', '30m', '45m', '1h', '2h', '3h', '4h', '6h', '8h', '12h', '1D'])
</script>
