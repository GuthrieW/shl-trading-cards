import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { PageWrapper } from '@components/common/PageWrapper'
import LineupDetails from '@components/lineups/LineupDetails'

const EditLineupPage = () => {
  const router = useRouter()
  const { lineupId } = router.query

  // Ensure lineupId is available before rendering
  if (!lineupId || typeof lineupId !== 'string') {
    return (
      <PageWrapper title="Edit Lineup">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Invalid Lineup ID
            </h1>
            <p className="text-gray-600">
              Please provide a valid lineup ID to edit.
            </p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Edit Lineup">
      <div className="border-b-8 border-b-blue700 bg-secondary p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold text-secondaryText sm:text-xl">
            Edit Lineup
          </h1>
          <span className="text-sm text-secondary">
            Modify your lineup
          </span>
        </div>
      </div>
      <LineupDetails />
    </PageWrapper>
  )
}

export default EditLineupPage
