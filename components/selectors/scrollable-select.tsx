import React from 'react'

type ScrollableSelectProps = {
  scrollbarTitle: string
  children: JSX.Element[]
}

const ScrollableSelect = ({
  scrollbarTitle,
  children,
}: ScrollableSelectProps) => {
  const firstOption = children[0]
  const restOptions = children.slice(1)
  return (
    <>
      <aside className="w-64 top-16 border-r">{firstOption}</aside>
      <aside
        className="w-64 top-28 bottom-0 overflow-y-scroll absolute border-r"
        aria-label={`${scrollbarTitle} Scrollbar`}
      >
        <div>
          <ul>
            {restOptions.map((child, index) => {
              return <li key={index}>{child}</li>
            })}
          </ul>
        </div>
      </aside>
    </>
  )
}

export default ScrollableSelect
