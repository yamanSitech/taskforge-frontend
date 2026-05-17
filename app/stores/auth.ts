import { defineStore } from 'pinia'
import { gql } from '@apollo/client/core'

interface User {
  id: string
  name: string
  email: string
}

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user { id email name }
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user { id email name }
    }
  }
`

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)
  const loginLoading = ref(false)
  const loginError = ref<Error | null>(null)

  async function login(email: string, password: string) {
    const { $apollo } = useNuxtApp() as any
    loginLoading.value = true
    loginError.value = null
    try {
      const result = await $apollo.mutate({ mutation: LOGIN_MUTATION, variables: { input: { email, password } } })
      const payload = result?.data?.login
      if (!payload) throw new Error('Login failed')
      user.value = payload.user
      token.value = payload.token
      localStorage.setItem('tf_token', payload.token)
      localStorage.setItem('tf_user', JSON.stringify(payload.user))
    } catch (e: any) {
      loginError.value = e
      throw e
    } finally {
      loginLoading.value = false
    }
  }

  async function register(email: string, password: string, name: string) {
    const { $apollo } = useNuxtApp() as any
    const result = await $apollo.mutate({ mutation: REGISTER_MUTATION, variables: { input: { email, password, name } } })
    const payload = result?.data?.register
    if (!payload) throw new Error('Registration failed')
    user.value = payload.user
    token.value = payload.token
    localStorage.setItem('tf_token', payload.token)
    localStorage.setItem('tf_user', JSON.stringify(payload.user))
  }

  async function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('tf_token')
    localStorage.removeItem('tf_user')

    // Clear Apollo cache so next user's data isn't leaked
    const { $apollo } = useNuxtApp()
    await ($apollo as any).resetStore().catch(() => {})
  }

  function hydrate() {
    if (!import.meta.client) return
    const storedToken = localStorage.getItem('tf_token')
    const storedUser = localStorage.getItem('tf_user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    user, token, isAuthenticated,
    loginLoading, loginError,
    login, register, logout, hydrate,
  }
})
