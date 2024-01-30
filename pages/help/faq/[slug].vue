<template>
  <MediumContainer>

    <HelpCenterSearch class="mb-4"/>

    <UCard>
      <div class="prose max-w-full prose-indigo prose">
        <h1 class="font-serif">{{ help.title }}</h1>

        <Markdown :content="help.content"/>

        <div class="flex justify-between">
          <!-- tags -->
          <div v-if="help.tags"
               class="w-full mt-10 md:flex justify-between">
            <div>
              <div v-for="tag in help.tags" :key="tag.id" class="inline-flex mb-2">
                <NuxtLink :href="'/help/tag/' + tag.slug"
                          class="text-gray-600 bg-gray-100 px-2 py-2  mr-2 rounded text-sm hover:bg-gray-200 no-underline">
                  {{ tag.name }}
                </NuxtLink>
              </div>
            </div>

            <div class="text-gray-500 mt-2 text-sm">
              <span class="font-semibold">Last updated:</span> {{ useTimeAgo(help.updated_at).value }}
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </MediumContainer>
</template>

<script setup lang="ts">
import {fetchHelpCenterItem} from "~/composables/useApi";
import {useTimeAgo} from "@vueuse/core";
import MediumContainer from "~/components/MediumContainer.vue";

const slug: string = useRoute().params.slug as string
const help = await fetchHelpCenterItem(slug)
</script>
