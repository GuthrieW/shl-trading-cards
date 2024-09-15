import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import AddCardsToUsersForm from '@components/admin-scripts/AddCardsToUsersForms'
import DeleteDuplicateCardsForm from '@components/admin-scripts/DeleteDuplicateCardsForm'
import MonthlySubscriptionsForm from '@components/admin-scripts/MonthlySubscriptionsForm'
import RequestBaseCardsForm from '@components/admin-scripts/RequestBaseCardsForm'
import { PageWrapper } from '@components/common/PageWrapper'
import TablePagination from '@components/tables/TablePagination'
import { GET, POST } from '@constants/http-methods'
import { ArrowDownIcon } from '@heroicons/react/20/solid'
import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'
import { mutation } from '@pages/api/database/mutation'
import { query } from '@pages/api/database/query'
import { SettingsData } from '@pages/api/v3/settings'
import axios from 'axios'
import { ToastContext } from 'contexts/ToastContext'
import { useFormik } from 'formik'
import { Fragment, useContext, useEffect, useState } from 'react'

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
    <PageWrapper className="h-full flex flex-col justify-center items-center w-11/12 md:w-3/4">
      <Skeleton
        isLoaded={!isCheckingAuthentication || !isCheckingAuthorization}
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
      </Skeleton>
    </PageWrapper>
  )
}
