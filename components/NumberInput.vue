<template>
    <div class="flex items-center justify-between">
        <div class="font-bold text-gray-700 dark:text-gray-200">
            {{ title }}
        </div>

        <div class="flex">
            <button class="select-none border py-2 px-4 cursor-pointer bg-gray-100 hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900 dark:border-gray-900 rounded-l" @click="decrease">
                -
            </button>

            <input @focusout="check" v-model="number" class="border border-gray-200 p-2 text-center focus:outline-none focus:ring-0 dark:bg-gray-800 dark:border-gray-900" type="text">

            <button class="select-none border py-2 px-4 cursor-pointer bg-gray-100 hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900 dark:border-gray-900 rounded-r" @click="increase">
                +
            </button>
        </div>
    </div>
</template>
  
<script setup lang="ts">

let number = defineModel()
const props = defineProps<{
    title: string;
    default: number;
}>()

const increase = () => {
    number.value = number.value as number + 1;
}

const decrease = () => {
    number.value = number.value as number - 1;
}

const check = () => {
  if (!number.value) {
    number.value = props.default;
  }
}
</script>
