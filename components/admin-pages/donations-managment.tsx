import DonationManagementTable from '@components/tables/donation-management-table'
import useGetDonationUsers from '@pages/api/queries/use-get-donation-users'
import { NextSeo } from 'next-seo'

const DonationManagement = () => {
  const { donationUsers, isLoading } = useGetDonationUsers({})
  return (
    <>
      <NextSeo title="Donation Management" />
      <div className="m-2">
        <DonationManagementTable tableData={donationUsers} />
      </div>
    </>
  )
}

export default DonationManagement
