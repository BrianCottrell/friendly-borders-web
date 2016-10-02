var country;
var layer; // Fusion Tables layer
var tableid = 423734; // Fusion Tables table id for Natural Earth Dataset
var zoom = 3; // Map zoom
var center = new google.maps.LatLng(37.55, -122.2); // Map center
var map; // Google Map
var table; // GViz Table visualization
var datatable; // Fusion Tables data in GViz Data Table object
var infoWindow = new google.maps.InfoWindow(); // InfoWindow
var runQuery = false;
var tablequery = "";

google.load('visualization', '1', {'packages':['table']});

function openIW(FTevent) {
  // infoWindow.setContent(FTevent.infoWindowHtml);
  // infoWindow.setPosition(FTevent.latLng);
  var content;
  var color = FTevent.row['map_color'].value;
  country = FTevent.row['admin'].value;
  if (country == 'Russia') {
    content = '<b>' + country + '<br>Warning!</b> This country has freedom of expression laws<br>that can be used to target homosexuality!';
    // update articles if country is on the danger list
    while (country.indexOf(' ') >= 0){
      country = country.substr(0, country.indexOf(' ')) + '_' + country.substr(country.indexOf(' ') + 1);
    }
    document.getElementById('left').style.borderStyle = 'outset';
    document.getElementById('right').style.borderStyle = 'inset';
    document.getElementById('articles').style.marginTop = '-300px';
    document.getElementById('articles').src = 'https://76crimes.com/tag/' + country;
  } else if (color == '5') {
    content = '<b>' + country + '<br>Danger! </b>In this country homosexuality in punishable by death.<br>Use extreme caution when visiting this country!';
    // update articles if country is on the danger list
    while (country.indexOf(' ') >= 0){
      country = country.substr(0, country.indexOf(' ')) + '_' + country.substr(country.indexOf(' ') + 1);
    }
    document.getElementById('left').style.borderStyle = 'outset';
    document.getElementById('right').style.borderStyle = 'inset';
    document.getElementById('articles').style.marginTop = '-300px';
    document.getElementById('articles').src = 'https://76crimes.com/tag/' + country;
  } else if (color == '4') {
    content = '<b>' + country + '<br>Warning! </b>This country has laws against homosexuality.';
    // update articles if country is on the danger list
    while (country.indexOf(' ') >= 0){
      country = country.substr(0, country.indexOf(' ')) + '_' + country.substr(country.indexOf(' ') + 1);
    }
    document.getElementById('left').style.borderStyle = 'outset';
    document.getElementById('right').style.borderStyle = 'inset';
    document.getElementById('articles').style.marginTop = '-300px';
    document.getElementById('articles').src = 'https://76crimes.com/tag/' + country;
  } else {
    content = '<b>' + country + '</b><br>This country is LGTB friendly!';
    while (country.indexOf(' ') >= 0){
      country = country.substr(0, country.indexOf(' ')) + '_' + country.substr(country.indexOf(' ') + 1);
    }
    document.getElementById('left').style.borderStyle = 'inset';
    document.getElementById('right').style.borderStyle = 'outset';
    document.getElementById('articles').style.marginTop = '0px';
    document.getElementById('articles').src = 'https://en.wikipedia.org/wiki/List_of_LGBT_events#' + country;
  }
  document.getElementById('articles').style.display = 'initial';
  infoWindow.setOptions(
    { 
     // content: FTevent.infoWindowHtml,
     content: content,
     position: FTevent.latLng,
     pixelOffset: FTevent.pixelOffset
    });
  infoWindow.open(map);
}

function initialize() {
  myLatLng = new google.maps.LatLng(0,-20);
  // these set the initial center, zoom and maptype for the map 
  // if it is not specified in the query string
  var maptype = google.maps.MapTypeId.ROADMAP;

  var myOptions = {
      zoom: zoom,
      center: myLatLng,
      mapTypeId: maptype
  };
  map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
  // Initialize the Fusion Tables Layer

  layer = new google.maps.FusionTablesLayer({
    query: {
      select: '*',
      from: '1KeS8DQE8gZVyRXISBE9AHgqThbd3_QioHLpYhEBI'
    },
    styles: [{
      polygonOptions: {
        fillColor: '#00FF66'
      }
    }, {
      where: 'map_color > 3',
      polygonOptions: {
        fillColor: '#AAAA33'
      }
    }, {
      where: 'map_color > 4',
      polygonOptions: {
        fillColor: '#FF6666'
      } 
    }, {
      where: "admin = 'Russia'",
      polygonOptions: {
        fillColor: '#99CC44'
      }
    }], 
    suppressInfoWindows: true
  });
  layer.setMap(map);
  google.maps.event.addListener(layer, 'click', openIW);

  document.getElementById('left').addEventListener('click', function() {
    this.style.borderStyle = 'inset';
    document.getElementById('right').style.borderStyle = 'outset';
    document.getElementById('articles').style.marginTop = '0px';
    document.getElementById('articles').src = 'https://en.wikipedia.org/wiki/List_of_LGBT_events#' + country;
  });

  document.getElementById('right').addEventListener('click', function() {
    this.style.borderStyle = 'inset';
    document.getElementById('left').style.borderStyle = 'outset';
    document.getElementById('articles').style.marginTop = '-300px';
    document.getElementById('articles').src = 'https://76crimes.com/tag/' + country;
  });
}