import Button from '@components/buttons/button'
import pathToCards from '@constants/path-to-cards'
import Router from 'next/router'
import React from 'react'

type CardOwnerCardProps = {
  card: Card
  user: TradeUser
}

const CardOwnerCard = ({ card, user }: CardOwnerCardProps) => (
  <div className="w-full flex flex-col justify-between m-1">
    <img
      className="rounded-sm h-72 m-1"
      src={`${pathToCards}${card.image_url}`}
      alt={card.player_name}
      loading="lazy"
    />

    <Button
      disabled={false}
      onClick={() => Router.push(`/trade-hub/${user.userID}`)}
    >
      Trade With {user.username}
    </Button>
  </div>
)

export default CardOwnerCard
