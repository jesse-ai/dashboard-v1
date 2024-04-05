<template>
  <SlideOver v-model="exceptionReport" title="Report">
    <div v-if="alert.message" class="mb-4">
      <UAlert color="teal" icon="i-heroicons-check-circle" :title="alert.message" @close="alert.message = ''"
              :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link' }"/>
    </div>

    <p>
      If the exception you're seeing is not clear and you think it might be a bug, please send us a report to help
      us debugging and fixing it in a future release.
    </p>

    <br>

    <label class="font-semibold">Exception:</label>
    <pre
        class="break-all lg:break-normal mt-2 text-sm whitespace-pre-line px-6 py-6 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 dark:border-gray-800 border border-gray-200"
        v-html="content"/>

    <UForm :state="form" class="space-y-4 mt-4" @submit="report">
      <UFormGroup label="Description (optional):" name="Description (optional):">
        <UTextarea v-model="form.description" :rows="10" placeholder="Describe how the exception occurred..."/>
      </UFormGroup>

      <UFormGroup v-if="!hasLivePluginInstalled" label="Email (must be registered with on Jesse.Trade)"
                  description="Enter your email address for us to know who sent the feedback and possibly reply back to you. It must be the email address of your account on Jesse.Trade"
                  required>
        <UInput v-model="form.email" placeholder="Email address..." type="email"/>
      </UFormGroup>

      <!-- export chart -->
      <ToggleButton v-if="showLogToggle" v-model="form.attachLogs" title="Attach Debugging Logs"
                    description="Attach the log file of this session along with this report which helps Jesse's team"/>

      <div class="flex justify-end">
        <UButton id="feedback-cancel-button" color="gray" variant="link" class="mr-8" label="Cancel"
                 @click="exceptionReport = false"/>

        <UButton id="feedback-submit-button" type="submit" class="w-48 flex justify-center " label="Submit"
                 :loading="loadingBtn"
                 :disabled="!form.description.length || (!form.email.length && !hasLivePluginInstalled)"/>
      </div>
    </UForm>
  </SlideOver>

  <DividerWithButtons title="Exception">
    <button type="button"
            class="inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 dark:border-gray-600 text-sm leading-5 font-medium rounded-l-full text-gray-700 dark:text-gray-100 bg-white dark:bg-backdrop-dark hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
            @click="openReport">
      <FlagIcon class="-ml-1.5 mr-1 h-5 w-5 text-gray-400" aria-hidden="true"/>
      <span>Report</span>
    </button>
    <button type="button"
            class="inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 dark:border-gray-600 text-sm leading-5 font-medium rounded-r-full text-gray-700 dark:text-gray-100 bg-white dark:bg-backdrop-dark hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
            @click="copy">
      <CheckIcon v-if="copied" class="-ml-1.5 mr-1 h-5 w-5 text-gray-400" aria-hidden="true"/>
      <ClipboardIcon v-else class="-ml-1.5 mr-1 h-5 w-5 text-gray-400" aria-hidden="true"/>
      <span>{{ copied ? 'Copied' : 'Copy' }}</span>
    </button>
  </DividerWithButtons>

  <div class="rounded-md bg-red-50 p-4 my-4 select-text">
    <div class="flex">
      <div class="flex-shrink-0">
        <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true"/>
      </div>

      <div class="ml-3 overflow-hidden">
        <h3 class="text-base font-medium text-red-800 mb-6" v-text="title"/>

        <pre v-if="content"
             class="mt-2 text-sm text-red-700 whitespace-pre-line px-6 py-6 rounded-md border-2 border-dashed border-red-200"
             v-html="content"/>
      </div>
    </div>
    <textarea v-show="showException" id="exception-info" :value="content" class="fixed left-0 bottom-0 opacity-0"/>
  </div>
</template>

<script setup lang="ts">
import {useAuthStore} from '~/stores/authStore'
import {FlagIcon, XCircleIcon, ClipboardIcon, CheckIcon} from '@heroicons/vue/24/outline';

const props = defineProps({
  title: String,
  content: {
    type: String,
    default: ''
  },
  mode: String,
  debugMode: {
    type: Boolean,
    default: ''
  },
  sessionId: {
    type: String,
    default: ''
  }
})

const exceptionReport = defineModel()

const store = useAuthStore()
const form = reactive({
  description: '',
  attachLogs: true,
  email: ''
})

const showException = ref(false)
const copied = ref(false)
const loadingBtn = ref(false)

const alert = computed(() => {
  if (props.mode === 'backtest' && !props.debugMode) {
    return {
      message: 'It is highly recommended to attach log files with reports. To do that, press cancel, enable "Debug Mode", and  ' +
          'run again. ',
      type: 'warning'
    }
  }

  return {
    message: '',
    type: ''
  }
})

const showLogToggle = computed(() => {
  return (props.mode === 'backtest' && props.debugMode) || props.mode === 'live'
})

const hasLivePluginInstalled = computed(() => store.hasLivePluginInstalled);

const report = async () => {
  loadingBtn.value = true
  const {data, error} = await usePostApi('/report-exception', {
    description: form.description,
    email: form.email,
    traceback: props.content,
    mode: props.mode,
    attach_logs: form.attachLogs,
    session_id: props.sessionId
  }, true)
  loadingBtn.value = false
  if (error.value && error.value.statusCode !== 200) {
    showNotification('error', `[${error.value.statusCode}]: ${error.value.message}`)
    return
  }

  const res = data.value as { data: { status: string, message: string } }
  if (res.data.status === 'success') {
    form.description = ''
    form.email = ''
    showNotification('success', res.data.message)
    exceptionReport.value = false
  } else if (res.data.status === 'error') {
    showNotification('error', res.data.message)
  }
}

const copy = () => {
  navigator.clipboard.writeText(props.content)
  showNotification('success', 'Report copied successfully')
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const openReport = () => {
  exceptionReport.value = true
}
</script>
