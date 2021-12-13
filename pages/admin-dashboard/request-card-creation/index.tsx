import React, { useEffect, useState } from 'react'
import { Box, Button, ButtonGroup, FormGroup } from '@material-ui/core'
import { CardForm } from '@components/index'
import CSVReader from 'react-csv-reader'
import { useCreateRequestedCard } from '@pages/api/mutations'

type SelectedRequestUi = 'single-card' | 'csv-import'

const defaultCardState = {
  teamID: null,
  playerID: 0,
  card_rarity: '',
  player_name: '',
  position: '',
  overall: 0,
  skating: 0,
  shooting: 0,
  hands: 0,
  checking: 0,
  defense: 0,
  high_shots: 0,
  low_shots: 0,
  quickness: 0,
  control: 0,
  conditioning: 0,
  season: 0,
}

const RequestCardCreation = () => {
  const [selectedRequestUi, setSelectedRequestUi] =
    useState<SelectedRequestUi>('single-card')
  const [singleCard, setSingleCard] = useState<CardRequest>(defaultCardState)
  const [canSubmitSingleCard, setCanSubmitSingleCard] = useState<boolean>(false)
  const [csvToUpload, setCsvToUpload] = useState(null)
  const [canSubmitCsv, setCanSubmitCsv] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { createRequestedCard, response, isLoading, isError } =
    useCreateRequestedCard()

  useEffect(() => {
    const isNotDefaultState = Object.keys(singleCard).every((key) => {
      if (
        singleCard.position !== 'G' &&
        [
          'high_shots',
          'low_shots',
          'quickness',
          'control',
          'conditioning',
        ].indexOf(key) >= 0
      ) {
        return true
      } else if (
        singleCard.position === 'G' &&
        ['skating', 'shooting', 'hands', 'checking', 'defense'].indexOf(key) >=
          0
      ) {
        return true
      }

      return singleCard[key] !== defaultCardState[key]
    })

    setCanSubmitSingleCard(isNotDefaultState)
  }, [singleCard])

  useEffect(() => {
    setCanSubmitCsv(csvToUpload !== null)
  }, [csvToUpload])

  useEffect(() => {
    selectedRequestUi === 'single-card'
      ? setSingleCard(defaultCardState)
      : setCsvToUpload(null)
  }, [selectedRequestUi])

  const handleSelectCsv = (data, fileInfo) => {
    setCsvToUpload(data)
  }

  const handleSingleCardSubmit = async () => {
    if (canSubmitSingleCard) {
      setIsSubmitting(true)
      const basePlayerData = {
        teamID: singleCard.teamID,
        playerID: singleCard.playerID,
        card_rarity: singleCard.card_rarity,
        player_name: singleCard.player_name,
        position: singleCard.position,
        season: singleCard.season,
        overall: singleCard.overall,
      }

      const fullPlayerData: CardRequest =
        singleCard.position !== 'G'
          ? {
              ...basePlayerData,
              skating: singleCard.skating,
              shooting: singleCard.shooting,
              hands: singleCard.hands,
              checking: singleCard.checking,
              defense: singleCard.defense,
              high_shots: null,
              low_shots: null,
              quickness: null,
              control: null,
              conditioning: null,
            }
          : {
              ...basePlayerData,
              skating: null,
              shooting: null,
              hands: null,
              checking: null,
              defense: null,
              high_shots: singleCard.high_shots,
              low_shots: singleCard.low_shots,
              quickness: singleCard.quickness,
              control: singleCard.control,
              conditioning: singleCard.conditioning,
            }
      createRequestedCard({ requestedCard: fullPlayerData })
    }

    setSingleCard(defaultCardState)
    setIsSubmitting(false)
    setCsvToUpload(null)
  }

  const handleCsvUploadSubmit = () => {
    console.log('csvToUpload', csvToUpload)
    csvToUpload.map((row) => {
      const cardRequest: CardRequest = {
        teamID: row[0],
        playerID: row[1],
        player_name: row[3],
        season: row[4],
        card_rarity: row[5],
        position: row[6],
        overall: row[7],
        skating: row[8],
        shooting: row[9],
        hands: row[10],
        checking: row[11],
        defense: row[12],
        high_shots: row[13],
        low_shots: row[14],
        quickness: row[15],
        control: row[16],
        conditioning: row[17],
      }

      createRequestedCard({ requestedCard: cardRequest })
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'static',
        justifyContent: 'center',
      }}
    >
      <ButtonGroup variant={'contained'}>
        <Button
          onClick={() => {
            setSelectedRequestUi('single-card')
          }}
        >
          Single Card
        </Button>
        <Button
          onClick={() => {
            setSelectedRequestUi('csv-import')
          }}
        >
          CSV Import
        </Button>
      </ButtonGroup>
      <FormGroup>
        {selectedRequestUi === 'single-card' && (
          <>
            <CardForm
              handleOnChange={setSingleCard}
              cardData={singleCard}
              formDisabled={isSubmitting}
            />
            <Box m={2}>
              <Button
                disabled={!canSubmitSingleCard || isSubmitting}
                style={{ alignSelf: 'end' }}
                variant="contained"
                color="primary"
                onClick={handleSingleCardSubmit}
              >
                Submit Card
              </Button>
            </Box>
          </>
        )}
        {selectedRequestUi === 'csv-import' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ margin: '10px' }}>
              <CSVReader
                cssClass={'react-csv-input'}
                label={'CSV Upload'}
                onFileLoaded={handleSelectCsv}
              />
            </div>
            <Button
              disabled={!canSubmitCsv || isSubmitting}
              style={{ alignSelf: 'end' }}
              variant="contained"
              color="primary"
              onClick={handleCsvUploadSubmit}
            >
              Submit Card
            </Button>
          </div>
        )}
      </FormGroup>
    </div>
  )
}

export default RequestCardCreation
