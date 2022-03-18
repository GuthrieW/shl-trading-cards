import { useGetUserCards } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'
import { useRouter } from 'next/router'
import CollectionGrid from '@components/grids/collection-grid'

const Collection = () => {
  const { query } = useRouter()
  const parsedUid = parseInt(query.uid as string) || getUidFromSession()

  const {
    userCards,
    isLoading: getUserCardsIsLoading,
    isError: getUserCardsIsError,
  } = useGetUserCards({
    uid: parsedUid,
  })

  if (getUserCardsIsLoading || getUserCardsIsError) return null

  return (
    <div className="m-2">
      <h1>Collection</h1>
      <CollectionGrid gridData={userCards} />
    </div>
  )
}

export default Collection
