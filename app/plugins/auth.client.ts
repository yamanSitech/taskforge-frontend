export default defineNuxtPlugin(() => {
  useAuthStore().hydrate()
})
