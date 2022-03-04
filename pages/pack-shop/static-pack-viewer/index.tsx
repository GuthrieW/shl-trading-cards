import { Grid } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import { pathToCards } from '@constants/index'

type StaticPackViewerProps = {
  cards: Card[]
}

const GridContainer = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px;
  margin-top: 16px;
`

const StyledGridItem = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledImage = styled.img`
  margin-bottom: 16px;
  padding: 10;
  max-width: 100%;
  max-height: 100%;
`

const GridItem = ({ children }) => (
  <StyledGridItem item xs={12} sm={6} md={4} lg={4}>
    {children}
  </StyledGridItem>
)

const StaticPackViewer = ({ cards }: StaticPackViewerProps) => (
  <GridContainer container>
    {cards &&
      cards.map((card, index) => {
        return (
          <GridItem key={index}>
            <StyledImage
              width={300}
              height={400}
              src={`${pathToCards}${card.image_url}`}
            />
          </GridItem>
        )
      })}
  </GridContainer>
)

export default StaticPackViewer
