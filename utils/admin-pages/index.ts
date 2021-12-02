import { SelectedAdminPage } from '@pages/admin-dashboard'

type AdminPage = {
  title: string
  body: string
  href: SelectedAdminPage
  requiredPermissions: number[]
}

const adminPages: AdminPage[] = [
  {
    title: 'Edit Cards',
    body: 'Modify card information including',
    href: 'edit-cards',
    requiredPermissions: [],
  },
  {
    title: 'Edit Users',
    body: 'Modify user data including subscription status and permissions',
    href: 'edit-users',
    requiredPermissions: [],
  },
  {
    title: 'Process Cards',
    body: 'Approve or delete cards in the processing queue',
    href: 'process-cards',
    requiredPermissions: [],
  },
  {
    title: 'Submit Cards',
    body: 'Submit cards for approval',
    href: 'submit-cards',
    requiredPermissions: [],
  },
  {
    title: 'Claim a Card',
    body: 'Claim a card from the creation queue',
    href: 'claim-card-creation',
    requiredPermissions: [],
  },
  {
    title: 'Request Card Creation',
    body: 'Add a new card to the creation queue',
    href: 'request-card-creation',
    requiredPermissions: [],
  },
]

export default adminPages
