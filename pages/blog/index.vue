<template>
  <BlogArticle v-for="article in response.data" :article="article" :is-admin="false" :full="false"/>

  <div class="flex justify-center my-8">
    <UPagination
        v-model="currentPage"
        :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
        :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
        :total="response.meta.total"
        :page-count="response.meta.per_page"
    />
  </div>
</template>


<script setup lang="ts">
import {fetchBlogArticles} from "~/composables/useApi";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Jesse Blog'
const seoDescription = 'Get the latest news, updates, and tutorials on Jesse, the open-source Python trading framework for cryptocurrencies.'
setSeoMeta(seoTitle, seoDescription)

// config
const path = '/blog'
const fetchFunction = fetchBlogArticles

const route = useRoute()
const currentPage = route.query.page ? ref(parseInt(route.query.page as string)) : ref(1)
const response = ref(await fetchFunction(currentPage.value))

watch(currentPage, async (page) => {
  response.value = await fetchFunction(page)
  if (currentPage.value > 1) {
    navigateTo({path: path, query: {page: currentPage.value}})
  } else {
    navigateTo({path: path})
  }
})
</script>
