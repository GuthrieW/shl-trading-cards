import React from 'react'
import { PageWrapper } from '@components/common/PageWrapper'
import LineupList from '@components/lineups/LineupList'

const LineupsPage = () => {
  return (
    <PageWrapper title="SHL Lineups">
      <div className="border-b-8 border-b-blue700 bg-secondary p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold text-secondaryText sm:text-xl">
            Welcome to SHL Ultimate Team
          </h1>
          <span className="text-sm text-secondary">
            Use your hard earned SHL cash to buy cards, create your Ultimate Team, then face off against your friends (coming soon)!
          </span>
        </div>
      </div>
      <LineupList />
    </PageWrapper>
  )
}

export default LineupsPage