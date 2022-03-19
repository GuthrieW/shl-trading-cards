import { useGetLatestPackCards } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import { pathToCards } from '@constants/index'

const LastOpenedPack = () => {
  const { latestPackCards, isLoading, isError } = useGetLatestPackCards({
    uid: getUidFromSession(),
  })

  if (isLoading || isError || latestPackCards === []) return null

  return (
    <div className="m-2">
      <h1>Last Opened Pack</h1>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-6 gap-2 overflow-x-auto">
          {latestPackCards.map((card, index) => (
            <img
              width="320"
              height="440"
              key={index}
              className="animate-slide-in-left"
              src={`${pathToCards}${card.image_url}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LastOpenedPack
