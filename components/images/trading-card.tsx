import pathToCards from '@constants/path-to-cards'
import { useResponsive } from '@hooks/useResponsive'
import Image from 'next/image'

export type TradingCardProps = {
  source: string
  playerName: string
  rarity: string
  className?: string
}

const customLoader = (src: string) => {
  return `https://simulationhockey.com/tradingcards/${src}`
}

const TradingCard = ({
  source,
  playerName,
  rarity,
  className,
}: TradingCardProps) => {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const dimensions: { width: number; height: number } = isMobile
    ? { width: 211, height: 290 }
    : isTablet
      ? { width: 200, height: 276 }
      : isDesktop
        ? { width: 142, height: 195 }
        : { width: 320, height: 440 }

  return (
    <Image
      loader={() => customLoader(source)}
      width={dimensions.width}
      height={dimensions.height}
      src={`${pathToCards}${source}`}
      alt={`${rarity} ${playerName}`}
      className={`w-full h-full cursor-pointer rounded-sm mx-1 ${className}`}
      loading="lazy"
      unoptimized={true}
    />
  )
}

export default TradingCard
