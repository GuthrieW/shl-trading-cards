export type DropdownOption = {
  text: string
  onClick: () => void
}

export type DropdownProps = {
  title: string
  options: DropdownOption[]
}

const Dropdown = ({ title, options }: DropdownProps) => (
  <select
    onChange={(event) => {
      const foundOption = options.find(
        (option) => option.text === event.target.value
      )
      if (foundOption) {
        foundOption.onClick()
      }
    }}
    className="h-8 p-2 flex flex-row justify-center items-center rounded bg-neutral-800 text-gray-200 hover:bg-neutral-700 hover:text-gray-300"
    defaultValue={options[0].text}
  >
    {[...options].map(({ text }, index) => (
      <option key={text}>{text}</option>
    ))}
  </select>
)

export default Dropdown
