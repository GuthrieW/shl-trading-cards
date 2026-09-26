import React from 'react'
import { Box, Image } from '@chakra-ui/react'
import { getOverallColor, getRarityBoxShadow } from './utils'
import { POSITION_CONSTANTS } from './types'

interface PlayerCardComponentProps {
  card: Card
  isDragging?: boolean
}

const PlayerCardComponent: React.FC<PlayerCardComponentProps> = ({
  card,
  isDragging,
}) => (
  <Box
    borderRadius="md"
    p={1}
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="flex-start"
    position="relative"
  >
    <Box
      cursor="move"
      opacity={isDragging ? 0.8 : 1}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)' }}
    >
      <Box position="relative" flex="1">
        <Image
          src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
          alt={card.player_name}
          objectFit="contain"
          borderRadius="md"
          draggable={false}
          cursor="grab"
          maxHeight={POSITION_CONSTANTS.CARD_MAX_HEIGHT}
          boxShadow={getRarityBoxShadow(card.card_rarity)}
        />
        <Box
          bg={`${getOverallColor(card.overall)}.500`}
          color="white"
          px={2}
          py={1}
          borderRadius="md"
          fontSize="xs"
          fontWeight="bold"
          position="absolute"
          top="0"
          right="0"
          minW={POSITION_CONSTANTS.BADGE_MIN_WIDTH}
          textAlign="center"
        >
          {card.overall}
        </Box>
      </Box>
    </Box>
  </Box>
)

export default PlayerCardComponent
