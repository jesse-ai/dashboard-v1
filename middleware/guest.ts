import {authStore} from "~/stores";

export default defineNuxtRouteMiddleware((to, from) => {
    if (authStore().isAuthenticated) {
        return navigateTo('/')
    }
})
