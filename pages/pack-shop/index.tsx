import { useBuyPack } from '@pages/api/mutations'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import { packsMap, packInfo } from '@constants/packs-map'

const PackShop = () => {
  const [lastTouchedPack, setLastTouchedPack] = useState(packsMap[0])

  const { buyPack, response, isLoading, isError } = useBuyPack()

  const handleTouchPack = (packIndex) => {
    setLastTouchedPack(packsMap[packIndex])
  }

  const handleBuyPack = (packId) => {
    buyPack({ uid: getUidFromSession(), packType: packId })
  }

  return (
    <div className="m-2">
      <h1>Pack Shop</h1>
      <div className="flex flex-col">
        <span className="mx-2 text-3xl">{lastTouchedPack.label}</span>
        <span className="mx-5">{lastTouchedPack.description}</span>
      </div>
      <div className="h-auto flex flex-row items-center justify-center">
        {packsMap.map((pack: packInfo, index: number) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <img
              onClick={() => handleBuyPack(pack.id)}
              onMouseOver={() => handleTouchPack(index)}
              className={`cursor-pointer h-full mx-4 transition ease-linear duration-800 ${
                lastTouchedPack.id !== pack.id
                  ? 'translate-y-3 hover:scale-100 shadow-none'
                  : 'hover:-translate-y-3 hover:scale-100 shadow-xl'
              }`}
              src={pack.imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PackShop
