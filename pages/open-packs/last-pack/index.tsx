import useGetLatestPackCards from '@pages/api/queries/use-get-latest-pack-cards'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import rarityMap from '@constants/rarity-map'
import { NextSeo } from 'next-seo'
import MovableCard from '@components/canvas/movable-card'

const LastOpenedPack = () => {
  const [revealedCards, setRevealedCards] = useState<number[]>([])
  const { latestPackCards, isSuccess, isLoading, isError } =
    useGetLatestPackCards({
      uid: getUidFromSession(),
    })

  if (isLoading || isError || latestPackCards.length === 0) return null

  return (
    <div className="h-full w-full">
      <NextSeo title="Last Pack" />
      {/* <CardStack cardSrc={latestPackCards.map((card) => card.image_url)} /> */}
      <div className="flex flex-row justify-center">
        {latestPackCards.map((card) => (
          <MovableCard card={card} />
        ))}
      </div>
    </div>
  )
}

export default LastOpenedPack
