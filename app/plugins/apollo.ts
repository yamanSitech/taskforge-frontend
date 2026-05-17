import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { DefaultApolloClient } from '@vue/apollo-composable'

export default defineNuxtPlugin((nuxtApp) => {
  const httpLink = createHttpLink({
    uri: useRuntimeConfig().public.apiBase + '/graphql',
  })

  // Attach JWT from localStorage on every request (client only)
  const authLink = setContext((_, { headers }) => {
    const token = import.meta.client ? localStorage.getItem('tf_token') : null
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    }
  })

  const apolloClient = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    ssrMode: import.meta.server,
    devtools: { enabled: import.meta.client },
  })

  nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient)

  return {
    provide: { apollo: apolloClient },
  }
})
