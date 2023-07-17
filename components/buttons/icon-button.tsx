import React from 'react'

export type IconButtonProps = {
  className?: string
  children: JSX.Element
  disabled: boolean
  onClick: () => void
}
const IconButton = ({
  className,
  disabled,
  onClick,
  children,
}: IconButtonProps) => (
  <button
    className={`h-6 w-6 outline outline-1 rounded text-gray-200 transition-colors hover:text-gray-400 ${className}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
)
export default IconButton
