import {
  Box,
  VStack,
  Flex,
  Badge,
  SimpleGrid,
  Tooltip,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import ImageWithFallback from '@components/images/ImageWithFallback'
import Link from 'next/link'
import { useMemo } from 'react'

const TradeSection = ({
  id,
  title,
  cards,
  cardsInfo,
  cardsInTrades,
  cardsInTradesLoading,
  loggedInID = 0,
}: {
  id?: string
  title: string
  cards: TradeDetails[]
  cardsInfo?: Record<string, number>
  cardsInTrades: DuplicateCardsIntrades[]
  cardsInTradesLoading: boolean
  loggedInID?: number
}) => {
  const { initiatorAlerts, recipientAlerts } = useMemo(() => {
    const initiatorLastCopy = new Set<number>()
    const initiatorAlreadyOwn = new Set<number>()
    const recipientLastCopy = new Set<number>()
    const recipientAlreadyOwn = new Set<number>()

    const cardQuantities = new Map<
      number,
      {
        initiatorTrading: number
        recipientTrading: number
        initiatorOwned: number
        recipientOwned: number
      }
    >()

    cards.forEach((card) => {
      const existing = cardQuantities.get(card.cardID)
      if (existing) {
        existing.initiatorTrading += card.initiatorID === card.fromID ? 1 : 0
        existing.recipientTrading += card.recipientID === card.fromID ? 1 : 0
      } else {
        cardQuantities.set(card.cardID, {
          initiatorTrading: card.initiatorID === card.fromID ? 1 : 0,
          recipientTrading: card.recipientID === card.fromID ? 1 : 0,
          initiatorOwned: card.initiator_quantity,
          recipientOwned: card.recipient_quantity,
        })
      }
    })

    cardQuantities.forEach((quantities, cardID) => {
      if (
        quantities.initiatorOwned > 0 &&
        quantities.initiatorOwned === quantities.initiatorTrading
      ) {
        initiatorLastCopy.add(cardID)
      }
      if (quantities.recipientTrading > 0 && quantities.initiatorOwned > 0) {
        initiatorAlreadyOwn.add(cardID)
      }

      if (
        quantities.recipientOwned > 0 &&
        quantities.recipientOwned === quantities.recipientTrading
      ) {
        recipientLastCopy.add(cardID)
      }
      if (quantities.initiatorTrading > 0 && quantities.recipientOwned > 0) {
        recipientAlreadyOwn.add(cardID)
      }
    })
    return {
      initiatorAlerts: initiatorLastCopy,
      recipientAlerts: {
        lastCopy: recipientLastCopy,
        alreadyOwn: recipientAlreadyOwn,
      },
    }
  }, [cards])

  const shouldShowCardsInTrades = useMemo(
    () => loggedInID > 0 && cards.length > 0 && cards[0].fromID === loggedInID,
    [loggedInID, cards]
  )

  const cardsInOtherTradesMap = useMemo(() => {
    const map = new Map<number, Set<number>>()
    if (!cardsInTrades) return map

    cardsInTrades.forEach((item) => {
      if (!map.has(item.cardID)) {
        map.set(item.cardID, new Set())
      }
      map.get(item.cardID)?.add(item.tradeID)
    })
    return map
  }, [cardsInTrades])
  return (
    <div className="flex-1">
      <Box mb={3} rounded="lg" shadow="md" overflow="hidden" borderWidth="1px">
        <VStack spacing={2} p={2} align="stretch">
          <Flex align="center" justify="space-between">
            <div className="text-sm font-semibold text-secondary">
              Total Cards:
            </div>
            <Badge colorScheme="blue" fontSize="sm" px={2}>
              {cardsInfo && Object.values(cardsInfo).reduce((a, b) => a + b, 0)}
            </Badge>
          </Flex>

          {cardsInfo && Object.keys(cardsInfo).length > 0 && (
            <Box>
              <SimpleGrid columns={{ base: 3, sm: 5 }}>
                {Object.entries(cardsInfo).map(([rarity, count]) => (
                  <Flex
                    key={rarity}
                    justify="space-between"
                    px={2}
                    py={1}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                  >
                    <div className="text-xs">{rarity}</div>
                    <div className="text-xs font-medium">{count}</div>
                  </Flex>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Box>
      <div
        id={id}
        className="flex-1 bg-primary rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-primary shadow-sm">
          <div className="text-xl text-secondary text-center">
            {title} aquires
          </div>
        </div>

        <SimpleGrid
          columns={{ base: 2, sm: 2, md: 3 }}
          spacing={4}
          className="p-6"
        >
          {cards.map((card) => {
            const isInOtherTrade =
              shouldShowCardsInTrades &&
              cardsInOtherTradesMap.has(card.cardID) &&
              (cardsInOtherTradesMap.get(card.cardID)?.size ?? 0) > 0

            return (
              <div
                key={card.ownedcardid}
                className={`relative group flex flex-col items-center transition-all duration-200 max-w-xs sm:max-w-sm aspect-[3/4]`}
              >
                <div className="relative w-full h-full">
                  <ImageWithFallback
                    src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                    alt={`Card`}
                    loading="lazy"
                    fill
                    sizes="(max-width: 768px) 100vw, 256px"
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                  {loggedInID > 0 && card.trade_status === 'PENDING' && (
                    <Tooltip label="# of card(s) you own" placement="top">
                      <Badge
                        position="absolute"
                        top="-2"
                        right="-2"
                        zIndex="10"
                        borderRadius="full"
                        px="2"
                        py="1"
                        fontSize="xs"
                        fontWeight="bold"
                        bg="teal.700"
                        color="white"
                        border="1px solid white"
                        boxShadow="0 0 4px rgba(0,0,0,0.4)"
                      >
                        {loggedInID === card.initiatorID
                          ? card.initiator_quantity
                          : card.recipient_quantity}
                      </Badge>
                    </Tooltip>
                  )}
                  <Badge
                    position="absolute"
                    bottom="2"
                    left="2"
                    zIndex="10"
                    borderRadius="full"
                    px="1"
                    py=".5"
                    fontSize="0.6rem"
                    fontWeight="bold"
                    bg="teal.700"
                    color="white"
                    border="1px solid white"
                    boxShadow="0 0 4px rgba(0,0,0,0.4)"
                  >
                    {card.card_rarity}
                  </Badge>
                </div>
                {isInOtherTrade && (
                  <Alert
                    status="warning"
                    variant="subtle"
                    mt="2"
                    className="!bg-primary"
                  >
                    ⚠
                    <span className="text-xs">
                      {Array.from(
                        cardsInOtherTradesMap.get(card.cardID) ?? []
                      ).map((tid, idx, arr) => (
                        <span key={tid}>
                          <Link
                            href={`/trade/${tid}`}
                            className="!hover:no-underline !text-link underline"
                          >
                            Also in Trade #{tid}
                          </Link>
                          {idx < arr.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </Alert>
                )}
                {loggedInID > 0 && card.trade_status === 'PENDING' && (
                  <>
                    {loggedInID === card.initiatorID &&
                      initiatorAlerts.has(card.cardID) && (
                        <Alert
                          status="warning"
                          variant="subtle"
                          mt="2"
                          className="!bg-primary"
                        >
                          <AlertIcon boxSize="12px" mr="1" />
                          <span className="text-xs">
                            You are trading away your last copy
                          </span>
                        </Alert>
                      )}

                    {loggedInID === card.recipientID &&
                      recipientAlerts.alreadyOwn.has(card.cardID) && (
                        <Alert
                          status="info"
                          variant="subtle"
                          mt="2"
                          className="!bg-primary"
                        >
                          <AlertIcon boxSize="12px" mr="1" />
                          <span className="text-xs">
                            You already own this card
                          </span>
                        </Alert>
                      )}

                    {loggedInID !== card.recipientID &&
                      recipientAlerts.lastCopy.has(card.cardID) && (
                        <Alert
                          status="warning"
                          variant="subtle"
                          mt="2"
                          className="!bg-primary"
                        >
                          <AlertIcon boxSize="12px" mr="1" />
                          <span className="text-xs">
                            Trade Partner is trading away their last copy
                          </span>
                        </Alert>
                      )}
                  </>
                )}
              </div>
            )
          })}
        </SimpleGrid>
      </div>
    </div>
  )
}

export default TradeSection
