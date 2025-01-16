import axios from 'axios'
import { pathToCards } from '@constants/path-to-cards'
import Image from 'next/image'
import { Box, SimpleGrid, Spinner } from '@chakra-ui/react'
import { LatestCards } from '@pages/api/v3'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { useCookie } from '@hooks/useCookie'
import config from 'lib/config'
import CardLightBoxModal from '@components/modals/CardLightBoxModal'
import { useState } from 'react'

interface PackOpenProps {
  packID: string
}

const PackOpen: React.FC<PackOpenProps> = ({ packID }) => {
  const [uid] = useCookie(config.userIDCookieName)
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<LatestCards | null>(null)

  const customLoader = (src: string) => {
    return `https://simulationhockey.com/tradingcards/${src}.png`
  }

  const { payload: cards, isLoading: isLoading } = query<LatestCards[]>({
    queryKey: ['latest-cards', packID],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/uid/latest-cards?packID=${packID}`,
      }),
    enabled: !!packID,
  })

  if (isLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <Spinner />
      </div>
    )
  }
  return (
    <>
      <SimpleGrid columns={3} spacing={4}>
        {cards.map((card: LatestCards) => (
          <Box
            onClick={() => {
              if (card) {
                setSelectedCard(card)
                setLightBoxIsOpen(true)
              }
            }}
          >
            <Image
              key={card.cardID}
              src={`${pathToCards}${card.imageURL}`}
              width={300}
              height={475}
              alt={`Card ${card.cardID}`}
              className={`rounded-sm hover:scale-105 hover:shadow-xl`}
              loading="lazy"
              unoptimized={true}
            />
          </Box>
        ))}
      </SimpleGrid>
      {lightBoxIsOpen && selectedCard && (
        <CardLightBoxModal
          cardName={selectedCard.playerName}
          cardImage={selectedCard.imageURL}
          owned={1}
          rarity={selectedCard.card_rarity}
          playerID={selectedCard.playerID}
          cardID={selectedCard.cardID}
          userID={uid}
          setShowModal={() => setLightBoxIsOpen(false)}
        />
      )}
    </>
  )
}

export default PackOpen
