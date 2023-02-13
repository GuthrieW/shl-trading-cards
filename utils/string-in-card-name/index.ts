import { Card } from 'index.d'

const stringInCardName = (card: Card, stringToFind: string) => {
  return card.player_name.toLowerCase().includes(stringToFind.toLowerCase())
}

export default stringInCardName
