import React, { useMemo, useState, useEffect } from 'react'
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
import { BINDER_TABLE } from './tableBehaviorFlags'
import { TableHeader } from './TableHeader'
import { simpleGlobalFilterFn } from './shared'
import { Table } from './Table'
import { rarityMap } from '@constants/rarity-map'
import { CheckIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { round } from 'lodash'

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
      }),
      columnHelper.accessor('card_rarity', {
        header: () => <TableHeader title="card_rarity">rarity</TableHeader>,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('owned_count', {
        header: () => <TableHeader title="owned_count">Owned</TableHeader>,
        enableGlobalFilter: false,
        enableSorting: true,
      }),
      columnHelper.accessor(
        (row) => ({
          ownedCount: row.owned_count,
          totalCards: siteUniqueCards[0]?.total_count || 0,
        }),
        {
          header: `Total Completed`,
          cell: (props) => {
            const cellValue = props.getValue()
            return (
              <>
                <Progress
                  value={(cellValue.ownedCount / cellValue.totalCards) * 100}
                  colorScheme={
                    cellValue.ownedCount === cellValue.totalCards
                      ? 'green'
                      : 'blue'
                  }
                  borderRadius="md"
                  hasStripe
                ></Progress>
                <div>
                  {round(
                    (cellValue.ownedCount / cellValue.totalCards) * 100,
                    0
                  )}
                  %
                </div>
              </>
            )
          },
          enableSorting: true,
        }
      ),
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
      sorting: [{ id: 'owned_count', desc: true }],
    },
    state: {
      columnVisibility: {
        name: false,
      },
    },
  })

  return (
    <div className="w-full p-4 min-h-[400px]">
      <div className="border-b-8 border-b-blue700 bg-secondary p-2 flex items-center justify-between">
        <h1 className="text-lg font-bold text-secondaryText sm:text-xl">
          Collections By Rarity
        </h1>
        <Menu closeOnSelect={true}>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            className="!bg-grey900 !text-secondary hover:!bg-highlighted/40"
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
                  key={value.value}
                  value={value.value}
                  icon={
                    rarity === value.value ? (
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
            <div className="border rounded-lg overflow-hidden bg-table-header">
              {Array.from({ length: 10 }).map((_, index) => (
                <Box key={index} p="4" borderTop="1px" borderColor="gray.200">
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
            tableBehavioralFlags={BINDER_TABLE}
          />
        </>
      )}
    </div>
  )
}

export default UsersCollection
