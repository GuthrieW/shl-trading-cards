import React, { MouseEventHandler } from 'react'

type ButtonProps = {
  children: any
  onClick: MouseEventHandler
  disabled: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const Button = ({
  children,
  onClick,
  disabled,
  className,
  type,
}: ButtonProps) => {
  const classname = className
    ? className
    : 'py-2 px-4 text-sm font-medium cursor-pointer rounded-md border-neutral-800 bg-white border text-neutral-800  hover:bg-gray-300 hover:text-neutral-800  disabled:bg-neutral-500 disabled:cursor-default'
  return (
    <button
      className={classname}
      onClick={onClick}
      disabled={disabled}
      type={type || 'button'}
    >
      {children}
    </button>
  )
}

export default Button
