<template>
  <!-- new version announcement -->
  <UpdateBanner/>

  <!-- Settings -->
  <SlideOver v-model="settings" title="Settings">
    <Settings/>
  </SlideOver>

  <!-- Feedback -->
  <SlideOver v-model="feedback" title="Feedback">
    <Feedback v-model="feedback"/>
  </SlideOver>

  <!-- Make strategy -->
  <SlideOver v-model="makeStrategy" title="Make a new strategy" width="max-w-lg">
    <MakeStrategy v-model="makeStrategy"/>
  </SlideOver>

  <!-- About -->
  <SlideOver v-model="about" title="About" width="max-w-lg">
    <About v-model="about"/>
  </SlideOver>

  <!-- Logout -->
  <ConfirmModal title="Logout"
                description="Are you sure you want to logout?"
                type="info" v-model="logoutConfirmation">
    <UButton @click="logout"
             variant="solid"
             color="rose"
             size="lg"
             label="Logout"/>
  </ConfirmModal>

  <Disclosure v-slot="{ open }" as="nav" class="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-900 select-none">
    <div class="mx-auto px-4 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <!-- light -->
            <img class="h-9 w-auto dark:hidden" src="@/assets/imgs/logo-light.png" alt="Jesse Logo">
            <!-- dark -->
            <img class="hidden dark:block h-10 w-auto" src="@/assets/imgs/logo-dark.svg" alt="Jesse Logo">
          </div>
          <div class="hidden lg:block lg:ml-6">
            <div class="flex space-x-4">
              <router-link v-for="item in navigation" :id="convertToSlug(item.name) + '-page-button'" :key="item.name"
                           :to="item.to"
                           class="flex items-center text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                           :class="($route.path.startsWith(item.to) && item.to !== '/') || $route.path === item.to ? 'bg-gray-200 dark:bg-gray-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200'">
                <component :is="item.icon"
                           :class="[($route.path.startsWith(item.to) && item.to !== '/') || $route.path === item.to ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400', 'flex-shrink-0 -ml-1 mr-2 h-6 w-6']"
                           aria-hidden="true"/>
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="hidden lg:ml-6 lg:block">
          <div class="flex items-center">
            <ThemeSwitch/>

            <button class="btn-nav" @click="settings = true">
              <span class="sr-only">Settings</span>
              <CogIcon class="h-6 w-6" aria-hidden="true"/>
            </button>

            <!-- Notifications -->
            <!--            <button class="p-1 mx-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none">-->
            <!--              <span class="sr-only">View notifications</span>-->
            <!--              <BellIcon class="h-6 w-6" aria-hidden="true" />-->
            <!--            </button>-->

            <!-- Profile dropdown -->
            <Menu as="div" class="relative z-40">
              <MenuButton class="btn-nav">
                <span class="sr-only">Settings</span>
                <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true"/>
              </MenuButton>

              <transition enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                    class="bg-white dark:bg-gray-700 origin-top-right absolute right-0 mt-2 w-64 rounded-md border-gray-200 dark:border-gray-900 shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-900">
                  <div class="px-4 py-3 select-text">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Active License: <span
                        class="truncate text-sm font-medium text-gray-800 dark:text-gray-200 opacity-100 uppercase">{{
                        planInfo.plan
                      }}</span></p>
                  </div>

                  <div class="py-1">
                    <MenuItem v-if="shouldShowUpgradeButton" v-slot="{ active }">
                      <a href="https://jesse.trade/pricing"
                         :class="[active ? 'bg-gray-100 dark:bg-gray-800' : '', 'flex justify-start items-center w-full text-left px-4 py-2 text-sm text-yellow-500 dark:text-yellow-300']"
                         target="_blank">
                        <SparklesIcon class="w-5 h-5 mr-2"/>
                        Upgrade License
                      </a>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <button
                          :class="[active ? 'bg-gray-100 dark:bg-gray-800' : '', 'flex justify-left items-center w-full text-left px-4 py-2 text-sm text-indigo-700 dark:text-indigo-300']"
                          @click="makeStrategy = true">
                        <DocumentPlusIcon class="w-5 h-5 mr-2"/>
                        New Strategy
                      </button>
                    </MenuItem>
                  </div>

                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                          :class="[active ? 'bg-gray-100 dark:bg-gray-800' : '', 'flex justify-left items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300']"
                          @click="openFeedback">
                        <ChatBubbleLeftIcon class="w-5 h-5 mr-2"/>
                        Feedback
                      </button>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <a href="https://docs.jesse.trade/"
                         :class="[active ? 'bg-gray-100 dark:bg-gray-800' : '', 'flex justify-start items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300']"
                         target="_blank">
                        <CircleStackIcon class="w-5 h-5 mr-2"/>
                        Documentation
                      </a>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <a href="https://jesse.trade/strategies"
                         :class="[active ? 'bg-gray-100 dark:bg-gray-800' : '', 'flex justify-start items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300']"
                         target="_blank">
                        <DocumentTextIcon class="w-5 h-5 mr-2"/>
                        Sample Strategies
                      </a>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <a href="https://jesse.trade/help"
                         :class="[active ? 'bg-gray-100 dark:bg-gray-800' : '', 'flex justify-start items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300']"
                         target="_blank">
                        <QuestionMarkCircleIcon class="w-5 h-5 mr-2"/>
                        Help Center
                      </a>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <button
                          :class="[active ? 'bg-gray-100 dark:bg-gray-800' : '', 'flex justify-start items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300']"
                          @click="about = true">
                        <IdentificationIcon class="w-5 h-5 mr-2"/>
                        About
                      </button>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <button
                          :class="[active ? 'bg-gray-100 dark:bg-gray-800' : '', 'flex justify-start items-center w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-300']"
                          @click="logoutConfirmation = true">
                        <ArrowLeftEndOnRectangleIcon class="w-5 h-5 mr-2"/>
                        Logout
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div class="-mr-2 flex lg:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:focus:ring-gray-800">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true"/>
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true"/>
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="lg:hidden" v-slot="{ close }">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <div v-for="item in navigation" @click="close" :id="convertToSlug(item.name) + '-page-button'" :key="item.name"
             :class="[($route.path.startsWith(item.to) && item.to != '/') || ($route.path == '/' && item.to == '/') ? 'bg-gray-200 dark:bg-gray-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200', 'rounded-md']">
          <nuxt-link :to="item.to" class="text-gray-700 dark:text-gray-300 text-sm font-medium">
            <div class="flex items-center w-full p-2">
              <component :is="item.icon"
                         :class="[($route.path.startsWith(item.to) && item.to != '/') || ($route.path == '/' && item.to == '/') ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400', 'flex-shrink-0 mr-2 h-6 w-6']"
                         aria-hidden="true"/>
              {{ item.name }}
            </div>
          </nuxt-link>
        </div>
      </div>

      <div class="px-2 py-2 space-y-1 border-t border-gray-200 dark:border-gray-900">
        <a v-if="shouldShowUpgradeButton" href="https://jesse.trade/pricing" target="_blank"
           class="flex justify-start items-center w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 rounded-md">
          <DocumentPlusIcon class="w-5 h-5 mr-2"/>
          Upgrade License
        </a>

        <button
            class="flex justify-start items-center w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 rounded-md"
            @click="makeStrategy = true">
          <DocumentPlusIcon class="w-5 h-5 mr-2"/>
          New Strategy
        </button>
      </div>

      <!-- docs, help and strategies links -->
      <div class="px-2 py-2 space-y-1 border-t border-gray-200 dark:border-gray-900">
        <div @click="close" class="w-full">
          <a href="https://docs.jesse.trade/"
             class="flex justify-start items-center w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 rounded-md"
             target="_blank">
            <CircleStackIcon class="w-5 h-5 mr-2"/>
            Documentation
          </a>
        </div>

        <div @click="close" class="w-full">
          <a href="https://jesse.trade/strategies"
             class="flex justify-start items-start w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 rounded-md"
             target="_blank">
            <DocumentTextIcon class="w-5 h-5 mr-2"/>
            Sample Strategies
          </a>
        </div>

        <div @click="close" class="w-full">
          <a href="https://jesse.trade/help"
             class="flex justify-start items-center w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 rounded-md"
             target="_blank">
            <QuestionMarkCircleIcon class="w-5 h-5 mr-2"/>
            Help Center
          </a>
        </div>

        <div @click="close" class="w-full">
          <button href="https://jesse.trade/strategies"
                  class="flex justify-start items-start w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 rounded-md"
                  target="_blank" @click="about = true">
            <IdentificationIcon class="w-5 h-5 mr-2"/>
            About
          </button>
        </div>

        <div @click="close" class="w-full">
          <button
              class="flex justify-start items-start w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 rounded-md"
              @click="logoutConfirmation = true">
            <ArrowLeftEndOnRectangleIcon class="w-5 h-5 mr-2"/>
            Logout
          </button>
        </div>
      </div>

      <!-- options and feedback button -->
      <div class="flex justify-between items-center px-2 py-2 space-y-1 border-t border-gray-200 dark:border-gray-900">
        <button class="btn-nav ml-0" @click="settings = true">
          <span class="sr-only">Feedback</span>
          <CogIcon class="h-6 w-6" aria-hidden="true"/>
        </button>

        <button class="btn-nav ml-0" @click="openFeedback()">
          <span class="sr-only">Settings</span>
          <ChatBubbleLeftIcon class="h-6 w-6" aria-hidden="true"/>
        </button>

        <ThemeSwitch/>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {useAuthStore} from '~/stores/authStore'
import {
  ArrowDownTrayIcon,
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  CalculatorIcon,
  ChatBubbleLeftIcon,
  CircleStackIcon,
  CogIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  IdentificationIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const store = useAuthStore()

const settings = ref(false)
const feedback = ref(false)
const makeStrategy = ref(false)
const about = ref(false)

const hasLivePluginInstalled = computed(() => store.hasLivePluginInstalled)
const planInfo = computed(() => store.planInfo)

const shouldShowUpgradeButton = computed(() => planInfo.value && planInfo.value.plan !== 'premium')

const navigation = computed(() => {
  const arr = [
    {
      name: 'Home',
      to: '/',
      icon: HomeIcon
    },
    {
      name: 'Import Candles',
      to: '/candles/',
      icon: ArrowDownTrayIcon
    },
    {
      name: 'Backtest',
      to: '/backtest/',
      icon: CalculatorIcon
    },
    {
      name: 'Optimization',
      to: '/optimization/',
      icon: CpuChipIcon
    },
  ]

  if (hasLivePluginInstalled.value) {
    arr.push({
      name: 'Live',
      to: '/live/',
      icon: CurrencyDollarIcon
    })
  }

  return arr
})

const convertToSlug = (Text: string) => {
  return Text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
}

const openFeedback = () => {
  feedback.value = true
}

const logoutConfirmation = ref(false)

function logout() {
  localStorage.clear()
  location.reload()
  logoutConfirmation.value = false
  showNotification('success', 'Logged out successfully')
}
</script>
