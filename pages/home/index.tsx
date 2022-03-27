import Card from '@components/card/card'
import packsMap from '@constants/packs-map'
import pathToCards from '@constants/path-to-cards'
import {
  useGetAllUsersWithCards,
  useGetUserCards,
  useGetUserPacks,
} from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import { NextSeo } from 'next-seo'
import Router, { useRouter } from 'next/router'
import React, { useMemo } from 'react'

// const homeBoxes = [
//   {
//     title: 'See Your Cards',
//     href: `/collection?uid=${getUidFromSession()}`,
//     content: '',
//   },
//   {
//     title: 'View Other Collections',
//     href: '/community',
//     content: '',
//   },
//   {
//     title: 'Open Your Packs',
//     href: '/open-packs',
//     content: '',
//   },
// ]

const Home = () => {
  const { query } = useRouter()
  const parsedUid = parseInt(query.uid as string) || getUidFromSession()

  const {
    userCards,
    isSuccess: getUserCardsIsSuccess,
    isLoading: getUserCardsIsLoading,
    isError: getUserCardsIsError,
  } = useGetUserCards({
    uid: parsedUid,
  })

  const {
    userPacks,
    isSuccess: getUserPacksIsSuccess,
    isLoading: getUserPacksIsLoading,
    isError: getUserPacksIsError,
  } = useGetUserPacks({
    uid: parsedUid,
  })

  const cards = useMemo(() => {
    return userCards
      .sort((a, b) => {
        return b.overall - a.overall
      })
      .slice(0, 5)
      .reverse()
  }, [userCards])

  const packs = useMemo(() => {
    return userPacks.slice(0, 5).reverse()
  }, [userPacks])

  if (
    getUserCardsIsLoading ||
    getUserPacksIsLoading ||
    getUserCardsIsError ||
    getUserPacksIsError
  ) {
    return null
  }

  return (
    <>
      <NextSeo title="Home" />
      {/* Keeping the background video in here in case we ever want to bring it back */}
      {/* <video
      className="fixed -z-10 top-0  opacity-75"
      autoPlay
      loop
      playsInline
      muted
    >
      <source src={'/videos/home-background.mp4'} type={'video/mp4'} />
    </video> */}
      <div
        className="w-full bg-cover bg-center bg-no-repeat hidden lg:block"
        style={{
          height: '70vh',
          backgroundImage: `url(https://simulationhockey.com/tradingcards/header/header1.png)`,
        }}
      ></div>
      <div className="w-3/4 m-auto h-full flex flex-col xl:grid xl:grid-cols-3 gap-4">
        <Card className="w-full h-full relative">
          <h1 className="text-3xl font-bold mb-2">Your Cards</h1>
          {cards.length > 0 ? (
            <>
              <div className="relative w-full h-auto">
                <img
                  key={cards[0].cardID}
                  className="w-1/2 hover:-translate-y-2 transition-transform duration-200 hover:z-10 invisible"
                  src={`${pathToCards}/${cards[0].cardID}.png`}
                />
                {cards.map((card, index) => {
                  return (
                    <img
                      key={card.cardID}
                      className="absolute w-1/2 hover:-translate-y-2 transition-transform duration-200 hover:z-10"
                      style={{
                        left: `${index * 10}%`,
                        top: `0`,
                      }}
                      src={`${pathToCards}/${card.cardID}.png`}
                    />
                  )
                })}
              </div>

              <div className="flex justify-center xl:justify-end">
                <button
                  className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    Router.push(`/collection?uid=${parsedUid}`)
                  }}
                >
                  See Your Cards
                </button>
              </div>
            </>
          ) : (
            // direct user to buy packs
            <div className="flex flex-col h-full align-center justify-evenly">
              <div className="text-center">
                <p className="text-xl">You don't have any cards.</p>
                <p className="text-xl">
                  Go to the{' '}
                  <a
                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200 my-4"
                    href="/pack-shop"
                  >
                    pack shop
                  </a>{' '}
                  to get some cards!
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit"
                  onClick={() => {
                    Router.push('/pack-shop')
                  }}
                >
                  Buy Packs
                </button>
              </div>
            </div>
          )}
        </Card>
        <Card className="w-full h-full relative">
          <h1 className="text-3xl font-bold mb-2">User Collections</h1>
          {/* TODO: Show list of top user collections in terms of card total */}
          <div className="flex flex-col h-full align-center justify-evenly">
            <div className="text-center">
              <p className="text-xl mb-2">
                Trade with other users to get cards you are looking for and to
                complete sets.
              </p>
              <p className="text-md">Feature Coming Soon!</p>
            </div>
            <div className="flex justify-end">
              <button
                className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  Router.push('/community')
                }}
              >
                See All Other Collections
              </button>
            </div>
          </div>
        </Card>
        <Card className="w-full h-full relative">
          <h1 className="text-3xl font-bold mb-2">Your Unopened Packs</h1>
          {packs.length > 0 ? (
            <>
              <div className="relative w-full h-auto">
                <img
                  className="w-2/5 hover:-translate-y-2 transition-transform duration-200 hover:z-10 invisible"
                  src={packsMap[packs[0].packType].imageUrl}
                />
                {packs.map((pack, index) => {
                  return (
                    <img
                      key={pack.packID}
                      className="absolute w-2/5 hover:-translate-y-2 transition-transform duration-200 hover:z-10"
                      style={{
                        left: `${index * 10}%`,
                        top: `0`,
                      }}
                      src={packsMap[pack.packType].imageUrl}
                    />
                  )
                })}
              </div>
              <div className="flex justify-center xl:justify-end">
                <button
                  className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    Router.push('/open-packs')
                  }}
                >
                  Open Your Packs
                </button>
              </div>
            </>
          ) : (
            // direct user to buy packs
            <div className="flex flex-col h-full align-center justify-evenly">
              <div className="text-center">
                <p className="text-xl">You don't have any packs to open.</p>
                <p className="text-xl">
                  Go to the{' '}
                  <a
                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200 my-4"
                    href="/pack-shop"
                  >
                    pack shop
                  </a>{' '}
                  to get some packs!
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit"
                  onClick={() => {
                    Router.push('/pack-shop')
                  }}
                >
                  Buy Packs
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  )
}

export default Home
