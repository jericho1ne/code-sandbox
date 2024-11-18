/**
 * @openapi
 * /healthcheck:
 */
export default defineEventHandler(async (event) => {
  return {
    date: new Date().toLocaleDateString(),
    status: getResponseStatus(event),
  }
})
