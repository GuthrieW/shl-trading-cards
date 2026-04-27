import { Badge, Button } from '@chakra-ui/react'
import ImageWithFallback from '@components/images/ImageWithFallback'
import { RARITY_CONFIG, DEFAULT_RARITY } from '@utils/marketplace-rarity-maps'
import React from 'react'

interface Props {
  card: MarketplaceCard
  index: number
  onOpenLightbox: (card: MarketplaceCard) => void
  onSelectCard: (card: MarketplaceCard) => void
}

export default function MarketplaceCard({
  card,
  index,
  onOpenLightbox,
  onSelectCard,
}: Props) {
  const rarity = RARITY_CONFIG[card.card_rarity] ?? DEFAULT_RARITY

  return (
    <div
      key={`${card.cardID}-${index}`}
      className="relative rounded-lg overflow-hidden transition-all duration-250 cursor-pointer border border-border-secondary bg-secondary"
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = rarity.accent
        el.style.boxShadow = `0 12px 40px -10px ${rarity.glow}`
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = ''
        el.style.boxShadow = ''
        el.style.transform = ''
      }}
      onClick={() => onOpenLightbox(card)}
    >
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-border-secondary gap-y-1">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              backgroundColor: rarity.accent,
              boxShadow: `0 0 6px ${rarity.accent}`,
            }}
          />
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: rarity.accent }}
          >
            {rarity.label}
          </span>
        </div>

        <Badge className="!text-xs rounded-full border bg-primary sm:ml-auto">
          {card.quantity === 0 ? 'New' : `${card.quantity} Owned`}
        </Badge>
      </div>

      <div className="relative aspect-[3/4] w-full">
        <ImageWithFallback
          className={`cursor-pointer ${card.purchased ? 'grayscale' : ''}`}
          src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
          alt={`${card.player_name} Card`}
          loading="lazy"
          fill
          sizes="(max-width: 768px) 100vw, 256px"
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none bg-gradient-to-t from-background-secondary to-transparent" />
      </div>

      <div className="px-3 pb-3 pt-2 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs tracking-widest uppercase text-text-tertiary">
                Price
              </p>

              <p
                className="text-lg font-bold tracking-wide"
                style={{ color: rarity.accent }}
              >
                ${card.cost.toLocaleString()}
              </p>
            </div>

            <Button
              isDisabled={card.purchased}
              className="w-full sm:w-auto py-2 sm:py-1.5 px-4 rounded text-sm font-bold tracking-widest uppercase border transition-all duration-200"
              style={{
                borderColor: rarity.accent,
                color: rarity.accent,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = rarity.accent
                el.style.color = 'var(--color-background-secondary)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = 'transparent'
                el.style.color = rarity.accent
              }}
              onClick={(e) => {
                e.stopPropagation()
                onSelectCard(card)
              }}
            >
              Buy
            </Button>
          </div>

          {card.quantity === 0 && (
            <div
              className="text-xs font-black tracking-widest uppercase text-center py-0.5 rounded"
              style={{
                backgroundColor: rarity.accent,
              }}
            >
              Not Owned
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
