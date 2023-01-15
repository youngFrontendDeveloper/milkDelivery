import styles from "../../styles/Form.module.scss";
import {
  FullscreenControl,
  Map,
  Placemark,
  useYMaps,
  ZoomControl,
  Polygon, SearchControl,
} from "@pbe/react-yandex-maps";
import React, { useEffect, useId, useMemo, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import data from "../../const/data.json";

console.log( data.features.geometry.coordinates );
const INPUT_DEBOUNCE_DELAY = 500;

const getGeocodeError = (obj) => {
  if( !obj ) {
    return {
      error: "Адрес не найден",
      hint: "Уточните адрес"
    };
  }

  const precision = obj.properties.get( "metaDataProperty.GeocoderMetaData.precision" );

  switch( precision ) {
    case "exact":
      return;
    case "number":
    case "near":
    case "range":
      return {
        error: "Неточный адрес, требуется уточнение",
        hint: "Уточните номер дома"
      };
    case "street":
      return {
        error: "Неполный адрес, требуется уточнение",
        hint: "Уточните номер дома"
      };
    case "other":
    default:
      return {
        error: "Неполный адрес, требуется уточнение",
        hint: "Уточните адрес"
      };
  }

  return;
};

function InputAddress(props) {
  const suggestInputId = useId();
  const [ fullAddress, setFullAddress ] = useState( "" );
  const debouncedAddress = useDebounce( fullAddress, INPUT_DEBOUNCE_DELAY );
  const [ hint, setHint ] = useState( "" );
  const [ error, setError ] = useState( "" );
  const [ geoobj, setGeoobj ] = useState();

  const ymaps = useYMaps( [ "SuggestView", "geocode", "util.bounds" ] );

  const mapState = useMemo( () => {
    return geoobj
      ? ymaps.util.bounds.getCenterAndZoom(
        geoobj.properties.get( "boundedBy" ),
        [ "100%", 300 ]
      )
      : {
        center: [ 55.751574, 37.573856 ],
        zoom: 9
      };
  }, [ geoobj ] );


  const geocode = async(value) => {
    if( !value ) {
      return;
    }

    const res = await ymaps.geocode( value );

    const obj = res.geoObjects.get( 0 );
    const geocodeError = getGeocodeError( obj );

    return {
      error: geocodeError && geocodeError.error,
      hint: geocodeError && geocodeError.hint,
      geoobj: obj
    };
  };


  useEffect( () => {
    if( !ymaps ) {
      return;
    }

    const suggestView = new ymaps.SuggestView( suggestInputId );

    const handleSuggestSelect = async(event) => {
      const nextValue = event.originalEvent.item.value;
      const geocodeRes = await geocode( nextValue );

      if( geocodeRes.error ) {
        setError( geocodeRes.error );
        setHint( geocodeRes.hint );
      } else {
        setGeoobj( geocodeRes.geoobj );
      }

      setFullAddress( nextValue );
    };

    suggestView.events.add( "select", handleSuggestSelect );

    return () => {
      suggestView.events.remove( "select", handleSuggestSelect );
    };
  }, [ ymaps, suggestInputId ] );

  useEffect( () => {
    if( !debouncedAddress ) {
      return;
    }

    geocode( debouncedAddress );
  }, [ debouncedAddress ] );


  useEffect( () => {
    setHint( "" );
    setError( "" );
  }, [ fullAddress ] );

  const handleChange = (geoobj, mapState) => {
    if( !geoobj || !mapState ) {
      return props.onChange( {
        location: "",
        street: "",
        house: "",
        coordinates: [],
      } );
    }

    if( typeof props.onChange === "function" ) {
      props.onChange( {
        location: geoobj.getLocalities().join( ", " ),
        street: geoobj.getThoroughfare(),
        house: geoobj.getPremiseNumber(),
        coordinates: mapState.center,
      } );
    }
  };

  useEffect( () => {
    handleChange( geoobj, mapState );
  }, [ geoobj, mapState ] );


  return (
    <>
      <div>
        <p className={ styles.form__item }>
          <label htmlFor="locality" className={ styles.form__label }>Выберите адрес:</label>
          <input
            defaultValue={ props.defaultValue }
            className={ styles.form__input }
            type="text"
            id={ suggestInputId }
            onChange={ () => setGeoobj( undefined ) }
            onBlur={ () => handleChange( geoobj, mapState ) }
          />
        </p>
      </div>
      { props.errors && <p
        className={ styles.error }
      >
        { props.errors.message }
      </p> }

      <div>
        <p
          className={ styles.error }
        >{ error }</p>
        <p
          className={ styles.error }
        > { hint }</p>
      </div>

      <Map
        className={ styles.map }
        state={ mapState }
        modules={ [ "Placemark" ] }
      >

        <Polygon
          geometry={ data.features.geometry.coordinates }
          options={ {
            fillColor: "#00FF00",
            strokeColor: "#0000FF",
            opacity: 0.5,
            strokeWidth: 5,
            strokeStyle: "shortdash",
          } }
        />
        <ZoomControl />
        <FullscreenControl />
        {/*<GeolocationControl />*/ }
        {/*<SearchControl />*/ }
        { geoobj && mapState && mapState.center && <Placemark geometry={ mapState.center } /> }
      </Map>
    </>
  );
}

export default InputAddress;