import { useResponsive } from '@hooks/useResponsive'

export type CardGridProps = {
  gridData: CollectionCard[]
}

const CardGrid = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  return (
    <div
      className={`grid ${
        isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-5'
      }`}
    >
      Card Grid
    </div>
  )
}

export default CardGrid
