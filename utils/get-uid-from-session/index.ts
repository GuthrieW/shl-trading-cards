const getUidFromSession = () => {
  if (typeof window !== 'undefined') {
    return parseInt(sessionStorage.getItem('uid'))
  } else {
    return null
  }
}

export default getUidFromSession
