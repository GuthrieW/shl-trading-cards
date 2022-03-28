import CryptoJS from 'crypto-js'

const getUidFromSession = () => {
  if (typeof window !== 'undefined') {
    const token = window.sessionStorage.getItem('token')

    console.log('token', process.env.NEXT_PUBLIC_TOKEN_KEY)
    return token
      ? parseInt(
          CryptoJS.AES.decrypt(
            token,
            process.env.NEXT_PUBLIC_TOKEN_KEY
          ).toString(CryptoJS.enc.Utf8)
        )
      : parseInt(window.sessionStorage.getItem('uid') || '0')
  } else {
    return null
  }
}

export default getUidFromSession
