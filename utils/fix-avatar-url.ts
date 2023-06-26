const fixAvatar = (avatar: string): string => {
  if (avatar?.startsWith('.')) {
    return 'https://simulationhockey.com' + avatar?.substring(1)
  }

  return avatar
}

export default fixAvatar
