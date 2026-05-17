<script setup lang="ts">
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

const messages = ref<Message[]>([
  {
    id: '0',
    role: 'assistant',
    content: "Hi! I'm your AI project assistant. Ask me to break down a goal into tasks, estimate effort, or plan your sprint.",
    streaming: false,
  },
])

const input = ref('')
const loading = ref(false)
const messagesEnd = ref<HTMLElement | null>(null)

const MOCK_RESPONSES = [
  "I'll break this down into actionable tasks:\n\n1. **Research & Requirements** — Define scope and success metrics (2h)\n2. **Backend Setup** — Create API endpoints and database schema (4h)\n3. **Frontend Components** — Build UI with mock data (3h)\n4. **Integration** — Connect frontend to API (2h)\n5. **Testing & QA** — Write tests and squash bugs (3h)\n\nTotal estimate: **14 hours** across 2–3 days.",
  "Based on the complexity, I estimate **2–3 sprints** (4–6 weeks):\n\n**Sprint 1** — Core infrastructure and backend\n**Sprint 2** — Frontend and integrations\n**Sprint 3** — Testing, polish, and deployment\n\nShould I create these tasks in the project?",
  "Here's a sprint plan for the next two weeks:\n\n**Sprint 1 — Foundation**\n- [ ] Set up project structure\n- [ ] Define data models\n- [ ] Build core API\n\n**Sprint 2 — Product**\n- [ ] Build UI components\n- [ ] Add authentication\n- [ ] Deploy to staging",
]

let responseIndex = 0

async function sendMessage() {
  const text = input.value.trim()
  if (!text || loading.value) return

  input.value = ''
  loading.value = true

  messages.value.push({ id: Date.now().toString(), role: 'user', content: text })
  await nextTick()
  scrollToBottom()

  await new Promise(r => setTimeout(r, 500))

  const reply: Message = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: '',
    streaming: true,
  }
  messages.value.push(reply)

  const fullText = MOCK_RESPONSES[responseIndex % MOCK_RESPONSES.length]
  responseIndex++

  for (const char of fullText) {
    reply.content += char
    await new Promise(r => setTimeout(r, 10))
    if (reply.content.length % 15 === 0) scrollToBottom()
  }

  reply.streaming = false
  loading.value = false
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => messagesEnd.value?.scrollIntoView({ behavior: 'smooth' }))
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3.5 border-b border-gray-200 flex items-center gap-2 flex-shrink-0">
      <div class="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <span class="text-sm font-semibold text-gray-800">AI Assistant</span>
      <div class="ml-auto flex items-center gap-1 text-xs text-emerald-500 font-medium">
        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        Online
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
      >
        <div
          :class="msg.role === 'user'
            ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm max-w-[82%]'
            : 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm max-w-[92%]'"
          class="text-sm leading-relaxed px-3.5 py-2.5 whitespace-pre-wrap"
        >
          {{ msg.content }}<span
            v-if="msg.streaming"
            class="inline-block w-0.5 h-3.5 bg-current ml-0.5 animate-pulse align-middle"
          />
        </div>
      </div>
      <div ref="messagesEnd" />
    </div>

    <!-- Input -->
    <div class="px-4 py-3 border-t border-gray-200 flex-shrink-0">
      <div class="flex items-end gap-2">
        <textarea
          v-model="input"
          rows="1"
          placeholder="Ask AI to break down tasks..."
          class="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 leading-relaxed"
          style="max-height: 100px"
          @keydown="onKeydown"
        />
        <button
          :disabled="loading || !input.trim()"
          class="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          @click="sendMessage"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-1.5">Enter to send · Shift+Enter for newline</p>
    </div>
  </div>
</template>
