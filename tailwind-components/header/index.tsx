import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'

const Header = () => (
  <div className="relative top-0 w-full h-16 bg-gray-600 flex flex-row items-center">
    <div className="flex flex-row mx-2 cursor-pointer">
      <span className="text-red-800">Home</span>
      <ChevronDownIcon className="ml-2 h-5 w-5" />
    </div>
    <div className="flex flex-row mx-2 cursor-pointer">
      <span className=" text-orange-800">Collections</span>
      <ChevronDownIcon className="ml-2 h-5 w-5" />
    </div>
    <div className="flex flex-row mx-2 cursor-pointer">
      <span>Community</span>
      <ChevronDownIcon className="ml-2 h-5 w-5" />
    </div>
    <div className="flex flex-row mx-2 cursor-pointer">
      <span>Trade Hub</span>
      <ChevronDownIcon className="ml-2 h-5 w-5" />
    </div>
  </div>
)

export default Header
