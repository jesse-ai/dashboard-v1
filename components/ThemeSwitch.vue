<template>
    <button id="theme-switch-button" class="btn-nav" @click="toggle">
        <MoonIcon v-if="store.theme === 'light'" class="h-6 w-6" aria-hidden="true" />

        <SunIcon v-if="store.theme === 'dark'" class="h-6 w-6" aria-hidden="true" />
    </button>
</template>
  
<script setup lang="ts">
import {
    MoonIcon,
    SunIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authState'

const store = useAuthStore()


const toggle = () => {
    const newTheme = store.theme === 'light' ? 'dark' : 'light'
    if (newTheme === 'light') {
        document.documentElement.classList.remove('dark')
        store.theme = 'light'
    } else if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
        store.theme = 'dark'
    }
}
</script>
  