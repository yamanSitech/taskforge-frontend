<script setup lang="ts">
definePageMeta({ middleware: 'auth', title: 'Dashboard' })

const { projects, allColumns, loading } = useProjects()

const totalTasks = computed(() => allColumns.value.flatMap(c => c.tasks).length)
const inProgressCount = computed(() => allColumns.value.find(c => c.id === 'in_progress')?.tasks.length ?? 0)
const doneCount = computed(() => allColumns.value.find(c => c.id === 'done')?.tasks.length ?? 0)
</script>

<template>
  <div class="p-6 max-w-7xl">
    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Tasks</p>
        <div v-if="loading" class="h-8 w-12 bg-gray-100 rounded animate-pulse mt-1" />
        <p v-else class="text-3xl font-bold text-gray-900 mt-1 tabular-nums">{{ totalTasks }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">In Progress</p>
        <div v-if="loading" class="h-8 w-8 bg-gray-100 rounded animate-pulse mt-1" />
        <p v-else class="text-3xl font-bold text-blue-600 mt-1 tabular-nums">{{ inProgressCount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Done</p>
        <div v-if="loading" class="h-8 w-8 bg-gray-100 rounded animate-pulse mt-1" />
        <p v-else class="text-3xl font-bold text-emerald-600 mt-1 tabular-nums">{{ doneCount }}</p>
      </div>
    </div>

    <!-- Kanban -->
    <div class="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-sm font-semibold text-gray-900">All Tasks</h2>
        <span class="text-xs text-gray-400">{{ projects.length }} projects</span>
      </div>
      <div v-if="loading" class="flex gap-5">
        <div v-for="i in 3" :key="i" class="flex-shrink-0 w-72 space-y-2">
          <div class="h-4 bg-gray-100 rounded animate-pulse w-20 mb-3" />
          <div v-for="j in 2" :key="j" class="h-16 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
      <KanbanBoard v-else :columns="allColumns" />
    </div>

    <!-- Projects grid -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-gray-900">Projects</h2>
        <NuxtLink to="/projects" class="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          View all →
        </NuxtLink>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <template v-if="loading">
          <div v-for="i in 3" :key="i" class="bg-white rounded-xl border border-gray-200 p-4 h-28 animate-pulse" />
        </template>
        <NuxtLink
          v-for="project in projects"
          v-else
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
        >
          <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ project.name }}</h3>
          <p class="text-xs text-gray-400 line-clamp-1 mb-3">{{ project.description }}</p>
          <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-indigo-500 rounded-full"
              :style="`width: ${project.tasks.length ? Math.round(project.tasks.filter(t => t.status === 'done').length / project.tasks.length * 100) : 0}%`"
            />
          </div>
          <p class="text-xs text-gray-400 mt-1.5 tabular-nums">
            {{ project.tasks.filter(t => t.status === 'done').length }} / {{ project.tasks.length }} done
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
