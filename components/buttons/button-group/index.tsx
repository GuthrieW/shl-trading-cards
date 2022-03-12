import React from 'react'

type ButtonProps = {
  disabled: boolean
  onClick: Function
  text: string
}

export type ButtonGroupProps = {
  buttons: ButtonProps[]
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

const ButtonGroup = ({ buttons }: ButtonGroupProps) => (
  <div className="inline-flex rounded-md shadow-sm" role="group">
    {buttons.map((button, index) => (
      <button
        className={`${getPositionalRounding(
          index,
          buttons.length
        )} py-2 px-4 text-sm font-medium text-neutral-800 bg-white border border-neutral-800 hover:bg-gray-300`}
        disabled={button.disabled}
        onClick={() => button.onClick()}
      >
        {button.text}
      </button>
    ))}
  </div>
)

export default ButtonGroup
