import React from 'react'

type CardProps = {
  children: any
  className?: string
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={`${className ? className : ''} rounded-md shadow-md p-4 m-4`}
    >
      {children}
    </div>
  )
}

export default Card
