import React, { useMemo } from 'react'
import { Box, useBreakpointValue } from '@chakra-ui/react'
import pathToCards from '@constants/path-to-cards'
import Image from 'next/image'

export type TradingCardProps = {
  source: string
  playerName: string
  rarity: string
  className?: string
}

const TradingCard = ({
  source,
  playerName,
  rarity,
  className,
}: TradingCardProps) => {
  const aspectRatio = useBreakpointValue({ base: 4 / 6, md: 3 / 4 })
  const maxHeight = useBreakpointValue({ base: '70vh', md: '80vh' })

  const imageSource = useMemo(() => {
    if (playerName === 'backOfCard') {
      return '/cardback.png'
    }
    return `${pathToCards}${source}`
  }, [playerName, source])

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >
      <Box
        width="auto"
        height={`min(${maxHeight}, 100%)`}
        position="relative"
        aspectRatio={aspectRatio}
      >
        <Image
          src={`${imageSource}`}
          alt={`${rarity} ${playerName}`}
          loading="lazy"
          fill
          style={{ objectFit: 'contain' }}
          className={`rounded-sm ${className}`}
        />
      </Box>
    </Box>
  )
}

export default TradingCard
