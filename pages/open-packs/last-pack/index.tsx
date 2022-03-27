import { useGetLatestPackCards } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import { pathToCards, rarityMap } from '@constants/index'
import { NextSeo } from 'next-seo'

const LastOpenedPack = () => {
  const [revealedCards, setRevealedCards] = useState<number[]>([])
  const { latestPackCards, isSuccess, isLoading, isError } =
    useGetLatestPackCards({
      uid: getUidFromSession(),
    })

  if (isLoading || isError || latestPackCards === []) return null

  const updateRevealedCards = (index: number) => {
    if (revealedCards.includes(index)) return
    setRevealedCards([...revealedCards, index])
  }

  const cardRarityShadows = [
    {
      id: rarityMap.ruby.label,
      color: '#e0115f',
    },
    {
      id: rarityMap.diamond.label,
      color: '#b9f2ff',
    },
    {
      id: rarityMap.logo.label,
      color: '#e0115f',
    },
    {
      id: rarityMap.hallOfFame.label,
      color: '#FFD700',
    },
  ]

  return (
    <>
      <NextSeo title="Last Pack" />
      <div className="m-2" style={{ height: 'calc(100vh-64px)' }}>
        <div className="flex justify-center items-start h-full">
          <div className="flex h-full flex-col sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2 overflow-x-auto py-6">
            {latestPackCards.map((card, index) => (
              <div className="group relative p-2" key={index}>
                <img
                  width="320"
                  height="440"
                  key={index}
                  className={`animate-slide-in-left rounded-sm  ${
                    revealedCards.includes(index) ? '' : 'blur-3xl'
                  } transition-all duration-200`}
                  style={{
                    boxShadow: `${
                      revealedCards.includes(index)
                        ? `0px 0px 16px 10px ${
                            cardRarityShadows.find(
                              (shadow) => shadow.id === card.card_rarity
                            )?.color
                          }`
                        : 'none'
                    }`,
                  }}
                  src={`${pathToCards}${card.image_url}`}
                />
                {!revealedCards.includes(index) && (
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                    onClick={() => updateRevealedCards(index)}
                  >
                    <div className="text-white text-2xl w-3/4 text-center transition-all duration-300">
                      Click card to reveal
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default LastOpenedPack
