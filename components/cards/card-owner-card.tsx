import Button from '@components/buttons/button'
import TradingCard from '@components/images/trading-card'
import Router from 'next/router'
import React from 'react'

type CardOwnerCardProps = {
  card: Card
  user: TradeUser
}

const CardOwnerCard = ({ card, user }: CardOwnerCardProps) => (
  <div className="w-full flex flex-col justify-between items-center m-1">
    <TradingCard
      source={card.image_url}
      rarity={card.card_rarity}
      playerName={card.player_name}
    />

    <div className="mt-1">
      <Button
        disabled={false}
        onClick={() => Router.push(`/trade-hub/${user.userID}`)}
      >
        Trade with {user.username}
      </Button>
    </div>
  </div>
)

export default CardOwnerCard
