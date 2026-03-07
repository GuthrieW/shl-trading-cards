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
import { warningToastOptions } from '@utils/toast'
import ImageWithFallback from '@components/images/ImageWithFallback'

type BuyCardModalProps = {
  isOpen: boolean
  onClose: () => void
  onBuy: (card: MarketplaceCard) => void
  card: MarketplaceCard
}

const BuyCardModal = ({ isOpen, onClose, onBuy, card }: BuyCardModalProps) => {
  const toast = useToast()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="bg-primary text-secondary">{`${
          card.player_name
        } - $${card.cost.toLocaleString()}`}</ModalHeader>
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
        </ModalBody>

        <ModalFooter className="bg-primary text-secondary">
          <Button
            colorScheme="red"
            className="font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 select-none"
            mr={3}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            colorScheme="green"
            disabled={false}
            className="font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 select-none"
            onClick={
              false
                ? () =>
                    toast({
                      title: 'Couldnt buy card',
                      description: 'Please try again.',
                      ...warningToastOptions,
                    })
                : () => onBuy(card)
            }
          >
            Buy Card
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BuyCardModal
