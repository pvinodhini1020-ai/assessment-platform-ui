import { eventHandler, getHeaders, readBody } from 'h3'

export default eventHandler(async (event) => {
  const path = event.context.params?.path || ''
  const url = `https://admin-moderator-backend-staging.up.railway.app/api/${path}`
  
  const method = event.method
  const headers = getHeaders(event)
  const body = method !== 'GET' && method !== 'HEAD' ? await readBody(event) : undefined
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': headers['content-type'] || 'application/json',
      'Authorization': headers['authorization'] || '',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  
  const data = await response.json()
  
  return data
})
