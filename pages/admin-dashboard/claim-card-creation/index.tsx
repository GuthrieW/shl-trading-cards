import React from 'react'
import PageHeader from '@components/page-header'
import useRequestedCards from '@hooks/use-requested-cards'

const ClaimCardCreation = () => {
  const { requestedCards, isLoading, isError } = useRequestedCards()

  return (
    <>
      <PageHeader>Placeholder</PageHeader>
    </>
  )
}

export default ClaimCardCreation
