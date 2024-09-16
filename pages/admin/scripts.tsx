import { Select, Skeleton } from '@chakra-ui/react'
import AddCardsToUsersForm from '@components/admin-scripts/AddCardsToUsersForms'
import DeleteDuplicateCardsForm from '@components/admin-scripts/DeleteDuplicateCardsForm'
import MonthlySubscriptionsForm from '@components/admin-scripts/MonthlySubscriptionsForm'
import RequestBaseCardsForm from '@components/admin-scripts/RequestBaseCardsForm'
import { PageWrapper } from '@components/common/PageWrapper'
import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'

import { useState } from 'react'

type ScriptId =
  | 'add-cards-to-users'
  | 'monthly-subscriptions'
  | 'request-base-cards'
  | 'delete-duplicates'

type ScriptData = {
  id: ScriptId
  name: string
}

const scripts: ScriptData[] = [
  { id: 'add-cards-to-users', name: 'Add Cards to Users' },
  { id: 'monthly-subscriptions', name: 'Distribute Monthly Subscription' },
  { id: 'request-base-cards', name: 'Request Base Cards' },
  { id: 'delete-duplicates', name: 'Delete Duplicate Cards' },
] as const

export default () => {
  const [selectedScript, setSelectedScript] =
    useState<(typeof scripts)[number]['id']>()
  const [formError, setFormError] = useState<string>('')

  const { isCheckingAuthentication } = useRedirectIfNotAuthenticated()
  const { isCheckingAuthorization } = useRedirectIfNotAuthorized({
    roles: ['TRADING_CARD_ADMIN'],
  })

  return (
    <PageWrapper
      loading={isCheckingAuthentication || isCheckingAuthorization}
      className="h-full flex flex-col justify-center items-center w-11/12 md:w-3/4"
    >
      <div className="max-w-md">
        <Select
          placeholder="Select a script"
          onChange={(event) =>
            setSelectedScript(event.target.value as ScriptId)
          }
        >
          {scripts.map((script) => (
            <option key={script.id} value={script.id}>
              {script.name}
            </option>
          ))}
        </Select>
      </div>

      {formError && (
        <div className="text-red dark:text-redDark">{formError}</div>
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
      </div>
    </PageWrapper>
  )
}
