import React, { useRef, useEffect } from 'react'
import { useSpring, animated, to } from '@react-spring/web'
import { useGesture } from 'react-use-gesture'
import pathToCards from '@constants/path-to-cards'
import styles from './card-viewer.module.css'
import rarityMap from '@constants/rarity-map'
import { useResponsive } from '@hooks/useResponsive'
import TradingCard from '@components/images/trading-card'

export type MovableCard = {
  card: Card
}

const MovableCard = ({ card }: MovableCard) => {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const dimensions: { width: number; height: number } = isMobile
    ? { width: 211, height: 290 }
    : isTablet
      ? { width: 200, height: 276 }
      : isDesktop
        ? { width: 142, height: 195 }
        : { width: 320, height: 440 }

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault()
    document.addEventListener('gesturestart', preventDefault)
    document.addEventListener('gesturechange', preventDefault)

    return () => {
      document.removeEventListener('gesturestart', preventDefault)
      document.removeEventListener('gesturechange', preventDefault)
    }
  }, [])

  const cardRarityShadows = [
    { id: rarityMap.ruby.label, color: '#e0115f' },
    { id: rarityMap.diamond.label, color: '#45ACA5' },
    { id: rarityMap.hallOfFame.label, color: '#FFD700' },
    { id: rarityMap.award.label, color: '#FFD700' },
    { id: rarityMap.twoThousandClub.label, color: '#FFD700' },
    { id: rarityMap.fistOverall.label, color: '#FFD700' },
  ]

  const domTarget = useRef(null)
  const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
    () => ({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      zoom: 0,
      x: 0,
      y: 0,
      config: { mass: 5, tension: 350, friction: 40 },
    })
  )

  useGesture(
    {
      onDrag: ({ active, offset: [x, y] }) =>
        api.start({ x, y, rotateX: 0, rotateY: 0, scale: active ? 1 : 1.1 }),
      onPinch: ({ offset: [d, a] }) => api.start({ zoom: d / 200, rotateZ: a }),
      onMove: ({ xy: [px, py], dragging }) =>
        !dragging && api.start({ scale: 1.1 }),
      onHover: ({ hovering }) =>
        !hovering && api.start({ rotateX: 0, rotateY: 0, scale: 1 }),
    },
    { domTarget, eventOptions: { passive: false } }
  )

  const getShadow = (cardRarity: string): string => {
    const foundRarity = cardRarityShadows.find(
      (shadow) => shadow.id === cardRarity
    )?.color
    return `0 0 20px 10px ${foundRarity}`
  }

  return (
    <animated.div
      ref={domTarget}
      className="relative overflow-hidden cursor-grab touch-none will-change-transform transition-shadow"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        margin: '5px',
        touchAction: 'auto',
        transition: 'box-shadow 0.5s, opacity 0.5s',
        transform: 'perspective(600px)',
        x,
        y,
        scale: to([scale, zoom], (s, z) => s + z),
        rotateX,
        rotateY,
        rotateZ,
      }}
    >
      <img
        className="shadow-lg rounded hover:shadow-xl"
        style={{
          pointerEvents: 'none',
          boxShadow: getShadow(card.card_rarity),
        }}
        src={`${pathToCards}${card.image_url}`}
      />
    </animated.div>
  )
}

export default MovableCard
