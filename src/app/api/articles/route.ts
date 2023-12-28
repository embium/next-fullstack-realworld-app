import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { ApiResponse } from '@/app/api/response'
import getCurrentUser from '@/actions/getCurrentUser'
import { articleInputSchema } from '@/validation/schema'
import slug from 'slug'
import genRandomString from '@/utils/random'

export const POST = async (req: NextRequest) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return ApiResponse.unauthorized()
  }
  const body = await req.json()

  const result = articleInputSchema.safeParse(body.article)
  if (!result.success) {
    return ApiResponse.badRequest(result.error)
  }

  const { title, description = '', body: articleBody, tagList } = result.data

  try {
    const article = await prisma.article.create({
      data: {
        title,
        slug: `${slug(title)}-${genRandomString(7)}`,
        description,
        body: articleBody,
        authorId: currentUser.id,
        tagList: {
          create: tagList?.map((tag) => ({
            tag: {
              connectOrCreate: {
                create: { name: tag },
                where: { name: tag },
              },
            },
          })),
        },
      },
    })
    return ApiResponse.ok({ article })
  } catch (e: any) {
    return ApiResponse.badRequest('Create article failed')
  }
}
