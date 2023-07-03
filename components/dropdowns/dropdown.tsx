import IconButton from '@components/buttons/icon-button'
import DrawerItem from '@components/drawers/drawer-item'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { useState } from 'react'

{
  /* <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown button <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>
<!-- Dropdown menu -->
<div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
      </li>
    </ul>
</div> */
}

export type DropdownOption = {
  text: string
  onClick: () => void
}

export type DropdownProps = {
  title: string
  options: DropdownOption[]
}

const Dropdown = ({ title, options }: DropdownProps) => {
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const handleClick = (onClick: () => void) => {
    onClick()
    setShowOptions(false)
  }

  return (
    <>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex flex-row justify-center items-center rounded bg-neutral-800 text-gray-200 hover:bg-neutral-700 hover:text-gray-300"
      >
        <span className="p-2">{title}</span>
        <ChevronDownIcon className="px-2 h-8 w-8" />
      </button>
      <ul className="bg-neutral-800 text-gray-200 rounded w-36">
        {showOptions &&
          options.map(({ text, onClick }) => (
            <li
              className="h-8 flex flex-row items-center rounded cursor-pointer hover:text-gray-400 hover:bg-neutral-700"
              onClick={() => handleClick(onClick)}
            >
              <span className="mx-2 p-1 h-6 flex justify-center items-center rounded">
                {text}
              </span>
            </li>
          ))}
      </ul>
    </>
  )
}

export default Dropdown
