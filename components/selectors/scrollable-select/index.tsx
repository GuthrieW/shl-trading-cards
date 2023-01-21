import React from 'react'

type ScrollableSelectProps = {
  scrollbarTitle: string
  children: JSX.Element[]
}

const ScrollableSelect = ({
  scrollbarTitle,
  children,
}: ScrollableSelectProps) => {
  return (
    <aside className="w-64" aria-label={`${scrollbarTitle} Scrollbar`}>
      <div className="overflow-y-auto border">
        <ul>
          {children.map((child) => {
            return <li>{child}</li>
          })}
        </ul>
      </div>
    </aside>
  )
}

export default ScrollableSelect
