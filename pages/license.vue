<template>
  <SmallContainer>
    <div class="w-full flex justify-center">
      <div class="w-full">
        <div class="mt-3 text-gray-600 text-lg">
          <div class="w-full">
            <p>
              You own a lifetime license for using the live trade plugin of Jesse. At the moment that is the only
              premium product that we offer. We might add new ones in the future.
            </p>
          </div>
        </div>

        <div class="mt-12">
          <h1 class="text-gray-700 text-xl font-serif">
            Your License Detail
          </h1>

          <div class="flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-4">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr>
                      <th scope="col"
                          class=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TYPE
                      </th>
                      <th scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTIVATE DATE
                      </th>
                      <th scope="col"
                          class=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STATUS
                      </th>
                      <th scope="col" class=" relative px-6 py-3">
                        <span class="sr-only">Edit</span>
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <!-- Odd row -->
                    <!-- <tr :class="order.indexOf(item) % 2 == 0 ? 'bg-white' : 'bg-gray-50'"> -->
                    <!-- free plan license -->
                    <tr v-if="isFreePlan" class="bg-white">
                      <td class=" px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Free Plan
                      </td>
                      <td class=" px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                      </td>
                      <td class=" px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Active
                      </td>
                      <td class=" px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <NuxtLink
                            class=" inline-flex items-center font-bold px-2.5 py-1.5 text-xs rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-0 focus:ring-indigo-500 tracking-widest"
                            href="/pricing">
                          Upgrade
                        </NuxtLink>
                      </td>
                    </tr>

                    <!-- premium -->
                    <tr class="bg-white" v-if="!isFreePlan" v-for="o in orders" :key="o.id">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ o.product_name }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ useTimeAgo(o.updated_at).value }}
                      </td>
                      <td v-if="o.active && o.paid"
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Active
                      </td>
                      <td v-else class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Inactive
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <UButton
                            class="inline-flex items-center font-bold px-2.5 py-1.5 rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-0 focus:ring-indigo-500 tracking-widest"
                            @click="download(o.id)"
                            size="xs"
                            :loading="loading"
                        >
                          Invoice
                        </UButton>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SmallContainer>
</template>

<script setup lang="ts">
import {useTimeAgo} from "@vueuse/core";
import {authStore} from "~/stores";
import {useFetchApi1} from "~/composables/useApi";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'License'
const seoDescription = 'Manage your Jesse license.'
setSeoMeta(seoTitle, seoDescription)

definePageMeta({
  middleware: 'auth'
});

const {data, error} = await useFetchApi1('/license', true)

const res = ref(data.value as OrderHistory)
const orders = ref(res.value.orders as Order[])
const user = authStore().user
const loading = ref(false)

// computed isFreePlan
const isFreePlan = computed(() => {
  return res.value.plan === 'free'
})

async function download(orderId) {
  loading.value = true
  const {data, error} = await useFetchApi1('/invoices/' + orderId, true);
  loading.value = false

  if (error.value && error.value.statusCode !== 200) {
    showNotification('error', error.value)
    return
  }

  const blob = new Blob([data.value], {type: 'application/pdf'});
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'jesse-invoice-' + orderId + '.pdf';
  link.click();
}
</script>
