import { useGetLatestPackCards } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import { pathToCards } from '@constants/index'
import { NextSeo } from 'next-seo'

const LastOpenedPack = () => {
  const { latestPackCards, isSuccess, isLoading, isError } =
    useGetLatestPackCards({
      uid: getUidFromSession(),
    })

  if (isLoading || isError || latestPackCards === []) return null

  return (
    <>
      <NextSeo title="Last Pack" />
      <div className="m-2">
        <div className="flex justify-center items-center">
          <div className="flex flex-col sm:grid sm:grid-cols-3 lg:grid-cols-6  gap-2 overflow-x-auto">
            {latestPackCards.map((card, index) => (
              <img
                width="320"
                height="440"
                key={index}
                className="animate-slide-in-left rounded-sm"
                src={`${pathToCards}${card.image_url}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default LastOpenedPack
