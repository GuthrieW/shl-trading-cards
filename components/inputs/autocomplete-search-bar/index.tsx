import React, { useMemo, useState } from 'react'

type AutoCompleteSearchBarProps = {
  onSelect: Function
  options: User[]
}

const AutoCompleteSearchBar = ({
  options,
  onSelect,
}: AutoCompleteSearchBarProps) => {
  const [searchText, setSearchText] = useState<string>('')

  const filteredOptions = useMemo(
    () =>
      options
        .filter((option) =>
          option.username.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a, b) =>
          a.username.toLowerCase().localeCompare(b.username.toLowerCase())
        )
        .slice(0, 10),
    [searchText]
  )

  console.log(filteredOptions)

  const onChange = (event) => {
    setSearchText(event.target.value)
  }

  return (
    <div>
      <input
        className="my-2 px-2 h-8 rounded-md border border-black text-black font-normal text-base "
        type="text"
        onChange={onChange}
      />
      {searchText.length !== 0 && (
        <div className="absolute mt-1 rounded-md shadow-lg overflow-y-auto">
          <div className="rounded-md bg-white shadow-xl">
            <div className="py-1">
              {filteredOptions.map((option: User) => (
                <div
                  className="flex w-full px-2 cursor-pointer hover:bg-neutral-400"
                  key={option.uid}
                  onClick={() => onSelect(option)}
                >
                  <label
                    className="cursor-pointer"
                    htmlFor={String(option.uid)}
                  >
                    {option.username}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AutoCompleteSearchBar
