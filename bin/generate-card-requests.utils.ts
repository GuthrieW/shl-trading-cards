import rarityMap from '@constants/rarity-map'
import teamsMap from '@constants/teams-map'
import { IndexPlayer, Position } from './generate-card-requests'

/**
 * transform an index player into trading card attributes and position
 * formulas found in the readme
 */
export const calculateAttributesAndPosition = (
  player: IndexPlayer
): {
  skating: number
  shooting: number
  hands: number
  checking: number
  defense: number
  high_shots: number
  low_shots: number
  quickness: number
  control: number
  conditioning: number
  overall: number
  position: Position
} => {
  if (
    player.position === 'C' ||
    player.position === 'LW' ||
    player.position === 'RW'
  ) {
    const skating =
      (player.acceleration +
        player.agility +
        player.balance +
        player.speed +
        player.stamina) /
      5
    const shooting =
      (player.screening + player.gettingOpen + player.shootingAccuracy) / 3
    const hands =
      (player.passing + player.puckhandling + player.offensiveRead) / 3
    const checking = (player.checking + player.hitting + player.strength) / 3
    const defense =
      (player.positioning + player.stickchecking + player.defensiveRead) / 3
    const overall = skating + shooting + hands + checking + defense + 2

    return {
      overall,
      skating,
      shooting,
      hands,
      checking,
      defense,
      high_shots: null,
      low_shots: null,
      quickness: null,
      control: null,
      conditioning: null,
      position: 'F',
    }
  }

  if (player.position === 'LD' || player.position === 'RD') {
    const skating =
      (player.acceleration +
        player.agility +
        player.balance +
        player.speed +
        player.stamina) /
      5
    const shooting = (player.shootingRange + player.gettingOpen) / 2
    const hands =
      (player.passing + player.puckhandling + player.offensiveRead) / 3
    const checking = (player.checking + player.hitting + player.strength) / 3
    const defense =
      (player.positioning +
        player.stickchecking +
        player.shotBlocking +
        player.defensiveRead) /
      4
    const overall = skating + shooting + hands + checking + defense + 2

    return {
      overall,
      skating,
      shooting,
      hands,
      checking,
      defense,
      high_shots: null,
      low_shots: null,
      quickness: null,
      control: null,
      conditioning: null,
      position: 'D',
    }
  }

  if (player.position === 'G') {
    const high_shots = (player.blocker + player.glove) / 2
    const low_shots = (player.lowShots + player.pokeCheck) / 2
    const quickness = (player.reflexes + player.skating) / 2
    const control =
      (player.puckhandling + player.rebound + player.positioning) / 3
    const conditioning =
      (player.recovery + player.mentalToughness + player.goalieStamina) / 3
    const overall =
      high_shots + low_shots + quickness + conditioning + conditioning

    return {
      skating: null,
      shooting: null,
      hands: null,
      checking: null,
      defense: null,
      high_shots,
      low_shots,
      quickness,
      control,
      conditioning,
      overall,
      position: 'G',
    }
  }
}

/**
 *
 */
export const getSameAndHigherRaritiesQueryFragment = (
  rarity: string
): string => {
  if (rarity === rarityMap.bronze.value) {
    return `(card_rarity="${rarityMap.bronze.value}" OR card_rarity="${rarityMap.silver.value}" OR card_rarity="${rarityMap.gold.value}" OR card_rarity="${rarityMap.ruby.value}" OR card_rarity="${rarityMap.diamond.value}")`
  }
  if (rarity === rarityMap.silver.value) {
    return `(card_rarity="${rarityMap.silver.value}" OR card_rarity="${rarityMap.gold.value}" OR card_rarity="${rarityMap.ruby.value}" OR card_rarity="${rarityMap.diamond.value}")`
  }
  if (rarity === rarityMap.gold.value) {
    return `(card_rarity="${rarityMap.gold.value}" OR card_rarity="${rarityMap.ruby.value}" OR card_rarity="${rarityMap.diamond.value}")`
  }
  if (rarity === rarityMap.ruby.value) {
    return `( card_rarity="${rarityMap.ruby.value}" OR card_rarity="${rarityMap.diamond.value}")`
  }
  if (rarity === rarityMap.diamond.value) {
    return `(card_rarity="${rarityMap.diamond.value}")`
  }
}

/**
 * calculate a card's rarity
 */
export const calculateRarity = (
  position: Position,
  overall: number
): string => {
  if (position === 'F' || position === 'D') {
    if (overall < 70) return rarityMap.bronze.value
    if (overall >= 70 && overall < 80) return rarityMap.silver.value
    if (overall >= 80 && overall < 85) return rarityMap.gold.value
    if (overall >= 85 && overall < 88) return rarityMap.ruby.value
    if (overall >= 88) return rarityMap.diamond.value
    return rarityMap.bronze.label
  } else {
    if (overall < 76) return rarityMap.bronze.value
    if (overall >= 76 && overall < 81) return rarityMap.silver.value
    if (overall >= 81 && overall < 86) return rarityMap.gold.value
    if (overall >= 86 && overall < 89) return rarityMap.ruby.value
    if (overall >= 89) return rarityMap.diamond.value
    return rarityMap.bronze.label
  }
}

/**
 * transform a team name to a team ID
 */
export const teamNameToId = (teamName: string): number => {
  return Object.values(teamsMap).find((team) => team.abbreviation === teamName)
    .teamID
}
