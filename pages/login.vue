<template>
  <SmallContainer>
    <LoginComponent/>
  </SmallContainer>
</template>

<script setup lang="ts">
import LoginComponent from "~/components/LoginComponent.vue";
import SmallContainer from "~/components/SmallContainer.vue";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Login - Jesse'
const seoDescription = 'Login to Jesse, a powerful trading framework written in Python for cryptocurrency. Access your account to manage trades and stay updated with the latest features.'
setSeoMeta(seoTitle, seoDescription)

definePageMeta({
  middleware: 'guest'
})
</script>
