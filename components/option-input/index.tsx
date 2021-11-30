import { Autocomplete } from '@material-ui/lab'
import { TextField } from '@material-ui/core'

export type OptionInputProps = {
  options: any[]
  loading: boolean
  groupBy: any
  getOptionLabel: any
  label: string
  onInputChange: any
}

const OptionInput = ({
  options,
  loading,
  groupBy,
  getOptionLabel,
  label,
  onInputChange,
}: OptionInputProps) => {
  return (
    <Autocomplete
      options={options}
      loading={loading}
      groupBy={groupBy}
      getOptionLabel={getOptionLabel}
      clearOnBlur={false}
      onInputChange={onInputChange}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
    />
  )
}

export default OptionInput
