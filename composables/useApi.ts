import { useRuntimeConfig } from '#app/nuxt'

export async function useFetchApi (url: string, authenticated: boolean = false) {
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  if (!apiBaseUrl) {
    throw new Error('apiBaseUrl is not defined')
  }
  // if the url begins with: https://
  let fullUrl = apiBaseUrl + url
  if (url.startsWith('https://')) {
    fullUrl = url
  }

  const headers = authenticated
    ? {
      Authorization: `${useMainStore().authToken}`
    }
    : undefined
  const { data, error } = await useFetch(`${fullUrl}`, {
    headers,
    server: false,
    lazy: true
  })
  return { data, error }
}

export async function usePostApi (url: string, payload: any, authenticated: boolean = false) {
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  if (!apiBaseUrl) {
    throw new Error('apiBaseUrl is not defined')
  }
  // if the url begins with: https://
  let fullUrl = apiBaseUrl + url
  if (url.startsWith('https://')) {
    fullUrl = url
  }
  const headers: HeadersInit = authenticated
    ? {
      'Authorization': `${useMainStore().authToken}`,
      'Content-Type': 'application/json'
    }
    : {
      'Content-Type': 'application/json'
    }
  const { data, error } = await useFetch(`${fullUrl}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: headers,
    server: false,
    lazy: true
  })
  return { data, error }
}
