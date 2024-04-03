import DonationManagementTable from '@components/tables/donation-management-table'
import useGetallUsers from '@pages/api/queries/use-get-all-users'
import { NextSeo } from 'next-seo'

const DonationManagement = () => {
  const { users, isSuccess, isLoading, isError } = useGetallUsers({})
  return (
    <>
      <NextSeo title="Donation Management" />
      <div className="m-2">
        <DonationManagementTable tableData={users} />
      </div>
    </>
  )
}

export default DonationManagement
