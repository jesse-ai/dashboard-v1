<template>
    <div v-if="show.flag" class="relative bg-indigo-600 dark:bg-indigo-400 select-none text-white dark:text-black">
        <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div class="pr-16 sm:text-center sm:px-16">
                <p class="font-medium">
                    <span class="md:inline">
                        {{ show.message }}
                    </span>
                    <span class="block sm:ml-2 sm:inline-block">
                        <a href="https://docs.jesse.trade/docs/getting-started/update.html" target="_blank" class="font-bold underline"> Update Guide <span aria-hidden="true">&rarr;</span></a>
                    </span>
                </p>
            </div>
            <div class="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
                <button type="button" class="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-0" @click="skip(show.type, show.version)">
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authState'
import helpers from '@/utils/helpers'


const skipped = ref(false)
const store = useAuthStore()
const updateInfo = computed(() => store.updateInfo)
const systemInfo = computed(() => store.systemInfo)

const show = computed(() => {
    if (skipped.value || !updateInfo.value || !updateInfo.value.is_update_info_available) {
        return {
            flag: false,
            message: '',
            type: '',
            version: '',
        }
    }

    // fetch skipped versions from the local storage
    const skippedJesseVersions = helpers.localStorageGet('skippedJesseVersions') || []
    const skippedLivePluginVersions = helpers.localStorageGet('skippedLivePluginVersions') || []

    if (updateInfo.value.jesse_latest_version > systemInfo.value.jesse_version && !skippedJesseVersions.includes(updateInfo.value.jesse_latest_version)) {
        return {
            flag: true,
            message: `Version "${updateInfo.value.jesse_latest_version}" of Jesse is available. You are currently running version "${systemInfo.value.jesse_version}".`,
            type: 'jesse',
            version: updateInfo.value.jesse_latest_version,
        }
    }

    if (systemInfo.value.live_plugin_version && updateInfo.value.jesse_live_latest_version > systemInfo.value.live_plugin_version && !skippedLivePluginVersions.includes(updateInfo.value.jesse_live_latest_version)) {
        return {
            flag: true,
            message: `Version "${updateInfo.value.jesse_live_latest_version}" of the live plugin is available. You are running "${systemInfo.value.live_plugin_version}".`,
            type: 'live',
            version: updateInfo.value.jesse_live_latest_version,
        }
    }

    return {
        flag: false,
        message: '',
        type: '',
        version: '',
    }
})

const skip = (type: string, version: string) => {
    if (type === 'jesse') {
        const skippedJesseVersions = helpers.localStorageGet('skippedJesseVersions') || []
        skippedJesseVersions.push(version)
        helpers.localStorageSet('skippedJesseVersions', skippedJesseVersions)
        skipped.value = true
    }

    if (type === 'live') {
        const skippedLivePluginVersions = helpers.localStorageGet('skippedLivePluginVersions') || []
        skippedLivePluginVersions.push(version)
        helpers.localStorageSet('skippedLivePluginVersions', skippedLivePluginVersions)
        skipped.value = true
    }
}
</script>
  