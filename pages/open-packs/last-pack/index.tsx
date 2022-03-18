import { useGetLatestPackCards } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import { pathToCards } from '@constants/index'

const LastOpenedPack = () => {
  const { latestPackCards, isLoading, isError } = useGetLatestPackCards({
    uid: getUidFromSession(),
  })

  const [cards, setCards] = useState<any[]>(latestPackCards)

  const handleUpdateCard = (index) => {
    const updatedArray = cards.map((card, i) => {
      if (i === index) {
        return { ...card, flipped: true }
      } else {
        return card
      }
    })

    setCards(updatedArray)
  }

  if (isLoading || isError) return null

  if (latestPackCards === []) return null

  return (
    <div className="m-2">
      <h1>Last Opened Pack</h1>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-6 gap-2 overflow-x-auto">
          {cards.map((card, index) => {
            return card.flipped ? (
              <img
                width="320"
                height="440"
                key={index}
                className="animate-slide-in-left"
                onClick={() => handleUpdateCard(index)}
                src={`${pathToCards}${card.image_url}`}
              />
            ) : (
              <img
                width="320"
                height="440"
                key={index}
                className="animate-slide-in-left"
                onClick={() => handleUpdateCard(index)}
                src={`https://m.media-amazon.com/images/I/71pl1bc87ZL._AC_SY445_.jpg`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LastOpenedPack
