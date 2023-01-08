import styles from "../../styles/Form.module.scss";
import { useState } from "react";


function Input({errors}) {

  const [ value, setValue ] = useState( "" );

  const handleChangeAddress = (event) => {
    const newValue = event.target.value;
    setValue( newValue );
    console.log( value );
  };
  return (
    <>
      <div>
        <p className={ styles.form__item }>
          <label htmlFor="locality" className={ styles.form__label }>Выберите адрес:</label>
          <input
            value={ value }
            onChange={ handleChangeAddress }

            className={ errors ? styles.form__input : styles[ "form__input--error" ] }
            type="text"
            id="address"
            name="address"
            placeholder="Москва, ул.  "
          />

        </p>
      </div>
    </>
  );
}

export default Input;