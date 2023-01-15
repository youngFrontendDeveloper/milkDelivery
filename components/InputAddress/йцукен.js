import DatePicker from "react-datepicker";
import OrderDate from "../OrderDate/OrderDate";
import styles from "../../styles/Form.module.scss";
import getDay from "date-fns/getDay";
import { addDays } from "date-fns";
import { useForm, Controller } from "react-hook-form";

function DatePickerWrapper({ control, register, errors }) {
  // const { control,  } = useForm();
  const isWeekday = (date) => {
    const day = getDay( date );
    return day !== 0 && day !== 1 && day !== 2 && day !== 3 && day !== 4 && day !== 5;
  };


  return <Controller

    control={ control }
    name="deliveryDate"
   { ...register  }
    render={ ({ field }) => (
      <div className={ styles[ "react-datepicker-wrapper" ] }>
        <DatePicker
          // style={ { width: "100%" } }
          className={ `${ styles[ "form__input" ] } ${ styles[ "form__input--date" ] } ` }
          dateFormat="dd.MM.yy"
          // selected={ value }
          // selected={ field.value }

          minDate={ new Date() }
          maxDate={ addDays( new Date(), 22 ) }
          onChange={ (date) => field.onChange( date ) }
          // onChange={ onChange }
          // onChange={ (date) => {
          //   setStartDate( date );
          // } }
          // onBlur={onBlur}
          filterDate={ isWeekday }
          calendarStartDay={ 1 }
          placeholderText="Выберите день доставки"
          // value={ startDate } //{ ...register }
        />
        { errors && <p className={ styles.error }>{ errors.message }</p> }
      </div>
      // <DatePicker
      //   onBlur={onBlur} // notify when input is touched
      //   onChange={(date) => onChange(date.getTime())} // send value to hook form
      //   checked={new Date(value)}
      //   inputRef={ref}
      // />
    ) }
  />;
}

export default DatePickerWrapper;