import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  routeRules: {
    '/api/**': {
      proxy: {
        to: 'https://admin-moderator-backend-staging.up.railway.app',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  }
})
