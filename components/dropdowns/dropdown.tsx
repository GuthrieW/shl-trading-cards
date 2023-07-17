import { ChevronDownIcon } from '@heroicons/react/outline'
import { useState } from 'react'

export type DropdownOption = {
  text: string
  onClick: () => void
}

export type DropdownProps = {
  title: string
  options: DropdownOption[]
}

const Dropdown = ({ title, options }: DropdownProps) => {
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const handleClick = (onClick: () => void) => {
    onClick()
    setShowOptions(false)
  }

  return (
    <select className="h-8 p-2 flex flex-row justify-center items-center rounded bg-neutral-800 text-gray-200 hover:bg-neutral-700 hover:text-gray-300">
      {[...options].map(({ text, onClick }, index) => (
        <option selected={index === 0} onClick={() => handleClick(onClick)}>
          {text}
        </option>
      ))}
    </select>
  )
}

export default Dropdown
