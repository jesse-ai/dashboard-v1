<template>
  <div class="bg-white">
    <div class="bg-gray-50 text-gray-800 py-24">
      <!-- Hero Section -->
      <HomeHeroSection/>
    </div>

    <!-- feature tabs with screenshots -->
    <HomeSliderSection/>

    <!-- newsletter section -->
    <NewsletterSection/>

    <!-- steps and stats section and community section -->
    <CommunitySection/>

    <!-- stats -->
    <StatsSection/>

    <!--Blog section-->
    <BlogSection :articles="articles" v-if="articles"/>

    <!-- footer section -->
    <!--    <HomeFooterSection/>-->
  </div>
</template>

<script setup lang="ts">
import HomeHeroSection from '@/components/home/HomeHeroSection.vue'
import HomeSliderSection from '@/components/home/HomeSliderSection.vue'
import NewsletterSection from '@/components/home/NewsletterSection.vue'
import CommunitySection from '@/components/home/CommunitySection.vue'
import StatsSection from '@/components/home/StatsSection.vue'
import BlogSection from '@/components/home/BlogSection.vue'
import {setSeoMeta} from "~/utils/meta";
import {useFetchApi1} from "~/composables/useApi";

const seoTitle = 'Jesse - The Open-source Python Bot For Trading Cryptocurrencies'
const seoDescription = 'A powerful and efficient trading framework written in Python for cryptocurrency. Automate your trades and stay on top of the latest market trends.'
setSeoMeta(seoTitle, seoDescription)

const articles = ref([] as BlogArticle[])
onMounted(() => {
  setTimeout(async () => {
    const {data, error} = await useFetchApi1('/blog/recent', false)
    articles.value = data.value as BlogArticle[]
  }, 10);
})
</script>
