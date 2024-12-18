import React from 'react'
import { TradeCard } from '@pages/api/v3/trades/collection/[uid]'
import { Button } from '@chakra-ui/react'

const RemoveButton = ({
  onClick,
  isLoggedInUser,
  card,
  size,
  rightSide,
}: {
  onClick: (card: TradeCard, isLoggedInUser: boolean) => void
  isLoggedInUser: boolean
  card: TradeCard
  size: string
  rightSide: number
}) => {
  return (
    <Button
      onClick={() => onClick(card, isLoggedInUser)}
      position="absolute"
      top={2}
      right={rightSide}
      zIndex={10}
      size={size}
      colorScheme="red"
      aria-label="Remove from trade"
    >
      Remove
    </Button>
  )
}

export default RemoveButton
