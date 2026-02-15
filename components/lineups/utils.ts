export const getOverallColor = (overall: number): string => {
  if (overall >= 90) return 'purple'
  if (overall >= 85) return 'blue'
  if (overall >= 80) return 'green'
  if (overall >= 75) return 'yellow'
  return 'gray'
}

export const getRarityTextColor = (rarity: string): string => {
  switch (rarity?.toLowerCase()) {
    case 'bronze':
      return '#B87333' // Bronze
    case 'silver':
      return '#C0C0C0' // Silver
    case 'gold':
      return '#FFD700' // Gold
    case 'ruby':
      return '#E0115F' // Ruby
    case 'logo':
      return '#FF6B35' // Orange
    case 'diamond':
      return '#B9F2FF' // Diamond
    case 'award':
      return '#9C27B0' // Purple
    case 'iihf awards':
      return '#00BCD4' // Cyan
    case '2000 tpe club':
      return '#4CAF50' // Green
    case 'special edition':
      return '#FF9800' // Amber
    case 'charity':
      return '#E91E63' // Pink
    case '1st overall':
      return '#3F51B5' // Indigo
    case 'hall of fame':
      return '#FFD700' // Gold
    case 'misprint':
      return '#FF0000' // Red
    default:
      return '#FFFFFF' // Default white
  }
}

export const getRarityBoxShadow = (rarity: string): string => {
  switch (rarity?.toLowerCase()) {
    case 'bronze':
      return '0 0 15px rgba(205, 127, 50, 0.6), 0 0 30px rgba(205, 127, 50, 0.3)'
    case 'silver':
      return '0 0 15px rgba(192, 192, 192, 0.6), 0 0 30px rgba(192, 192, 192, 0.3)'
    case 'gold':
      return '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.3)'
    case 'ruby':
      return '0 0 15px rgba(224, 17, 95, 0.6), 0 0 30px rgba(224, 17, 95, 0.3)'
    case 'logo':
      return '0 0 15px rgba(255, 0, 150, 0.6), 0 0 30px rgba(0, 255, 255, 0.3)'
    case 'diamond':
      return '0 0 15px rgba(185, 242, 255, 0.6), 0 0 30px rgba(185, 242, 255, 0.3)'
    case 'award':
      return '0 0 15px rgba(255, 0, 100, 0.6), 0 0 30px rgba(255, 200, 0, 0.3)'
    case 'iihf awards':
      return '0 0 15px rgba(0, 255, 0, 0.6), 0 0 30px rgba(255, 0, 255, 0.3)'
    case '2000 tpe club':
      return '0 0 15px rgba(255, 100, 0, 0.6), 0 0 30px rgba(0, 100, 255, 0.3)'
    case 'special edition':
      return '0 0 15px rgba(150, 0, 255, 0.6), 0 0 30px rgba(255, 255, 0, 0.3)'
    case 'charity':
      return '0 0 15px rgba(255, 0, 255, 0.6), 0 0 30px rgba(0, 255, 150, 0.3)'
    case '1st overall':
      return '0 0 15px rgba(0, 150, 255, 0.6), 0 0 30px rgba(255, 150, 0, 0.3)'
    case 'hall of fame':
      return '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 0, 150, 0.3)'
    case 'misprint':
      return '0 0 15px rgba(255, 0, 0, 0.6), 0 0 30px rgba(0, 255, 255, 0.3)'
    default:
      return '0 0 5px rgba(255, 255, 255, 0.3)'
  }
}

export const downloadDataAsJson = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}