import { useRuntimeConfig } from "#app/nuxt";

export async function useFetchApi(url: string, authenticated: boolean = false) {
    const apiBaseUrl1 = useRuntimeConfig().public.apiBaseUrl1;
    if (!apiBaseUrl1) {
        throw new Error('apiBaseUrl1 is not defined');
    }
    // if the url begins with: https://
    let fullUrl = apiBaseUrl1 + url;
    if (url.startsWith('https://')) {
        fullUrl = url;
    }

    const headers = authenticated ? {
        'Authorization': `Bearer ${authStore().bearerToken}`
    } : undefined;
    const { data, error } = await useFetch(`${fullUrl}`, { headers });
    return { data, error };
}

export async function usePostApi(url: string, payload: any, authenticated: boolean = false) {
    const apiBaseUrl1 = useRuntimeConfig().public.apiBaseUrl1;
    if (!apiBaseUrl1) {
        throw new Error('apiBaseUrl1 is not defined');
    }
    // if the url begins with: https://
    let fullUrl = apiBaseUrl1 + url;
    if (url.startsWith('https://')) {
        fullUrl = url;
    }
    const headers: HeadersInit = authenticated ? {
        'Authorization': `Bearer ${authStore().bearerToken}`,
        'Content-Type': 'application/json'
    } : {
        'Content-Type': 'application/json'
    };
    const { data, error } = await useFetch(`${fullUrl}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: headers,
    });
    return { data, error };
}