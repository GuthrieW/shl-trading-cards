import { Alert, AlertIcon } from '@chakra-ui/react'
import AddCardsToUsersForm from '@components/admin-scripts/AddCardsToUsersForms'
import DeleteDuplicateCardsForm from '@components/admin-scripts/DeleteDuplicateCardsForm'
import MonthlySubscriptionsForm from '@components/admin-scripts/MonthlySubscriptionsForm'
import RequestBaseCardsForm from '@components/admin-scripts/RequestBaseCardsForm'
import { PageWrapper } from '@components/common/PageWrapper'
import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'
import { Select } from '@components/common/Select'
import { useState } from 'react'
import RequestCustomCardsForm from '@components/admin-scripts/RequestCustomCardsForm'
import { Permissions, usePermissions } from '@hooks/usePermissions'

type ScriptId =
  | 'add-cards-to-users'
  | 'monthly-subscriptions'
  | 'request-base-cards'
  // | 'request-charity-card'
  | 'request-custom-cards'
  | 'delete-duplicates'

type ScriptData = {
  id: ScriptId
  name: string
  requiredPermissions?: (keyof Permissions)[]
}

const scripts: ScriptData[] = [
  {
    id: 'add-cards-to-users',
    name: 'Add Cards to Users',
    requiredPermissions: ['canAddCardsToUsers'],
  },
  {
    id: 'monthly-subscriptions',
    name: 'Distribute Monthly Subscription',
    requiredPermissions: ['canEditDonations'],
  },
  {
    id: 'request-base-cards',
    name: 'Request Base Cards',
    requiredPermissions: ['canSubmitCardRequests'],
  },
  {
    id: 'request-custom-cards',
    name: 'Request Custom Cards',
    requiredPermissions: ['canSubmitCardRequests'],
  },
  // {
  //   id: 'request-charity-card',
  //   name: 'Request Charity Card',
  //   requiredPermissions: ['canSubmitCardRequests'],
  // },
  // {
  //   id: 'delete-duplicates',
  //   name: 'Delete Duplicate Cards',
  //   requiredPermissions: ['canEditCards'],
  // },
] as const

export default () => {
  const [selectedScript, setSelectedScript] = useState<ScriptId>(scripts[0].id)
  const [formError, setFormError] = useState<string>('')
  const { permissions } = usePermissions()

  const { isCheckingAuthentication } = useRedirectIfNotAuthenticated()
  const { isCheckingAuthorization } = useRedirectIfNotAuthorized({
    roles: ['TRADING_CARD_ADMIN'],
  })

  const optionsMap = new Map<ScriptId, string>(
    scripts
      .filter((script) =>
        script.requiredPermissions.some((required) => permissions[required])
      )
      .map((script) => [script.id, script.name])
  )

  return (
    <PageWrapper
      loading={isCheckingAuthentication || isCheckingAuthorization}
      className="h-full flex flex-col justify-center items-center w-11/12 md:w-3/4"
    >
      <div className="border-grey100 !text-grey100">
        <Select
          options={scripts.map((script) => script.id)}
          selectedOption={selectedScript}
          onSelection={(option) => setSelectedScript(option)}
          optionsMap={optionsMap}
          optionClassName="hover:bg-highlighted/40"
          dark={false}
        />
      </div>

      {formError && (
        <Alert status="error">
          <AlertIcon />
          {formError}
        </Alert>
      )}

      <div className="mt-6">
        {selectedScript === 'add-cards-to-users' && (
          <AddCardsToUsersForm onError={setFormError} />
        )}
        {selectedScript === 'delete-duplicates' && (
          <DeleteDuplicateCardsForm onError={setFormError} />
        )}
        {selectedScript === 'monthly-subscriptions' && (
          <MonthlySubscriptionsForm onError={setFormError} />
        )}
        {selectedScript === 'request-base-cards' && (
          <RequestBaseCardsForm onError={setFormError} />
        )}
        {selectedScript === 'request-custom-cards' && (
          <RequestCustomCardsForm onError={setFormError} />
        )}
      </div>
    </PageWrapper>
  )
}
