import IconButton from '@components/buttons/icon-button'
import { ChatBubbleLeftRightIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import fixAvatar from '@utils/fix-avatar-url'
import Router from 'next/router'

export type UserCardProps = {
  user: User
  quantity?: number
}

const UserCard = ({ user, quantity }: UserCardProps) => {
  if (!user) {
    user = {
      uid: -1,
      username: 'USER_NOT_FOUND',
    }
  }

  return (
    <div className="flex flex-col justify-start items-center">
      <div className="flex flex-col justify-center items-center bg-neutral-800 p-2 m-2 rounded text-gray-200 hover:shadow-lg hover:shadow-neutral-800">
        <img
          alt={`${user.username} avatar`}
          className="w-24 h-24 mt-6 mx-6 rounded-full"
          src={fixAvatar(user.avatar)}
        />
        <span>{user.username}</span>
        {quantity && <span>Cards: {quantity}</span>}
        <div className="grid grid-cols-2 mt-4">
          <div className="flex flex-col items-center">
            <IconButton
              className="h-8 w-8"
              disabled={false}
              onClick={() => Router.push(`/collection?uid=${user.uid}`)}
            >
              <Squares2X2Icon />
            </IconButton>
            <span className="text-sm mt-1">Collection</span>
          </div>
          <div className="flex flex-col items-center">
            <IconButton
              className="h-8 w-8"
              disabled={false}
              onClick={() => Router.push(`/trade-hub/${user.uid}`)}
            >
              <ChatBubbleLeftRightIcon />
            </IconButton>
            <span className="text-sm mt-1">Trade</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCard
