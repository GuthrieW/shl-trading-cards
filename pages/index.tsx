import React from 'react'
import Router from 'next/router'

const index = () => {
  if (typeof window !== 'undefined') {
    Router.push({
      pathname: '/home',
    })
  }

  return null
}

export default index
