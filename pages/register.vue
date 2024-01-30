<template>
  <SmallContainer>
    <RegisterComponent/>
  </SmallContainer>
</template>

<script setup lang="ts">
import SmallContainer from "~/components/SmallContainer.vue";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Register for Jesse'
const seoDescription = 'Sign up for Jesse, a trading framework written in Python for cryptocurrency. Join now to access powerful trading features and tools, and optimize your cryptocurrency trading strategy.'
setSeoMeta(seoTitle, seoDescription)

definePageMeta({
  middleware: 'guest'
})
</script>
