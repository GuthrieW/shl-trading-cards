import React from 'react'
import axios from 'axios'
import cookie from 'react-cookies'
import { StorageKeys } from '../utils/constants'

const Example = () => {
  const handleButtonClick = async () => {
    const cookies = document.cookie
    console.log(cookies)
    const shlCookie = cookie.load(StorageKeys.Cookies.TheShlMyBbUser)
    if (shlCookie) {
      shlCookie.split('_')
      const userId = shlCookie[0]
      const loginKey = shlCookie[1]
      console.log('shlCookie', shlCookie)
      console.log('userId', userId)
      console.log('loginKey', loginKey)
    }

    // const response = await axios({ method: 'get', url: '/api/v1/example' })
    // console.log('data', response)
  }

  return (
    <>
      <h1>Example Component</h1>
      <button onClick={handleButtonClick}>Make call</button>
    </>
  )
}

export default Example
