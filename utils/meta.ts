import {useRuntimeConfig} from "#app/nuxt";

export function setSeoMeta(
    title: string,
    description: string,
    image: string | null = null
) {
    if (image === null) {
        image = useRuntimeConfig().public.appUrl + '/og-image.jpg'
    }

    useSeoMeta({
        title: title,
        ogTitle: title,
        description: description,
        ogDescription: description,
        ogImage: image,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterImage: image,
        twitterSite: useRuntimeConfig().public.twitterHandle,
        ogSiteName: useRuntimeConfig().public.appName,
    })
}
