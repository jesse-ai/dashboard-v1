<template>
  <div class="w-full h-screen items-center flex justify-center">
    <div class="font-bold text-xl md:text-2xl text-indigo-600">
      <h1 class="md:text-5xl text-2xl text-center font-serif">
        Checking payment information...
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import {onMounted} from 'vue'
import {setSeoMeta} from "~/utils/meta";

definePageMeta({
  middleware: 'auth'
});

const seoTitle = 'Checking payment information...'
const seoDescription = 'Checking payment information...'
setSeoMeta(seoTitle, seoDescription)

const route = useRoute()
const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    const id = route.query.id
    router.push(`/payments/${id}`)
  }, 1000)
})
</script>
