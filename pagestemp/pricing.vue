<template>
  <div>
    <!-- main -->
    <div>
      <div class="relative">
        <div class="absolute inset-0 h-1/2 "/>
        <div class="relative mx-auto">
          <div class="mx-auto shadow overflow-hidden">
            <!-- pricing section -->
            <div class="bg-gray-900 pt-20">
              <!-- pricing top description -->
              <div>
                <div class="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                  <!--                  <Promotion/>-->

                  <div class="max-w-3xl mx-auto space-y-2 lg:max-w-none">
                    <h1 class="mb-8 text-3xl tracking-tight font-bold text-white sm:text-4xl sm:tracking-tight lg:text-6xl lg:tracking-tight font-serif">
                      Simple no-tricks pricing
                    </h1>
                    <p class="text-xl text-gray-300">
                      Start with a free plan. Or pay once for a lifetime license
                    </p>
                  </div>
                </div>
              </div>

              <!-- pricing carts -->
              <div class="mt-8 pb-12 bg-white sm:mt-12 sm:pb-16 lg:mt-16 lg:pb-24">
                <div class="relative">
                  <div class="absolute inset-0 h-3/4 bg-gray-900"/>
                  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="max-w-md mx-auto space-y-4 lg:max-w-5xl lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
                      <!-- free plan -->
                      <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
                        <div class="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                          <div>
                            <h3 id="tier-standard"
                                class="inline-flex px-4 py-1 rounded-full text-base font-semibold bg-indigo-100 text-indigo-600 font-serif">
                              Free
                            </h3>
                          </div>
                          <div class="mt-4 flex items-baseline text-7xl tracking-tight font-bold font-serif">$0</div>
                          <p class="mt-5 text-lg text-gray-500">Get started with Jesse for free</p>
                        </div>

                        <div
                            class="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                          <ul role="list" class="space-y-4">
                            <li v-for="feature in freePlanFeatures" :key="feature" class="flex items-start">
                              <div class="flex-shrink-0">
                                <UIcon name="i-heroicons-check" class="h-6 w-6 text-green-500"/>
                              </div>
                              <p class="ml-3 text-base text-gray-700" v-html="feature"/>
                            </li>
                          </ul>

                          <!-- logged in free user -->
                          <div v-if="isLoggedIn && isFreePlan" class="flex justify-center items-center">
                            <button
                                class="w-full flex items-center justify-center px-5 py-3 text-base font-medium rounded-md border-2 border-indigo-600 text-indigo-600 shadow cursor-not-allowed"
                                aria-describedby="tier-standard">
                              Activated Plan
                            </button>
                          </div>
                          <!-- guest -->
                          <div v-else-if="!isLoggedIn" class="rounded-md shadow">
                            <NuxtLink href="/register"
                                      class="w-full flex items-center justify-center px-5 py-3 border-transparent text-base font-medium rounded-md border-2 border-indigo-600 text-indigo-600 hover:text-white hover:bg-indigo-600 shadow"
                                      aria-describedby="tier-standard">
                              Get Started
                            </NuxtLink>
                          </div>
                        </div>
                      </div>

                      <!-- premium plan -->
                      <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
                        <div class="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                          <div class="flex justify-between">
                            <h3 id="tier-standard"
                                class="inline-flex items-center px-4 py-1 rounded-full text-base font-semibold bg-indigo-100 text-indigo-600 font-serif">
                              Premium
                            </h3>

                            <h3 v-if="discountPercent > 0"
                                class="inline-flex px-4 py-1 rounded-full text-2xl font-semibold bg-rose-100 text-rose-600 font-serif">
                              {{ discountPercent }}% OFF!
                            </h3>
                          </div>
                          <!-- if have discount -->
                          <div v-if="product_livetrade['discount_percent']">
                            <div class="mt-4 flex items-baseline  tracking-tight font-bold">
                                <span v-if="discountPercent > 0" class="line-through opacity-50 text-6xl font-serif">
                                  ${{ product_livetrade['price'] }}
                                </span>

                              <span class="ml-4 text-7xl font-serif">
                                ${{ calculatePrice(product_livetrade['price'], product_livetrade['discount_percent']) }}
                              </span>
                            </div>
                          </div>
                          <div v-else class="mt-4 flex items-baseline text-7xl font-serif tracking-tight font-bold">
                            ${{ product_livetrade['price'] }}
                            <span class="ml-1 text-2xl font-medium text-gray-500 tracking-normal"> /life time </span>
                          </div>

                          <p class="mt-5 text-lg text-gray-500">
                            Contribute to the project and get lifetime access to Jesse's premium features
                          </p>
                        </div>
                        <div
                            class="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                          <ul role="list" class="space-y-4">
                            <li v-for="feature in premiumPlanFeatures" :key="feature"
                                class="flex items-start">
                              <div class="flex-shrink-0">
                                <UIcon name="i-heroicons-check" class="h-6 w-6 text-green-500"/>
                              </div>
                              <p class="ml-3 text-base text-gray-700">
                                {{ feature }}
                              </p>
                            </li>
                          </ul>

                          <!-- if guest -->
                          <div v-if="!isLoggedIn" class="rounded-md shadow">
                            <NuxtLink href="/register"
                                      class="w-full flex items-center justify-center px-5 py-3 border-transparent text-base font-medium rounded-md border-2 border-indigo-600 text-white bg-indigo-600 shadow hover:shadow-2xl"
                                      aria-describedby="tier-standard">
                              Get Started
                            </NuxtLink>
                          </div>
                          <!-- if premium user -->
                          <div v-else-if="!isFreePlan" class="flex justify-center items-center">
                            <button
                                class="w-full flex items-center justify-center px-5 py-3 text-base font-medium rounded-md border-2 border-indigo-600 text-indigo-600 shadow cursor-not-allowed"
                                aria-describedby="tier-standard">
                              Activated Plan
                            </button>
                          </div>
                          <!-- if free user -->
                          <div v-else class="rounded-md shadow">
                            <button
                                class="w-full flex items-center justify-center px-5 py-3 text-base font-medium rounded-md border-2 border-indigo-600 text-white bg-indigo-600 shadow hover:shadow-2xl"
                                aria-describedby="tier-standard" @click="openOrderModal = true">
                              Upgrade
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- feature comparison -->
                <PricingFeatureComparison/>

                <!-- faq section -->
                <PricingFAQ/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UModal v-model="openOrderModal" v-if="isLoggedIn">
      <Order :product="product_livetrade" :coupon="referral_coupon" :payment_address="payment_address"/>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import PricingFAQ from "~/components/pricing/PricingFAQ.vue";
import Order from "~/components/pricing/Order.vue";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Pricing'
const seoDescription = 'Simple no-tricks pricing for Jesse trading framework.'
setSeoMeta(seoTitle, seoDescription)

const openOrderModal = ref(false)
const isLoggedIn = ref(authStore().isAuthenticated)
const isFreePlan = ref(!authStore().isPremium)
const loading = ref(false)
const price = ref(null)
const freePlanFeatures = ref([
  "Importing Candles",
  "Backtesting",
  "Optimization",
  "Research module",
  "Community support on <a href='https://jesse.trade/discord' target='_blank' class='underline'>Discord</a>"
])
const premiumPlanFeatures = ref([
  "Everything included in the \"free\" plan",
  "Paper trading",
  "Live trading on all supported exchanges",
  "Chat and email support",
  "Access to my personal premium strategy"
])

const {data, error} = await useFetchApi1('/pricing', true);
const res = data.value as PricingResponse
const product_livetrade = ref(res.product_livetrade as Product)
const referral_coupon: Ref<Coupon | null> = ref(res.referral_coupon)
const payment_address = ref(res.payment_address)

const discountPercent = computed(() => {
  if (calculatePrice(product_livetrade.value["price"], product_livetrade.value["discount_percent"]) === 0) {
    return 100
  }

  if (Number(product_livetrade.value["discount_percent"]) === 0) {
    return 0
  }

  return (product_livetrade.value["price"] - calculatePrice(product_livetrade.value["price"], product_livetrade.value["discount_percent"])) / product_livetrade.value["price"] * 100
})

function calculatePrice(productPrice: number, discount: number) {
  let price = productPrice - productPrice * (discount / 100)
  if (referral_coupon.value && referral_coupon.value.discount_percent) {
    price = price - price * (referral_coupon.value.discount_percent / 100)
  }
  return price
}
</script>
