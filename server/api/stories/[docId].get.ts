import { getFairytale } from '@/utils/FairyTales'

/**
 * @openapi
 * /stories/{docId}:
 */
export default defineEventHandler(async (event) => {
  const docId = getRouterParam(event, 'docId')

  return docId ? getFairytale(docId as string) : {}
})
