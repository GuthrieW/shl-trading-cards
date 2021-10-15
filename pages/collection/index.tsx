import React, { useState } from 'react'
import cards from '@utils/test-data/cards.json'
import { Avatar, Box, Chip } from '@material-ui/core'

const Collection = (props) => {
  const [filterOptions, setFilterOptions] = useState([
    {
      rarity: 'Bronze',
      imageUrl: '/images/bronze-icon.svg',
      enabled: false,
    },
    {
      rarity: 'Silver',
      imageUrl: '/images/silver-icon.svg',
      enabled: false,
    },
    {
      rarity: 'Gold',
      imageUrl: '/images/gold-icon.svg',
      enabled: false,
    },
    {
      rarity: 'Ruby',
      imageUrl: '/images/gold-icon.svg',
      enabled: false,
    },
    {
      rarity: 'Diamond',
      imageUrl: '/images/diamond-icon.svg',
      enabled: false,
    },
  ])

  const handleChipClick = (filterOption, index) => {
    const filterOptionsCopy = [...filterOptions]
    filterOptionsCopy[index].enabled = !filterOption.enabled
    setFilterOptions(filterOptionsCopy)
  }

  return (
    <>
      <UsernameHeader username={'caltroit_red_flames'} />
      <Box whiteSpace={'nowrap'} overflow={'auto'}>
        {filterOptions.map((filterOption, index) => (
          <Chip
            key={filterOption.rarity}
            variant={filterOption.enabled ? 'default' : 'outlined'}
            label={filterOption.rarity}
            avatar={<Avatar src={filterOption.imageUrl} />}
            onClick={() => handleChipClick(filterOption, index)}
          />
        ))}
      </Box>
    </>
  )
}

const UsernameHeader = ({ username }) => {
  const displayUsername = username ? `${username}\'s` : 'My'
  return <h1>{displayUsername} Collection</h1>
}

export default Collection
