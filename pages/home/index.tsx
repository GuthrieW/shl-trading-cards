import InfoCard from '@components/cards/info-card'
import pathToCards from '@constants/path-to-cards'
import useGetUserCards from '@pages/api/queries/use-get-user-cards'
import useGetUserPacks from '@pages/api/queries/use-get-user-packs'
import useGetUsersWithMostCards from '@pages/api/queries/use-get-users-with-most-cards'
import getUidFromSession from '@utils/get-uid-from-session'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import React, { useMemo } from 'react'

const Home = () => {
  const parsedUid = parseInt(Router.query.uid as string) || getUidFromSession()
  const {
    userCards,
    isLoading: getUserCardsIsLoading,
    isError: getUserCardsIsError,
  } = useGetUserCards({
    uid: parsedUid,
    name: '',
    rarities: [],
    teams: [],
    page: 0,
  })
  const { cardOwners, isLoading, isError } = useGetUsersWithMostCards({})

  const {
    userPacks,
    isLoading: getUserPacksIsLoading,
    isError: getUserPacksIsError,
  } = useGetUserPacks({
    uid: parsedUid,
  })

  const cards = useMemo(
    () =>
      userCards
        .sort((a, b) => b.overall - a.overall)
        .slice(0, 5)
        .reverse(),
    [userCards]
  )

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
      <div className="w-3/4 m-auto h-full flex flex-col xl:grid xl:grid-cols-3 gap-4">
        <InfoCard className="w-full relative">
          <h1 className="text-3xl font-bold mb-2">Your Top Cards</h1>
          {cards.length > 0 ? (
            <>
              <div className="relative w-full h-auto">
                <img
                  key={cards[0].cardID}
                  className="w-1/2 hover:-translate-y-2 transition-transform duration-200 hover:z-10 invisible"
                  src={`${pathToCards}/${cards[0].cardID}.png`}
                />
                {cards.map((card, index) => (
                  <img
                    key={card.cardID}
                    className="absolute w-1/2 hover:-translate-y-2 transition-transform duration-200 hover:z-10"
                    style={{
                      left: `${index * 10}%`,
                      top: `0`,
                    }}
                    src={`${pathToCards}/${card.cardID}.png`}
                  />
                ))}
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
        <InfoCard className="w-full relative xl:pb-8">
          <h1 className="text-3xl font-bold mb-2">User Collections</h1>
          <div className="flex flex-col h-full align-center content-between">
            <div className="flex flex-col w-full">
              {cardOwners.map(
                ({ userID, username, sum, uniqueCards }, index) => (
                  <div
                    key={userID}
                    onClick={() => Router.push(`/collection?uid=${userID}`)}
                    className="flex flex-row items-start justify-between outline outline-1 rounded bg-neutral-800 text-gray-200 hover:bg-neutral-700 hover:scale-110 duration-200 cursor-pointer"
                  >
                    <span className="ml-2 my-1">
                      {index + 1}. {username}
                    </span>
                    <span className="mr-2 my-1">
                      Unique: {uniqueCards} Total: {sum}
                    </span>
                  </div>
                )
              )}
            </div>
            <div className="flex justify-end">
              <button
                className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  Router.push('/community')
                }}
              >
                See All Collections
              </button>
            </div>
          </div>
        </InfoCard>
        <div className="w-full h-full flex justify-center items-center relative m-4 ">
          <iframe
            src="https://discord.com/widget?id=806601618702336000&theme=dark"
            width="350"
            height="500"
            allowTransparency={true}
            frameBorder={'0'}
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          ></iframe>
        </div>
      </div>
    </>
  )
}

export default Home
