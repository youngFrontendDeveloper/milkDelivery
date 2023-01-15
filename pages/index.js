// import styles from "../styles/Form.module.scss";
import "../styles/Form.module.scss";
import Head from "next/head";
import OrderForm from "../components/OrderForm/OrderForm";


export default function Home() {

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
        />

      </main>
    </>
  );
}
