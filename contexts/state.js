import { createContext, useState, useMemo, useEffect } from "react";

export const OrderContext = createContext( {} );

export const OrderContextProvider = ({ children }) => {
  const [ orders, setOrders ] = useState( [

  ] );

  const value = useMemo( () => (
    {
      orders, setOrders
    }
  ), [ orders, setOrders ] );
  console.log( orders );
  return <OrderContext.Provider value={ value }>{ children }</OrderContext.Provider>;
};