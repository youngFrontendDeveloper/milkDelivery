import "react-datepicker/dist/react-datepicker.css";
import styles from "../../styles/Form.module.scss";
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import getDay from "date-fns/getDay";
import { addDays } from "date-fns";



function OrderDate({ onDatePick, }) {

  const isWeekday = (date) => {
    const day = getDay( date );
    return day !== 0 && day !== 1 && day !== 2 && day !== 3 && day !== 4 && day !== 5;
  };

  const day = new Date().getUTCDate() + ( 6 - getDay( new Date() ) );
  const [ date, setDate ] = useState( new Date( `2023.01.${ day }` ) );


  // const ref = useRef()

  // console.log( getDay( new Date() ) + ( 6 - getDay( new Date() ) ) );
  // const date = new Date();
  // console.log( `${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() + 1 }` );
  // const [ startDate, setStartDate ] = useState( "" );
  // console.log( startDate );
  //
  // const inputRef = useRef()
  //
  // const {
  //   field: {
  //     onChange,
  //     onBlur,
  //     value,
  //     name,
  //     ref
  //   },
  //   // fieldState: { invalid, isTouched, isDirty },
  //   // formState: { touchedFields, dirtyFields }
  // } = useController( {
  //   name: formName,
  //   control,
  //   // rules: { required: true },
  // } );
  //
  //   console.log(ref);
  //
  // useEffect(() => {
  //   if (!ref.current) {
  //     return
  //   }

  //   const handleInputChange = (event) => {
  //     console.log(event);
  //   }
  //
  //   ref.current.addEventListener('change', handleInputChange)
  //
  //   return () => ref.current.removeEventListener('change', handleInputChange)
  //
  // }, [ref.current])

  useEffect( () => {
    onDatePick( date );
  }, [ date ] );


  return (
    <>
      <div className={ styles[ "react-datepicker-wrapper" ] }>
        <DatePicker
          style={ { width: "100%" } }
          className={ `${ styles[ "form__input" ] } ${ styles[ "form__input--date" ] } ` }
          dateFormat="dd.MM.yy"

          selected={ date }
          minDate={ new Date() }
          maxDate={ addDays( new Date(), 21 ) }
          // onBlur={ onBlur }
          filterDate={ isWeekday }
          calendarStartDay={ 1 }
          placeholderText="Выберите день доставки"
          onChange={ date => setDate( date ) }

          // value={ date.toLocaleDateString() }

          //{ ...register. }
          // ref={ (el) => {
          //   if (el) {
          //     ref( el.input )
          //     inputRef.current = el.input
          //   }
          // }}
          // customInput={<input
          //   type="text"
          //   name={name}
          //   onChange={(event) => {
          //     console.log(event);
          //     onChange(event);
          //   }}
          //   onBlur={onBlur}
          //   ref={el => {
          //     ref.current = el;
          //     inputRef(el);
          //   }}
          // />}
        />

      </div>

    </>
  );
}

export default OrderDate;