// https://github.com/theoephraim/node-google-spreadsheet/
import { GoogleSpreadsheet } from "google-spreadsheet";
import { areaOrderMap } from "../../const/areaList";

const HEADER_AREA = "Район";
const HEADER_DELIVERY_DATE = "Дата доставки";
const HEADER_VALUES = [ "Дата заказа", "Имя", "Телефон", HEADER_AREA, "Населенный пункт", "Улица", "Дом", "Подъезд", "Код на двери", "Кв.", "Кол-во", "Цена", "Стоимость", HEADER_DELIVERY_DATE, "Примечание" ];

const doc = new GoogleSpreadsheet( process.env.GOOGLE_SHEET_ID );
doc.useServiceAccountAuth( {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
} );

const getOrderList = async(sheet) => {
  const rows = await sheet.getRows();
  const rowsRaw = rows.map( row => {
    return HEADER_VALUES.reduce( (acc, heading) => {
      return { ...acc, [ heading ]: row[ heading ] };
    }, {} );
  } );
  // console.log( rowsRaw );
  return rowsRaw;
};

const sortOrderListByArea = (orderList) => {
  return [ ...orderList ].sort( (a, b) => {
    const areaIndexA = areaOrderMap[ a[ HEADER_AREA ] ];
    const areaIndexB = areaOrderMap[ b[ HEADER_AREA ] ];
    return areaIndexA - areaIndexB;
  } );
};

const createNewOrderDetails = (data) => {
  const date = new Date();  // получаем дату отправления заказа
  return {
    "Дата заказа": date.toLocaleString(),
    "Имя": data.name,
    "Телефон": data.phone,
    [ HEADER_AREA ]: data.area,
    "Населенный пункт": data.locality,
    "Улица": data.street,
    "Дом": data.house,
    "Подъезд": data.entrance,
    "Код на двери": data.digitsCode,
    "Кв.": data.apartment,
    "Кол-во": data.quantity,
    "Цена": data.price,
    "Стоимость": data.cost,
    [ HEADER_DELIVERY_DATE ]: new Date( data.deliveryDate ).toLocaleDateString(),
    "Примечание": data.note
  };
};

export default async function handler(req, res) {
  if( req.method === "POST" ) {
    try {
      const body = JSON.parse( req.body );
      const newOrder = createNewOrderDetails( body );

      await doc.loadInfo();
      const sheet = doc.sheetsByTitle[ newOrder[ HEADER_DELIVERY_DATE ] ] ?? await doc.addSheet( {
        title: newOrder[ HEADER_DELIVERY_DATE ],
        headerValues: HEADER_VALUES
      } );
      const list = await getOrderList( sheet );

      const sortedList = sortOrderListByArea( [ ...list, newOrder ] );
      await sheet.clearRows();
      await sheet.addRows( sortedList );

      // console.log( doc.sheetsByTitle );

      res.status( 200 ).json( {} );

    } catch( err ) {
      res.status( 400 ).json( {
        error: "Invalid request body",
        message: JSON.stringify( err?.message ?? err )
      } );

      console.error( err );
    }

  } else {
    res.status( 200 ).json( { error: "This request should be POST" } );
  }

}

