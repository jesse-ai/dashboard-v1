<template>
    <MultipleValuesTable v-if="ordersTable.length" :data="ordersTable"
                         :header-items="['ID', 'Created', 'Symbol', 'Type', 'Side', 'Price', 'QTY', 'Status']" header />

    <EmptyBox v-else />
</template>
  
<script setup lang="ts">
import helpers from '@/utils/helpers'

const props = defineProps<{
    orders: ordersEvent[];
}>()

const ordersTable = computed(() => {
    if (!props.orders.length) return []

    const arr = []
    // inverse loop
    for (let i = props.orders.length - 1; i >= 0; i--) {
        const item = props.orders[i]
        arr.push([
            { value: item.id.slice(-12), style: 'text-xs', tooltip: item.id, tag: 'code' },
            { value: helpers.timestampToTimeOnly(item.created_at), style: 'text-xs', tooltip: helpers.timestampToTime(item.created_at) },
            { value: item.symbol, style: 'text-xs' },
            { value: item.type, style: 'text-xs' },
            { value: item.side, style: helpers.colorBasedOnSide(item.side) },
            { value: item.price, style: 'text-xs' },
            { value: item.qty, style: helpers.colorBasedOnSide(item.side) },
            { value: item.status, style: 'text-xs' },
        ])
    }
    return arr
})
</script>
