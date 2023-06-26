import React, { useMemo } from 'react'
import Modal from './modal'
import useGetAllUsersWithCards from '@pages/api/queries/use-get-all-users-with-cards'
import AutoCompleteSearchBar from '@components/inputs/autocomplete-search-bar'
import Router from 'next/router'
import getUidFromSession from '@utils/get-uid-from-session'

type SelectUserModalProps = {
  setShowModal: Function
}

const SelectUserModal = ({ setShowModal }: SelectUserModalProps) => {
  const {
    users,
    isSuccess: getAllUsersIsSuccess,
    isLoading: getAllUsersIsLoading,
    isError: getAllUsersIsError,
  } = useGetAllUsersWithCards({})

  // filter out current user so people don't trying to trade with themselves
  const filteredUsers: User[] = useMemo(() => {
    if (!users) return users

    const currentUserId = getUidFromSession()
    const userIndex = users.findIndex((user) => user.uid !== currentUserId)

    if (userIndex === -1) return users

    return users.splice(userIndex, 1)
  }, [users])

  const handleSelectUser = (selectedUser: User) => {
    Router.push(`/trade-hub/${selectedUser.uid}`)
  }

  if (getAllUsersIsLoading || getAllUsersIsError) {
    return null
  }

  return (
    <Modal
      setShowModal={setShowModal}
      title={'New Trade'}
      subtitle={'Select a user to trade with'}
    >
      <div>
        <AutoCompleteSearchBar
          onSelect={handleSelectUser}
          options={filteredUsers}
        />
      </div>
    </Modal>
  )
}
export default SelectUserModal
