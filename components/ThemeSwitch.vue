<template>
    <button id="theme-switch-button" class="btn-nav" @click="toggle">
        <MoonIcon v-if="theme === 'light'" class="h-6 w-6" aria-hidden="true" />

        <SunIcon v-if="theme === 'dark'" class="h-6 w-6" aria-hidden="true" />
    </button>
</template>
  
<script setup lang="ts">
import {
    MoonIcon,
    SunIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authState'
import helpers from '@/utils/helpers'

const store = useAuthStore()
const theme = ref(store.theme)


const toggle = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    if (newTheme === 'light') {
        document.documentElement.classList.remove('dark')
        theme.value = 'light'
    } else if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
        theme.value = 'dark'
    }
}
</script>
  