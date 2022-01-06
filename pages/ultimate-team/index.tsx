import PageHeader from '@components/page-header'
import StartingLineupSelector from '@components/starting-lineup-selector'
import { useGetUserCards } from '@pages/api/queries'
import React, { useEffect, useState } from 'react'
import { Box } from '@material-ui/core'
import { getUidFromSession } from '@utils/index'

const UltimateTeam = () => {
  const { userCards, isLoading, isError } = useGetUserCards({
    uid: getUidFromSession(),
  })
  const [centerCard, setCenterCard] = useState<Card>(null)
  const [rightWingCard, setRightWingCard] = useState<Card>(null)
  const [leftWingCard, setLeftWingCard] = useState<Card>(null)
  const [rightDefenseCard, setRightDefenseCard] = useState<Card>(null)
  const [leftDefenseCard, setLeftDefenseCard] = useState<Card>(null)
  const [goalieCard, setGoalieCard] = useState<Card>(null)
  const [forwardCards, setForwardCards] = useState<Card[]>([])
  const [defenseCards, setDefenseCards] = useState<Card[]>([])
  const [goalieCards, setGoalieCards] = useState<Card[]>([])

  useEffect(() => {
    const forwardPositions = ['C', 'RW', 'LW']
    const defensePositions = ['RD', 'LD']

    const forwards = userCards.filter((card: Card) => {
      return forwardPositions.indexOf(card.position) >= 0
    })

    const defense = userCards.filter((card: Card) => {
      return defensePositions.indexOf(card.position) >= 0
    })

    const goalies = userCards.filter((card: Card) => {
      return card.position === 'G'
    })

    setForwardCards(forwards)
    setDefenseCards(defense)
    setGoalieCards(goalies)
  }, [userCards])

  return (
    <>
      <PageHeader>Ultimate Team</PageHeader>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StartingLineupSelector
          headerText={'Left Wing'}
          selectedCard={leftWingCard}
          ownedCards={forwardCards}
          ownedCardsLoading={isLoading}
          otherSelectedCards={[
            centerCard,
            rightWingCard,
            rightDefenseCard,
            leftDefenseCard,
            goalieCard,
          ]}
          onCardChange={setLeftWingCard}
        />
        <StartingLineupSelector
          headerText={'Center'}
          selectedCard={centerCard}
          ownedCards={forwardCards}
          ownedCardsLoading={isLoading}
          otherSelectedCards={[
            rightWingCard,
            leftWingCard,
            rightDefenseCard,
            leftDefenseCard,
            goalieCard,
          ]}
          onCardChange={setCenterCard}
        />
        <StartingLineupSelector
          headerText={'Right Wing'}
          selectedCard={rightWingCard}
          ownedCards={forwardCards}
          ownedCardsLoading={isLoading}
          otherSelectedCards={[
            centerCard,
            leftWingCard,
            rightDefenseCard,
            leftDefenseCard,
            goalieCard,
          ]}
          onCardChange={setRightWingCard}
        />
      </Box>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StartingLineupSelector
          headerText={'Left Defense'}
          selectedCard={leftDefenseCard}
          ownedCards={defenseCards}
          ownedCardsLoading={isLoading}
          otherSelectedCards={[
            centerCard,
            rightWingCard,
            leftWingCard,
            rightDefenseCard,
            goalieCard,
          ]}
          onCardChange={setLeftDefenseCard}
        />
        <StartingLineupSelector
          headerText={'Right Defense'}
          selectedCard={rightDefenseCard}
          ownedCards={defenseCards}
          ownedCardsLoading={isLoading}
          otherSelectedCards={[
            centerCard,
            rightWingCard,
            leftWingCard,
            leftDefenseCard,
            goalieCard,
          ]}
          onCardChange={setRightDefenseCard}
        />
      </Box>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StartingLineupSelector
          headerText={'Goalie'}
          selectedCard={goalieCard}
          ownedCards={goalieCards}
          ownedCardsLoading={isLoading}
          otherSelectedCards={[
            centerCard,
            rightWingCard,
            leftWingCard,
            rightDefenseCard,
            leftDefenseCard,
          ]}
          onCardChange={setGoalieCard}
        />
      </Box>
    </>
  )
}

export default UltimateTeam
