<script setup lang="ts">
definePageMeta({ layout: 'project', middleware: 'auth' })

const route = useRoute()
const { project, columns, loading } = useProject(computed(() => route.params.id as string))
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="flex-1 flex items-center justify-center">
    <svg class="animate-spin w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  </div>

  <template v-else-if="project">
    <!-- Main content -->
    <div class="flex-1 overflow-y-auto p-6">
      <!-- Breadcrumb + title -->
      <div class="mb-6">
        <div class="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
          <NuxtLink to="/projects" class="hover:text-indigo-600 transition-colors">Projects</NuxtLink>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-gray-600">{{ project.name }}</span>
        </div>
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ project.name }}</h1>
            <p class="text-sm text-gray-500 mt-1">{{ project.description }}</p>
          </div>
          <span class="text-xs font-medium bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100 capitalize flex-shrink-0 ml-4">
            {{ project.status }}
          </span>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p class="text-xs text-gray-400">Total</p>
          <p class="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{{ project.tasks.length }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p class="text-xs text-gray-400">In Progress</p>
          <p class="text-2xl font-bold text-blue-600 mt-0.5 tabular-nums">
            {{ project.tasks.filter(t => t.status === 'in_progress').length }}
          </p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p class="text-xs text-gray-400">Done</p>
          <p class="text-2xl font-bold text-emerald-600 mt-0.5 tabular-nums">
            {{ project.tasks.filter(t => t.status === 'done').length }}
          </p>
        </div>
      </div>

      <!-- Kanban board -->
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-sm font-semibold text-gray-900">Board</h2>
          <button class="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add task
          </button>
        </div>
        <KanbanBoard :columns="columns" />
      </div>
    </div>

    <!-- AI Sidebar -->
    <div class="w-80 border-l border-gray-200 bg-white flex-shrink-0 flex flex-col overflow-hidden">
      <AiChatSidebar />
    </div>
  </template>

  <!-- Not found -->
  <div v-else class="flex-1 flex items-center justify-center text-gray-400 text-sm">
    Project not found.
    <NuxtLink to="/projects" class="ml-1 text-indigo-600 hover:underline">Go back</NuxtLink>
  </div>
</template>
