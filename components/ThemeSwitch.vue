<template>
  <button id="theme-switch-button" class="ml-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none" @click="toggle">
    <SunIcon class="hidden dark:block h-6 w-6" aria-hidden="true" />
    <MoonIcon class="dark:hidden h-6 w-6" aria-hidden="true" />
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
