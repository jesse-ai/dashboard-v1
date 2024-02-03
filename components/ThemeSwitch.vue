<template>
    <button id="theme-switch-button" class="btn-nav" @click="toggle">
        <SunIcon v-if="colorMode.preference === 'dark'" class="h-6 w-6" aria-hidden="true" />

        <MoonIcon v-else class="h-6 w-6" aria-hidden="true" />

    </button>
</template>
  
<script setup lang="ts">
import {
    MoonIcon,
    SunIcon
} from '@heroicons/vue/24/outline'
const colorMode = useColorMode()


const toggle = () => {
    if (colorMode.preference == 'dark')
        colorMode.preference = 'light'
    else
        colorMode.preference = 'dark'
}
</script>
  