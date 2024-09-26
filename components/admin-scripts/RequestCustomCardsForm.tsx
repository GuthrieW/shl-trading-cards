import { Button } from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import rarityMap from '@constants/rarity-map'
import { shlTeamsMap } from '@constants/teams-map'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { useEffect, useState } from 'react'
import CSVReader from 'react-csv-reader'

export default function RequestCustomCardsForm({
  onError,
}: {
  onError: (errorMessage) => void
}) {
  const [csvToUpload, setCsvToUpload] = useState(null)
  const [canSubmitCsv, setCanSubmitCsv] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [numberOfCardsToUpload, setNumberOfCardsToUpload] = useState<number>(0)

  const { mutateAsync: requestCustomCards, isLoading } = mutation<
    void,
    { cards: Card[] }
  >({
    mutationFn: ({ cards }) =>
      axios({
        method: POST,
        url: '/api/v3/cards/custom-requests',
        data: { cards },
      }),
  })

  useEffect(() => {
    setCanSubmitCsv(csvToUpload !== null)
  }, [csvToUpload])

  const handleSelectCsv = (data, fileInfo) => {
    setNumberOfCardsToUpload(data.length - 1)
    setCsvToUpload(data)
  }

  const handleUploadCsv = async () => {
    setIsSubmitting(true)
    const errors: string[] = []
    const cards: Card[] = csvToUpload.map((row, index) => {
      if (index === 0) return

      const newCard: Partial<Card> = {
        teamID: parseInt(row[0]),
        playerID: parseInt(row[1]),
        player_name: row[2],
        season: parseInt(row[3]),
        card_rarity: row[4],
        sub_type: row[5].length === 0 ? null : row[5],
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

      const validation = validateCard(newCard, index)
      if (validation.status === false) {
        errors.push(validation.error)
        return null
      }

      return newCard
    })

    if (errors.length === 0) {
      await requestCustomCards({ cards })
    } else {
      onError(errors.join('. '))
    }

    setIsSubmitting(false)
  }

  return (
    <div>
      <CSVReader
        cssClass="react-csv-input"
        label="Upload CSV&nbsp;"
        onFileLoaded={handleSelectCsv}
      />
      <div className="mb-5 flex justify-start items-center">
        Cards Awaiting Submission: {numberOfCardsToUpload}
      </div>

      <div className="flex justify-end items-center">
        <Button
          disabled={!canSubmitCsv || isSubmitting || isLoading}
          onClick={handleUploadCsv}
        >
          Submit Cards
        </Button>
      </div>
    </div>
  )
}

const validateCard = (
  card: Partial<Card>,
  index: number
): { status: true } | { status: false; error: string } => {
  console.log('card', card)
  if (
    !card.teamID ||
    !Object.keys(shlTeamsMap).some((teamId) => teamId === String(card.teamID))
  ) {
    return { status: false, error: `teamID missing on row ${index}` }
  }

  if (!card.playerID) {
    return { status: false, error: `playerID missing on row ${index}` }
  }

  if (!card.season || card.season < 0) {
    return { status: false, error: `season missing or invalid on row ${index}` }
  }

  if (
    !card.card_rarity ||
    !Object.values(rarityMap).some(
      (rarity) => rarity.value === card.card_rarity
    )
  ) {
    return {
      status: false,
      error: `card_rarity missing or invalid on row ${index}`,
    }
  }

  if (!card.position || !['F', 'D', 'G', 'X'].includes(card.position)) {
    return {
      status: false,
      error: `position missing or invalid on row ${index}`,
    }
  }

  if (!card.overall || card.overall < 0 || card.overall >= 100) {
    return {
      status: false,
      error: `overall missing or invalid on row ${index}`,
    }
  }

  if (card.position === 'F' || card.position === 'D') {
    if (
      !card.skating ||
      !card.shooting ||
      !card.hands ||
      !card.checking ||
      !card.defense
    ) {
      return {
        status: false,
        error: `attributes missing or invalid on skater row ${index}`,
      }
    }
  }

  if (card.position === 'G') {
    if (
      !card.high_shots ||
      !card.low_shots ||
      !card.quickness ||
      !card.control ||
      !card.conditioning
    ) {
      return {
        status: false,
        error: `attributes missing or invalid on goalie row ${index}`,
      }
    }
  }

  return { status: true }
}
