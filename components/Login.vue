<template>
    <section v-if="open" class="absolute top-o l-0 w-full h-screen bg-white dark:bg-backdrop-dark z-40 select-none flex items-center justify-center">
        <div class="text-center">
            <div class="w-full text-center">
                <img class="animate-bounce h-32 w-auto mx-auto dark:hidden" src="@/assets/imgs/logo-light.png" alt="Jesse Logo">
                <img class="animate-bounce h-32 w-auto mx-auto hidden dark:block" src="@/assets/imgs/logo-dark.svg" alt="Jesse Logo">
            </div>

            <br>
            <br>

            <h1 class="text-gray-700 dark:text-gray-300">Welcome Back!</h1>

            <br>

            <p class="opacity-70 text-gray-700 dark:text-gray-300">Enter your password to continue:</p>

            <br>

            <div>
                <UForm :state="form" class="flex items-center justify-center" @submit="login">
                    <UFormGroup name="password">
                        <UInput v-model="form.password" placeholder="password" icon="i-heroicons-lock-closed" type="password" />
                    </UFormGroup>

                    <UButton icon="i-heroicons-arrow-long-right" type="submit" class="ml-2" size="sm" color="primary" square variant="solid" />
                </UForm>
            </div>
        </div>
    </section>
</template>
  
<script setup lang="ts">
import { useAuthStore } from '@/stores/authState'

const open = ref(true)
const form = reactive({
    password: undefined,
})
const store = useAuthStore()

const setAuth = () => {
    store.setAuthToken(sessionStorage.auth_key)
    store.initiate()
    open.value = false
}

const login = async () => {
    if (!form.password) {
        showNotification('error', 'Password is required')
        return true
    }

    const { data, error } = await usePostApi('/auth', {
        password: form.password,
    })
    if (error.value && error.value.statusCode !== 200) {
        if (!error.value.data.message) {
            showNotification('error', error.value.data)
        } else if (error.value.statusCode === 401) {
            showNotification('error', 'Incorrect password')
        } else {
            showNotification('error', `[${error.value.statusCode}]: ${error.value.data.message}`)
        }
        return
    }
    const res = data.value as AuthResponse
    sessionStorage.auth_key = res.auth_token
    setAuth()
    showNotification('success', 'Logged in successfully')
}
</script>