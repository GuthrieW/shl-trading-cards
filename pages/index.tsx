import React from 'react'
import { useRouter } from 'next/router'

const index = () => {
  const router = useRouter()
  if (typeof window !== 'undefined') {
    router.push({
      pathname: '/home',
    })
  }

  return null
}

export default index
