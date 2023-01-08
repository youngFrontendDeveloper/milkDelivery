// import styles from "../styles/Form.module.scss";
import "../styles/Form.module.scss";
// import Script from "next/script";
import Head from "next/head";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
import OrderForm from "../components/OrderForm/OrderForm";
import OrderMap from "../components/OrderMap/OrderMap";
import { useState } from "react";


export default function Home() {
  // const [ coordinates, setCoordinates ] = useState();


  return (
    <>
      <Head>
        <title>Form with Create Next App</title>
        <meta name="description" content="Generated form by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <main>
        <h2>Заказать молоко</h2>
        <OrderForm
          // onCoordinatesSelect={ setCoordinates }
        />
        <OrderMap
          // coordinates={ coordinates }
        />
        {/*<div id="header">*/}
        {/*  <input type="text" id="suggest" className="input" placeholder="Введите адрес" />*/}
        {/*  <button type="submit" id="button">Проверить</button>*/}
        {/*</div>*/}
        {/*<p id="notice">Адрес не найден</p>*/}
        {/*<div id="map" />*/}
        {/*<div id="footer" style={{marginBottom: "150px"}}>*/}
        {/*  <div id="messageHeader" />*/}
        {/*  <div id="message" />*/}
        {/*</div>*/}
      </main>
    </>
  );
}
