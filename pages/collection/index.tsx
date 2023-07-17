import useGetUser from '@pages/api/queries/use-get-user'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'
import CollectionGrid from '@components/grids/collection-grid'
import { NextSeo } from 'next-seo'
import Router from 'next/router'

const Collection = () => {
  const parsedUid = parseInt(Router.query.uid as string) || getUidFromSession()
  const isCurrentUser = parsedUid === getUidFromSession()

  const {
    user,
    isSuccess: getUserIsSuccess,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: parsedUid,
  })

  if (getUserIsLoading || getUserIsError) return null

  return (
    <>
      <NextSeo
        title={`${user.username}'s Collection`}
        openGraph={{
          title: `${user.username}'s Collection`,
        }}
      />
      <div className="m-2">
        <h1 className="text-4xl text-center my-6">
          {isCurrentUser ? 'Your' : `${user.username}'s`} Collection
        </h1>
        <CollectionGrid userId={parsedUid} />
      </div>
    </>
  )
}

export default Collection
