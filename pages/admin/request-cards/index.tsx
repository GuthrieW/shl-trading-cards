import Button from '@components/buttons/button'
import { warningToast } from '@utils/toasts'
import useCreateCard from '@pages/api/mutations/use-create-card'
import useGetUser from '@pages/api/queries/use-get-user'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/is-admin'
import isAdminOrCardTeam from '@utils/is-admin-or-card-team'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import CSVReader from 'react-csv-reader'

const RequestCards = () => {
  const parsedUid = getUidFromSession()

  const {
    user,
    isSuccess: getUserIsSuccess,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: parsedUid,
  })

  const [csvToUpload, setCsvToUpload] = useState(null)
  const [canSubmitCsv, setCanSubmitCsv] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [numberOfCardsToUpload, setNumberOfCardsToUpload] = useState<number>(0)

  const { createCard, response, isLoading, isError } = useCreateCard()

  useEffect(() => {
    setCanSubmitCsv(csvToUpload !== null)
  }, [csvToUpload])

  if (getUserIsLoading || getUserIsError) return null

  const userIsAdmin = isAdmin(user)
  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)

  if (!userIsAdminOrCardTeam) {
    Router.push('/')
    return null
  }

  const handleSelectCsv = (data, fileInfo) => {
    setNumberOfCardsToUpload(data.length - 1)
    setCsvToUpload(data)
  }

  const handleUploadCsv = () => {
    if (isLoading) {
      warningToast({ warningText: 'Already uploading card requests' })
      return
    }

    setIsSubmitting(true)
    csvToUpload.map((row, index) => {
      if (index === 0) return

      const playerData = {
        teamID: parseInt(row[0]),
        playerID: parseInt(row[1]),
        player_name: row[2],
        season: parseInt(row[3]),
        card_rarity: row[4],
        sub_type: row[5],
        position: row[6],
        overall: parseInt(row[7]),
        skating: row[6] !== 'G' ? parseInt(row[8]) : null,
        shooting: row[6] !== 'G' ? parseInt(row[9]) : null,
        hands: row[6] !== 'G' ? parseInt(row[10]) : null,
        checking: row[6] !== 'G' ? parseInt(row[11]) : null,
        defense: row[6] !== 'G' ? parseInt(row[12]) : null,
        high_shots: row[6] !== 'G' ? null : parseInt(row[13]),
        low_shots: row[6] !== 'G' ? null : parseInt(row[14]),
        quickness: row[6] !== 'G' ? null : parseInt(row[15]),
        control: row[6] !== 'G' ? null : parseInt(row[16]),
        conditioning: row[6] !== 'G' ? null : parseInt(row[17]),
      }

      createCard({ card: playerData })
    })
    setIsSubmitting(false)
  }

  return (
    <>
      <NextSeo title="Request Cards" />
      <div className="m-2 flex flex-col">
        <h1>Request Cards</h1>
        <div className="flex flex-col justify-center items-center">
          <div className="w-1/3">
            <div className="flex justify-start items-center">
              <CSVReader
                cssClass="react-csv-input"
                label="CSV Upload"
                onFileLoaded={handleSelectCsv}
              />
            </div>
            <div className="mb-5 flex justify-start items-center">
              Cards Awaiting Submission: {numberOfCardsToUpload}
            </div>

            <div className="flex justify-end items-center">
              <Button
                disabled={!canSubmitCsv || isSubmitting || isLoading || isError}
                onClick={handleUploadCsv}
              >
                Submit Cards
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RequestCards
