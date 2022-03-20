import React from 'react'

type ButtonProps = {
  id: string
  onClick: Function
  text: string
  className: string
}

export type MultiSelectButtonGroupProps = {
  buttons: ButtonProps[]
  selectedButtonIds: string[]
}

const getPositionalRounding = (index, numberOfButtons) => {
  if (index === 0) {
    return 'rounded-l-md'
  } else if (index === numberOfButtons - 1) {
    return 'rounded-r-md'
  } else {
    return ''
  }
}

const getIsSelected = (button: ButtonProps, selectedButtonIds: string[]) =>
  selectedButtonIds.includes(button.id)
    ? 'bg-neutral-800 text-white'
    : button.className

const MultiSelectButtonGroup = ({
  buttons,
  selectedButtonIds,
}: MultiSelectButtonGroupProps) => (
  <div className="inline-flex shadow-sm" role="group">
    {buttons.map((button, index) => (
      <button
        key={index}
        className={`
          ${getPositionalRounding(index, buttons.length)}
          py-2 px-4 text-sm font-medium border text-neutral-800 border-neutral-800 cursor-pointer hover:bg-gray-300 hover:text-neutral-800
          ${getIsSelected(button, selectedButtonIds)}
        `}
        onClick={() => button.onClick()}
      >
        {button.text}
      </button>
    ))}
  </div>
)

export default MultiSelectButtonGroup
