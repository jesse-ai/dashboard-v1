<template>
  <UContainer>
    <div class="mt-8">
      <div v-for="i in 6" :key="i" :class="i === 1 ? '' : 'mt-8'">
        <div class="loading-bar h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div class="loading-bar2 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mt-4" />
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
.loading-bar {
  width: 0;
  animation: load 1s infinite, pulse 2s infinite;
}

.loading-bar2 {
  width: 0;
  animation: load 2s infinite, pulse 2s infinite;
}

@keyframes load {
  0% {
    width: 0;
  }

  70% {
    width: 100%;
  }

  100% {
    width: 0;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
