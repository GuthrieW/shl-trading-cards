import isAdmin from '@utils/user-groups/is-admin'
import isAdminOrCardTeam from '@utils/user-groups/is-admin-or-card-team'
import Router from 'next/router'
import { useState } from 'react'
import AllCards from '../../components/admin-pages/all-cards'
import getUidFromSession from '@utils/get-uid-from-session'
import useGetUser from '@pages/api/queries/use-get-user'
import ClaimCards from '../../components/admin-pages/claim-cards'
import EditCards from '../../components/admin-pages/edit-cards'
import IssuePacks from '../../components/admin-pages/issue-packs'
import RequestCards from '../../components/admin-pages/request-cards'
import SubmitCards from '../../components/admin-pages/submit-cards'
import ProcessCards from '../../components/admin-pages/process-cards'
import Dropdown, { DropdownOption } from '@components/dropdowns/dropdown'

type AdminPage =
  | 'issue-packs'
  | 'all-cards'
  | 'edit-cards'
  | 'request-cards'
  | 'claim-cards'
  | 'submit-cards'
  | 'process-cards'

const Admin = () => {
  const [selectedAdminPage, setSelectedAdminPage] =
    useState<AdminPage>('all-cards')
  const [buttonText, setButtonText] = useState<string>('All Cards')
  const parsedUid = getUidFromSession()
  const { user, isLoading: getUserIsLoading } = useGetUser({
    uid: parsedUid,
  })
  const userIsAdmin = isAdmin(user)
  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)

  if (getUserIsLoading) return null
  if (!userIsAdminOrCardTeam) Router.push('/home')

  const handleSelectOption = (newPage: AdminPage) => {
    const title = newPage
      .replace('-', ' ')
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
    setButtonText(title)
    setSelectedAdminPage(newPage)
  }

  const dropdownOptions: DropdownOption[] = [
    {
      text: 'All Cards',
      onClick: () => handleSelectOption('all-cards'),
    },
    {
      text: 'Claim Cards',
      onClick: () => handleSelectOption('claim-cards'),
    },
    {
      text: 'Edit Cards',
      onClick: () => handleSelectOption('edit-cards'),
    },
    {
      text: 'Process Cards',
      onClick: () => handleSelectOption('process-cards'),
    },
    {
      text: 'Request Cards',
      onClick: () => handleSelectOption('request-cards'),
    },
    {
      text: 'Submit Cards',
      onClick: () => handleSelectOption('submit-cards'),
    },
  ]

  if (userIsAdmin) {
    dropdownOptions.push({
      text: 'Issue Packs',
      onClick: () => setSelectedAdminPage('issue-packs'),
    })
  }

  return (
    <div className="mx-2">
      <p>Admin Dashboard</p>
      <Dropdown title={buttonText} options={dropdownOptions} />
      {selectedAdminPage === 'issue-packs' && <IssuePacks />}
      {selectedAdminPage === 'all-cards' && <AllCards />}
      {selectedAdminPage === 'edit-cards' && <EditCards />}
      {selectedAdminPage === 'request-cards' && <RequestCards user={user} />}
      {selectedAdminPage === 'claim-cards' && <ClaimCards />}
      {selectedAdminPage === 'submit-cards' && <SubmitCards user={user} />}
      {selectedAdminPage === 'process-cards' && <ProcessCards />}
    </div>
  )
}

export default Admin
