<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { Column } from '~/composables/useProjects'
import { UPDATE_TASK } from '~/composables/useProjects'

const props = defineProps<{ columns: Column[] }>()

// Local mutable copy so VueDraggable can reorder / move tasks freely
const localColumns = reactive(
  props.columns.map(col => ({ ...col, tasks: [...col.tasks] })),
)

watch(() => props.columns, (updated) => {
  updated.forEach((col, i) => {
    if (localColumns[i]) localColumns[i].tasks = [...col.tasks]
  })
})

const { mutate: updateTask } = useMutation(UPDATE_TASK)

// Called by vue-draggable-plus when an item moves to a new column
function onTaskMoved(task: { id: string }, toColumnId: string) {
  // Convert frontend column id (todo/in_progress/done) to backend enum (TODO/IN_PROGRESS/DONE)
  const status = toColumnId.toUpperCase() as string
  updateTask({ input: { id: task.id, status } }).catch(console.error)
}

const dotColor: Record<string, string> = {
  zinc: 'bg-zinc-400',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
}
</script>

<template>
  <div class="flex gap-5 overflow-x-auto pb-2">
    <div
      v-for="column in localColumns"
      :key="column.id"
      class="flex-shrink-0 w-72"
    >
      <!-- Column header -->
      <div class="flex items-center gap-2 mb-3">
        <span :class="dotColor[column.color] ?? 'bg-gray-400'" class="w-2 h-2 rounded-full flex-shrink-0" />
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ column.title }}</span>
        <span class="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium tabular-nums">
          {{ column.tasks.length }}
        </span>
      </div>

      <!-- Task list -->
      <VueDraggable
        v-model="column.tasks"
        :animation="180"
        group="kanban"
        ghost-class="opacity-40"
        class="flex flex-col gap-2 min-h-16"
        @end="(evt) => {
          if (evt.from !== evt.to) {
            const task = column.tasks[evt.newIndex]
            if (task) onTaskMoved(task, column.id)
          }
        }"
      >
        <KanbanCard
          v-for="task in column.tasks"
          :key="task.id"
          :task="task"
        />
      </VueDraggable>

      <!-- Add task button -->
      <button class="w-full mt-2 flex items-center gap-1.5 px-2 py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add task
      </button>
    </div>
  </div>
</template>
