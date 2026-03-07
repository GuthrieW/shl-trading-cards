import { query } from '@pages/api/database/query'
import { useSession } from 'contexts/AuthContext'
import axios from 'axios'
import { GET } from '@constants/http-methods'
import { PageWrapper } from '@components/common/PageWrapper'
import { useEffect, useMemo, useState } from 'react'
import ImageWithFallback from '@components/images/ImageWithFallback'
import CardLightBoxModal from '@components/modals/CardLightBoxModal'
import { NextSeo } from 'next-seo'
import { Badge, Button, Skeleton, useToast } from '@chakra-ui/react'
import { TimeUntilMarketplaceReset } from '@utils/time-until-market-reset'
import { RARITY_CONFIG, DEFAULT_RARITY } from '@utils/marketplace-rarity-maps'
import BuyCardModal from '@components/modals/BuyCardModal'
import useBuyCard from '@pages/api/mutations/use-buy-card'
import { errorToastOptions, warningToastOptions } from '@utils/toast'
import React from 'react'
import router from 'next/router'

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
    handleSelectCard(null)
    setShowModal(false)
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

  React.useEffect(() => {
    if (useBuyCardError) {
      toast({
        title: 'Card Purchase Error',
        description: 'Unable to purchase the card. Please try again.',
        ...errorToastOptions,
      })
    }
  }, [useBuyCardError])

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
          Cards Resets in {TimeUntilMarketplaceReset()}
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
          : marketPlaceCards?.map((card, index) => {
              const rarity = RARITY_CONFIG[card.card_rarity] ?? DEFAULT_RARITY

              return (
                <div
                  key={`${card.cardID}-${index}`}
                  className="relative rounded-lg overflow-hidden transition-all duration-250 cursor-pointer border border-border-secondary bg-secondary"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = rarity.accent
                    el.style.boxShadow = `0 12px 40px -10px ${rarity.glow}`
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = ''
                    el.style.boxShadow = ''
                    el.style.transform = ''
                  }}
                  onClick={() => {
                    setSelectedCard(card)
                    setLightBoxIsOpen(true)
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-border-secondary gap-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: rarity.accent,
                          boxShadow: `0 0 6px ${rarity.accent}`,
                        }}
                      />
                      <span
                        className="text-xs tracking-widest uppercase"
                        style={{ color: rarity.accent }}
                      >
                        {rarity.label}
                      </span>
                    </div>
                    <Badge className="!text-xs rounded-full border bg-primary sm:ml-auto">
                      {card.quantity === 0 ? 'New' : `${card.quantity} Owned`}
                    </Badge>
                  </div>

                  <div className="relative aspect-[3/4] w-full">
                    <ImageWithFallback
                      className={`cursor-pointer ${
                        card.purchased ? 'grayscale' : ''
                      }`}
                      src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                      alt={`${card.player_name} Card`}
                      loading="lazy"
                      fill
                      sizes="(max-width: 768px) 100vw, 256px"
                      style={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none bg-gradient-to-t from-background-secondary to-transparent" />
                  </div>

                  <div className="px-3 pb-3 pt-2 flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs tracking-widest uppercase text-text-tertiary">
                            Price
                          </p>
                          <p
                            className="text-lg font-bold tracking-wide"
                            style={{ color: rarity.accent }}
                          >
                            ${card.cost.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          isDisabled={card.purchased}
                          className="w-full sm:w-auto py-2 sm:py-1.5 px-4 rounded text-sm font-bold tracking-widest uppercase border transition-all duration-200"
                          style={{
                            borderColor: rarity.accent,
                            color: rarity.accent,
                            backgroundColor: 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget
                            el.style.backgroundColor = rarity.accent
                            el.style.color = 'var(--color-background-secondary)'
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget
                            el.style.backgroundColor = 'transparent'
                            el.style.color = rarity.accent
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectCard(card)
                          }}
                        >
                          Buy
                        </Button>
                      </div>
                      {card.quantity === 0 && (
                        <div
                          className="text-xs font-black tracking-widest uppercase text-center py-0.5 rounded"
                          style={{
                            backgroundColor: rarity.accent,
                          }}
                        >
                          Not Owned
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
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
        />
      )}
    </PageWrapper>
  )
}
