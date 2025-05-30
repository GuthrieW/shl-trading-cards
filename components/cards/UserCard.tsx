import { IconButton } from '@chakra-ui/react'
import { Search2Icon, ChatIcon } from '@chakra-ui/icons'
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
    <div className="flex flex-col justify-start items-center hover:scale-105 hover:shadow-xl">
      <div className="flex flex-col justify-center items-center bg-neutral-800 p-2 m-2 rounded text-primary ">
        <img
          alt={`${user.username} avatar`}
          className="w-24 h-24 mt-6 mx-6 rounded-full"
          src={fixAvatar(user.avatar)}
        />
        <span>{user.username}</span>
        {quantity && <span>Cards: {quantity}</span>}
        <div className="grid grid-cols-2 mt-4">
          <div className="flex flex-col items-center hover:scale-105 hover:shadow-xl">
            <IconButton
              className="h-8 w-8"
              disabled={false}
              onClick={() => Router.push(`/collect/${user.uid}`)}
              aria-label={''}
            >
              <Search2Icon />
            </IconButton>
            <span className="text-sm mt-1">Collection</span>
          </div>
          <div className="flex flex-col items-center hover:scale-105 hover:shadow-xl">
            <IconButton
              className="h-8 w-8"
              disabled={false}
              onClick={() => Router.push(`/trade?partnerId=${user.uid}`)}
              aria-label={''}
            >
              <ChatIcon />
            </IconButton>
            <span className="text-sm mt-1">Trade</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCard