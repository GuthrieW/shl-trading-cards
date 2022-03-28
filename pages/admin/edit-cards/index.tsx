import EditCardsTable from '@components/tables/edit-cards-table'
import { useGetAllCards, useGetUser } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/is-admin'
import isAdminOrCardTeam from '@utils/is-admin-or-card-team'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import React from 'react'

const EditCards = () => {
  const parsedUid = getUidFromSession()
  const router = useRouter()

  const {
    user,
    isSuccess: getUserIsSuccess,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: parsedUid,
  })

  if (getUserIsLoading || getUserIsError) return null

  const userIsAdmin = isAdmin(user)
  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)

  if (!userIsAdminOrCardTeam) {
    router.push('/')
    return null
  }

  const { allCards, isLoading, isError } = useGetAllCards({})

  if (isLoading || isError) return null

  return (
    <>
      <NextSeo title="Edit Cards" />
      <div className="m-2">
        <h1>Edit Cards</h1>
        <EditCardsTable tableData={allCards} />
      </div>
    </>
  )
}

export default EditCards
