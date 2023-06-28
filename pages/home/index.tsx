import Button from '@components/buttons/button'
import InfoCard from '@components/cards/info-card'
import Drawer from '@components/drawers/drawer'
import packsMap from '@constants/packs-map'
import pathToCards from '@constants/path-to-cards'
import useGetUserCards from '@pages/api/queries/use-get-user-cards'
import useGetUserPacks from '@pages/api/queries/use-get-user-packs'
import getUidFromSession from '@utils/get-uid-from-session'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import React, { useMemo, useState } from 'react'

const Home = () => {
  const parsedUid = parseInt(Router.query.uid as string) || getUidFromSession()
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false)
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
      <div
        className="w-full bg-cover bg-center bg-no-repeat hidden lg:block"
        style={{
          height: '70vh',
          backgroundImage: `url(https://simulationhockey.com/tradingcards/header/header1.png)`,
        }}
      ></div>
      <Button onClick={() => setDrawerIsOpen(!drawerIsOpen)} disabled={false}>
        Drawer
      </Button>
      <div className="w-3/4 m-auto h-full flex flex-col xl:grid xl:grid-cols-3 gap-4">
        <InfoCard className="w-full h-full relative">
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
        </InfoCard>
        <InfoCard className="w-full h-full relative xl:pb-8">
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
        </InfoCard>
        <InfoCard className="w-full h-full relative">
          <h1 className="text-3xl font-bold mb-2">Unopened Packs</h1>
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
                <p className="text-xl">You don't have any packs.</p>
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
        </InfoCard>
      </div>
      <Drawer
        isOpen={drawerIsOpen}
        closeDrawer={() => setDrawerIsOpen(!drawerIsOpen)}
      >
        <p className="text-gray-100">
          Look I made you some content! Daddy made you your favorite open wide.
          Here comes the content... It's a beautiful day to stay inside!
        </p>
      </Drawer>
    </>
  )
}

export default Home
