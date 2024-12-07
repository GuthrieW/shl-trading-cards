import React from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react'
import { PackInfoWithCover } from '@pages/shop/index'
import { warningToastOptions } from '@utils/toast'

type BuyPackModalProps = {
  isOpen: boolean
  onClose: () => void
  onAccept: (packId: string) => void
  pack: PackInfoWithCover
}

const BuyPackModal = ({
  isOpen,
  onClose,
  onAccept,
  pack,
}: BuyPackModalProps) => {
  const toast = useToast()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="bg-primary text-secondary">{`${pack.label} - ${pack.priceLabel}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="bg-primary text-secondary">
          <div className="flex flex-col justify-center items-center bg-primary text-secondary">
            <div className="w-1/2 flex flex-col justify-center items-center">
              <img
                className="select-none"
                src={pack.cover}
                alt={`${pack.label} Pack`}
              />
            </div>
            <p>{pack.description}</p>
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
                      title: 'max packs purchased',
                      description: 'Please try again tomorrow.',
                      ...warningToastOptions,
                    })
                : () => onAccept(pack.id)
            }
          >
            Buy Pack
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BuyPackModal
