import React, { ChangeEventHandler } from 'react'

type SearchBarProps = {
  onChange: ChangeEventHandler<HTMLInputElement>
  disabled?: boolean
}

const SearchBar = ({ onChange, disabled = false }: SearchBarProps) => (
  <input
    disabled={disabled}
    className="my-2 px-2 h-8 rounded-md border border-black text-black font-normal text-base w-full min-w-0 disabled:bg-neutral-500 disabled:cursor-default"
    type="text"
    placeholder="Search"
    onChange={onChange}
  />
)

export default SearchBar
