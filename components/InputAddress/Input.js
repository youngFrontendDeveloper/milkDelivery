import React from "react";
import ReactDOM from "react-dom";
// import { YMaps, Map } from "react-yandex-maps";
import {
  YMaps,
  Map,
  ZoomControl,
  FullscreenControl,
  SearchControl,
  GeolocationControl,
  Placemark
} from "@pbe/react-yandex-maps";
import styles from "../../styles/Form.module.scss";


function Input({ errors }) {

  const loadSuggest = ymaps => {
    const suggestView = new ymaps.SuggestView( "suggest" );
  };
  return (
    <>
      <div>
        <p className={ styles.form__item }>
          <label htmlFor="phone" className={ styles.form__label }>Адрес:</label>
          <input
            style={ { marginBottom: "50px" } }
            type="text"
            className={ errors ? styles.form__input : styles[ "form__input--error" ] }
            id="suggest"
            name="suggest"
            placeholder="Введите свой адрес"

          />
        </p>
        { errors && <p
          className="form--error"
        >
          { errors.message }
        </p> }
      </div>
      <YMaps>
        <Map
          style={ { width: "100%", height: "400px" } }
          onLoad={ ymaps => loadSuggest( ymaps ) }
          defaultState={ { center: [ 55.751574, 37.573856 ], zoom: 9 } }
          modules={ [ "Placemark", "geocode", "geoObject.addon.balloon", "SuggestView" ] }
        >
          <ZoomControl />
          <FullscreenControl />
          {/*<SearchControl />*/ }
          {/*<GeolocationControl />*/ }
          <Placemark geometry={ [ 55.684758, 37.738521 ] } />
        </Map>
      </YMaps>


    </>
  );
}


export default Input;