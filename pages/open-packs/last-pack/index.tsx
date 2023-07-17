import useGetLatestPackCards from '@pages/api/queries/use-get-latest-pack-cards'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import { NextSeo } from 'next-seo'
import MovableCard from '@components/canvas/movable-card'
import Button from '@components/buttons/button'
import Router from 'next/router'

const LastOpenedPack = () => {
  const [revealedCards, setRevealedCards] = useState<number[]>([])
  const { latestPackCards, isSuccess, isLoading, isError } =
    useGetLatestPackCards({
      uid: getUidFromSession(),
    })

  if (isLoading || isError || latestPackCards.length === 0) return null

  return (
    <div className="h-full w-full m-1">
      <NextSeo title="Last Pack" />
      <Button disabled={false} onClick={() => Router.push('/open-packs')}>
        Open Another Pack
      </Button>
      <div className="flex flex-row">
        {latestPackCards.map((card) => (
          <MovableCard card={card} />
        ))}
      </div>
    </div>
  )
}

export default LastOpenedPack
