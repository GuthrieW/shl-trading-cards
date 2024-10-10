import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import { Icon } from '@chakra-ui/react'
import { SortDirection } from '@pages/api/v3'

export default function SortIcon({
  sortDirection,
}: {
  sortDirection: SortDirection
}) {
  return <Icon as={sortDirection === 'ASC' ? ArrowDownIcon : ArrowUpIcon} />
}
