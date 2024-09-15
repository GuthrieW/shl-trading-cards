import { Field } from 'formik'

export const SelectField = ({ name, label, options, disabled = false }) => (
  <div className="m-2 flex flex-row w-full">
    <label htmlFor={name} className="flex-nowrap whitespace-nowrap">
      {label}:&nbsp;
    </label>
    <Field
      id={name}
      name={name}
      as="select"
      className="text-left ml-2 w-full bg-white disabled:bg-gray-200 outline outline-1 outline-offset-1 rounded"
      disabled={disabled}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
  </div>
)
