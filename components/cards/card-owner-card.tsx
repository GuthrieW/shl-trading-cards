import Button from '@components/buttons/button'
import TradingCard from '@components/images/trading-card'
import { CardOwner } from '@pages/api/queries/use-get-card-owners'
import Router from 'next/router'
import React from 'react'

type CardOwnerCardProps = {
  cardOwner: CardOwner
}

const CardOwnerCard = ({ cardOwner }: CardOwnerCardProps) => (
  <div className="w-full flex flex-col justify-between items-center m-1">
    <TradingCard
      source={cardOwner.image_url}
      rarity={cardOwner.card_rarity}
      playerName={cardOwner.player_name}
    />

    <div className="mt-1">
      <Button
        disabled={false}
        onClick={() => Router.push(`/trade-hub/${cardOwner.userID}`)}
      >
        Trade with {cardOwner.username}
      </Button>
    </div>
  </div>
)

export default CardOwnerCard
