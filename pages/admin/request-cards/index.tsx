import Button from '@components/buttons/button'
import { useCreateRequestedCard } from '@pages/api/mutations'
import React, { useEffect, useState } from 'react'
import CSVReader from 'react-csv-reader'

const RequestCards = () => {
  const [csvToUpload, setCsvToUpload] = useState(null)
  const [canSubmitCsv, setCanSubmitCsv] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [numberOfCardsToUpload, setNumberOfCardsToUpload] = useState<number>(0)

  const { createRequestedCard, response, isLoading, isError } =
    useCreateRequestedCard()

  useEffect(() => {
    setCanSubmitCsv(csvToUpload !== null)
  }, [csvToUpload])

  const handleSelectCsv = (data, fileInfo) => {
    setNumberOfCardsToUpload(data.length - 1)
    setCsvToUpload(data)
  }

  const handleUploadCsv = () => {
    setIsSubmitting(true)
    csvToUpload.map((row, index) => {
      if (index === 0) return

      const playerData = {
        teamID: parseInt(row[0]),
        playerID: parseInt(row[1]),
        player_name: row[2],
        season: parseInt(row[3]),
        card_rarity: row[4],
        position: row[5],
        overall: parseInt(row[6]),
        skating: row[5] !== 'G' ? parseInt(row[7]) : null,
        shooting: row[5] !== 'G' ? parseInt(row[8]) : null,
        hands: row[5] !== 'G' ? parseInt(row[9]) : null,
        checking: row[5] !== 'G' ? parseInt(row[10]) : null,
        defense: row[5] !== 'G' ? parseInt(row[11]) : null,
        high_shots: row[5] !== 'G' ? null : parseInt(row[11]),
        low_shots: row[5] !== 'G' ? null : parseInt(row[11]),
        quickness: row[5] !== 'G' ? null : parseInt(row[11]),
        control: row[5] !== 'G' ? null : parseInt(row[11]),
        conditioning: row[5] !== 'G' ? null : parseInt(row[11]),
      }

      createRequestedCard({ requestedCard: playerData })
    })
    setIsSubmitting(false)
  }

  return (
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
  )
}

export default RequestCards
