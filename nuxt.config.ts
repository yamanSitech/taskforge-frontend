export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ],

  imports: {
    dirs: ['stores'],
    presets: [
      {
        from: '@vue/apollo-composable',
        imports: ['useQuery', 'useMutation', 'useLazyQuery'],
      },
      {
        from: '@apollo/client/core',
        imports: ['gql'],
      },
    ],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE ?? 'http://localhost:3001',
    },
  },

  vite: {
    optimizeDeps: {
      include: ['@apollo/client/core', '@apollo/client/link/context', '@vue/apollo-composable', 'graphql', '@vue/devtools-core', '@vue/devtools-kit', 'vue-draggable-plus'],
    },
    ssr: {
      // Bundle these instead of treating as externals — fixes the rxjs CJS/ESM conflict
      noExternal: ['@apollo/client', '@vue/apollo-composable'],
    },
  },
})
