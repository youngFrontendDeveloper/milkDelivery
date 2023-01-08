import styles from "../../styles/Form.module.scss";
import { YMaps } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

const INPUT_DEBOUNCE_DELAY = 300;

function InputAddress(props) {
  const [ value, setValue ] = useState( "" );
  const debouncedValue = useDebounce( value, INPUT_DEBOUNCE_DELAY );
  const [ isSuggestionsShown, setSuggestionsShown ] = useState( false );
  const [ responseList, setResponseList ] = useState( [] );
  const [ location, setLocation ] = useState();

  const handleChange = (e) => {
    const value = e.target.value;

    if( value === "" ) {
      setValue( "" );
      setResponseList( [] );
    } else {
      setValue( value );
    }
  };

  const handleSuggestionClick = (loc) => {
    setLocation( loc );
  };

  const handleShowSuggestions = () => {
    setSuggestionsShown( true );
  };
  const handleHideSuggestions = () => {
    setSuggestionsShown( false );
  };

  useEffect( () => {
    ( async() => {
      if( !debouncedValue ) {
        return;
      }

      const res = await fetch( `https://nominatim.openstreetmap.org/search/${ debouncedValue }?format=json&addressdetails=1&limit=10` ).then( res => res.json() );

      if( Array.isArray( res ) && res.length > 0 ) {
        setResponseList( res );
      }
    } )();
  }, [ debouncedValue ] );

  useEffect( () => {
    if( typeof props.onChange === "function" ) {
      props.onChange( location );
    }
  }, [ location ] );

  return (
    <>
      <div>
        <p className={ styles.form__item }>
          <label htmlFor="locality" className={ styles.form__label }>Выберите адрес:</label>
          <input
            value={ value }
            onChange={ handleChange }
            onFocus={ handleShowSuggestions }
            onBlur={ handleHideSuggestions }
            className="form__input"
            type="text"
            id="address"
            name="address"
          />

        </p>

        { isSuggestionsShown &&
          <div>
            { responseList.map( (item, i) => <div
              key={ i } onClick={ () => handleSuggestionClick( item ) }
            >
              { item.display_name }
              {/*{ item.address.city }, { item.address.road }, { item.address.house_number }*/ }
            </div> ) }
          </div>
        }
      </div>
    </>
  );
}

export default InputAddress;