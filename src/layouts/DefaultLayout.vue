<script setup></script>

<template>
  <div class="mx-auto max-w-7xl w-full px-4 sm:px-6 md:px8 grow-1">
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component"></component>
      </KeepAlive>
    </RouterView>
  </div>
</template>
