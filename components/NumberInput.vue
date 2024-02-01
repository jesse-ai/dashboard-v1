<template>
    <div class="flex items-center justify-between">
        <div class="font-medium text-gray-700 dark:text-gray-200">
            {{ title }}
        </div>

        <div class="flex">
            <button class="select-none border py-2 px-4 cursor-pointer bg-gray-100 hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900 dark:border-gray-900 rounded-l" @click="decrease">
                -
            </button>

            <input v-model="numberModel" class="border border-gray-200 p-2 text-center focus:outline-none focus:ring-0 dark:bg-gray-800 dark:border-gray-900" type="text">

            <button class="select-none border py-2 px-4 cursor-pointer bg-gray-100 hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900 dark:border-gray-900 rounded-r" @click="increase">
                +
            </button>
        </div>
    </div>
</template>
  
<script setup lang="ts">

let numberModel = defineModel()
const props = defineProps<{
    title: string;
    default: {
        type: Number,
        default: 1
    }
}>()

const setDefault = () => {
    if (!numberModel.value) {
        numberModel.value = props.default
    }
}

watch(() => [numberModel, props.default], setDefault, { immediate: true })

const increase = () => {
    numberModel.value = numberModel.value as number + 1;
}

const decrease = () => {
    numberModel.value = numberModel.value as number - 1;
}
</script>
  