 // console.log('L', L);

// zoom 地圖最大可放大到 18
var map = L.map('map', {
  center: [24.1338065,120.658394],
  zoom: 16
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var violetIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var greyIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var markers = new L.MarkerClusterGroup().addTo(map);

/*=============================================
=            實際倒入資料            =
=============================================*/

var xhr = new XMLHttpRequest();

// 取得資料於本地端
// xhr.open("get", "data/points.json");
// 取得資料於遠端
xhr.open("get","https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json");
xhr.send();
// console.log('xhr', xhr);
xhr.onload = function(){
  var markerJsonData = JSON.parse(xhr.responseText).features;
  console.log('markerJsonData', markerJsonData);
  
  for( let i=0; i<markerJsonData.length; i++ ){
    var mask;
    /** 
     * 成人與小孩都有 -> greenIcon
     * 成人與小孩都沒有 -> greyIcon
     * 小孩 == 0 -> redIcon
     * 成人 == 0 -> violetIcon
    */
    if( markerJsonData[i].properties.mask_adult !== 0 && markerJsonData[i].properties.mask_child !== 0){
      mask = greenIcon;
    } else if ( markerJsonData[i].properties.mask_adult == 0 && markerJsonData[i].properties.mask_child == 0 ) {
      mask = greyIcon;
    } else if ( markerJsonData[i].properties.mask_child == 0 ) {
      mask = redIcon;
    } else if ( markerJsonData[i].properties.mask_adult == 0 ) {
      mask = violetIcon;
    }
    markers.addLayer(
      L.marker(
        [ 
          markerJsonData[i].geometry.coordinates[1], 
          markerJsonData[i].geometry.coordinates[0] 
        ], 
        { icon: mask }
      ).bindPopup(`
          <div style='text-align: center;'>
            <h1>${ markerJsonData[i].properties.name }</h1>
            <p>
              成人口罩數量：${markerJsonData[i].properties.mask_adult} <br>
              小孩口罩數量：${markerJsonData[i].properties.mask_child} <br>
              地址：${markerJsonData[i].properties.address} 
            </p>
          </div>
        `)
    )
  };
  map.addLayer(markers);
};

/*=====  End of 實際倒入資料  ======*/