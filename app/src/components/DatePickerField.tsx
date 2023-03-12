import { useField } from 'formik';
import DatePicker from 'react-datepicker';

export const DatePickerField = ({ name, ...props }: any) => {
  const [field, meta, helpers] = useField(name);

  const { value } = meta;
  const { setValue } = helpers;

  return (
    <DatePicker
      {...props}
      {...field}
      selected={value}
      onChange={(date) => setValue(date)}
    />
  );
}
