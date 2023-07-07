import { useResponsive } from '@hooks/useResponsive'
import React from 'react'

type ScrollableSelectProps = {
  scrollbarTitle: string
  children: JSX.Element[]
}

const ScrollableSelect = ({
  scrollbarTitle,
  children,
}: ScrollableSelectProps) => {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const firstOption = children[0]
  const restOptions = children.slice(1)

  return (
    <>
      <aside
        className={`${
          isDesktop ? 'w-64' : 'w-32'
        } top-16 border-r border-neutral-400`}
      >
        {firstOption}
      </aside>
      <aside
        className={`${
          isDesktop ? 'w-64' : 'w-32'
        } top-28 bottom-0 overflow-y-scroll absolute border-r border-neutral-400`}
        aria-label={`${scrollbarTitle} Scrollbar`}
      >
        <ul>
          {restOptions.map((child, index) => {
            return <li key={index}>{child}</li>
          })}
        </ul>
      </aside>
    </>
  )
}

export default ScrollableSelect
