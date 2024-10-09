import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image, Text } from '@chakra-ui/react'
import { packService, PackInfo } from 'services/packService'
import { UserPackWithCover } from '@pages/packs'

type OpenPackModalProps = {
  onAccept: (packID: number) => void
  setShowModal: (show: boolean) => void
  pack: UserPackWithCover
}

const getPackTypeData = (pack: UserPackWithCover) => {
  if (pack.packType === packService.packs.base.id) {
    return packService.packs.base
  }
}

const OpenPackModal = ({
  onAccept,
  setShowModal,
  pack,
}: OpenPackModalProps) => {
  const packTypeData = getPackTypeData(pack)

  return (
    <Modal isOpen={true} blockScrollOnMount={false} onClose={() => setShowModal(false)}>
      <ModalOverlay />
      <ModalContent className='bg-primary text-secondary'>
        <ModalHeader className='bg-primary text-secondary'>
          <div className= 'select-none'>{packTypeData.label}</div>
        </ModalHeader>
        <ModalBody className="flex flex-col justify-center items-center bg-primary text-secondary">
          <Image src={pack.cover} alt={packTypeData.label} className="select-none" />
          <Text mt={2}>{packTypeData.description}</Text>
        </ModalBody>
        <ModalFooter className="flex justify-end bg-primary text-secondary">
          <Button
            variant="ghost"
            colorScheme="red"
            className='border-2 border-secondary'
            onClick={() => setShowModal(false)}
            mr={2}
          >
            Open Later
          </Button>
          <Button
            colorScheme="green"
            onClick={() => onAccept(Number(pack.packID) )}
          >
            Open Pack
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default OpenPackModal
