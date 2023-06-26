import React from 'react'

type InfoCardProps = {
  children: any
  className?: string
}

const InfoCard = ({ children, className }: InfoCardProps) => (
  <div className={`rounded-md shadow-md p-4 m-4 ${className ? className : ''}`}>
    {children}
  </div>
)

export default InfoCard
