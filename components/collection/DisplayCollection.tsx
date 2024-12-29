import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Skeleton,
  VStack,
  Wrap,
  WrapItem,
  Progress,
  Text,
} from '@chakra-ui/react'
import { Fragment } from 'react'
import { SiteUniqueCards, UserUniqueCollection } from '@pages/api/v3'

interface DisplayCollectionProps {
  siteUniqueCards: SiteUniqueCards[]
  userUniqueCards: UserUniqueCollection[]
  isLoading: boolean
}

const DisplayCollection = ({
  siteUniqueCards = [],
  userUniqueCards = [],
  isLoading,
}: DisplayCollectionProps) => {
  const getUserOwnedCount = (rarity: string) => {
    const userCard = userUniqueCards.find((card) => card.card_rarity === rarity)
    return userCard
      ? { owned_count: userCard.owned_count, rarity_rank: userCard.rarity_rank }
      : { owned_count: 0, rarity_rank: 0 }
  }

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="2" textAlign="left" fontWeight="bold" fontSize="lg">
              Collection Sets
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {isLoading ? (
            <VStack>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} height="40px" width="100%" />
              ))}
            </VStack>
          ) : (
            <Fragment>
              <Wrap spacing={4} mt={2}>
                {siteUniqueCards.map((siteCard) => {
                  const { owned_count, rarity_rank } = getUserOwnedCount(
                    siteCard.card_rarity
                  )
                  const totalCount = siteCard.total_count
                  const progressValue = (owned_count / totalCount) * 100
                  const isComplete = owned_count === totalCount

                  return (
                    <WrapItem key={siteCard.card_rarity} width="100%">
                      <Box width="100%">
                        <div className="font-bold mb-1">
                          {siteCard.card_rarity}: {owned_count} / {totalCount} [
                          #{rarity_rank} Global]
                        </div>
                        <Progress
                          value={progressValue}
                          colorScheme={isComplete ? 'green' : 'blue'}
                          borderRadius="md"
                          hasStripe
                        />
                      </Box>
                    </WrapItem>
                  )
                })}
              </Wrap>
            </Fragment>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default DisplayCollection
