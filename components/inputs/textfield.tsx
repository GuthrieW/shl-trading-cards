import { Field } from 'formik'

export const TextField = ({
  name,
  label,
  type,
  disabled = false,
  hidden = false,
}) => (
  <div className={`m-2 flex flex-row w-full ${hidden ? 'hidden' : ''}`}>
    <label htmlFor={name} className="flex-nowrap whitespace-nowrap">
      {label}:
    </label>
    <Field
      id={name}
      name={name}
      type={type}
      disabled={disabled}
      className="text-left ml-2 w-full disabled:bg-gray-200 outline outline-1 outline-offset-1 rounded"
    />
  </div>
)
