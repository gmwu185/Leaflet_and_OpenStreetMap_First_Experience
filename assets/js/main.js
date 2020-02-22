// 畫面初始化執行函式
window.onload = function () {
  getLocation();
};

// 預設位置
var position = {
  lat: 24.1338065,
  lon: 120.658394,
  name: '臺中市',
}

// 取得裝置的地理位置
function getLocation() {

	if (navigator.geolocation) {
    function success(position) {
      position.lat = position.coords.latitude;
      position.lon = position.coords.longitude;
      console.log('getCurrentPosition() position.lat', position.lat);
      console.log('getCurrentPosition() position.lon', position.lon);
      runMap(position.lat, position.lon);
    };
    function error() {
      runMap(position.lat, position.lon);
    };
    navigator.geolocation.getCurrentPosition(success, error);
	} else {
    console.log('瀏灠器無法使用 Geolocation API');
    getIPLocation()
	}
}

// 由裝置IP來取得使用者的地理位置。採用 ipinfo.io 方案 (https://ipinfo.io/developers)
function getIPLocation() {
  var corsUrl = 'https://cors-anywhere.herokuapp.com/';
	var url = "https://ipinfo.io"
	$.getJSON(url, function(data) {
    console.log('data', data);
		var loc = data.loc.split(',');
		position.lat = parseFloat(loc[0]);
    position.lon = parseFloat(loc[1]);
    console.log('getJSON position.lat', position.lat);
    console.log('getJSON position.lon', position.lon);
	})
		.fail(function() {
      alert("不知道在那理，ipinfo.io 取不到地理座標位置");
      runMap(position.lat, position.lon);
    })
		.always(function() {
      
    });
}

// 執行使用地圖框架 (leaflet) 與圖資服務 (OSM)
function runMap(lat, lon) {
  
  // zoom 地圖最大可放大到 18
  var map = L.map('map', {
    center: [lat, lon],
    zoom: 16
  });
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  var greenIcon = new L.Icon({
    iconUrl: './assets/img/marker-icon-2x-green.png',
    shadowUrl: './assets/img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var redIcon = new L.Icon({
    iconUrl: './assets/img/marker-icon-2x-red.png',
    shadowUrl: './assets/img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var violetIcon = new L.Icon({
    iconUrl: './assets/img/marker-icon-2x-violet.png',
    shadowUrl: './assets/img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var greyIcon = new L.Icon({
    iconUrl: './assets/img/marker-icon-2x-grey.png',
    shadowUrl: './assets/img/marker-shadow.png',
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


  
  /*=============================================
  =            地圖圖標收閤按鍵            =
  =============================================*/
  
  $(".js-c-slideToggle__btn").click(function(e){
    $(".js-c-slideToggle__panel").slideToggle(200);
    // console.log('e', e);
  });
  $(document).keydown(function(e) {
    if (e.keyCode == 27) {
      $(".js-c-slideToggle__panel").hide(0);
    }
  });
  
  /*=====  End of 地圖圖標收閤按鍵  ======*/
  
};