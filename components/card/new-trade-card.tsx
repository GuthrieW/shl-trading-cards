import useGetUser from '@pages/api/queries/use-get-user'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'
import { PlusIcon } from '@heroicons/react/solid'

export type TradeCardProps = {
  className?: string
  onClick?: Function
  trade: Trade
}

const NewTradeCard = ({ className, trade, onClick }: TradeCardProps) => {
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
      <div className="p-1 w-12 h-12 rounded-full">
        <PlusIcon fill="black" stroke="black" />
      </div>
      <div className="flex w-full justify-center items-center">
        <p>New Trade</p>
      </div>
    </div>
  )
}
export default NewTradeCard
