import styles from "../../styles/Form.module.scss";
import "../../styles/Form.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, { useContext, useState, useMemo, useEffect } from "react";
import InputAddress from "../InputAddress/InputAddress";
import OrderDate from "../OrderDate/OrderDate";


const LOCAL_STORAGE_FIELDS_KEY = "Milk_order_field";

const getPricePerLiter = (liters) => {
  if( liters < 10 ) {
    return 85;
  }
  return 80;
};

const getPrice = (liters) => {
  const pricePerLiter = getPricePerLiter( liters );
  return liters * pricePerLiter;
};

const getStoredFields = () => {
  if( typeof window === "undefined" ) return {};

  const fields = localStorage.getItem( LOCAL_STORAGE_FIELDS_KEY );
  return fields ? JSON.parse( fields ) : {};
};

const storeFields = (fields) => {
  if( typeof window === "undefined" ) return;

  localStorage.setItem( LOCAL_STORAGE_FIELDS_KEY, JSON.stringify( fields ) );
};

function OrderForm(props) {

  const defaultValues = useMemo( getStoredFields, [] );
  const [ deliveryDate, setDeliveryDate ] = useState( "" );
  const [ note, setNote ] = useState( "" );
  const [ digitsCode, setDigitsCode ] = useState( "" );

  const nameRegExp = /[a-zA-zа-яА-яёЁ]$/;
  const phoneRegExp = /[+7][0-9]{10}$/;

  const validationSchema = Yup.object().shape( {
    name: Yup.string()
      .required( "Пожалуйста, заполните это поле" )
      .matches( nameRegExp, "Допускаются только латинские или кириллические буквы" )
      .min( 2, "В этом поле должно быть не менее 2-х символов" )
      .max( 15, "В этом поле должно быть не более 15-х символов" ),
    phone: Yup.string()
      .required( "Пожалуйста, заполните это поле" )
      .matches( phoneRegExp, "Телефон должен соответствовать виду: +79172546925" ),
    quantity: Yup.string()
      .required( "Пожалуйста, заполните это поле" ),
    area: Yup.string()
      .required( "Пожалуйста, заполните это поле" )
      .min( 5, "Пожалуйста, заполните это поле" ),
    entrance: Yup.string()
      .required( "Пожалуйста, заполните это поле" ),
    apartment: Yup.string()
      .required( "Пожалуйста, заполните это поле" ),
    locality: Yup.string()
      .required( "Введите населённый пункт" ),
    street: Yup.string(),
    house: Yup.string()
      .required( "Введите номер дома" ),
    coordinates: Yup.array().of( Yup.number() )
      .length( 2 , "Выберите адрес доставки"),
  } );

  const formOptions = {
    resolver: yupResolver( validationSchema ),
    mode: "all",
  };
  const { register, handleSubmit, reset, watch, formState: { errors }, setValue, trigger } = useForm( formOptions );
  const watchQuantity = watch( "quantity" );

  const inputLiters = watchQuantity ?? 0;

  const handleChangeSelect = (event) => {
    console.log( event.target.value );
  };

  const handleAddressChange = (loc) => {
    setValue( "locality", loc.location );
    setValue( "street", loc.street );
    setValue( "house", loc.house );
    setValue( "coordinates", loc.coordinates );
    trigger( [
      "locality",
      "street",
      "house",
      "coordinates"
    ] );
  };

  const onDatePick = (date) => {
    setDeliveryDate( date );
  };

  const onSubmit = (data) => {
    const body = {
      ...data,
      price: getPricePerLiter( data.quantity ),
      cost: getPrice( data.quantity ),
      deliveryDate: deliveryDate ? deliveryDate.getTime() : "",
      note,
      digitsCode
    };

    storeFields( body );

    fetch( "/api/order", {
      method: "POST",
      body: JSON.stringify( body )
    } );

  };

  const onError = (errors, e) => console.log( errors, e );

  useEffect( () => {
    for( const key in defaultValues ) {
      setValue( key, defaultValues[ key ] );
    }
  }, [] );

  return (
    <>
      <form onSubmit={ handleSubmit( onSubmit, onError ) } className={ styles.form }>
        <fieldset className={ styles.form__fieldset }>
          <legend className={ styles.form__legend }>Персональная информация</legend>
          <div>
            <p className={ styles.form__item }>
              <label htmlFor="name" className={ styles.form__label }>Имя:</label>
              <input
                className={ errors.name ? `${ styles.form__input } ${ styles[ "form__input--error" ] }` : styles.form__input }
                type="text"
                id="name"
                name="name"
                placeholder="Василий"
                { ...register( "name" ) }
              />
            </p>
            { errors.name && <p
              className={ styles.error }
            >
              { errors.name.message }
            </p> }
          </div>

        </fieldset>

        <fieldset className={ styles.form__fieldset }>
          <legend className={ styles.form__legend }>Контакты</legend>
          <div>
            <div className={ styles.form__item }>
              <label htmlFor="phone" className={ styles.form__label }>Телефон:</label>
              <input
                className={ errors.phone ? `${ styles.form__input } ${ styles[ "form__input--error" ] }` : styles.form__input }
                type="text"
                id="phone"
                name="phone"
                placeholder="+79271458923"
                { ...register( "phone" ) }
              />
            </div>
            { errors.phone && <p
              className={ styles.error }
            >
              { errors.phone.message }
            </p> }
          </div>

          <div>
            <div className={ styles.form__item }>
              <label htmlFor="area" className={ styles.form__label }>Выберите район:</label>
              <select
                required
                name="area" id="area"
                className={ styles.form__select }
                defaultValue={ "" }
                { ...register( "area" ) }
                onChange={ handleChangeSelect }
              >
                <option
                  value=""
                  hidden disabled
                >- Выберите значение -
                </option>
                <option value="Химкинский">Химкинский</option>
                <option value="Мытищинский">Мытищинский</option>
                <option value="Красногорский">Красногорский</option>
                <option value="Одинцовский">Одинцовский</option>
                <option value="Митино">Митино</option>
              </select>
            </div>
            { errors.area && <p
              className={ styles.error }
            >
              { errors.area.message }
            </p> }


            <InputAddress
              defaultValue={ [ defaultValues.locality, defaultValues.street, defaultValues.house ].filter( item => item ).join( ", " ) }
              onChange={ handleAddressChange }
              errors={ errors.coordinates }
            />

          </div>
          <div>
            <div className={ styles.form__item }>
              <label htmlFor="entrance" className={ styles.form__label }>Подъезд:</label>
              <input
                className={ errors.entrance ? `${ styles.form__input } ${ styles[ "form__input--error" ] }` : styles.form__input }
                type="text"
                id="entrance"
                name="entrance"
                placeholder="1"
                { ...register( "entrance" ) }
              />
            </div>
            { errors.entrance && <p
              className={ styles.error }
            >
              { errors.entrance.message }
            </p> }
          </div>

          <div>
            <div className={ styles.form__item }>
              <label htmlFor="apartment" className={ styles.form__label }>Квартира:</label>
              <input
                className={ errors.apartment ? `${ styles.form__input } ${ styles[ "form__input--error" ] }` : styles.form__input }
                type="text"
                id="apartment"
                name="apartment"
                placeholder="10"
                { ...register( "apartment" ) }
              />
            </div>
            { errors.apartment && <p
              className={ styles.error }
            >
              { errors.apartment.message }
            </p> }
          </div>

          <div>
            <div className={ styles.form__item }>
              <label htmlFor="digitsCode" className={ styles.form__label }>Код на двери подъезда:</label>
              <input
                onChange={ (e) => setDigitsCode( e.target.value ) }
                className={ styles.form__input }
                type="text"
                id="digitsCode"
                name="digitsCode"
                value={ digitsCode }
                placeholder="01"
              />
            </div>

          </div>
        </fieldset>

        <fieldset className={ styles.form__fieldset }>
          <legend className={ styles.form__legend }>Информация о заказе</legend>
          <div>
            <div className={ styles.form__item }>
              <label className={ styles.form__label }>Выберите день доставки:</label>

              <OrderDate
                // control={control}
                // name="orderDate"
                onDatePick={ onDatePick }

                // {...orderDateRegister}
                // inputRef={orderDateRef}
              />
            </div>
            { !deliveryDate && <p className={ styles.error }>Пожалуйста, заполните это поле </p> }
          </div>

          <div>
            <p className={ styles.form__item }>
              <label htmlFor="quantity" className={ styles.form__label }>Количество молока в литрах:</label>
              <input
                className={ errors.quantity ? `${ styles.form__input } ${ styles[ "form__input--error" ] }` : styles.form__input }
                type="number"
                id="quantity"
                placeholder="9"
                { ...register( "quantity" ) }

              />
            </p>
            { errors.quantity && <p
              className={ styles.error }
            >
              { errors.quantity.message }
            </p> }
          </div>
          <div>
            <div className={ styles.form__item }>
              <label htmlFor="price" className={ styles.form__label }>Цена за 1 литр в рублях :</label>
              <span
                className={ styles.form__input }
              >
          { getPricePerLiter( inputLiters ) }
            </span>
            </div>
          </div>

          <div>
            <div className={ styles.form__item }>
              <span className={ styles.form__label }>Стоимость в рублях :</span>
              <span
                className={ styles.form__input }
              >
          { getPrice( inputLiters ) }
            </span>
            </div>
          </div>

          <div>
            <div className={ styles.form__item }>
              <label htmlFor="note" className={ styles.form__label }>Примечание:</label>
              <textarea
                className={ styles.form__input }
                value={ note }
                id="note"
                name="note"
                onChange={ (e) => setNote( e.target.value ) }
              />
            </div>
          </div>
        </fieldset>

        <button type="submit" className={ styles.form__btn }>Отправить</button>
      </form>
    </>
  );
}

export default OrderForm;