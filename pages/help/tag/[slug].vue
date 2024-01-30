<template>
  <BigContainer>
    <div class="w-full flex justify-center">
      <div class="w-full">
        <!-- search section -->
        <HelpCenterSearch/>

        <!-- recent faq for tag -->
        <div class="mt-6 bg-white px-4 py-4 rounded-md">
          <div class="w-full flex justify-center text-lg font-bold text-gray-700 mb-4">
            <div>
              <div class="px-2">
                <h1 class="font-serif">Recent posts for #{{ slug }}</h1>
              </div>
              <div class="pt-0.5 bg-gray-600"/>
            </div>
          </div>

          <NuxtLink
              v-for="(help, index) in helps"
              :key="help.id"
              :href="'/help/faq/' + help.slug"
              class="w-full"
          >
            <div
                class="w-full px-4 py-4 md:flex items-center justify-between rounded hover:bg-indigo-600 hover:text-white text-gray-700"
                :class="index % 2 == 0 ? 'bg-gray-100' : 'bg-white'"
            >
              <div>
                {{ help.title }}
              </div>
              <div class="mt-2 md:mt-0 opacity-90 text-xs md:text-sm">
                {{ useTimeAgo(help.created_at).value }}
              </div>
            </div>
          </NuxtLink>

          <div
              v-if="helps.length === 0"
              class="w-full flex justify-center text-center mt-4 text-gray-600"
          >
          <span class="mr-4 text-amber-300">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </span>
            There is currently no item for the entered tag.
          </div>
        </div>
      </div>
    </div>
  </BigContainer>
</template>

<script setup lang="ts">
import {fetchHelpTagIndex} from "~/composables/useApi";
import {useTimeAgo} from "@vueuse/core";

const helps = await fetchHelpTagIndex(
    useRoute().params.slug as string
)
const slug: string = useRoute().params.slug as string
</script>
