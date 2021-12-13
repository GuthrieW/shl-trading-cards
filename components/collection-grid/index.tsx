import React from 'react'
import { Badge, Box, Grid } from '@material-ui/core'
import styled from 'styled-components'
import { ViewCardModal } from '@components/index'

type CollectionGridProps = {
  filteredCards: Card[]
  pageNumber: number
  cardsPerPage: number
  handleOpenCard: Function
  handleCloseCard: any
  open: boolean
  currentCard: Card
}

const GridContainer = styled(Grid)`
  margin: 0px;
  margin-top: 16px;
`

const StyledImage = styled.img`
  margin-bottom: 16px;
  padding: 10;
  max-width: 100%;
  max-height: 100%;
`

const GridItem = ({ children }) => (
  <Grid item xs={12} sm={6} md={4} lg={3}>
    {children}
  </Grid>
)

const CollectionGrid = ({
  filteredCards,
  pageNumber,
  cardsPerPage,
  handleOpenCard,
  handleCloseCard,
  open,
  currentCard,
}: CollectionGridProps) => (
  <GridContainer container>
    {filteredCards.length > 0 &&
      filteredCards
        .slice((pageNumber - 1) * cardsPerPage, pageNumber * cardsPerPage)
        .map((card) => {
          const numberOfDuplicates = filteredCards.filter(
            (collectionCard) => collectionCard.player_name === card.player_name
          ).length

          return card ? (
            <GridItem>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Badge
                  badgeContent={numberOfDuplicates ? numberOfDuplicates : null}
                  color={'primary'}
                >
                  <StyledImage
                    onClick={() => handleOpenCard(card)}
                    width={300}
                    height={400}
                    src={card.image_url}
                  />
                </Badge>
              </Box>
            </GridItem>
          ) : null
        })}
    <ViewCardModal
      open={open}
      handleCardClose={handleCloseCard}
      card={currentCard}
    />
  </GridContainer>
)

export default CollectionGrid
