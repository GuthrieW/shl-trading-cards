import { Field } from 'formik'

export const TextField = ({
  name,
  label,
  type,
  disabled = false,
  hidden = false,
}) => (
  <div className={`m-2 flex justify-between ${hidden ? 'hidden' : ''}`}>
    <label htmlFor={name}>{label}</label>
    <Field id={name} name={name} type={type} disabled={disabled} />
  </div>
)
