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
