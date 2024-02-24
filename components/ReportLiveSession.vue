<template>
    <p>
        If you think something is wrong with your running live session, you can submit a report.
        By submitting this form, the logs of this session will be sent to Jesse's developers so we can see what's going on.
    </p>
    <br>
    <p>Your exchange API keys and strategies are safe and <b>are never sent to us.</b></p>
    <br>

    <UForm :state="form" class="space-y-4" @submit="report">
        <UFormGroup label="Email (optional)" description="Enter your email address for us to know who sent the email and possibly reply back to you.">
            <UInput v-model="form.email" placeholder="Email address..." type="email" />
        </UFormGroup>

        <br>

        <UFormGroup label="Description (optional):" name="Description">
            <UTextarea v-model="form.description" :rows="10" placeholder="Describe what you think is wrong in this session..." />
        </UFormGroup>

        <br>

        <div class="flex justify-end item-center">
            <div class="flex justify-end">
                <UButton color="gray" variant="link" class="mr-8" label="Cancel" @click="close()" />

                <UButton type="submit" class="w-48 flex justify-center " label="Submit" :loading="loadingBtn" :disabled="loadingBtn" />
            </div>
        </div>
    </UForm>
</template>
  
<script setup lang="ts">
const emit = defineEmits(['close'])
const loadingBtn = ref(false)

const props = defineProps<{
    sessionId: String;
}>()

let form = ref({
    description: '',
    email: ''
})

const close = () => {
    emit('close')
}

const report = async () => {
    loadingBtn.value = true
    const { data, error } = await usePostApi('/report-exception', {
        description: form.value.description,
        email: form.value.email,
        traceback: 'manual report',
        mode: 'live',
        attach_logs: true,
        session_id: props.sessionId
    }, true)
    loadingBtn.value = false

    if (error.value && error.value.statusCode !== 200) {
        showNotification('error', `[${error.value.statusCode}]: ${error.value.statusText}`)
        return
    }

    const res = data.value as any
    if (res.status === 'success') {
        form.value.description = ''
        form.value.email = ''
        showNotification('success', res.message)
        close()
    } else if (res.status === 'error') {
        showNotification('error', res.message)
    }
}
</script>
  