import { PageWrapper } from '@components/common/PageWrapper'
import TradesDrawer from '@components/drawers/TradesDrawer'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { SortDirection } from '@pages/api/v3'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useState } from 'react'

type ColumnName = 'username' | 'create_date' | 'update_date'

export default () => {
  // TODO: move the new trade component into this open area and add
  // a disclosure that makes it so you can open the existing trades sidebar

  return (
    <PageWrapper>
      <p>Trade Home</p>
      <TradesDrawer />
    </PageWrapper>
  )
}
