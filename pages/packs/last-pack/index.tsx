import useGetLatestPackCards from '@pages/api/queries/use-get-latest-pack-cards'
import React, { useEffect, useMemo, useState } from 'react'
import { NextSeo } from 'next-seo'
import Router, { useRouter } from 'next/router'
import ReactCardFlip from 'react-card-flip'
import { rarityMap } from '@constants/rarity-map'
import pathToCards from '@constants/path-to-cards'
import {
  Button,
  Badge,
  useToast,
  Tooltip,
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumb,
  Spinner,
} from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import {
  successToastOptions,
  warningToastOptions,
  errorToastOptions,
} from '@utils/toast'
import CardLightBoxModal from '@components/modals/CardLightBoxModal'
import { UserPacks } from '@pages/api/v3'
import { useCookie } from '@hooks/useCookie'
import config from 'lib/config'
import useOpenPack from '@pages/api/mutations/use-open-pack'
import { ChevronLeftIcon } from '@chakra-ui/icons'

const HexCodes = {
  Ruby: '#E0115F',
  Diamond: '#459F94',
  Gold: '#BD8700 ',
  Charity: '#9737F0',
  Award: '#0C65EE',
}

const LastOpenedPack = () => {
  const toast = useToast()
  const { session, loggedIn } = useSession()
  const router = useRouter()
  const [revealedCards, setRevealedCards] = useState<number[]>([])
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [loggedInUID] = useCookie(config.userIDCookieName)

  const { type } = router.query as { type: string }

  useEffect(() => {
    if (!loggedIn) {
      router.replace('/')
    }
  })

  const { payload: packs, isLoading: packsLoading } = query<UserPacks[]>({
    queryKey: ['packs', String(loggedInUID), type],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/packs/${loggedInUID}?packType=${type}`,
      }),
    enabled: !!loggedInUID && !!type,
  })
  const firstPack = useMemo(() => {
    return packs?.[0] || undefined
  }, [packs])

  const {
    openPack,
    response,
    isSuccess: useOpenPackIsSuccess,
    isLoading: useOpenPackIsLoading,
    isError: useOpenPackIsError,
  } = useOpenPack()

  const OpenNextPack = (pack: UserPacks) => {
    if (useOpenPackIsLoading) {
      toast({
        title: 'Already opening a pack',
        description: `Bro chill we're still opening that pack`,
        ...warningToastOptions,
      })
      return
    }
    if (!pack) {
      toast({
        title: 'No Packs Available',
        description: `You don't have any ${type} packs to open.`,
        ...errorToastOptions,
      })
      return
    }
    console.log(pack)
    openPack({ packID: pack.packID })
  }

  const { payload: user } = query<UserData>({
    queryKey: ['baseUser', session?.token],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/user',
        headers: { Authorization: `Bearer ${session?.token}` },
      }),
    enabled: loggedIn,
  })

  const { latestPackCards, isSuccess, isLoading, isError } =
    useGetLatestPackCards({
      uid: user?.uid,
    })
  const handleCardClick = (index: number, card: Card) => {
    if (revealedCards.includes(index)) {
      setSelectedCard(card)
      setLightBoxIsOpen(true)
    } else {
      updateRevealedCards(index)
    }
  }

  const cardRarityShadows = [
    { id: rarityMap.bronze.label, emoji: '🥉' },
    { id: rarityMap.silver.label, emoji: '🥈' },
    { id: rarityMap.gold.label, emoji: '🥇' },
    { id: rarityMap.logo.label, emoji: '📜' },
    { id: rarityMap.ruby.label, color: HexCodes.Ruby, emoji: '🔴' },
    { id: rarityMap.diamond.label, color: HexCodes.Diamond, emoji: '💎' },
    { id: rarityMap.hallOfFame.label, color: HexCodes.Gold, emoji: '🐐' },
    { id: rarityMap.twoThousandClub.label, color: HexCodes.Gold, emoji: '🎉' },
    { id: rarityMap.award.label, color: HexCodes.Award, emoji: '🏆' },
    { id: rarityMap.firstOverall.label, color: HexCodes.Gold, emoji: '☝️' },
    { id: rarityMap.iihfAwards.label, color: HexCodes.Gold, emoji: '🌍' },
    { id: rarityMap.charity.label, color: HexCodes.Charity, emoji: '🎗️' },
  ]

  const updateRevealedCards = (index: number): void => {
    if (revealedCards.includes(index)) return
    setRevealedCards([...revealedCards, index])
  }

  const flipAllCards = (): void => {
    setRevealedCards(
      revealedCards.length === latestPackCards.length ? [] : [0, 1, 2, 3, 4, 5]
    )
  }

  const shareMessage = () => {
    const packID = latestPackCards[0]?.packID
    const emojis = latestPackCards
      .map((card) => {
        const rarity = cardRarityShadows.find(
          (shadow) => shadow.id === card.card_rarity
        )
        return rarity ? rarity.emoji : ''
      })
      .join(' ')

    const specialCardMessages = latestPackCards
      .filter((card) => card.totalCardQuantity === 1 || card.quantity === 1)
      .map((card) => {
        if (card.totalCardQuantity === 1) {
          return `First pull of ${card.card_rarity} ${card.player_name}! 🌟`
        }
        if (card.quantity === 1 && card.totalCardQuantity > 1) {
          return `My first ${card.card_rarity} ${card.player_name}! 🆕`
        }
        return null
      })
      .filter(Boolean)

    const specialCardText =
      specialCardMessages.length > 0
        ? '\n' + specialCardMessages.join('\n')
        : ''

    const message = `I opened pack #${packID} \n ${emojis}${specialCardText}\nCheck out my cards: https://cards.simulationhockey.com/packs/${packID}`

    navigator.clipboard.writeText(message).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: 'Share with friends on discord or chirper!',
        ...successToastOptions,
      })
    })
  }

  if (useOpenPackIsSuccess) {
    Router.reload()
  }
  React.useEffect(() => {
    if (useOpenPackIsError) {
      toast({
        title: 'Pack Opening Error',
        description: 'Unable to open the pack. Please try again.',
        ...errorToastOptions,
      })
    }
  }, [useOpenPackIsError])

  if (isLoading || isError || latestPackCards.length === 0) return null
  return (
    <PageWrapper>
      <div className="h-full w-full m-1">
        <NextSeo title="Last Pack" />
        <Breadcrumb>
          <ChevronLeftIcon color="gray.500" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/packs">Return to Packs</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="flex flex-row items-center justify-start space-x-2 pt-3">
          {firstPack ? (
            <Tooltip label="Open a new pack">
              <Button
                isDisabled={useOpenPackIsLoading || packsLoading}
                onClick={() => OpenNextPack(firstPack)}
                position="relative"
              >
                {(useOpenPackIsLoading || packsLoading) && (
                  <Spinner size="sm" mr={2} />
                )}
                Open Another {type} Pack
              </Button>
            </Tooltip>
          ) : (
            <Button isDisabled>No More {type} Packs to Open</Button>
          )}
          <Button disabled={false} onClick={flipAllCards}>
            Flip All Cards
          </Button>
          <Button onClick={shareMessage} colorScheme="teal">
            Share
          </Button>
        </div>

        <div className="m-2" style={{ height: 'calc(100vh-64px)' }}>
          <div className="flex justify-center items-start h-full">
            <div className="px-8 flex h-full flex-col sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto py-6 no-scrollbar">
              {latestPackCards.map((card, index) => (
                <div
                  className="relative flex flex-col items-center hover:scale-105 hover:shadow-xl"
                  key={`${card.cardID}-${index}`}
                  onClick={() => handleCardClick(index, card)}
                >
                  <ReactCardFlip isFlipped={revealedCards.includes(index)}>
                    <img
                      width="320"
                      height="440"
                      key={index}
                      draggable={false}
                      className={`rounded-sm transition-all duration-200 cursor-pointer select-none`}
                      style={{
                        boxShadow: `${
                          revealedCards.includes(index)
                            ? `0px 0px 16px 10px ${cardRarityShadows.find(
                                (shadow) => shadow.id === card.card_rarity
                              )?.color}`
                            : 'none'
                        }`,
                      }}
                      src={`/cardback.png`}
                      onClick={() => updateRevealedCards(index)}
                    />
                    <img
                      width="320"
                      height="440"
                      key={index}
                      draggable={false}
                      className={`rounded-sm transition-all duration-200 select-none`}
                      style={{
                        boxShadow: `${
                          revealedCards.includes(index)
                            ? `0px 0px 16px 10px ${cardRarityShadows.find(
                                (shadow) => shadow.id === card.card_rarity
                              )?.color}`
                            : 'none'
                        }`,
                      }}
                      src={`${pathToCards}${card.image_url}`}
                    />
                  </ReactCardFlip>

                  {/* Show badge only when the card is not flipped */}
                  {revealedCards.includes(index) &&
                    card.quantity === 1 && ( // Check for quantity and show badge
                      <Badge
                        colorScheme="green"
                        variant="outline"
                        border="2px solid"
                        borderColor="green.500"
                        className="shine-effect mt-2" // Added margin-top for spacing
                      >
                        New Card
                      </Badge>
                    )}
                  {revealedCards.includes(index) &&
                    card.totalCardQuantity === 1 && ( // If first ever card thats been opened
                      <Tooltip
                        label="First pull of this card"
                        aria-label="First pull explanation"
                        hasArrow
                        placement="top"
                      >
                        <Badge
                          colorScheme="yellow"
                          variant="outline"
                          border="2px solid"
                          borderColor="yellow.500"
                          className="shine-effect-gold mt-2"
                        >
                          First Pull
                        </Badge>
                      </Tooltip>
                    )}
                </div>
              ))}
              {lightBoxIsOpen && (
                <CardLightBoxModal
                  cardName={selectedCard.player_name}
                  cardImage={selectedCard.image_url}
                  owned={selectedCard.quantity}
                  rarity={selectedCard.card_rarity}
                  playerID={selectedCard.playerID}
                  cardID={selectedCard.cardID}
                  userID={String(user?.uid)}
                  setShowModal={() => setLightBoxIsOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default LastOpenedPack
