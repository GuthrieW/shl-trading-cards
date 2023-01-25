import { useGetUser } from '@pages/api/queries'
import React from 'react'

type TradeCardProps = {
  className?: string
  onClick?: Function
  trade: Trade
}

const TradeCard = ({ className, trade, onClick }: TradeCardProps) => {
  const { user, isSuccess, isLoading, isError } = useGetUser({
    uid: trade.toID,
  })

  return (
    <div
      className={`${className ? className : ''} w-full hover:bg-neutral-400`}
      onClick={() => onClick()}
    >
      <span className="flex justify-start items-center p-1">
        <img
          className="w-10 h-10 rounded-full"
          src="https://simulationhockey.com/uploads/avatars/avatar_2856.jpg"
          // src={`https://simulationhockey.com/${user.avatar.replace('./', '')}`}
          alt="Rounded avatar"
        />
      </span>
    </div>
  )
}
export default TradeCard
