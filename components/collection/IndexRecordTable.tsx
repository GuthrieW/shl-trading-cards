import React, { useCallback, useEffect, useRef, useState } from 'react'
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
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { Link } from 'components/common/Link'
import { LEAGUE_LINK_MAP } from 'lib/constants'
import { generateIndexLink } from 'lib/constants'
import axios from 'axios'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { UserCollection } from '@pages/api/v3'
import GetUsername from '@components/common/GetUsername'
import Router from 'next/router'

export const IndexRecordTable = ({
  owned,
  playerID,
  cardID,
  userID,
}: {
  owned: boolean
  playerID: number
  cardID: number
  userID: string
}) => {
  const [indexSrc, setIndexSrc] = useState<string | undefined>(undefined)
  const iFrameRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState('0px')
  const { colorMode } = useColorMode()
  const [playerHistory, setPlayerHistory] = useState<any[]>([])

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

  useEffect(() => {
    const fetchPlayerHistory = async () => {
      try {
        const response = await axios.get(
          `https://portal.simulationhockey.com/api/v1/history/player?fhmID=${playerID}&leagueID=0`
        )
        setPlayerHistory(response.data)
      } catch (error) {
        console.error('Failed to fetch player history:', error)
      }
    }

    fetchPlayerHistory()
  }, [playerID])

  const { payload: packs, isLoading } = query<UserCollection[]>({
    queryKey: ['packs-from-cards', String(cardID), String(userID), "false"],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/cards/packs-from-cards?userID=${userID}&cardID=${cardID}&isOwned=false`,
      }),
    enabled: !!cardID && !!userID,
  })

  if (!playerID) return null

  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Player Stats
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {playerID === -1 || playerID > 100000 ? (
            <div>Player stats not available at this time</div>
          ) : (
            <>
              <TableContainer className="bg-secondary text-secondary">
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
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Player Awards
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {playerHistory && playerHistory.length > 0 ? (
            playerHistory
              .sort((a, b) => b.seasonID - a.seasonID)
              .map((record) => (
                <Box
                  key={record.playerUpdateID}
                  p={2}
                  borderWidth="1px"
                  rounded="md"
                  mb={2}
                >
                  <div
                    className={`${
                      record.isAward && record.won ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    S{record.seasonID} - {record.achievementName}{' '}
                    {record.isAward && (record.won ? '(won)' : '(nom)')}
                  </div>
                  <div className="text-sm">
                    {record.achievementDescription}
                  </div>
                </Box>
              ))
          ) : (
            <div>No awards found for this player.</div>
          )}
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
  <h2>
    <AccordionButton>
      <Box flex="1" textAlign="left">
        Users who own the card
      </Box>
      <AccordionIcon />
    </AccordionButton>
  </h2>
  <AccordionPanel pb={4}>
    {packs && packs.length > 0 ? (
      packs.map((pack) => (
        <Box
          key={pack.packID}
          p={2}
          borderWidth="1px"
          rounded="md"
          mb={2}
        >
          <div>
            User: { <GetUsername userID={pack.userID} /> }
          </div>
          {userID !== String(pack.userID) && (
            <Button
              className="mt-2"
              colorScheme="blue"
              onClick={() => Router.push(`/trade?partnerId=${pack.userID}&cardID=${pack.cardID}`)}
            >
              Trade for this card
            </Button>
          )}
        </Box>
      ))
    ) : (
      <div>No users own this card yet.</div>
    )}
  </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
