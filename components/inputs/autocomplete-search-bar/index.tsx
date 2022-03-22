import React from 'react'

type AutoCompleteSearchBarProps = {
  onChange: Function
  availableInputs: any[]
}

const AutoCompleteSearchBar = ({ onChange, availableInputs }) => (
  <input
    className="my-2 px-2 h-8 rounded-md border border-black text-black font-normal text-base "
    type="text"
    placeholder="Search"
    onChange={onChange}
  />
)

export default AutoCompleteSearchBar
