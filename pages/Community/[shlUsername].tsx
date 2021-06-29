import React from 'react'
import { useRouter } from 'next/router'
import { Collection } from '@pages/collection'

const CommunityMemberPage = () => {
  const router = useRouter()
  const { shlUsername } = router.query
  return <Collection shlUsername={shlUsername} />
}

export default CommunityMemberPage
