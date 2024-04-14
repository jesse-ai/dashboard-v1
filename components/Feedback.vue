<template>
  <div class="w-full">
    <p id="feedback-description">
      I would love to hear your feedback whether it's about a bug, suggestion, something you like, or something you hate
      about Jesse!
    </p>

    <br>

    <UForm :state="form" class="space-y-4" @submit="submit">
      <UFormGroup label="Description" name="Description">
        <UTextarea v-model="form.description" :rows="6" placeholder="Type here..." />
      </UFormGroup>

      <UFormGroup
        label="Email (must be registered with on Jesse.Trade)"
        description="Enter your email address for us to know who sent the feedback and possibly reply back to you. It must be the email address of your account on Jesse.Trade"
        required>
        <UInput v-model="form.email" placeholder="Email address..." type="email" />
      </UFormGroup>

      <div class="flex justify-end">
        <UButton
          id="feedback-cancel-button" color="gray"
          variant="link" class="mr-8"
          label="Cancel" @click="close()" />

        <UButton
          id="feedback-submit-button" type="submit"
          class="w-48 flex justify-center " label="Submit"
          :loading="loadingBtn"
          :disabled="!form.description.length || (!form.email.length && !hasLivePluginInstalled)" />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '~/stores/mainStore'

const feedback = defineModel()
const loadingBtn = ref(false)
const store = useMainStore()
const form = reactive({
  email: '',
  description: '',
})

const hasLivePluginInstalled = computed(() => store.hasLivePluginInstalled)

async function submit () {
  loadingBtn.value = true
  const { data, error } = await usePostApi('/feedback', {
    description: form.description,
    email: form.email,
  }, true)
  loadingBtn.value = false
  if (error.value && error.value.statusCode !== 200) {
    showNotification('error', `[${error.value.statusCode}]: Something went wrong. If this persists, please contact support.`)
  }
  // todo: fix type of the response
  const res = data.value as FeedbackResponse
  if (res.status === 'success') {
    form.description = ''
    form.email = ''
    showNotification('success', res.message)
    close()
  }
  else if (res.status === 'error') {
    showNotification('error', res.message)
  }
}

function close () {
  feedback.value = false
}
</script>
