import React from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useToast,
  ModalBody,
} from '@chakra-ui/react'
import ImageWithFallback from '@components/images/ImageWithFallback'
import { RARITY_CONFIG, DEFAULT_RARITY } from '@utils/marketplace-rarity-maps'

type BuyCardModalProps = {
  isOpen: boolean
  onClose: () => void
  onBuy: (card: MarketplaceCard) => void
  card: MarketplaceCard
  alreadyOwned?: number
  isLoading?: boolean
}

const BuyCardModal = ({
  isOpen,
  onClose,
  onBuy,
  card,
  alreadyOwned,
  isLoading,
}: BuyCardModalProps) => {
  const accentColor = RARITY_CONFIG[card.card_rarity] ?? DEFAULT_RARITY
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        className="rounded-lg overflow-hidden"
        style={
          accentColor.accent
            ? {
                border: `1px solid ${accentColor.accent}`,
                boxShadow: `0 0 24px -4px ${accentColor.accent}40`,
              }
            : undefined
        }
      >
        <ModalHeader
          className="bg-primary text-secondary border-b-8"
          style={{ borderBottomColor: accentColor.accent }}
        >
          Confirm Purchase
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="bg-primary text-secondary">
          <div className="relative aspect-[3/4] w-full">
            <ImageWithFallback
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

          <p className="text-center font-semibold mt-2">
            {card.player_name} — ${card.cost.toLocaleString()}
          </p>

          {alreadyOwned != null && alreadyOwned > 0 && (
            <p className="text-center text-sm text-gray-400 mt-1">
              You already own {alreadyOwned}{' '}
              {alreadyOwned === 1 ? 'copy' : 'copies'} of this card
            </p>
          )}
        </ModalBody>

        <ModalFooter className="bg-primary text-secondary">
          <Button
            colorScheme="red"
            className="font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 select-none"
            mr={3}
            onClick={onClose}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            colorScheme="green"
            disabled={false}
            className="font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 select-none"
            onClick={() => onBuy(card)}
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            Confirm Purchase
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BuyCardModal
