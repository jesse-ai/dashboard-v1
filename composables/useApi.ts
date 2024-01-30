import { useRuntimeConfig } from "#app/nuxt";

export async function useFetchApi(url: string, authenticated: boolean = false) {
    const apiBaseUrl1 = useRuntimeConfig().public.apiBaseUrl1;
    if (!apiBaseUrl1) {
        throw new Error('apiBaseUrl1 is not defined');
    }
    const headers = authenticated ? {
        'Authorization': `Bearer ${authStore().bearerToken}`
    } : undefined;
    const { data, error } = await useFetch(`${apiBaseUrl1}${url}`, { headers });
    return { data, error };
}

export async function usePostApi(url: string, payload: any, authenticated: boolean = false) {
    const apiBaseUrl1 = useRuntimeConfig().public.apiBaseUrl1;
    if (!apiBaseUrl1) {
        throw new Error('apiBaseUrl1 is not defined');
    }
    const headers: HeadersInit = authenticated ? {
        'Authorization': `Bearer ${authStore().bearerToken}`,
        'Content-Type': 'application/json'
    } : {
        'Content-Type': 'application/json'
    };
    const { data, error } = await useFetch(`${apiBaseUrl1}${url}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: headers,
    });
    return { data, error };
}