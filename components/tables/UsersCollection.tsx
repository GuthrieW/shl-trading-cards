import React, { useMemo, useState } from 'react'
import axios from 'axios'
import {
  SkeletonText,
  Box,
  Link,
  MenuItemOption,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuOptionGroup,
  Progress,
} from '@chakra-ui/react'
import { GET } from '@constants/http-methods'
import { SiteUniqueCards, UserUniqueCollection } from '@pages/api/v3'
import { query } from '@pages/api/database/query'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { CARDS_TABLE } from './tableBehaviorFlags'
import { TableHeader } from './TableHeader'
import { simpleGlobalFilterFn } from './shared'
import { Table } from './Table'
import { rarityMap } from '@constants/rarity-map'
import { CheckIcon, ChevronDownIcon } from '@chakra-ui/icons'

const columnHelper = createColumnHelper<UserUniqueCollection>()

const UsersCollection = () => {
  const [rarity, setRarity] = useState<string>('Bronze')

  const { payload: userUniqueCards, isLoading: userUniqueCardsIsLoading } =
    query<UserUniqueCollection[]>({
      queryKey: ['user-unique-cards', rarity],
      queryFn: () =>
        axios({
          method: GET,
          url: `/api/v3/collection/collection-by-rarity?card_rarity=${rarity}`,
        }),
    })

  const { payload: siteUniqueCards, isLoading: siteUniqueCardsIsLoading } =
    query<SiteUniqueCards[]>({
      queryKey: ['unique-cards', rarity],
      queryFn: () =>
        axios({
          method: GET,
          url: `/api/v3/collection/unique-cards?card_rarity=${rarity}`,
        }),
    })

  const columns = useMemo(() => {
    const currentColumns = [
      columnHelper.accessor(({ userID, username }) => [userID, username], {
        header: 'Username',
        cell: (props) => {
          const cellValue = props.getValue()
          return (
            <Link
              className="!hover:no-underline !text-link"
              href={`/collect/${cellValue[0]}`}
            >
              {cellValue[1]}
            </Link>
          )
        },
        enableSorting: true,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('username', {
        header: () => <TableHeader title="username">UserName</TableHeader>,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('card_rarity', {
        header: () => <TableHeader title="card_rarity">Rarity</TableHeader>,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('owned_count', {
        id: 'ownedCount',
        header: `Total Completed`,
        cell: (props) => {
          const ownedCount = props.getValue()
          const totalCards = siteUniqueCards[0]?.total_count || 0
          const progressPercent = (ownedCount / totalCards) * 100

          return (
            <div className="flex items-center space-x-2 w-full">
              <div className="w-full rounded-md relative">
                <Progress
                  value={progressPercent}
                  colorScheme={ownedCount === totalCards ? 'green' : 'blue'}
                  borderRadius="md"
                  className="w-full !bg-primary"
                  size="lg"
                >
                  <div className="absolute inset-0 flex items-center justify-center font-bold !text-secondary  text-sm">
                    {ownedCount}/{totalCards}
                  </div>
                </Progress>
              </div>
            </div>
          )
        },
        enableSorting: true,
      }),
    ]
    return currentColumns
  }, [siteUniqueCards])

  const table = useReactTable({
    columns,
    data: userUniqueCards,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: simpleGlobalFilterFn,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [{ id: 'ownedCount', desc: true }],
    },
    state: {
      columnVisibility: {
        username: false,
      },
    },
  })

  return (
    <div className="w-full p-4 min-h-[400px]">
      <div className="border-b-8 border-b-blue700 bg-secondary p-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-lg font-bold text-secondaryText sm:text-xl">
          Collections By Rarity
        </h1>
        <Menu closeOnSelect={true}>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            className="!bg-grey900 !text-white hover:!bg-highlighted/40 w-full sm:w-auto"
          >
            Rarity: {rarityMap[rarity]?.label || rarity}
          </MenuButton>
          <MenuList>
            <MenuOptionGroup
              type="radio"
              className="!bg-grey900 !text-secondary"
              value={rarity}
              onChange={(value) => setRarity(value as string)}
            >
              {Object.entries(rarityMap).map(([key, value]) => (
                <MenuItemOption
                  className="hover:bg-highlighted/40"
                  key={value.label}
                  value={value.label}
                  icon={
                    rarity === value.label ? (
                      <CheckIcon className="mx-2" />
                    ) : null
                  }
                >
                  {value.label}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </div>
      {userUniqueCardsIsLoading || siteUniqueCardsIsLoading ? (
        <>
          <div className="flex justify-end"></div>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-primary">
              {Array.from({ length: 10 }).map((_, index) => (
                <Box
                  key={index}
                  p="4"
                  borderTop="1px"
                  className="!border-primary"
                >
                  <SkeletonText noOfLines={1} spacing="4" />
                </Box>
              ))}
            </div>
            <div className="flex justify-center pt-4"></div>
          </div>
        </>
      ) : (
        <>
          <Table<UserUniqueCollection>
            table={table}
            tableBehavioralFlags={CARDS_TABLE}
          />
        </>
      )}
    </div>
  )
}

export default UsersCollection
