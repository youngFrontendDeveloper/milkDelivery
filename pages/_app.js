import "../styles/globals.css";
import { YMaps } from "@pbe/react-yandex-maps";
import { OrderContextProvider } from "../contexts/state";

export default function App({ Component, pageProps }) {
  return (
    <OrderContextProvider>
      <YMaps
        query={ {
          apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
          lang: "ru_RU"
        } }
      >
        <Component { ...pageProps } />
      </YMaps>
    </OrderContextProvider>
  );
}
