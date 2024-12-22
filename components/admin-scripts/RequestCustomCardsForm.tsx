import { Button, Spinner, useToast } from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { rarityMap } from '@constants/rarity-map'
import { allTeamsMaps } from '@constants/teams-map'
import { mutation } from '@pages/api/database/mutation'
import { successToastOptions } from '@utils/toast'
import axios from 'axios'
import { useEffect, useState } from 'react'
import CSVReader from 'react-csv-reader'

const DATA_COLUMNS = {
  teamID: 0,
  playerID: 1,
  player_name: 2,
  render_name: 3,
  season: 4,
  card_rarity: 5,
  sub_type: 6,
  position: 7,
  overall: 8,
  skating: 9,
  shooting: 10,
  hands: 11,
  checking: 12,
  defense: 13,
  high_shots: 14,
  low_shots: 15,
  quickness: 16,
  control: 17,
  conditioning: 18,
}

export default function RequestCustomCardsForm({
  onError,
}: {
  onError: (errorMessage) => void
}) {
  const toast = useToast()
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
    onSuccess: () => {
      toast({
        title: 'Cards inserted',
        ...successToastOptions,
      })
    },
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
        teamID: parseInt(row[DATA_COLUMNS.teamID]),
        playerID: parseInt(row[DATA_COLUMNS.playerID]),
        player_name: row[DATA_COLUMNS.player_name],
        render_name: row[DATA_COLUMNS.render_name],
        season: parseInt(row[DATA_COLUMNS.season]),
        card_rarity: row[DATA_COLUMNS.card_rarity],
        sub_type:
          row[DATA_COLUMNS.sub_type].length === 0
            ? null
            : row[DATA_COLUMNS.sub_type],
        position: row[DATA_COLUMNS.position],
        overall: parseInt(row[DATA_COLUMNS.overall]),
        skating:
          row[DATA_COLUMNS.position] !== 'G'
            ? parseInt(row[DATA_COLUMNS.skating])
            : null,
        shooting:
          row[DATA_COLUMNS.position] !== 'G'
            ? parseInt(row[DATA_COLUMNS.shooting])
            : null,
        hands:
          row[DATA_COLUMNS.position] !== 'G'
            ? parseInt(row[DATA_COLUMNS.hands])
            : null,
        checking:
          row[DATA_COLUMNS.position] !== 'G'
            ? parseInt(row[DATA_COLUMNS.checking])
            : null,
        defense:
          row[DATA_COLUMNS.position] !== 'G'
            ? parseInt(row[DATA_COLUMNS.defense])
            : null,
        high_shots:
          row[DATA_COLUMNS.position] !== 'G'
            ? null
            : parseInt(row[DATA_COLUMNS.high_shots]),
        low_shots:
          row[DATA_COLUMNS.position] !== 'G'
            ? null
            : parseInt(row[DATA_COLUMNS.low_shots]),
        quickness:
          row[DATA_COLUMNS.position] !== 'G'
            ? null
            : parseInt(row[DATA_COLUMNS.quickness]),
        control:
          row[DATA_COLUMNS.position] !== 'G'
            ? null
            : parseInt(row[DATA_COLUMNS.control]),
        conditioning:
          row[DATA_COLUMNS.position] !== 'G'
            ? null
            : parseInt(row[DATA_COLUMNS.conditioning]),
      }

      const validation = validateCard(newCard, index)
      if (validation.status === false) {
        errors.push(validation.error)
        return null
      }

      return newCard
    })

    // remove header row
    cards.shift()

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
          {isLoading || isSubmitting ? <Spinner /> : 'Submit Cards'}
        </Button>
      </div>
    </div>
  )
}

const validateCard = (
  card: Partial<Card>,
  index: number
): { status: true } | { status: false; error: string } => {
  if (
    !Object.keys(allTeamsMaps).some((teamId) => teamId === String(card.teamID))
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
