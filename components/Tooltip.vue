<template>
    <span class="relative underline" @mouseenter="showIt" @mouseleave="hideIt">
        <span v-show="show" class="absolute -top-10 z-90 bg-gray-900 rounded px-2 py-1 text-sm text-white" v-text="title" />
        <slot />
    </span>
</template>
  
<script setup lang="ts">
const props = defineProps<{
    title: string;
}>();

const show = ref(false);

const showIt = () => {
    show.value = true;
};

const hideIt = () => {
    show.value = false;
};
</script>
  