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
                    className={` ${
                      record.isAward && record.won ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    S{record.seasonID} - {record.achievementName}{' '}
                    {record.isAward && (record.won ? '(won)' : '(nom)')}
                  </div>
                  <div className="text-sm">{record.achievementDescription}</div>
                </Box>
              ))
          ) : (
            <div>No awards found for this player.</div>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
