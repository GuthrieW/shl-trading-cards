import pathToCards from '@constants/path-to-cards'
import React from 'react'
import Modal from '../modal'

type CardLightBoxModalProps = {
  setShowModal: Function
  cardName: string
  cardImage: string
}

const THRESHOLD = 30

const CardLightBoxModal = ({
  setShowModal,
  cardName,
  cardImage,
}: CardLightBoxModalProps) => {
  const cardImageRef = React.useRef<HTMLImageElement>(null)
  const shineRef = React.useRef<HTMLDivElement>(null)
  return (
    <Modal setShowModal={setShowModal}>
      {cardImage && (
        <div
          className="w-full h-full relative motion-reduce:hover:transform-none"
          style={{ transformStyle: 'preserve-3d' }}
          onMouseMove={(event) => {
            const mouseX =
              event.nativeEvent.offsetX - cardImageRef.current.clientWidth / 2
            const mouseY =
              event.nativeEvent.offsetY - cardImageRef.current.clientHeight / 2

            cardImageRef.current.style.transform = `perspective(${
              cardImageRef.current.clientWidth
            }px) rotateX(${-mouseY / THRESHOLD}deg) rotateY(${
              mouseX / THRESHOLD
            }deg) scale3d(1, 1, 1)`
            shineRef.current.style.transform = `perspective(${
              cardImageRef.current.clientWidth
            }px) rotateX(${-mouseY / THRESHOLD}deg) rotateY(${
              mouseX / THRESHOLD
            }deg) scale3d(1, 1, 1)`
            shineRef.current.style.background = `radial-gradient(circle at ${event.nativeEvent.offsetX}px ${event.nativeEvent.offsetY}px, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 100%)`
          }}
          onMouseLeave={(event) => {
            cardImageRef.current.style.transform = `perspective(${cardImageRef.current.clientWidth}px) rotateX(0deg) rotateY(0deg)`
            shineRef.current.style.transform = `perspective(${cardImageRef.current.clientWidth}px) rotateX(0deg) rotateY(0deg)`
            shineRef.current.style.background = 'none'
          }}
        >
          <img
            ref={cardImageRef}
            id="card-image"
            className="w-full h-full rounded-sm shadow-lg motion-reduce:hover:transform-none"
            style={{
              transformStyle: 'preserve-3d',
            }}
            alt={cardName}
            src={`${pathToCards}${cardImage}`}
          />
          <div
            ref={shineRef}
            id="shine"
            style={{
              transformStyle: 'preserve-3d',
            }}
            className="absolute w-full h-full top-0 left-0 motion-reduce:hover:transform-none motion-reduce:background-none motion-reduce:hover:background-none"
          />
        </div>
      )}
    </Modal>
  )
}

export default CardLightBoxModal
