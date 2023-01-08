import { useRef, } from "react";
import { useYMaps, YMaps, Map, Placemark, ObjectManager } from "@pbe/react-yandex-maps";
import addresses from "../../public/addresses.json";
import { useEffect, useMemo } from "react";


function OrderMap() {
  const mapRef = useRef( null );
  const ymaps = useYMaps( [ "Map", "Placemark", "SuggestView" ] );

  useEffect(() => {
    if (!ymaps || !mapRef.current) {
      return;
    }

    new ymaps.Map(mapRef.current, {
      center: [55.76, 37.64],
      zoom: 10,
    });

    ymaps.ready(init);

    function init() {
      // Подключаем поисковые подсказки к полю ввода.
      var suggestView = new ymaps.SuggestView('suggest'),
        map,
        placemark;

      // При клике по кнопке запускаем верификацию введёных данных.
      $('#button').bind('click', function (e) {
        geocode();
      });

      function geocode() {
        // Забираем запрос из поля ввода.
        var request = $('#suggest').val();
        // Геокодируем введённые данные.
        ymaps.geocode(request).then(function (res) {
          var obj = res.geoObjects.get(0),
            error, hint;

          if (obj) {
            // Об оценке точности ответа геокодера можно прочитать тут: https://tech.yandex.ru/maps/doc/geocoder/desc/reference/precision-docpage/
            switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
              case 'exact':
                break;
              case 'number':
              case 'near':
              case 'range':
                error = 'Неточный адрес, требуется уточнение';
                hint = 'Уточните номер дома';
                break;
              case 'street':
                error = 'Неполный адрес, требуется уточнение';
                hint = 'Уточните номер дома';
                break;
              case 'other':
              default:
                error = 'Неточный адрес, требуется уточнение';
                hint = 'Уточните адрес';
            }
          } else {
            error = 'Адрес не найден';
            hint = 'Уточните адрес';
          }

          // Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
          if (error) {
            showError(error);
            showMessage(hint);
          } else {
            showResult(obj);
          }
        }, function (e) {
          console.log(e)
        })

      }
      function showResult(obj) {
        // Удаляем сообщение об ошибке, если найденный адрес совпадает с поисковым запросом.
        $('#suggest').removeClass('input_error');
        $('#notice').css('display', 'none');

        var mapContainer = $('#map'),
          bounds = obj.properties.get('boundedBy'),
          // Рассчитываем видимую область для текущего положения пользователя.
          mapState = ymaps.util.bounds.getCenterAndZoom(
            bounds,
            [mapContainer.width(), mapContainer.height()]
          ),
          // Сохраняем полный адрес для сообщения под картой.
          address = [obj.getCountry(), obj.getAddressLine()].join(', '),
          // Сохраняем укороченный адрес для подписи метки.
          shortAddress = [obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(' ');
        // Убираем контролы с карты.
        mapState.controls = [];
        // Создаём карту.
        createMap(mapState, shortAddress);
        // Выводим сообщение под картой.
        showMessage(address);
      }

      function showError(message) {
        $('#notice').text(message);
        $('#suggest').addClass('input_error');
        $('#notice').css('display', 'block');
        // Удаляем карту.
        if (map) {
          map.destroy();
          map = null;
        }
      }

      function createMap(state, caption) {
        // Если карта еще не была создана, то создадим ее и добавим метку с адресом.
        if (!map) {
          map = new ymaps.Map('map', state);
          placemark = new ymaps.Placemark(
            map.getCenter(), {
              iconCaption: caption,
              balloonContent: caption
            }, {
              preset: 'islands#redDotIconWithCaption'
            });
          map.geoObjects.add(placemark);
          // Если карта есть, то выставляем новый центр карты и меняем данные и позицию метки в соответствии с найденным адресом.
        } else {
          map.setCenter(state.center, state.zoom);
          placemark.geometry.setCoordinates(state.center);
          placemark.properties.set({iconCaption: caption, balloonContent: caption});
        }
      }

      function showMessage(message) {
        $('#messageHeader').text('Данные получены:');
        $('#message').text(message);
      }
    }
  }, [ymaps]);

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
      {/*<YMaps*/}
      {/*  query={ {*/}
      {/*    apikey: "29294198-6cdc-4996-a870-01e89b830f3e",*/}
      {/*    ns: "use-load-option",*/}
      {/*    load: "Map,Placemark,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon",*/}
      {/*  } }*/}
      {/*>*/}
      {/*  <Map*/}
      {/*    style={ { width: "100%", height: "400px" } }*/}
      {/*    state={ {*/}
      {/*      center: [ 55.775724, 37.56084 ],*/}
      {/*      zoom: 14,*/}
      {/*      controls: [ "zoomControl", "fullscreenControl" ],*/}
      {/*    } }*/}
      {/*    modules={ [ "control.ZoomControl", "control.FullscreenControl" ] }*/}
      {/*  >*/}
      {/*    <Placemark geometry={ [ 55.684758, 37.738521 ] } />*/}
      {/*    <ObjectManager*/}
      {/*      options={ {*/}
      {/*        clusterize: true,*/}
      {/*        gridSize: 32,*/}
      {/*        clusterDisableClickZoom: true*/}
      {/*      } }*/}
      {/*      objects={ {*/}
      {/*        openBalloonOnClick: true,*/}
      {/*        preset: "islands#greenDotIcon",*/}
      {/*      } }*/}
      {/*      clusters={ {*/}
      {/*        preset: "islands#redClusterIcons",*/}
      {/*      } }*/}
      {/*      filter={ (object) => object.id % 2 === 0 }*/}
      {/*      // defaultFeatures={objectManagerFeatures}*/}
      {/*      // defaultFeatures={ addresses }*/}
      {/*      modules={ [*/}
      {/*        "objectManager.addon.objectsBalloon",*/}
      {/*        "objectManager.addon.objectsHint",*/}
      {/*        // "objectManager.addon.objectsData",*/}
      {/*      ] }*/}
      {/*    />*/}
      {/*  </Map>*/}
      {/*</YMaps>*/}
    </>
  );
}

// function OrderMap(props) {
//   const point = useMemo( () => props.coordinates
//       ? [
//         Number( props.coordinates.lat ),
//         Number( props.coordinates.lon )
//       ]
//       : undefined,
//     [ props.coordinates ] );
//
//   return (
//     <YMaps
//       query={ {
//         ns: "use-load-option",
//         load: "Map,Placemark,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon",
//       } }
//     >
//       <Map
//         style={ { width: "100%", height: "300px" } }
//         state={ {
//           center: point ?? [ 55.75, 37.57 ],
//           zoom: 14,
//           controls: [ "zoomControl", "fullscreenControl" ],
//         } }
//         modules={ [ "control.ZoomControl", "control.FullscreenControl" ] }
//       >
//         {/*{ addresses.map( (item, i) =>*/ }
//         {/*  item.coordinates ? <Placemark*/ }
//         {/*    key={ i }*/ }
//         {/*    defaultGeometry={ [*/ }
//         {/*      item.coordinates.lat,*/ }
//         {/*      item.coordinates.lon*/ }
//         {/*    ] }*/ }
//         {/*  /> : null*/ }
//         {/*) }*/ }
//
//         { point &&
//           <Placemark
//             geometry={ point }
//           />
//         }
//
//         <ObjectManager
//           options={ {
//             clusterize: true,
//             gridSize: 32,
//           } }
//           objects={ {
//             openBalloonOnClick: true,
//             preset: "islands#greenDotIcon",
//           } }
//           clusters={ {
//             preset: "islands#redClusterIcons",
//           } }
//           filter={ (object) => object.id % 2 === 0 }
//           // defaultFeatures={objectManagerFeatures}
//           defaultFeatures={ addresses }
//           modules={ [
//             "objectManager.addon.objectsBalloon",
//             "objectManager.addon.objectsHint",
//           ] }
//         />
//       </Map>
//     </YMaps>
//   );
//
// }

export default OrderMap;