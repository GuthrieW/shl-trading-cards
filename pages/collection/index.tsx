import { useGetUser, useGetUserCards } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'
import { useRouter } from 'next/router'
import CollectionGrid from '@components/grids/collection-grid'
import { NextSeo } from 'next-seo'

const Collection = () => {
  const { query } = useRouter()
  const parsedUid = parseInt(query.uid as string) || getUidFromSession()
  const isCurrentUser = parsedUid === getUidFromSession()

  const {
    userCards,
    isSuccess: getUserCardsIsSuccess,
    isLoading: getUserCardsIsLoading,
    isError: getUserCardsIsError,
  } = useGetUserCards({
    uid: parsedUid,
  })

  const {
    user,
    isSuccess: getUserIsSuccess,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: parsedUid,
  })

  if (
    getUserCardsIsLoading ||
    getUserIsLoading ||
    getUserCardsIsError ||
    getUserIsError
  )
    return null

  console.log(userCards, user.username)
  return (
    <>
      <NextSeo title="Collection" />
      <div className="m-2">
        <h1 className="text-4xl text-center my-6">
          {isCurrentUser ? 'Your' : `${user.username}'s`} Collection
        </h1>
        {isCurrentUser && userCards.length === 0 ? (
          <div className="text-center">
            <p className="text-xl">
              You don't have any cards in your collection.
            </p>
            <p className="text-xl">
              Go to the <a href="/pack-shop">pack shop</a> to get some packs!
            </p>
          </div>
        ) : (
          <CollectionGrid gridData={userCards} />
        )}
      </div>
    </>
  )
}

export default Collection
