'use client'

import { ArticleItem } from '@/types/response'
import { fetchWrapper } from '@/utils/fetch'
import { useState } from 'react'
import clsx from 'clsx'
import { useAuth } from '@/components/common/AuthProvider'
import { useRouter } from 'next/navigation'
import { useArticle } from '../article/ArticleProvider'

interface FavoriteButtonProps {
  className?: string
}

const FavoriteButton = ({ className }: FavoriteButtonProps) => {
  const { currentUser } = useAuth()
  const { article, setArticle } = useArticle()
  const { favorited, favoritesCount, slug } = {
    favorited: article?.favorited,
    favoritesCount: article?.favoritesCount,
    slug: article?.slug,
  }
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFavorites = async () => {
    if (!currentUser) {
      router.push('/login')
    }

    setLoading(true)
    try {
      const data = favorited
        ? await fetchWrapper<ArticleItem>(
            `/articles/${slug}/favorite`,
            'DELETE',
          )
        : await fetchWrapper<ArticleItem>(`/articles/${slug}/favorite`, 'POST')

      if (data) {
        setArticle(data)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleFavorites}
      disabled={loading}
      className={clsx(
        className || 'btn btn-sm',
        favorited ? 'btn-primary' : 'btn-outline-primary',
      )}
    >
      <i className="ion-heart"></i>
      &nbsp; {favorited ? 'Unfavorite' : 'Favorite'}{' '}
      <span className="counter">({favoritesCount})</span>
    </button>
  )
}
export default FavoriteButton
