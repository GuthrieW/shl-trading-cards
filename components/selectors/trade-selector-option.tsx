import useGetUser from '@pages/api/queries/use-get-user'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'
import dayjs from 'dayjs'
import fixAvatar from '@utils/fix-avatar-url'

export type TradeSelectorOptionProps = {
  className?: string
  onClick?: Function
  trade: Trade
}

const TradeSelectorOption = ({
  className,
  trade,
  onClick,
}: TradeSelectorOptionProps) => {
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

  const otherUser = currentUserId === trade.initiatorid ? toUser : fromUser

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
            trade.trade_status === 'COMPLETE'
              ? 'bg-green-600'
              : trade.trade_status === 'PENDING'
              ? 'bg-yellow-600'
              : 'bg-red-600'
          }`}
        ></div>
        <div className="text-sm">
          {trade.trade_status === 'PENDING'
            ? `Offered on ${
                trade.create_date
                  ? dayjs(trade.create_date).format('DD/MM/YYYY')
                  : 'N/A'
              }`
            : `${
                trade.trade_status === 'COMPLETE'
                  ? 'Accepted'
                  : trade.declineUserID === currentUserId
                  ? 'Cancelled'
                  : 'Declined'
              } on ${
                trade.update_date
                  ? dayjs(trade.update_date).format('DD/MM/YYYY')
                  : 'N/A'
              }`}
        </div>
      </div>
    </div>
  )
}
export default TradeSelectorOption
