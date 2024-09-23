import React from 'react'
import { Link } from 'components/common/Link'

interface DisplayHistoryProps {
  playerID: number
}

export const DisplayHistory: React.FC<DisplayHistoryProps> = ({ playerID }) => {
  return (
    <Link
      href={`https://index.simulationhockey.com/shl/player/${playerID}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View Player Page
    </Link>
  )
}
