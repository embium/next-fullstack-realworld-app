'use client'

import React, { createContext, useContext, useState } from 'react'

export type FollowContextType = {
  following: boolean | null
  setFollowing: (following: boolean | null) => void
}
export const FollowContext = createContext<FollowContextType>({
  following: null,
  setFollowing: () => {},
})

interface FollowProviderProps {
  following: boolean | null
  children: React.ReactNode
}

export const FollowProvider = ({
  following: initialFollowing,
  children,
}: FollowProviderProps) => {
  const [following, setFollowing] = useState<boolean | null>(initialFollowing)
  return (
    <FollowContext.Provider value={{ following, setFollowing }}>
      {children}
    </FollowContext.Provider>
  )
}

export const useFollow = () => {
  return useContext(FollowContext)
}
