export const userGroups = {
  SHL_COMMISSIONER: 35,
  SMJHL_COMMISSIONER: 10,
  IIHF_COMMISSIONER: 26,
  SHL_HO: 23,
  SMJHL_HO: 30,
  SMJHL_INTERN: 29,
  IIHF_HO: 174,
  HEAD_UPDATER: 163,
  UPDATER: 14,
  SHL_GM: 12,
  SMJHL_GM: 11,
  PORTAL_MANAGEMENT: 173,
  ROOKIE_MENTOR: 21,
  BANKER: 13,
  PT_GRADER: 16,
  TRADING_CARD_ADMIN: 157,
  TRADING_CARD_TEAM: 165,
} as const

export const generateIndexLink = (
  playerID: number,
  withPortalMode?: string,
) =>
  `https://index.simulationhockey.com/${LEAGUE_LINK_MAP[
    0
  ].toLowerCase()}/player/${playerID}${withPortalMode ? `?portalView=${withPortalMode}` : ''}`;

export type RoleGroup = (keyof Readonly<typeof userGroups>)[]

export const CAN_RUN_SCRIPTS: RoleGroup = ['TRADING_CARD_ADMIN']
export const CAN_ISSUE_PACKS: RoleGroup = ['TRADING_CARD_ADMIN']
export const CAN_EDIT_DONATIONS: RoleGroup = ['TRADING_CARD_ADMIN']
export const CAN_VIEW_ALL_CARDS: RoleGroup = ['TRADING_CARD_TEAM']
export const CAN_SUBMIT_CARD_REQUESTS: RoleGroup = ['TRADING_CARD_ADMIN']
export const CAN_CLAIM_CARDS: RoleGroup = ['TRADING_CARD_TEAM']
export const CAN_EDIT_CARDS: RoleGroup = ['TRADING_CARD_ADMIN']
export const CAN_SUBMIT_CARDS: RoleGroup = ['TRADING_CARD_TEAM']
export const CAN_PROCESS_CARDS: RoleGroup = ['TRADING_CARD_ADMIN']
export const LEAGUE_LINK_MAP = ['SHL', 'SMJHL', 'IIHF', 'WJC'];
