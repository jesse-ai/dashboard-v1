<template>
    <div class="w-screen h-screen flex justify-center items-center -mt-16">
        <div class="w-1/2" ref="animationContainer"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import lottie from 'lottie-web';

const animationContainer = ref(null);

onMounted(() => {
    if (animationContainer.value !== null) {
        lottie.loadAnimation({
            container: animationContainer.value, // the DOM element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/_nuxt/assets/json/loading.json' // the path to the animation json
        })
    }
});
</script>

<style scoped></style>