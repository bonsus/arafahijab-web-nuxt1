<template>
  <div class="min-h-screen bg-cream-dark flex items-center justify-center p-4">
    <!-- Decorative background blobs -->
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-100 opacity-50" />
      <div class="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-primary-200 opacity-30" />
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center justify-center gap-2 mb-8">
        <span class="w-10 h-10 rounded-full bg-primary-700 text-white font-bold text-lg flex items-center justify-center">A</span>
        <span class="text-xl font-bold text-gray-900">ArafaHijab</span>
      </NuxtLink>
      <slot />
    </div>
  </div>
</template>

