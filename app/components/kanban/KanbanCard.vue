<script setup lang="ts">
import type { Task } from '~/composables/useProjects'

defineProps<{ task: Task }>()

const priorityConfig: Record<string, { label: string; cls: string }> = {
  high: { label: 'High', cls: 'bg-red-50 text-red-600 border-red-100' },
  medium: { label: 'Med', cls: 'bg-amber-50 text-amber-600 border-amber-100' },
  low: { label: 'Low', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-gray-300 hover:shadow-sm transition-all select-none">
    <p class="text-sm text-gray-800 font-medium leading-snug">{{ task.title }}</p>

    <p v-if="task.description" class="text-xs text-gray-400 mt-1 line-clamp-1">
      {{ task.description }}
    </p>

    <div class="flex items-center justify-between mt-2.5 gap-2">
      <span
        :class="priorityConfig[task.priority]?.cls"
        class="text-xs px-1.5 py-0.5 rounded border font-medium flex-shrink-0"
      >
        {{ priorityConfig[task.priority]?.label }}
      </span>

      <div class="flex items-center gap-1.5 ml-auto">
        <span v-if="task.dueDate" class="text-xs text-gray-400">
          {{ new Date(task.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric' }) }}
        </span>
        <div
          v-if="task.assigneeInitials"
          class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center flex-shrink-0"
        >
          {{ task.assigneeInitials.charAt(0) }}
        </div>
      </div>
    </div>
  </div>
</template>
