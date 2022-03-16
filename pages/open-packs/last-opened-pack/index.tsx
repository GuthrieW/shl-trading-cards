import { useGetLatestPackCards } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'
import { pathToCards } from '@constants/index'

const LastOpenedPack = () => {
  const { latestPackCards, isLoading, isError } = useGetLatestPackCards({
    uid: getUidFromSession(),
  })

  if (isLoading || isError) return null

  if (latestPackCards === []) return null

  return (
    <div className="m-2">
      <h1>Last Opened Pack</h1>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-3 gap-5">
          {latestPackCards.map((card, index) => (
            <img key={index} src={`${pathToCards}${card.image_url}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LastOpenedPack
