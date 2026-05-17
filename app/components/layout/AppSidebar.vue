<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: 'grid' },
  { label: 'Projects', to: '/projects', icon: 'folder' },
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

async function handleLogout() {
  auth.logout()
  await navigateTo('/login')
}
</script>

<template>
  <aside class="w-60 bg-zinc-950 flex flex-col h-full flex-shrink-0">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-zinc-800">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM15 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <span class="text-white font-semibold text-sm tracking-tight">TaskForge</span>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-0.5">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors"
        :class="isActive(item.to)
          ? 'bg-zinc-800 text-white'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'"
      >
        <!-- Grid icon -->
        <template v-if="item.icon === 'grid'">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </template>
        <!-- Folder icon -->
        <template v-if="item.icon === 'folder'">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
        </template>
        {{ item.label }}
      </NuxtLink>
    </nav>

    <!-- User profile -->
    <div class="px-3 py-4 border-t border-zinc-800">
      <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-zinc-900 group">
        <div class="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {{ auth.user?.name?.charAt(0)?.toUpperCase() ?? 'U' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-zinc-200 text-xs font-medium truncate">{{ auth.user?.name ?? 'User' }}</p>
          <p class="text-zinc-500 text-xs truncate">{{ auth.user?.email ?? '' }}</p>
        </div>
        <button
          @click="handleLogout"
          class="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Sign out"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>
