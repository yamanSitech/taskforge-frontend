<script setup lang="ts">
definePageMeta({ middleware: 'auth', title: 'Projects' })

const { projects } = useProjects()
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-bold text-gray-900">Projects</h2>
        <p class="text-sm text-gray-500 mt-0.5">{{ projects.length }} active projects</p>
      </div>
      <button class="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 text-white px-3.5 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New project
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="project in projects"
        :key="project.id"
        :to="`/projects/${project.id}`"
        class="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all block"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
          </div>
          <span class="text-xs font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 capitalize">
            {{ project.status }}
          </span>
        </div>

        <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ project.name }}</h3>
        <p class="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{{ project.description }}</p>

        <div>
          <div class="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Progress</span>
            <span class="tabular-nums">
              {{ Math.round(project.tasks.filter(t => t.status === 'done').length / project.tasks.length * 100) }}%
            </span>
          </div>
          <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-indigo-500 rounded-full transition-all"
              :style="`width: ${project.tasks.filter(t => t.status === 'done').length / project.tasks.length * 100}%`"
            />
          </div>
        </div>

        <div class="flex items-center justify-between mt-4 pt-3.5 border-t border-gray-100">
          <span class="text-xs text-gray-400 tabular-nums">{{ project.tasks.length }} tasks</span>
          <span class="text-xs text-gray-400">
            {{ new Date(project.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
