import React from 'react'

const Button = ({ children, onClick, disabled }) => (
  <button
    className="py-2 px-4 text-sm font-medium cursor-pointer rounded-md
    border-neutral-800 bg-white border text-neutral-800 
    hover:bg-gray-300 hover:text-neutral-800 
    disabled:bg-neutral-500 disabled:cursor-default"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
)

export default Button
