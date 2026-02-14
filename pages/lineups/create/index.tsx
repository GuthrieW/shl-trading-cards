import React from 'react'
import { PageWrapper } from '@components/common/PageWrapper'
import LineupDetails from '@components/lineups/LineupDetails'

const CreateLineupPage = () => {
  return (
    <PageWrapper title="SHL Lineups">
      <div className="border-b-8 border-b-blue700 bg-secondary p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold text-secondaryText sm:text-xl">
            Create a New Lineup
          </h1>
          <span className="text-sm text-secondary">
            Drag your cards into the position slots below to set your lineup. When you have filled out every position, click save.
          </span>
        </div>
      </div>
      <LineupDetails />
    </PageWrapper>
  )
}

export default CreateLineupPage