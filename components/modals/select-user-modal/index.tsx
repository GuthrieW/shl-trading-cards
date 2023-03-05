import React from 'react'
import Modal from '../modal'
import Button from '@components/buttons/button'
import { useGetAllUsersWithCards } from '@pages/api/queries'
import AutoCompleteSearchBar from '@components/inputs/autocomplete-search-bar'
import { Router, useRouter } from 'next/router'

type SelectUserModalProps = {
  setShowModal: Function
}

const SelectUserModal = ({ setShowModal }: SelectUserModalProps) => {
  const router = useRouter()
  const {
    users,
    isSuccess: getAllUsersIsSuccess,
    isLoading: getAllUsersIsLoading,
    isError: getAllUsersIsError,
  } = useGetAllUsersWithCards({})

  const handleSelectUser = (selectedUser: User) => {
    router.push(`/trade-hub/${selectedUser.uid}`)
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
        <AutoCompleteSearchBar onSelect={handleSelectUser} options={users} />
      </div>
    </Modal>
  )
}
export default SelectUserModal
