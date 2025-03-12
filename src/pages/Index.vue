<script setup>
import BrandIcon from '@/components/icons/BrandIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>
<template>
  <div class="flex justify-center flex-col items-center text-base-dark h-full py-10">
    <BrandIcon class="fill-base-dark mb-10"></BrandIcon>
    <h1 class="text-2xl max-w-130 text-center">
      Tusk Manager helps you organize, prioritize, and conquer your tasks with ease.
    </h1>
    <div class="flex gap-10 mt-10">
      <BaseButton :to="{ name: 'SignIn' }">Sign in</BaseButton>
      <BaseButton :to="{ name: 'SignUp' }">Sign up</BaseButton>
    </div>
  </div>
</template>
