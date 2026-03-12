import { query } from '@pages/api/database/query'
import { useSession } from 'contexts/AuthContext'
import axios from 'axios'
import { GET } from '@constants/http-methods'
import { PageWrapper } from '@components/common/PageWrapper'
import { useEffect, useMemo, useState } from 'react'
import CardLightBoxModal from '@components/modals/CardLightBoxModal'
import { NextSeo } from 'next-seo'
import { Skeleton, useToast } from '@chakra-ui/react'
import { timeUntilMarketplaceReset } from '@utils/time-until-market-reset'
import BuyCardModal from '@components/modals/BuyCardModal'
import useBuyCard from '@pages/api/mutations/use-buy-card'
import { errorToastOptions, warningToastOptions } from '@utils/toast'
import React from 'react'
import router from 'next/router'
import MarketplaceCard from '@components/cards/MarketplaceCard'

export default function Marketplace() {
  const toast = useToast()
  const { session, loggedIn } = useSession()
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<MarketplaceCard | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [cardBuy, setCardBuy] = useState<MarketplaceCard | null>(null)

  const handleSelectCard = (card: MarketplaceCard) => {
    setCardBuy(card)
    setShowModal(true)
  }

  useEffect(() => {
    if (!loggedIn) {
      router.replace('/')
    }
  }, [loggedIn, router])

  const {
    buyCard,
    response,
    isSuccess: useBuyCardIsSucess,
    isLoading: useBuyCardIsLoading,
    isError: useBuyCardError,
  } = useBuyCard()

  const handleBuyCard = (card: MarketplaceCard) => {
    if (useBuyCardIsLoading) {
      toast({
        title: 'Already buying a card',
        description: `Bro chill we're still buying that card`,
        ...warningToastOptions,
      })
      return
    }
    buyCard({ card })
  }

  const { payload: marketPlaceCards, isLoading: marketPlaceLoading } = query<
    MarketplaceCard[]
  >({
    queryKey: ['marketplace', session?.userId],
    queryFn: async () =>
      axios({
        method: GET,
        url: `/api/v3/marketplace/${session?.userId}`,
        headers: { Authorization: `Bearer ${session?.token}` },
      }),
    enabled: loggedIn,
  })

  useEffect(() => {
    if (useBuyCardError) {
      toast({
        title: 'Card Purchase Error',
        description: 'Unable to purchase the card. Please try again.',
        ...errorToastOptions,
      })
    }
  }, [useBuyCardError])

  useEffect(() => {
    if (useBuyCardIsSucess) {
      setShowModal(false)
      setCardBuy(null)
    }
  }, [useBuyCardIsSucess])

  const unpurchasedCount = useMemo(
    () => marketPlaceCards?.filter((card) => !card.purchased).length ?? 5,
    [marketPlaceCards]
  )

  return (
    <PageWrapper title="Marketplace">
      <NextSeo title="Marketplace" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between px-6 pt-8 pb-5 border-b border-border-secondary gap-3 sm:gap-0">
        <div>
          <div className="text-4xl sm:text-5xl font-bold tracking-widest leading-none text-text-primary">
            Marketplace
          </div>
          <div className="text-xs tracking-widest uppercase mt-2 text-text-tertiary">
            {unpurchasedCount === 0
              ? "You've purchased all available cards!"
              : `${unpurchasedCount} more cards available to purchase`}
          </div>
          <div className="text-xs tracking-widest uppercase mt-2 text-text-tertiary">
            Marketplace is a place where you can buy up to 5 random cards every
            week. Prices are set by Card Management and Head Office
          </div>
        </div>
        <div className="text-xs tracking-widest uppercase text-text-tertiary sm:text-right">
          Cards Resets in {timeUntilMarketplaceReset()}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6 ">
        {marketPlaceLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="relative rounded-lg overflow-hidden border border-border-secondary"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-border-secondary bg-secondary">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
                <Skeleton className="aspect-[3/4] w-full" />
                <div className="px-3 pb-3 pt-2 flex flex-col gap-3">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-2 w-8 rounded" />
                      <Skeleton className="h-5 w-16 rounded" />
                    </div>
                    <Skeleton className="h-8 w-14 rounded" />
                  </div>
                </div>
              </div>
            ))
          : marketPlaceCards?.map((card, index) => (
              <MarketplaceCard
                key={`${card.cardID}-${index}`}
                card={card}
                index={index}
                onOpenLightbox={(card) => {
                  setSelectedCard(card)
                  setLightBoxIsOpen(true)
                }}
                onSelectCard={handleSelectCard}
              />
            ))}
      </div>

      {lightBoxIsOpen && selectedCard && (
        <CardLightBoxModal
          cardName={selectedCard.player_name}
          cardImage={selectedCard.image_url}
          owned={1}
          rarity={selectedCard.card_rarity}
          playerID={selectedCard.playerID}
          leagueID={selectedCard.leagueID}
          cardID={selectedCard.cardID}
          userID={session.userId}
          setShowModal={() => setLightBoxIsOpen(false)}
        />
      )}

      {showModal && (
        <BuyCardModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onBuy={(card) => {
            handleBuyCard(card)
          }}
          card={cardBuy}
          isLoading={useBuyCardIsLoading}
        />
      )}
    </PageWrapper>
  )
}
