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
    <aside
      className="w-64 top-16 bottom-0 overflow-y-scroll absolute border-r"
      aria-label={`${scrollbarTitle} Scrollbar`}
    >
      <div className="">
        <ul>
          {children.map((child, index) => {
            return <li key={index}>{child}</li>
          })}
        </ul>
      </div>
    </aside>
  )
}

export default ScrollableSelect
