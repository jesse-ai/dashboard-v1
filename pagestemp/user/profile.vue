<template>
  <SmallContainer>
    <ProfileInformation/>
    <br>
    <UpdatePassword/>
    <br>
    <TwoFactorAuthentication/>
    <br>
    <DeleteAccount/>
  </SmallContainer>
</template>

<script setup lang="ts">
import ProfileInformation from "~/components/profile/ProfileInformation.vue";
import UpdatePassword from "~/components/profile/UpdatePassword.vue";
import DeleteAccount from "~/components/profile/DeleteAccount.vue";
import TwoFactorAuthentication from "~/components/profile/TwoFactorAuthentication.vue";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Profile Settings'
const seoDescription = 'Manage your profile settings. Update your password, enable two-factor authentication, or delete your account.'
setSeoMeta(seoTitle, seoDescription)

definePageMeta({
  middleware: 'auth'
});
</script>
