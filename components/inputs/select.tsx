import { Field } from 'formik'

export const SelectField = ({ name, label, options, disabled = false }) => (
  <div className="m-2 flex justify-between">
    <label htmlFor={name}>{label}</label>
    <Field id={name} name={name} as="select" disabled={disabled}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
  </div>
)
