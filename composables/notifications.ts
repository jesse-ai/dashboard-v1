export function showNotification(type: 'error' | 'success', description: string) {
    if (typeof window === 'undefined') return;
    
    const toast = useToast();

    const title = type.charAt(0).toUpperCase() + type.slice(1);
    const color = type === 'error' ? 'red' : 'green';
    const icon = type === 'error' ? 'i-heroicons i-heroicons-x-circle' : 'i-heroicons i-heroicons-check-circle';

    toast.add({
        title,
        description,
        color,
        icon
    });
}

export function handleError(error: any) {
    if (error.response) {
        if (error.response.data && error.response.data.message) {
            showNotification('error', error.response.data.message)
        }
    } else if (error.value) {
        if (error.value.data && error.value.data.message) {
            showNotification('error', error.value.data.message)
        } else if (error.value.data && error.value.data.error) {
            showNotification('error', error.value.data.error)
        }
    } else if (error.message) {
        showNotification('error', error.message)
    } else {
        showNotification('error', 'An error occurred')
    }
}
