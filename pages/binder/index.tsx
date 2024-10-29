import React from 'react'
import { PageWrapper } from '@components/common/PageWrapper'
import BinderTables from '@components/tables/BinderTable'

const BinderPage = () => {
  return (
    <PageWrapper>
      <div className="border-b-8 border-b-blue700 bg-secondary p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold text-secondaryText sm:text-xl">
            Welcome to the SHL Binders
          </h1>
          <span className="text-sm text-secondary">
            You can create up to 5 binders with a maximum of 75 cards per pack.
          </span>
        </div>
      </div>
      <BinderTables />
    </PageWrapper>
  )
}

export default BinderPage