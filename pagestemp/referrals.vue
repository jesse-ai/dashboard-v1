<template>
  <BigContainer>
    <p>
      You can refer your friends through your referral URL and get a commission if they purchase a premium license.
    </p>

    <!-- referral link section -->
    <ReferralLink :url="referralsResponse.url"/>

    <!-- stats -->
    <div class="mt-16">
      <div class="select-none">
        <div class="sm:hidden">
          <label for="small_page_time" class="sr-only">Select Period</label>
          <select id="statsPeriod" v-model="statsPeriod" name="statsPeriod"
                  class="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
            <option value="all-time">All time</option>
            <option value="24-hours">Last 24 hours</option>
            <option value="7-days">Last 7 days</option>
            <option value="30-days">Last 30 days</option>
          </select>
        </div>
        <div class="hidden sm:block">
          <nav class="flex space-x-4" aria-label="Tabs">
            <!-- Current: "bg-indigo-100 text-indigo-700", Default: "text-gray-500 hover:text-gray-700" -->
            <button @click="changeTimeLine('all-time')"
                    class="px-3 py-2 font-medium text-sm rounded-md"
                    :class="statsPeriod == 'all-time' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'">
              All time
            </button>

            <button @click="changeTimeLine('24-hours')"
                    class="px-3 py-2 font-medium text-sm rounded-md"
                    :class="statsPeriod == '24-hours' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'">
              Last 24 hours
            </button>

            <button @click="changeTimeLine('7-days')"
                    class="px-3 py-2 font-medium text-sm rounded-md"
                    :class="statsPeriod == '7-days' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'">
              Last 7 days
            </button>

            <button @click="changeTimeLine('30-days')"
                    class="px-3 py-2 font-medium text-sm rounded-md"
                    :class="statsPeriod == '30-days' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'">
              Last 30 days
            </button>
          </nav>
        </div>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
        <div class=" px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 flex items-center justify-between">
          <div>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Visitors
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ referralsResponse.visits_count }}
            </dd>
          </div>

          <div class="bg-indigo-50 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-700" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
        </div>

        <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 flex items-center justify-between">
          <div>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Registers
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ referralsResponse.registers_count }}
            </dd>
          </div>

          <div class="bg-indigo-50 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-700" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
        </div>

        <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 flex items-center justify-between">
          <div>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Sales
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ referralsResponse.sales_count }}
            </dd>
          </div>

          <div class="bg-indigo-50 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-700" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
        </div>
        <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 flex items-center justify-between">
          <div>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Available Income
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              ${{ referralsResponse.total_income }}
            </dd>
          </div>

          <div class="bg-indigo-50 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-700" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- recent activity -->
    <ReferralActivity :time-line="statsPeriod" :referral-actions="referralsResponse.actions"
                      :purchase-commission="referralsResponse.user_commission"/>

    <!-- withdrawal lists -->
    <ReferralWithdrawalList :net-income="referralsResponse.total_income"
                            :purchase-count="referralsResponse.sales_count"
                            :min-friend-purchase-count="referralsResponse.min_friend_purchase_count"
                            :withdrawals="referralsResponse.withdrawals"/>
  </BigContainer>
</template>


<script lang="ts" setup>
import {ref, watch} from 'vue';
import {useFetchApi1} from "~/composables/useApi";
import ReferralLink from "~/components/referrals/ReferralLink.vue";
import ReferralActivity from "~/components/referrals/ReferralActivity.vue";
import ReferralWithdrawalList from "~/components/referrals/ReferralWithdrawalList.vue";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Referral Program'
const seoDescription = 'Earn commissions by referring friends to Jesse.'
setSeoMeta(seoTitle, seoDescription)

definePageMeta({
  middleware: 'auth'
})

const statsPeriod = ref('all-time');
let {data, error} = await useFetchApi1(`/referrals?time=${statsPeriod.value}`, true);
const referralsResponse = ref(data.value as ReferralsResponse);

watch(statsPeriod, async (newPeriod) => {
  const response = await useFetchApi1(`/referrals?time=${newPeriod}`, true);
  data = response.data;
  error = response.error;
  referralsResponse.value = data.value as ReferralsResponse;
});

function changeTimeLine(time: string) {
  statsPeriod.value = time;
}
</script>
