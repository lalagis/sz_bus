// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: { strict: true },
  modules: [
    '@pinia/nuxt',
    '@formkit/auto-animate/nuxt',
    '@unocss/nuxt',
    'nuxt-mapbox',
    'nuxt-security',
    '@nuxt/content',
  ],
  experimental: {
    // https://vuejs.org/guide/extras/reactivity-transform.html#refs-vs-reactive-variables
    reactivityTransform: true,
  },
  mapbox: {
    accessToken: 'pk.eyJ1IjoiY2lybm9xdnEiLCJhIjoiY2xha2YxOGU3MGxreDN1bWgzbjNvMmw5cCJ9.OOwcII66PaN5yekvw-UN6Q',
  },
  security: {
    corsHandler: {
      origin: '*',
      methods: '*',
    },
  },
})
