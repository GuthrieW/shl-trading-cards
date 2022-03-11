import React, { useState } from 'react'

type packInfo = {
  id: string
  name: string
  description: string
  coverHref: string
}

const examplePacks: packInfo[] = [
  {
    id: 'shl-players-pack',
    name: 'SHL Players Pack',
    description: 'A pack of 6 SHL player trading cards',
    coverHref:
      'https://cdn.discordapp.com/attachments/719410556578299954/773048548026875904/s25_Pack.png',
  },
  {
    id: 'a-different-pack',
    name: 'A Different SHL Pack',
    description: 'Some other pack',
    coverHref:
      'https://cdn.discordapp.com/attachments/719410556578299954/773048548026875904/s25_Pack.png',
  },
  {
    id: 'a-third-pack',
    name: 'Third SHL Pack',
    description: 'Third other pack',
    coverHref:
      'https://cdn.discordapp.com/attachments/719410556578299954/773048548026875904/s25_Pack.png',
  },
]

const PackShop = () => {
  const [lastTouchedPack, setLastTouchedPack] = useState(examplePacks[0])

  const handleTouchPack = (packIndex) => {
    setLastTouchedPack(examplePacks[packIndex])
  }

  const handleBuyPack = (packId) => {
    console.log(`Buy a ${packId} pack`)
  }

  return (
    <>
      <div className="flex flex-col">
        <span className="mx-2 text-3xl">{lastTouchedPack.name}</span>
        <span className="mx-5">{lastTouchedPack.description}</span>
      </div>
      <div className="h-auto flex flex-row items-center justify-center">
        {examplePacks.map((pack: packInfo, index: number) => (
          <div className="flex flex-col items-center justify-center">
            <img
              onClick={() => {
                handleBuyPack(pack.id)
              }}
              onMouseOver={() => {
                handleTouchPack(index)
              }}
              className={
                lastTouchedPack.id !== pack.id
                  ? 'h-96 mx-4 transition ease-linear translate-y-3 hover:scale-100 duration-800'
                  : 'h-96 mx-4 transition ease-linear hover:-translate-y-3 hover:scale-100 duration-800'
              }
              src={pack.coverHref}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default PackShop
