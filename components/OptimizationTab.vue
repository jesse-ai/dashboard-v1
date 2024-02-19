<template>
    <!-- Debugger Logs -->
    <SlideOver v-if="form.debug_mode" name="logsModal" :object="results" title="Logs">
        <template #default>
            <Logs :logs="results.infoLogs" />
        </template>

        <template #buttons>
            <button class="btn-nav" @click="copyInfoLogs">
                <CheckIcon v-if="copiedLogsInfo" class="h-6 w-6" aria-hidden="true" />
                <ClipboardIcon v-if="!copiedLogsInfo && results.infoLogs.length != 0" class="h-6 w-6" aria-hidden="true" />
            </button>
            <input id="copy-info-logs" type="hidden" :value="results.infoLogs">
        </template>
    </SlideOver>

    <LayoutsSidebar>
        <template #left>
            <!-- alert -->
            <div v-if="results.alert.message">
                <UAlert color="teal" icon="i-heroicons-check-circle" :title="results.alert.message" @close="results.alert.message = ''" :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link' }" />
            </div>

            <!-- exception  -->
            <div v-if="results.exception.error && results.executing" class="mb-8">
                <Exception :title="results.exception.error" :content="results.exception.traceback" mode="optimize" v-model="exceptionReport" />
            </div>

            <!-- Execution -->
            <div v-if="(results.executing || results.showResults) && !results.exception.error">
                <Divider title="Info" />
                <KeyValueTable v-if="results.generalInfo.length" :data="results.generalInfo" />
                <TablePlaceholder v-else />

                <div v-if="results.best_candidates.length" class="mt-16">
                    <Divider title="Best DNA Candidates" />
                    <MultipleValuesTable :data="results.best_candidates" header />
                </div>
            </div>

            <!-- Content -->
            <div v-if="!results.executing && !results.showResults">
                <Routes :form="form" :results="results" />

                <Divider class="mt-16 mb-4" title="Options" />

                <div class="grid grid-cols-1 gap-6">
                    <!-- debug mode -->
                    <ToggleButton v-model="form.debug_mode" title="Debug Mode" description="Displays detailed logs about the genetics algorithm. Use it if you are interested in the genetics algorithm and are familiar with its basics." />
                </div>

                <!-- optimal_total -->
                <div class="select-none">
                    <Divider class="mt-16 mb-4" title="Optimal Trades" />
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        The number that tells Jesse how many trades you would find optimal for your strategy in the targeted time
                        period so that it can filter out those DNAs that cause too few trades.
                        <a href="https://docs.jesse.trade/docs/optimize/executing-the-optimize-mode.html" target="_blank" class="font-semibold hover:underline italic">More Details...</a>
                    </p>
                    <br>
                    <NumberInput v-model="form.optimal_total" title="Optimal number of trades:" />
                </div>

                <Divider class="mt-16 mb-4" title="Duration" />

                <div class="flex items-center select-none flex-1 mb-4">
                    <UInput v-model="form.start_date" type="date" variant="outline" size="xl" class="w-full mr-2" />

                    <UInput v-model="form.finish_date" type="date" variant="outline" size="xl" class="w-full ml-2" />
                </div>
            </div>
        </template>

        <template #right>
            <!-- Action Buttons -->
            <div v-if="!results.executing && !results.showResults">
                <div>
                    <UButton @click="start(Number($route.params.id))" class="w-full flex justify-center" icon="i-heroicons-bolt" size="xl" variant="solid" label="Start" :trailing="false" />
                </div>
            </div>

            <!-- Execution -->
            <div v-if="results.executing && !results.showResults" class="flex flex-col items-center justify-center select-none">
                <div class="mb-8 w-full">
                    <UButton @click="cancel(Number($route.params.id))" color="gray" class="w-full flex justify-center" icon="i-heroicons-no-symbol" size="sm" variant="solid" label="Cancel" :trailing="false" />

                    <a v-if="form.debug_mode" :href="logsUrl" class="flex justify-center items-center btn-secondary text-center mb-4 w-full">
                        <DocumentDownloadIcon class="w-5 h-5 mr-2" />
                        Debugging Logs
                    </a>
                </div>

                <div>
                    <CircleProgressbar :progress="results.progressbar.current" />
                </div>

                <h3 v-if="!results.exception.error && !results.best_candidates.length" class="mt-8 animate-pulse" v-text="remainingTimeText" />
            </div>
            <!-- Show Results -->
            <div v-if="results.showResults">
                <div class="mb-8 w-full">
                    <button class="flex justify-center items-center btn-success text-center mb-4 w-full" @click="newSession">
                        <ReplyIcon class="w-5 h-5 mr-2" />
                        New session
                    </button>

                    <a v-if="form.debug_mode" :href="logsUrl" class="flex justify-center items-center btn-secondary text-center mb-4 w-full">
                        <DocumentDownloadIcon class="w-5 h-5 mr-2" />
                        Debugging Logs
                    </a>
                </div>
            </div>
        </template>
    </LayoutsSidebar>
</template>
  
<script setup lang="ts">
import { useOptimizationStore } from '@/stores/optimizationState'
import { ClipboardIcon, CheckIcon } from '@heroicons/vue/24/solid'
import helpers from '@/utils/helpers'

const props = defineProps<{
    form: OptimizationForm;
    results: OptimizationResults;
}>();

const exceptionReport = ref(false)
const copiedLogsInfo = ref(false)
const baseURL = ref(useRuntimeConfig().public.apiBaseUrl1)

const auth_key = computed(() => sessionStorage.auth_key)

const remainingTimeText = computed(() => helpers.remainingTimeText(props.results.progressbar.estimated_remaining_seconds))

let logsUrl = computed(() => {
    let url = `/download/optimize/log?token=${auth_key.value}`
    if (baseURL.value !== '/') {
        url = baseURL.value + url
    }
    return url
})

const { addTab, startInNewTab, start, cancel, rerun, newOptimization } = useOptimizationStore()

function copyInfoLogs() {
    navigator.clipboard.writeText(props.results.infoLogs)
    showNotification('success', 'Info copied successfully')
    copiedLogsInfo.value = true

    setTimeout(() => {
        copiedLogsInfo.value = false
    }, 3000)
}

function newSession() {
    props.results.showResults = false
    props.results.executing = false
    props.results.progressbar.current = 0
    props.results.progressbar.estimated_remaining_seconds = 0
    props.results.alert.message = ''
    props.results.alert.type = ''
}

watch(() => props.form.start_date, (val) => {
    if (props.form.finish_date < val) {
        props.form.finish_date = val
    }
})

watch(() => props.form.finish_date, (val) => {
    if (props.form.start_date > val) {
        props.form.start_date = val
    }
})
</script>
  
  