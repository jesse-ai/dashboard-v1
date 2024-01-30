<template>
  <SmallContainer>
    <ReleaseItem v-for="release in response.data" :release="release"/>

    <div class="flex justify-center my-8">
      <UPagination
          v-model="currentPage"
          :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
          :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
          :total="response.meta.total"
          :page-count="response.meta.per_page"
      />
    </div>
  </SmallContainer>
</template>

<script setup lang="ts">
import {fetchReleases} from "~/composables/useApi";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Release Notes'
const seoDescription = 'Release notes for the latest versions of Jesse.'
setSeoMeta(seoTitle, seoDescription)

// config
const path = '/releases'
const fetchFunction = fetchReleases

const route = useRoute()
const currentPage = route.query.page ? ref(parseInt(route.query.page as string)) : ref(1)
let response = ref(await fetchFunction(currentPage.value))

watch(currentPage, async (page) => {
  response.value = await fetchFunction(page)
  if (currentPage.value > 1) {
    navigateTo({path: path, query: {page: currentPage.value}})
  } else {
    navigateTo({path: path})
  }
})
</script>
