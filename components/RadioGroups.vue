<template>
  <div class="flex items-center justify-between">
    <div class="font-semibold">{{ title }}</div>

    <div>
      <RadioGroup v-model="(model as any)">
        <RadioGroupLabel class="sr-only">{{ title }}</RadioGroupLabel>

        <div class="bg-white dark:bg-gray-900 rounded-md flex">
          <RadioGroupOption
            v-for="(setting, settingIdx) in options" :key="setting"
            v-slot="{ checked }" class="flex-1"
            as="template" :value="setting">
            <div :class="[settingIdx === 0 ? 'rounded-l-md' : '', settingIdx === options.length - 1 ? 'rounded-r-md' : '', checked ? 'bg-indigo-50 dark:bg-gray-800 border-indigo-200 dark:border-indigo-400 z-10' : 'border-gray-200 dark:border-gray-800', 'relative border px-4 py-3 flex cursor-pointer focus:outline-none']">
              <span :class="[checked ? 'bg-indigo-600 dark:bg-indigo-400 border-transparent' : 'bg-white dark:bg-backdrop-dark border-gray-300 dark:border-gray-700', 'h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center']" aria-hidden="true">
                <span class="rounded-full bg-white w-1.5 h-1.5" />
              </span>
              <div class="ml-3 flex flex-col">
                <RadioGroupLabel as="span" :class="[checked ? 'text-indigo-900 dark:text-gray-100' : 'text-gray-900 dark:text-gray-100', 'capitalize block text-sm font-medium']">
                  {{ setting }}
                </RadioGroupLabel>
              </div>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

const model = defineModel()

const props = defineProps<{
  title: string
  options: string[]
  default?: string
}>()

const setDefaults = () => {
  if (props.default && !props.options.includes(props.default)) {
    console.error(`The default value "${props.default}" is not in the options array. options: ${props.options}`)
  }
  if (!model.value) {
    model.value = props.default
  }
}

watch(() => [props.default, props.options, model.value], setDefaults, { immediate: true })
</script>
