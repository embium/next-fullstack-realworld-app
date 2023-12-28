import { prisma } from '@/libs/prisma'
import QueryLink from '@/components/common/QueryLink'

const PopularTags = async () => {
  const tags = await prisma.tag.findMany({
    where: { articles: { some: { NOT: [] } } },
    select: {
      articles: true,
      name: true,
      id: true,
    },
  })

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {tags.map((tag) => (
          <QueryLink
            query={{ tag: `${tag.name}` }}
            key={tag.id}
            className="tag-pill tag-default"
          >
            {tag.name}
          </QueryLink>
        ))}
      </div>
    </div>
  )
}

export default PopularTags
