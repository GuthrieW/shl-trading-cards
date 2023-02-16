import { useGetUser } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'
import dayjs from 'dayjs'

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

  const otherUser = currentUserId === trade.initiatorid ? fromUser : toUser
  // this one below is actually correct but I'm using the one above for testing
  // const otherUser = currentUserId === trade.initiatorid ? toUser : fromUser

  return (
    <div
      className={`${
        className ? className : ''
      } h-full w-full hover:bg-neutral-400 flex justify-between border-b-2`}
      onClick={() => onClick(trade)}
    >
      <div className="p-1">
        <img
          className="w-10 h-10 rounded-full"
          src={fixAvatar(otherUser?.avatar)}
          alt="Rounded avatar"
          title={otherUser.username}
        />
      </div>
      <div className="flex flex-col justify-between items-end mt-1 mr-1">
        <div
          title={trade.trade_status.toUpperCase()}
          className={`inline-block w-2 h-2 rounded-full ${
            trade.trade_status === 'complete'
              ? 'bg-green-600'
              : trade.trade_status === 'pending'
              ? 'bg-yellow-600'
              : 'bg-red-600'
          }`}
        ></div>
        <div className="text-sm">
          {trade.trade_status === 'pending' ? 'Initiated' : 'Resolved'} on:{' '}
          {dayjs(trade.update_date).format('DD/MM/YYYY')}
        </div>
      </div>
    </div>
  )
}
export default TradeCard
