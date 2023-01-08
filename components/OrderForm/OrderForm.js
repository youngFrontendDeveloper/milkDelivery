import styles from "../../styles/Form.module.scss";
import "../../styles/Form.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useContext, useState, useEffect } from "react";
import { OrderContext } from "../../contexts/state";
import InputAddress from "../InputAddress/InputAddress";
import Input from "../InputAddress/Input";


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

function OrderForm(props) {

  const nameRegExp = /[a-zA-zа-яА-яёЁ]$/;
  const phoneRegExp = /[+7][0-9]{10}$/;

  const validationSchema = Yup.object().shape( {
    firstName: Yup.string()
      .required( "Пожалуйста, заполните это поле" )
      .matches( nameRegExp, "Допускаются только латинские или кириллические буквы" )
      .min( 2, "В этом поле должно быть не менее 2-х символов" )
      .max( 15, "В этом поле должно быть не более 15-х символов" ),
    patronymic: Yup.string()
      .required( "Пожалуйста, заполните это поле" )
      .matches( nameRegExp, "Допускаются только латинские или кириллические буквы" )
      .min( 2, "В этом поле должно быть не менее 2-х символов" )
      .max( 15, "В этом поле должно быть не более 15-х символов" ),
    phone: Yup.string()
      .required( "Пожалуйста, заполните это поле" )
      .matches( phoneRegExp, "Телефон должен соответствовать виду: +79172546925" ),
    quantity: Yup.number()
      .required( "Пожалуйста, заполните это поле" )

    // locality: Yup.string()
    //   .required( "Пожалуйста, заполните это поле" )
    //   .matches( nameRegExp, "Допускаются только латинские или кириллические буквы" )
    //   .min( 2, "В этом поле должно быть не менее 2-х символов" )
    //   .max( 20, "В этом поле должно быть не более 20-ти символов" ),
    // street: Yup.string()
    //   .required( "Пожалуйста, заполните это поле" )
    //   .matches( nameRegExp, "Допускаются только латинские или кириллические буквы" )
    //   .min( 2, "В этом поле должно быть не менее 2-х символов" )
    //   .max( 20, "В этом поле должно быть не более 20-ти символов" ),
    // house: Yup.string()
    //   .required( "Пожалуйста, заполните это поле" ),

    // email: Yup.string()
    //   .required( "Пожалуйста, заполните это поле" )
    //   .email( "Данные заполнены некорректно" ),

  } );

  const formOptions = { resolver: yupResolver( validationSchema ), mode: "onBlur", };
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm( formOptions );
  const watchQuantity = watch( "quantity" );
  const inputLiters = watchQuantity ?? 0;


  const onSubmit = (data) => {
    const body = {
      ...data,
      price: getPricePerLiter( data.quantity ),
      cost: getPrice( data.quantity )
    };
    fetch( "/api/order", {
      method: "POST",
      body: JSON.stringify( body )
    } );

    //
    alert( "Success" + JSON.stringify( data ) );
  };

  const onError = (errors, e) => console.log( errors, e );

  return (
    <>
      <form onSubmit={ handleSubmit( onSubmit, onError ) } className={ styles.form }>
        <fieldset className={ styles.form__fieldset }>
          <legend className={ styles.form__legend }>Персональная информация</legend>
          <div>
            <p className={ styles.form__item }>
              <label htmlFor="firstName" className={ styles.form__label }>Имя:</label>
              <input
                className={ errors ? styles.form__input : styles[ "form__input--error" ] }
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Василий"
                { ...register( "firstName" ) }
              />
            </p>
            { errors && <p
              className="form--error"
            >
              { errors.message }
            </p> }
          </div>
          <div>
            <p className={ styles.form__item }>
              <label htmlFor="patronymic" className={ styles.form__label }>Отчество:</label>
              <input
                className={ errors ? styles.form__input : styles[ "form__input--error" ] }
                type="text"
                id="patronymic"
                name="patronymic"
                placeholder="Иванович"
                { ...register( "patronymic" ) }
              />
            </p>
            { errors && <p
              className="form--error"
            >
              { errors.message }
            </p> }
          </div>
        </fieldset>

        <fieldset className={ styles.form__fieldset }>
          <legend className={ styles.form__legend }>Контакты</legend>
          <div>
            <p className={ styles.form__item }>
              <label htmlFor="phone" className={ styles.form__label }>Телефон:</label>
              <input
                className={ errors ? styles.form__input : styles[ "form__input--error" ] }
                type="text"
                id="phone"
                name="phone"
                placeholder="+79271458923"
                { ...register( "phone" ) }
              />
            </p>
            { errors && <p
              className="form--error"
            >
              { errors.message }
            </p> }
          </div>

          {/*<InputAddress onChange={(loc) => {*/ }
          {/*  if (loc && typeof props.onCoordinatesSelect === 'function') {*/ }
          {/*    props.onCoordinatesSelect({*/ }
          {/*      lat: loc.lat,*/ }
          {/*      lon: loc.lon,*/ }
          {/*    })*/ }
          {/*  }*/ }
          {/*}} />*/ }

          <Input errors={ errors } />

        </fieldset>
        <fieldset className={ styles.form__fieldset }>
          <legend className={ styles.form__legend }>Информация о заказе</legend>
          <div>
            <p className={ styles.form__item }>
              <label htmlFor="quantity" className={ styles.form__label }>Количество молока в литрах:</label>
              <input
                // onChange={ handleChangeQuantity }
                className={ errors ? styles.form__input : styles[ "form__input--error" ] }
                type="number"
                // value={ quantity }
                id="quantity"
                name="quantity"
                placeholder="9"
                { ...register( "quantity" ) }

              />
            </p>
            { errors && <p
              className="form--error"
            >
              { errors.message }
            </p> }
          </div>
          <div>
            <p className={ styles.form__item }>
              <label htmlFor="price" className={ styles.form__label }>Цена за 1 литр в рублях :</label>

              <span
                className="form__input"
              >
                { getPricePerLiter( inputLiters ) }
              </span>
            </p>

          </div>

          <div>
            <p className={ styles.form__item }>
              <label htmlFor="cost" className={ styles.form__label }>Стоимость в рублях :</label>
              <span
                className="form__input"
              >
                { getPrice( inputLiters ) }
              </span>
            </p>

          </div>
        </fieldset>

        <button type="submit" className={ styles.form__btn }>Отправить</button>
      </form>
    </>
  );
}

export default OrderForm;