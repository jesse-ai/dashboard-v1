<template>
  <ClientOnly>
    <EmailVerificationWarning/>
  </ClientOnly>

  <div class="bg-primary-500 h-[3px]"/>

  <div class="min-h-full">
    <Disclosure as="nav" class="bg-white shadow-sm" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex flex-shrink-0 items-center">
              <NuxtLink href="/">
                <img class="block h-8 w-auto md:hidden" src="~/assets/w-01.png" alt="Jesse"/>
              </NuxtLink>
              <NuxtLink href="/">
                <img class="hidden h-8 w-auto md:block" src="~/assets/w-01.png" alt="Jesse"/>
              </NuxtLink>
            </div>
            <div class="hidden lg:-my-px lg:ml-6 lg:flex lg:space-x-8">
              <NuxtLink v-for="item in navigation" :key="item.name" :href="item.href"
                        :class="[item.current ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium']"
                        :aria-current="item.current ? 'page' : undefined">
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
          <div class="hidden lg:ml-6 lg:flex lg:items-center">
            <div v-if="isAuthenticated">
              <!-- Profile dropdown -->
              <UDropdown :items="dropdownItems" :ui="{ item: { disabled: 'cursor-text select-text' } }"
                         :popper="{ placement: 'bottom-start' }">
                <UButton color="gray" :label="authStore().user.name" trailing-icon="i-heroicons-chevron-down-20-solid"/>

                <template #account="{ item }">
                  <div class="text-left">
                    <p>Signed in as</p>
                    <p class="truncate font-medium text-gray-900 dark:text-white">{{ authStore().user.email }}</p>
                  </div>
                </template>

                <template #item="{ item }">
                  <NuxtLink class="truncate" :href="item.href">{{ item.label }}</NuxtLink>
                  <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"/>
                </template>
              </UDropdown>
            </div>

            <div v-else>
              <UButton color="gray" variant="solid" @click="isLoginOpen = true">Login</UButton>
              <UModal v-model="isLoginOpen">
                <LoginComponent/>
              </UModal>

              <UButton class="ml-2"
                       color="primary" variant="solid" @click="isRegisterOpen = true">Register
              </UButton>
              <UModal v-model="isRegisterOpen">
                <RegisterComponent/>
              </UModal>
            </div>
          </div>
          <div class="-mr-2 flex items-center lg:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
                class="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-500">
              <span class="absolute -inset-0.5"/>
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true"/>
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true"/>
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="lg:hidden border-t-2">
        <div class="space-y-1 pb-3 pt-2">
          <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href"
                            :class="[item.current ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800', 'block border-l-4 py-2 pl-3 pr-4 text-base font-medium']"
                            :aria-current="item.current ? 'page' : undefined">{{ item.name }}
          </DisclosureButton>
        </div>
        <div class="border-y-2 border-gray-200 pb-3 px-4">
          <div class="flex items-center pt-2" v-if="isAuthenticated">
            <div>
              <div class="text-base font-medium text-gray-800">Signed in as</div>
              <div class="text-sm font-medium text-gray-500">{{ authStore().user.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <DisclosureButton v-for="item in mobileUserNavigation"
                              :key="item.name" as="a"
                              :href="item.href">
              <UButton color="gray" class="mb-2" block>{{ item.name }}</UButton>
            </DisclosureButton>

            <UButton v-if="isAuthenticated"
                     block color="primary" variant="solid" @click="logout">
              Logout
            </UButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <!-- Your content -->
    <slot/>
  </div>

  <Footer/>
</template>

<script setup lang="ts">
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue'
import {BellIcon, Bars3Icon, XMarkIcon} from '@heroicons/vue/24/outline'
import {authStore} from "~/stores";
import {usePostApi1} from "~/composables/useApi";
import EmailVerificationWarning from "~/components/EmailVerificationWarning.vue";
import LoginComponent from "~/components/LoginComponent.vue";
import RegisterComponent from "~/components/RegisterComponent.vue";

const isLoginOpen = ref(false)
const isRegisterOpen = ref(false)

const navigationData = [
  {name: 'Blog', href: '/blog', auth: false},
  {name: 'Releases', href: '/releases', auth: false},
  {name: 'Pricing', href: '/pricing', auth: false},
  {name: 'License', href: '/license', auth: true},
  {name: 'Strategies', href: '/strategies', auth: false},
  {name: 'Referrals', href: '/referrals', auth: true},
  {name: 'Help Center', href: '/help', auth: false},
  {name: 'API Tokens', href: '/user/api-tokens', auth: true},
  {name: 'Documentation', href: 'https://docs.jesse.trade', auth: false},
]

const route = useRoute()

const navigation = computed(() => {
  let filteredNavigationData = navigationData;
  if (!authStore().isAuthenticated) {
    filteredNavigationData = navigationData.filter(item => !item.auth);
  }
  return filteredNavigationData.map(item => ({
    ...item,
    current: route.path.startsWith(item.href),
  }));
});

// logged in
const isAuthenticated = computed(() => authStore().isAuthenticated)
if (authStore().isAuthenticated) {
} else { // not logged in
  authStore().logout()
}

async function logout(): Promise<void> {
  authStore().logout()
  showNotification('success', 'Logout successful')
  // refresh page
  window.location.reload()
}

const dropdownItems = [
  [
    {
      label: authStore().user.email,
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      href: '/user/profile'
    },
    {
      label: 'License',
      icon: 'i-heroicons-identification',
      href: '/license'
    },
    {
      label: 'API Tokens',
      icon: 'i-heroicons-key',
      href: '/user/api-tokens'
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      slot: 'logout',
      click: () => logout()
    }
  ]
]

interface NavigationItem {
  name: string
  href: string
}

const mobileUserNavigation = ref([] as NavigationItem[])
if (authStore().isAuthenticated) {
  // const mobileUserNavigation = [
  //   {name: 'Account', href: '/user/profile'},
  //   {name: 'Sign out', href: '#'},
  // ]
  mobileUserNavigation.value = [
    {name: 'Settings', href: '/user/profile'},
  ]
} else {
  mobileUserNavigation.value = [
    {name: 'Login', href: '/login'},
    {name: 'Register', href: '/register'},
  ]
}

</script>
