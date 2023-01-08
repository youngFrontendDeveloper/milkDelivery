import "../styles/globals.css";
import { YMaps } from "@pbe/react-yandex-maps";
import { OrderContextProvider } from "../contexts/state";


export default function App({ Component, pageProps }) {
  return (
    <OrderContextProvider>
      <YMaps query={ {apikey: "5c6df3c1-4b9a-4049-b474-57d538acaeaf", lang: "en_RU" } }>
        <Component { ...pageProps } />
      </YMaps>
    </OrderContextProvider>
  );
}
