// https://github.com/theoephraim/node-google-spreadsheet/
import { GoogleSpreadsheet } from "google-spreadsheet";

const doc = new GoogleSpreadsheet( process.env.GOOGLE_SHEET_ID );
doc.useServiceAccountAuth( {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
} );

async function addRow(data) {
  await doc.loadInfo();

  // Создать новую таблицу
  // const sheet = await doc.addSheet( { headerValues: [ "name", "patronymic", "phone", "street", "house" ] } );
  // Переименовать таблицу
  // await doc.updateProperties({ title: 'Заказы' });

  const sheet = doc.sheetsByIndex[ 0 ];
  await sheet.addRows( [
    {
      "Имя": data.firstName,
      "Отчество": data.patronymic,
      "Телефон": data.phone,
      // "Населенный пункт": data.locality,
      // "Улица": data.street,
      // "Дом": data.house,
      "Количество": data.quantity,
      "Цена за 1 литр": data.price,
      "Стоимость": data.cost,
    }
  ] );

}

export default async function handler(req, res) {
  if( req.method === "POST" ) {
    try {
      const body = JSON.parse( req.body );
      await addRow( body );

      res.status( 200 ).json( {} );
    } catch( err ) {
      res.status( 400 ).json( {
        error: "Invalid request body",
        // message: JSON.stringify(err?.message ?? err)
      } );

      console.error( err );
    }

  } else {
    res.status( 200 ).json( { error: "This request should be POST" } );
  }

}