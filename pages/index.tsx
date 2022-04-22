import React from 'react'
import Router from 'next/router'

const index = () => {
  if (typeof window !== 'undefined') {
    Router.push('/home')
  }

  return null
}

export default index
