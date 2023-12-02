import useGetUser from '@pages/api/queries/use-get-user'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'
import dayjs from 'dayjs'
import fixAvatar from '@utils/fix-avatar-url'
import { ArrowPathIcon, CheckIcon,  XMarkIcon} from '@heroicons/react/20/solid'

export type TradeSelectorOptionProps = {
  className?: string
  onClick?: Function
  trade: Trade
}

const getTradeIconAndColor = (
  tradeStatus: TradeStatus
): { color: string; icon: JSX.Element; text: string } => {
  if (tradeStatus === 'COMPLETE') {
    return {
      color: 'bg-green-600',
      icon: <CheckIcon className="h-3 w-3 stroke-[3px]" />,
      text: 'Complete',
    }
  }

  if (tradeStatus === 'PENDING') {
    return {
      color: 'bg-yellow-600',
      icon: <ArrowPathIcon className="h-3 w-3 stroke-[3px]" />,
      text: 'Pending',
    }
  }

  if (tradeStatus === 'DECLINED') {
    return {
      color: 'bg-red-600',
      icon: <XMarkIcon className="h-3 w-3 stroke-[3px]" />,
      text: 'Declined',
    }
  }

  if (tradeStatus === 'AUTO_DECLINED') {
    return {
      color: 'bg-red-600',
      icon: <XMarkIcon className="h-3 w-3 stroke-[3px]" />,
      text: 'Voided',
    }
  }
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

  const tradeData = getTradeIconAndColor(trade.trade_status)

  return (
    <div
      className="flex flex-col justify-between h-full border-t-1 border-neutral-400 hover:bg-neutral-400 border-b-2 cursor-pointer"
      onClick={() => onClick(trade)}
    >
      <div className="flex flex-row justify-between items-start mt-1 mx-1">
        <img
          className="w-10 h-10 rounded-full"
          src={fixAvatar(otherUser?.avatar)}
          alt="Rounded avatar"
          title={otherUser.username}
        />
        <div
          title={tradeData.text}
          className={`rounded text-white p-1 font-bold ${tradeData.color}`}
        >
          {tradeData.icon}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-1 mx-1">
        <span className="text-xs">{otherUser.username}</span>
        <span className="text-xs">
          {trade.trade_status === 'PENDING'
            ? `Offered on ${
                trade.create_date
                  ? dayjs(trade.create_date).format('DD/MM/YYYY')
                  : 'N/A'
              }`
            : `${tradeData.text} on ${
                trade.update_date
                  ? dayjs(trade.update_date).format('DD/MM/YYYY')
                  : 'N/A'
              }`}
        </span>
      </div>
    </div>
  )
}

export default TradeSelectorOption
