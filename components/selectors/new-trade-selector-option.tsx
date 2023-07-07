import React from 'react'
import { PlusIcon } from '@heroicons/react/solid'

export type NewTradeSelectorOptionProps = {
  className?: string
  onClick?: Function
  trade: Trade
}

const NewTradeSelectorOption = ({
  className,
  trade,
  onClick,
}: NewTradeSelectorOptionProps) => (
  <div
    className={`h-full w-full hover:bg-neutral-400 flex justify-between border-b-2 ${className}`}
    onClick={() => onClick(trade)}
  >
    <div className="flex justify-center items-center p-1 w-12 h-12 rounded-full">
      <PlusIcon fill="black" stroke="black" />
    </div>
    <div className="flex w-full justify-center items-center">
      <p>New Trade</p>
    </div>
  </div>
)

export default NewTradeSelectorOption
