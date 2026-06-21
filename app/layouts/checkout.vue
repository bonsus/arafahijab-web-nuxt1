<template>
  <div class="min-h-screen bg-cream-dark">
    <!-- Minimal top bar -->
    <header class="bg-white border-b border-sand sticky top-0 z-30">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <!-- Back to home -->
        <NuxtLink
          to="/"
          class="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="hidden sm:inline">Beranda</span>
        </NuxtLink>

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-primary-700 text-white font-bold flex items-center justify-center">A</span>
          <span class="font-bold text-gray-900 hidden sm:inline">ArafaHijab</span>
        </NuxtLink>

        <!-- Edit order (back to cart) -->
        <NuxtLink
          to="/cart"
          class="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span class="hidden sm:inline">Edit Pesanan</span>
          <span class="sm:hidden">Keranjang</span>
        </NuxtLink>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
