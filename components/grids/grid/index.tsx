import pathToCards from '@constants/path-to-cards'
import React from 'react'

type GridProps = {
  cards: any[]
  prepareCell: Function
  onCellClick: Function
}

const Grid = ({ cards, prepareCell, onCellClick }: GridProps) => (
  <div className="my-2 rounded-md overflow-x-hidden overflow-y-auto">
    <div className="m-4 grid grid-cols-6 gap-8">
      {cards.map((card) => {
        prepareCell(card)
        const cardValues: CollectionCard = card.values
        return (
          <div className="relative inline-block ">
            <img
              className="w-full h-full cursor-pointer transition ease-linear shadow-none hover:scale-105 hover:shadow-xl rounded-sm"
              onClick={() => onCellClick(cardValues)}
              src={`${pathToCards}${cardValues.image_url}`}
            />
            {cardValues.quantity > 1 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-full">
                {cardValues.quantity}
              </span>
            )}
          </div>
        )
      })}
    </div>
  </div>
)

export default Grid
