import UserGrid from '@components/grids/user-grid'
import { NextSeo } from 'next-seo'
import React from 'react'

const Community = () => (
  <>
    <NextSeo title="Community" />
    <div className="m-2">
      <h1 className="text-4xl text-center my-6">Community</h1>
      <UserGrid />
    </div>
  </>
)

export default Community
