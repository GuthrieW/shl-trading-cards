import React from 'react'
import { useRouter } from 'next/router'
import Collection from '../Collection'

const CommunityMemberPage = () => {
  const router = useRouter()
  const { shlUsername } = router.query
  return <Collection shlUsername={shlUsername} />
}

export default CommunityMemberPage
