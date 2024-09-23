import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Box,
  Skeleton,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { SiteUniqueCards, UserUniqueCollection } from '@pages/api/v3';

interface DisplayCollectionProps {
  siteUniqueCards: SiteUniqueCards[];
  userUniqueCards: UserUniqueCollection[];
  isLoading: boolean;
}

const DisplayCollection = ({ siteUniqueCards = [], userUniqueCards = [], isLoading }: DisplayCollectionProps) => {
  const getUserOwnedCount = (rarity: string) => {
    const userCard = userUniqueCards.find((card) => card.card_rarity === rarity);
    return userCard ? userCard.owned_count : 0;
  };

  const getDynamicBadgeColor = (ownedCount: number, totalCount: number) => {
    const percentage = (ownedCount / totalCount) * 100;
    const red = Math.floor((1 - percentage / 110) * 150);
    const green = Math.floor((percentage / 110) * 150);

    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="2" textAlign="left" fontWeight="bold" fontSize="lg">
              Card Rarities
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
                  const ownedCount = getUserOwnedCount(siteCard.card_rarity);
                  const badgeColor = getDynamicBadgeColor(ownedCount, siteCard.total_count);
                  const isComplete = ownedCount === siteCard.total_count;

                  return (
                    <WrapItem key={siteCard.card_rarity}>
                      <Badge
                        backgroundColor={badgeColor}
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="md"
                        fontSize="md"
                        border={isComplete ? "2px solid black" : "2px solid transparent"}
                      >
                        {siteCard.card_rarity}: {ownedCount} / {siteCard.total_count}
                      </Badge>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </Fragment>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default DisplayCollection;
