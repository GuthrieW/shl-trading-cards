import React, { useMemo, useState } from 'react'
import { SkeletonText, Box, Link } from '@chakra-ui/react'
import { ListResponse, UserMostCards } from '@pages/api/v3'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { TableHeader } from './TableHeader'
import { simpleGlobalFilterFn } from './shared'
import { Table } from './Table'
import { TableBehavioralFlags } from './tableBehaviorFlags'
import { formatDateTime } from '@utils/formatDateTime'
import CardLightBoxModal from '@components/modals/CardLightBoxModal'

const columnHelper = createColumnHelper<Card>()

interface NewestCardsProps {
  data: ListResponse<Card>
  isLoading: boolean
  BehaviorFlag: TableBehavioralFlags
  uid: string
}

const NewestCards = ({
  data,
  isLoading,
  BehaviorFlag,
  uid,
}: NewestCardsProps) => {
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const columns = useMemo(() => {
    const currentColumns = [
      columnHelper.accessor('image_url', {
        header: 'View Card',
        cell: (props) => {
          const card = props.row.original
          return (
            <Link
              className="!hover:no-underline !text-link"
              onClick={() => {
                setSelectedCard(card)
                setLightBoxIsOpen(true)
              }}
            >
              {card.player_name}
            </Link>
          )
        },
        enableSorting: true,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('player_name', {
        header: () => (
          <TableHeader title="player_name">player name</TableHeader>
        ),
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('card_rarity', {
        header: () => (
          <TableHeader title="card_rarity">Card Rarity</TableHeader>
        ),
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('date_approved', {
        header: () => (
          <TableHeader title="date_approved">Date Approved</TableHeader>
        ),
        cell: (props) => formatDateTime(props.getValue()),
        enableGlobalFilter: false,
        enableSorting: true,
      }),
    ]
    return currentColumns
  }, [])

  const table = useReactTable({
    columns,
    data: data?.rows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: simpleGlobalFilterFn,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnVisibility: {
        player_name: false,
      },
    },
  })

  return (
    <div className="w-full p-4 min-h-[400px]">
      {isLoading ? (
        <>
          <div className="flex justify-end"></div>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-primary">
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
          <Table<UserMostCards>
            table={table}
            tableBehavioralFlags={BehaviorFlag}
          />
        </>
      )}
      {lightBoxIsOpen && (
        <CardLightBoxModal
          cardName={selectedCard.player_name}
          cardImage={selectedCard.image_url}
          owned={1} // just making it so that the card isnt grey
          rarity={selectedCard.card_rarity}
          playerID={selectedCard.playerID}
          cardID={selectedCard.cardID}
          userID={uid}
          setShowModal={() => setLightBoxIsOpen(false)}
        />
      )}
    </div>
  )
}

export default NewestCards
