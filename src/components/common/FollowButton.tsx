'use client'

import { ProfileResp } from '@/types/response'
import { fetchWrapper } from '@/utils/fetch'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { useAuth } from '@/components/common/AuthProvider'
import { useFollow } from './FollowProvider'
import { useState } from 'react'

interface FollowButtonProps {
  author: string
  className?: string
}

const FollowButton = ({ author, className }: FollowButtonProps) => {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const { following, setFollowing } = useFollow()

  const handleFollowing = async () => {
    if (!currentUser) {
      router.push('/login')
    }

    setLoading(true)
    try {
      const data = following
        ? await fetchWrapper<ProfileResp>(
            `/profiles/${author}/follow`,
            'DELETE',
          )
        : await fetchWrapper<ProfileResp>(`/profiles/${author}/follow`, 'POST')
      if (data) {
        setFollowing(data.profile.following)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleFollowing}
      disabled={loading}
      className={clsx(
        className || '',
        'btn btn-sm',
        following ? 'btn-secondary' : 'btn-outline-secondary',
      )}
    >
      <i className="ion-plus-round"></i>
      &nbsp; {following ? 'Unfollow' : 'Follow'}&nbsp;
      {author}
    </button>
  )
}
export default FollowButton
