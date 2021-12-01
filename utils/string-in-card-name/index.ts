const stringInCardName = (card: Card, stringToFind: string) => {
  return card.playerName.toLowerCase().includes(stringToFind.toLowerCase())
}

export default stringInCardName
