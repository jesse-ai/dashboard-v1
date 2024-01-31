<template>
  <BlogArticle :article="article" :full="true"/>
</template>

<script setup lang="ts">
import {fetchBlogArticle} from "~/composables/useApi";
import {setSeoMeta} from "~/utils/meta";

const slug: string = useRoute().params.slug as string
const article = await fetchBlogArticle(slug)

const seoTitle = `${article.title} - Jesse Blog`
const seoDescription = article.description
setSeoMeta(seoTitle, seoDescription, article.thumbnail)
</script>
