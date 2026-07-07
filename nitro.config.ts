import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  routeRules: {
    '/api/**': {
      proxy: {
        to: 'https://admin-moderator-backend-staging.up.railway.app',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
  }
})
