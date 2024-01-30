import {useRuntimeConfig} from "#app/nuxt";

export async function useFetchApi1(url: string, authenticated: boolean = false) {
    const apiBaseUrl1 = useRuntimeConfig().public.apiBaseUrl1;
    if (!apiBaseUrl1) {
        throw new Error('apiBaseUrl1 is not defined');
    }
    const headers = authenticated ? {
        'Authorization': `Bearer ${authStore().bearerToken}`
    } : undefined;
    const {data, error} = await useFetch(`${apiBaseUrl1}${url}`, {headers});
    return {data, error};
}

export async function useFetchApi2(url: string, authenticated: boolean = false) {
    const apiBaseUrl2 = useRuntimeConfig().public.apiBaseUrl2;
    if (!apiBaseUrl2) {
        throw new Error('apiBaseUrl2 is not defined');
    }
    const headers = authenticated ? {
        'Authorization': `Bearer ${authStore().bearerToken}`
    } : undefined;
    const {data, error} = await useFetch(`${apiBaseUrl2}${url}`, {headers});
    return {data, error};
}

export async function usePostApi1(url: string, payload: any, authenticated: boolean = false) {
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
    const {data, error} = await useFetch(`${apiBaseUrl1}${url}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: headers,
    });
    return {data, error};
}

export async function usePostApi2(url: string, payload: any, authenticated: boolean = false) {
    const apiBaseUrl2 = useRuntimeConfig().public.apiBaseUrl2;
    if (!apiBaseUrl2) {
        throw new Error('apiBaseUrl2 is not defined');
    }
    const headers: HeadersInit = authenticated ? {
        'Authorization': `Bearer ${authStore().bearerToken}`,
        'Content-Type': 'application/json'
    } : {
        'Content-Type': 'application/json'
    };
    const {data, error} = await useFetch(`${apiBaseUrl2}${url}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: headers,
    });
    return {data, error};
}

// ==================== Releases ====================

export async function fetchReleases(page: number): Promise<ReleasesResponse> {
    const endpoint = `/releases?page=${page}`;
    const {data} = await useFetchApi1(endpoint);
    return data.value as ReleasesResponse;
}

// ==================== Help Center ====================

export async function searchHelpCenterItems(query: string): Promise<HelpItem[]> {
    const endpoint = `/help/search?item=${query}`;
    const {data} = await useFetchApi1(endpoint);
    return data.value as HelpItem[];
}

export async function fetchHelpCenterItem(slug: string): Promise<HelpItem> {
    const {data} = await useFetchApi1(`/help/${slug}`);
    return data.value as HelpItem;
}

export async function fetchHelpCenterItems(): Promise<HelpIndexResponse> {
    const {data} = await useFetchApi1('/help');
    return data.value as HelpIndexResponse;
}

export async function fetchHelpCategoryIndex(slug: string): Promise<HelpCategoryIndexResponse> {
    const {data} = await useFetchApi1(`/help/category/${slug}`);
    return data.value as HelpCategoryIndexResponse;
}

export async function fetchHelpTagIndex(slug: string): Promise<HelpItem[]> {
    const {data} = await useFetchApi1(`/help/tag/${slug}`);
    return data.value as HelpItem[];
}

// ==================== Blog ====================

export async function fetchBlogArticles(page: number): Promise<BlogResponse> {
    const endpoint = `/blog?page=${page}`;
    const {data} = await useFetchApi1(endpoint);
    return data.value as BlogResponse;
}

export async function fetchBlogArticle(slug: string): Promise<BlogArticle> {
    const {data} = await useFetchApi1(`/blog/articles/${slug}`);
    return data.value as BlogArticle;
}

// ==================== User ====================

export async function fetchAuthUser(): Promise<AuthUser> {
    const {data} = await useFetchApi1('/auth/me', true);
    return data.value as AuthUser;
}
