import { UseToastOptions } from '@chakra-ui/react'

export const successToastOptions: Partial<UseToastOptions> = {
  status: 'success',
  duration: 2500,
  isClosable: true,
  position: 'bottom-left',
}

export const warningToastOptions: Partial<UseToastOptions> = {
  status: 'warning',
  duration: 2500,
  isClosable: true,
  position: 'bottom-left',
}

export const errorToastOptions: Partial<UseToastOptions> = {
  status: 'error',
  duration: 2500,
  isClosable: true,
  position: 'bottom-left',
}

export function getRandomToastDescription(
  username: string,
  latestPackCards: Card[]
): string {
  const options = [
    'Flip the cards again!',
    'I rigged this pack against you.',
    'Who got better luck, you or micool?',
    'Flip card 4 first....',
    'You got a good one in there, I promise.',
    'I rigged this pack just for you :)',
    `Hi ${username}!`,
    'Give eggcracker your grannies.',
    'Surely this pack will be the one.',
    'There is a HOF card in here I swear.',
    'Get ready for 6 bronzes.',
    'Forget training or coaching. Only buy packs. Packs are life.',
    'You really expect a diamond in here? ',
    'Imagine pulling 6 Ben Jammins...',
    'This pack is sponsored by the Rich and Luke Podcast',
    'Share this one to the chirper!',
    'Open responsibly. Emotional damage ahead',
    'Tag Downer if you pull a good card',
  ]

  const onlyBronzeOrSilver = latestPackCards.every((card) =>
    ['bronze', 'silver'].includes(card.card_rarity.toLowerCase())
  )
  if (onlyBronzeOrSilver) {
    return 'Surely this won’t be all bronzes and silvers like the last pack...'
  }

  const hasOwnCard = latestPackCards.some(
    (card) => card.author_username === username
  )
  if (hasOwnCard) {
    options.push('Wow look at you, you opened the card that you made!')
  }

  const hasHOF = latestPackCards.some((card) =>
    card.card_rarity.toLowerCase().includes('hall of fame')
  )
  if (hasHOF) {
    return 'Just stop, you already opened your HOF for the day.'
  }

  return options[Math.floor(Math.random() * options.length)]
}
