import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Text,
  Spinner,
} from '@chakra-ui/react'
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
  if (pack.packType === packService.packs.ruby.id) {
    return packService.packs.ruby
  }
}

const OpenPackModal = ({
  onAccept,
  setShowModal,
  pack,
}: OpenPackModalProps) => {
  const [isOpening, setIsOpening] = useState(false)
  const packTypeData = getPackTypeData(pack)

  const handleOpenPack = () => {
    setIsOpening(true)
    onAccept(Number(pack.packID))
  }

  return (
    <Modal
      isOpen={true}
      blockScrollOnMount={false}
      onClose={() => setShowModal(false)}
      size={{ base: 'xs', sm: 'sm', md: 'sm', lg: 'sm' }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="bg-primary text-secondary">
          <div className="select-none">{packTypeData.label}</div>
        </ModalHeader>
        <ModalBody className="flex flex-col justify-center items-center bg-primary text-secondary">
          <Image
            src={pack.cover}
            alt={packTypeData.label}
            className="select-none w-full max-w-xs sm:max-w-sm"
          />
          <Text mt={2} className="text-sm md:text-base">
            {packTypeData.description}
          </Text>
        </ModalBody>
        <ModalFooter className="flex justify-end bg-primary text-secondary">
          <Button
            variant="ghost"
            colorScheme="red"
            className="border-2 border-secondary"
            onClick={() => setShowModal(false)}
            mr={2}
            isDisabled={isOpening}
          >
            Open Later
          </Button>
          <Button
            colorScheme="green"
            onClick={handleOpenPack}
            isDisabled={isOpening}
            className={isOpening ? 'opacity-50' : ''}
          >
            {isOpening ? (
              <>
                {' '}
                <Spinner size="md" color="black" /> <div> Opening... </div>
              </>
            ) : (
              'Open Pack'
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default OpenPackModal
