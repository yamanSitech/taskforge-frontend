export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return  // hydration happens in auth.client.ts plugin
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})
