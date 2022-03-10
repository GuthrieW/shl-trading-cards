import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'

const Header = () => (
  <div className="relative top-0 w-full h-16 bg-gray-600 flex flex-row items-center">
    <div className="flex flex-row ml-5">
      <span>This is a dropdown</span>
      <ChevronDownIcon className="ml-2 h-5 w-5" />
    </div>
  </div>
)

export default Header
