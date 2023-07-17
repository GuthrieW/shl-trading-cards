import { useResponsive } from '@hooks/useResponsive'
import React from 'react'

type ScrollableSelectProps = {
  scrollbarTitle: string
  children: JSX.Element[] | JSX.Element
}

const ScrollableSelect = ({
  scrollbarTitle,
  children,
}: ScrollableSelectProps) => {
  const { isDesktop, isLargeScreen } = useResponsive()
  if (!Array.isArray(children)) {
    return <>{children}</>
  }
  const firstOption = children[0]
  const secondOption = children[1]
  const restOptions = children.slice(2)

  return (
    <>
      <aside
        className={`${
          isDesktop || isLargeScreen ? 'w-64' : 'w-32'
        } top-16  border-r border-neutral-400 h-12`}
      >
        {firstOption}
      </aside>
      <aside
        className={`${
          isDesktop || isLargeScreen ? 'w-64' : 'w-32'
        } top-32 border-r border-neutral-400 h-12`}
      >
        {secondOption}
      </aside>
      <aside
        className={`${
          isDesktop || isLargeScreen ? 'w-64' : 'w-32'
        } top-40 bottom-0 absolute border-r border-neutral-400 overflow-y-auto no-scrollbar`}
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
