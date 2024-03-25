<template>
  <div class="mt-8">
    <LayoutsSidebar>
      <template #left>
        <div v-for="i in 4" :class="i === 1 ? '' : 'mt-8'">
          <div class="loading-bar h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div class="loading-bar2 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mt-4"></div>
        </div>
      </template>

      <template #right>
        <div class="w-full relative animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div class="absolute inset-0" />
        </div>
        <div class="w-full animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded-full mt-4"></div>
      </template>
    </LayoutsSidebar>
  </div>
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
