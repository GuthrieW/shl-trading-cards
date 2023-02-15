import { useGetUser } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'

type TradeCardProps = {
  className?: string
  onClick?: Function
  trade: Trade
}

const fixAvatar = (avatar: string): string => {
  if (avatar.startsWith('.')) {
    return 'https://simulationhockey.com' + avatar?.substring(1)
  }

  return avatar
}

const TradeCard = ({ className, trade, onClick }: TradeCardProps) => {
  const currentUserId = getUidFromSession()
  console
  const {
    user: toUser,
    isLoading: toUserIsLoading,
    isError: toUserIsError,
  } = useGetUser({
    uid: trade.recipientid,
  })
  const {
    user: fromUser,
    isLoading: fromUserIsLoading,
    isError: fromUserIsError,
  } = useGetUser({
    uid: trade.initiatorid,
  })

  if (
    toUserIsLoading ||
    toUserIsError ||
    fromUserIsLoading ||
    fromUserIsError
  ) {
    return null
  }

  const otherUser = currentUserId === trade.initiatorid ? toUser : fromUser

  console.log('otherUser', otherUser)
  return (
    <div
      className={`${
        className ? className : ''
      } h-full w-full hover:bg-neutral-400 flex justify-between`}
      onClick={() => onClick()}
      title={trade.trade_status.toUpperCase()}
    >
      <div className="p-1">
        <img
          className="w-10 h-10 rounded-full"
          src={fixAvatar(otherUser?.avatar)}
          alt="Rounded avatar"
        />
      </div>
      <div className="h-full flex flex-col m-1">
        <div
          className={`inline-block w-2 h-2 rounded-full ${
            trade.trade_status === 'complete'
              ? 'bg-green-600'
              : trade.trade_status === 'pending'
              ? 'bg-yellow-600'
              : 'bg-red-600'
          }`}
        ></div>
        <div>{trade.update_date}</div>
      </div>
    </div>
  )
}
export default TradeCard
