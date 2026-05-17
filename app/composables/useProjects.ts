import { gql } from '@apollo/client/core'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  projectId: string
  assigneeInitials?: string
  dueDate?: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'archived'
  createdAt: string
  tasks: Task[]
}

export interface Column {
  id: string
  title: string
  color: string
  tasks: Task[]
}

// ─── GraphQL documents ───────────────────────────────────────────────────────

export const GET_PROJECTS = gql`
  query GetProjects {
    myProjects {
      id name description status createdAt updatedAt
      tasks { id title description status priority dueDate projectId assigneeId }
    }
  }
`

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id name description status createdAt updatedAt
      tasks { id title description status priority dueDate projectId assigneeId }
    }
  }
`

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) { id title status priority projectId }
  }
`

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) { id title status priority projectId }
  }
`

// ─── Normalise backend enums (UPPER_CASE → lower_case) ────────────────────────

function normalizeTask(t: any): Task {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? '',
    status: (t.status as string).toLowerCase() as Task['status'],
    priority: (t.priority as string).toLowerCase() as Task['priority'],
    projectId: t.projectId,
    dueDate: t.dueDate ?? undefined,
  }
}

function normalizeProject(p: any): Project {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? '',
    status: (p.status as string).toLowerCase() as Project['status'],
    createdAt: p.createdAt,
    tasks: (p.tasks ?? []).map(normalizeTask),
  }
}

function toColumns(tasks: Task[]): Column[] {
  return [
    { id: 'todo', title: 'To Do', color: 'zinc', tasks: tasks.filter(t => t.status === 'todo') },
    { id: 'in_progress', title: 'In Progress', color: 'blue', tasks: tasks.filter(t => t.status === 'in_progress') },
    { id: 'done', title: 'Done', color: 'green', tasks: tasks.filter(t => t.status === 'done') },
  ]
}

// ─── Composables ─────────────────────────────────────────────────────────────

/** All projects for the current user (used on dashboard + projects list). */
export function useProjects() {
  const { result, loading, error } = useQuery(GET_PROJECTS, null, { enabled: import.meta.client })

  const projects = computed<Project[]>(() =>
    (result.value?.myProjects ?? []).map(normalizeProject),
  )

  const allColumns = computed<Column[]>(() =>
    toColumns(projects.value.flatMap(p => p.tasks)),
  )

  return { projects, allColumns, loading, error }
}

/** Single project by id (used on project detail page). */
export function useProject(id: Ref<string> | string) {
  const { result, loading, error } = useQuery(
    GET_PROJECT,
    () => ({ id: unref(id) }),
    { fetchPolicy: 'cache-and-network', enabled: import.meta.client },
  )

  const project = computed<Project | null>(() =>
    result.value?.project ? normalizeProject(result.value.project) : null,
  )

  const columns = computed<Column[]>(() =>
    project.value ? toColumns(project.value.tasks) : [],
  )

  return { project, columns, loading, error }
}
