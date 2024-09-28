import useGetLatestPackCards from '@pages/api/queries/use-get-latest-pack-cards'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import ReactCardFlip from 'react-card-flip'
import rarityMap from '@constants/rarity-map'
import pathToCards from '@constants/path-to-cards'
import { Button } from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'

const HexCodes = {
  Ruby: '#E0115F',
  Diamond: '#45ACA5',
  Gold: '#FFD700',
}

const LastOpenedPack = () => {
    const { session, loggedIn } = useSession()
    const [revealedCards, setRevealedCards] = useState<number[]>([])
  
    const { payload: user, isLoading: userIDLoading } = query<UserData>({
      queryKey: ['baseUser', session?.token],
      queryFn: () =>
        axios({
          method: GET,
          url: '/api/v3/user',
          headers: { Authorization: `Bearer ${session?.token}` },
        }),
      enabled: loggedIn,
    })

  const { latestPackCards, isSuccess, isLoading, isError } =
    useGetLatestPackCards({
      uid: user?.uid,
    })

  const cardRarityShadows = [
    { id: rarityMap.ruby.label, color: HexCodes.Ruby },
    { id: rarityMap.diamond.label, color: HexCodes.Diamond },
    { id: rarityMap.hallOfFame.label, color: HexCodes.Gold },
    { id: rarityMap.twoThousandClub.label, color: HexCodes.Gold },
    { id: rarityMap.award.label, color: HexCodes.Gold },
    { id: rarityMap.firstOverall.label, color: HexCodes.Gold },
    { id: rarityMap.iihfAwards.label, color: HexCodes.Gold },
  ]

  const updateRevealedCards = (index: number): void => {
    if (revealedCards.includes(index)) return
    setRevealedCards([...revealedCards, index])
  }

  const flipAllCards = (): void => {
    setRevealedCards(
      revealedCards.length === latestPackCards.length ? [] : [0, 1, 2, 3, 4, 5]
    )
  }

  if (isLoading || isError || userIDLoading || latestPackCards.length === 0) return null

  return (
    <PageWrapper>
    <div className="h-full w-full m-1">
      <NextSeo title="Last Pack" />
      <div className="flex flex-row items-center justify-start space-x-2">
        <Button disabled={false} onClick={() => Router.push('/packs')}>
          Open Another Pack
        </Button>
        <Button disabled={false} onClick={flipAllCards}>
          Flip All Cards
        </Button>
      </div>

      <div className="m-2" style={{ height: 'calc(100vh-64px)' }}>
        <div className="flex justify-center items-start h-full">
          <div className="flex h-full flex-col sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2 overflow-x-auto py-6">
            {latestPackCards.map((card, index) => (
              <ReactCardFlip
                key={index}
                isFlipped={revealedCards.includes(index)}
              >
                <img
                  width="320"
                  height="440"
                  key={index}
                  draggable={false}
                  className={`rounded-sm transition-all duration-200 cursor-pointer select-none `}
                  style={{
                    boxShadow: `${
                      revealedCards.includes(index)
                        ? `0px 0px 16px 10px ${cardRarityShadows.find(
                            (shadow) => shadow.id === card.card_rarity
                          )?.color}`
                        : 'none'
                    }`,
                  }}
                  src={`/cardback.png`}
                  onClick={() => updateRevealedCards(index)}
                />

                <img
                  width="320"
                  height="440"
                  key={index}
                  draggable={false}
                  className={`rounded-sm transition-all duration-200 select-none `}
                  style={{
                    boxShadow: `${
                      revealedCards.includes(index)
                        ? `0px 0px 16px 10px ${cardRarityShadows.find(
                            (shadow) => shadow.id === card.card_rarity
                          )?.color}`
                        : 'none'
                    }`,
                  }}
                  src={`${pathToCards}${card.image_url}`}
                />
              </ReactCardFlip>
            ))}
          </div>
        </div>
      </div>
    </div>
    </PageWrapper>
  )
}

export default LastOpenedPack