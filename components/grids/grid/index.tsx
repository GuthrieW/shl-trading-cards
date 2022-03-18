import pathToCards from '@constants/path-to-cards'
import React from 'react'

type GridProps = {
  cards: any[]
  prepareCell: Function
  onCellClick: Function
}

const Grid = ({ cards, prepareCell, onCellClick }: GridProps) => (
  <div className="my-2 rounded-md overflow-x-hidden overflow-y-auto">
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => {
        prepareCell(card)
        const cardValues: Card = card.values
        return (
          <img
            className="m-1"
            onClick={() => onCellClick(cardValues)}
            src={`${pathToCards}${cardValues.image_url}`}
          />
        )
      })}
    </div>
  </div>
)

export default Grid
