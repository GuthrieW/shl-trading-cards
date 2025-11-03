import React, { useMemo } from 'react'
import { Box, VStack, Flex, Button, HStack } from '@chakra-ui/react'
import RemoveButton from './RemoveButton'
import { pluralizeName } from 'lib/pluralize-name'
import { TradeCard } from '@pages/api/v3/trades/collection/[uid]'
import { TradeSummaryBox } from './TradeSummaryBox'
import TradeCardSection from './TradeCardsSection'

interface NewTradeSectionProps {
  isSubmittingTrade: boolean
  loggedInUserCardsToTrade: TradeCard[]
  partnerUserCardsToTrade: TradeCard[]
  tradePartnerUser: { username: string }
  isMobile: boolean
  openDrawer: (uid: string) => void
  uid: string
  tradePartnerUid: string
  handleSubmitTrade: () => void
  handleResetTradeCards: () => void
  removeCardFromTrade: (card: TradeCard, isLoggedInUser: boolean) => void
  userCardQuantities?: Record<number, number>
  partnerCardQuantities?: Record<number, number>
}

interface CardStats {
  total: number
  byRarity: Record<string, number>
}

const calculateCardStats = (cards: TradeCard[]): CardStats => {
  const byRarity: Record<string, number> = {}

  cards.forEach((card) => {
    byRarity[card.card_rarity] = (byRarity[card.card_rarity] || 0) + 1
  })

  return {
    total: cards.length,
    byRarity,
  }
}

export const NewTradeSection: React.FC<NewTradeSectionProps> = ({
  isSubmittingTrade,
  loggedInUserCardsToTrade,
  partnerUserCardsToTrade,
  tradePartnerUser,
  isMobile,
  openDrawer,
  uid,
  tradePartnerUid,
  handleSubmitTrade,
  handleResetTradeCards,
  removeCardFromTrade,
  userCardQuantities,
  partnerCardQuantities,
}) => {
  const userStats = useMemo(
    () => calculateCardStats(loggedInUserCardsToTrade),
    [loggedInUserCardsToTrade]
  )

  const partnerStats = useMemo(
    () => calculateCardStats(partnerUserCardsToTrade),
    [partnerUserCardsToTrade]
  )

  const canSubmitTrade =
    !isSubmittingTrade &&
    loggedInUserCardsToTrade.length > 0 &&
    partnerUserCardsToTrade.length > 0

  return (
    <Box>
      <VStack spacing={4} mb={6} className="mt-2">
        <Flex
          direction={['column', 'column', 'row']}
          width="100%"
          gap={2}
          justifyContent="space-between"
        >
          <HStack spacing={2} width={['100%', '100%', 'auto']}>
            <Button
              onClick={() => openDrawer(uid)}
              isDisabled={isSubmittingTrade}
              width={['100%', '100%', 'auto']}
              fontSize={{ base: 'xs', sm: 'sm' }}
            >
              Open My Cards
            </Button>
            <Button
              onClick={() => openDrawer(tradePartnerUid)}
              isDisabled={isSubmittingTrade}
              width={['100%', '100%', 'auto']}
              fontSize={{ base: 'xs', sm: 'sm' }}
            >
              Open {pluralizeName(tradePartnerUser?.username)} Cards
            </Button>
          </HStack>

          <HStack spacing={2} width={['100%', '100%', 'auto']}>
            <Button
              colorScheme="green"
              isDisabled={!canSubmitTrade}
              onClick={handleSubmitTrade}
              width={['100%', '100%', 'auto']}
            >
              Submit Trade
            </Button>
            <Button
              colorScheme="red"
              onClick={handleResetTradeCards}
              isDisabled={isSubmittingTrade}
              width={['100%', '100%', 'auto']}
            >
              Reset Trade
            </Button>
          </HStack>
        </Flex>
      </VStack>

      <Flex direction={['column', 'column', 'row']} gap={4} align="stretch">
        <Box flex="1">
          <TradeSummaryBox
            title="Your Cards to Trade"
            totalCards={userStats.total}
            cardsByRarity={userStats.byRarity}
          />
          <TradeCardSection<TradeCard>
            title="Your Cards"
            cards={loggedInUserCardsToTrade}
            isInteractive={true}
            isMobile={isMobile}
            cardQuantities={userCardQuantities}
            showLastCopyWarning={true}
            isMyCardsSection={true}
            renderCardOverlay={(card) => (
              <div className="absolute top-2 right-2 z-20">
                <RemoveButton
                  onClick={removeCardFromTrade}
                  isLoggedInUser={true}
                  card={card}
                  rightSide={0}
                  size={isMobile ? 'xs' : 'sm'}
                />
              </div>
            )}
          />
        </Box>

        <Box flex="1">
          <TradeSummaryBox
            title={`${pluralizeName(
              tradePartnerUser?.username
            )} Cards to Trade`}
            totalCards={partnerStats.total}
            cardsByRarity={partnerStats.byRarity}
          />
          <TradeCardSection<TradeCard>
            title={`${pluralizeName(tradePartnerUser?.username)} Cards`}
            cards={partnerUserCardsToTrade}
            isInteractive={true}
            isMobile={isMobile}
            cardQuantities={partnerCardQuantities}
            showLastCopyWarning={true}
            isMyCardsSection={false}
            renderCardOverlay={(card) => (
              <div className="absolute top-2 right-2 z-20">
                <RemoveButton
                  onClick={removeCardFromTrade}
                  isLoggedInUser={false}
                  card={card}
                  rightSide={0}
                  size={isMobile ? 'xs' : 'sm'}
                />
              </div>
            )}
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default NewTradeSection
