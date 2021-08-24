import { GridList, GridListTile } from '@material-ui/core'
import React from 'react'
type StaticPackViewerProps = {
  cards: [any]
}

const StaticPackViewer = (props: StaticPackViewerProps) => {
  const { cards = [] } = props
  return (
    <GridList>
      {cards.map((card, index) => {
        return (
          <GridListTile key={index}>
            <img src={card.imageUrl} />
          </GridListTile>
        )
      })}
    </GridList>
  )
}

export default StaticPackViewer
