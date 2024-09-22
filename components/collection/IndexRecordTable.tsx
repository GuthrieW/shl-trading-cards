import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  useColorMode,
} from '@chakra-ui/react'
import { Link } from 'components/common/Link'
import { LEAGUE_LINK_MAP } from 'lib/constants'
import { generateIndexLink } from 'lib/constants'
import { useCallback, useEffect, useRef, useState } from 'react'

export const IndexRecordTable = ({
  owned,
  playerID,
}: {
  owned: number
  playerID: number
}) => {
  const [indexSrc, setIndexSrc] = useState<string | undefined>(undefined)
  const iFrameRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState('0px')
  console.log(indexSrc)
  const { colorMode } = useColorMode()

  const setIFrameHeight = useCallback((event: MessageEvent<any>) => {
    if (event.origin.includes('index.simulationhockey.com')) {
      if (event.data !== 0 && typeof event.data === 'number')
        setHeight(event.data + 'px')
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', setIFrameHeight)

    return () => window.removeEventListener('message', setIFrameHeight)
  }, [setIFrameHeight])

  if (!playerID) return null
  return (
    <div>
      <div className="border-b-2 p-2 bg-primary">
        <div className="flex justify-between text-sm font-bold ">
          <span>Index Links</span>
        </div>
      </div>
      <TableContainer className='bg-secondary text-secondary'>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>{LEAGUE_LINK_MAP.at(0)}</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <Button
                  className="!hover:no-underline mr-2 bg-primary font-mont hover:text-blue600 focus:text-blue600 "
                  onClick={() =>
                    setIndexSrc(generateIndexLink(playerID, colorMode))
                  }
                >
                  View Stats
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      
      {indexSrc && (
        <>
          <iframe
            ref={iFrameRef}
            src={indexSrc}
            className="w-full"
            height={height}
          />
          <Link
            className="!hover:no-underline ml-2 block pb-2 text-left text-blue600 "
            href={indexSrc.split('?')[0]}
            target="_blank"
          >
            View in a new window
          </Link>
        </>
      )}
    </div>
  )
}
