import React, { useState } from 'react'

type packInfo = {
  id: string
  name: string
  description: string
  coverHref: string
}

const examplePacks: packInfo[] = [
  {
    id: 'regular',
    name: 'Base Pack',
    description: 'A pack of 6 SHL player trading cards',
    coverHref:
      'https://cdn.discordapp.com/attachments/806601618702336003/951970513830420550/unknown.png',
  },
  {
    id: 'a-different-pack',
    name: 'ISFL Base Pack',
    description: 'A pack of 6 ISFL player trading cards',
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
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <img
              onClick={() => handleBuyPack(pack.id)}
              onMouseOver={() => handleTouchPack(index)}
              className={`cursor-pointer h-96 mx-4 transition ease-linear duration-800 ${
                lastTouchedPack.id !== pack.id
                  ? 'translate-y-3 hover:scale-100 shadow-none'
                  : 'hover:-translate-y-3 hover:scale-100 shadow-xl'
              }`}
              src={pack.coverHref}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default PackShop
