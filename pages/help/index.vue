<template>
  <BigContainer>
    <div class="w-full flex justify-center">
      <div class="w-full">
        <!-- search section -->
        <HelpCenterSearch class="mb-8"/>

        <!-- FAQ category -->
        <UDivider
            label="Categories"
            type="dashed"
            :ui="{ label: 'text-xl', border: { size: { horizontal: 'border-t-2' } } }"/>

        <div v-if="categories.length == 0" class="flex items-center justify-center mt-8">
          <span class="opacity-80 mr-2">There is currently no category for the help section</span> 🙁
        </div>

        <div class="mt-10 mb-16 text-gray-600 text-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <NuxtLink
              v-for="category in categories"
              :key="category.id"
              :to="`/help/category/${category.slug}`"
              class="w-full text-center px-1 py-6 rounded bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white border hover:shadow-lg font-bold"
          >
            {{ category.title }}
          </NuxtLink>
        </div>

        <!-- recent posts -->
        <UDivider
            label="Recent Posts"
            type="dashed"
            :ui="{ label: 'text-xl', border: { size: { horizontal: 'border-t-2' } } }"
        />

        <div class="mt-6 bg-white px-4 py-4 rounded-md">
          <NuxtLink
              v-for="(faq, index) in helpItems"
              :key="faq.id"
              :href="'/help/faq/' + faq.slug"
              class="w-full">
            <div
                class="w-full px-4 py-4 md:flex items-center justify-between rounded hover:bg-indigo-600 hover:text-white text-gray-700"
                :class="index % 2 == 0 ? 'bg-gray-100' : 'bg-white'">
              <div>
                {{ faq.title }}
              </div>
              <div class="mt-2 md:mt-0 opacity-90 text-xs md:text-sm">
                {{ useTimeAgo(faq.created_at).value }}
              </div>
            </div>
          </NuxtLink>

          <div v-if="helpItems.length == 0" class="flex items-center justify-center">
            <span class="opacity-80 mr-2">There is currently no item for the help section</span> 🙁
          </div>
        </div>
      </div>
    </div>
  </BigContainer>
</template>

<script setup lang="ts">
import {fetchHelpCenterItems} from "~/composables/useApi";
import {useTimeAgo} from "@vueuse/core";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Help Center'
const seoDescription = 'Get help with your account, orders, and more. Learn how to use Jesse and get answers to frequently asked questions and common errors.'
setSeoMeta(seoTitle, seoDescription)

const data = await fetchHelpCenterItems()
const helpItems = data.helps
const categories = data.categories
</script>
