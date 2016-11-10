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
var airports = [];

google.load('visualization', '1', {'packages':['table']});

function openIW(FTevent) {
  // infoWindow.setContent(FTevent.infoWindowHtml);
  // infoWindow.setPosition(FTevent.latLng);
  var button;
  var code = FTevent.row['adm0_a3'].value.substr(0,2);
  var color = FTevent.row['map_color'].value;
  var content;
  var count = 0;
  var element;
  var flights = null;
  var height;
  var link;
  var safe = false;
  country = FTevent.row['admin'].value;
  if (country == 'Russia' || country == 'Lithuania') {
    content = '<b>' + country + '<br>Warning!</b> This country has freedom of expression laws<br>that can be used to target homosexuality!';
    // update articles if country is on the danger list
    document.getElementById('left').style.borderStyle = 'outset';
    document.getElementById('right').style.borderStyle = 'inset';
    document.getElementById('articles').style.marginTop = '-340px';
    document.getElementById('articles').src = 'https://76crimes.com/tag/' + country;
  } else if (color == '5') {
    content = '<b>' + country + '<br>Danger! </b>In this country homosexuality in punishable by death.<br>Use extreme caution when visiting this country!';
    // update articles if country is on the danger list
    while (country.indexOf(' ') >= 0){
      country = country.substr(0, country.indexOf(' ')) + '-' + country.substr(country.indexOf(' ') + 1);
    }
    document.getElementById('left').style.borderStyle = 'outset';
    document.getElementById('right').style.borderStyle = 'inset';
    document.getElementById('articles').style.marginTop = '-340px';
    document.getElementById('articles').src = 'https://76crimes.com/tag/' + country;
  } else if (color == '4') {
    content = '<b>' + country + '<br>Warning! </b>This country has laws against homosexuality.';
    // update articles if country is on the danger list
    while (country.indexOf(' ') >= 0){
      country = country.substr(0, country.indexOf(' ')) + '-' + country.substr(country.indexOf(' ') + 1);
    }
    document.getElementById('left').style.borderStyle = 'outset';
    document.getElementById('right').style.borderStyle = 'inset';
    document.getElementById('articles').style.marginTop = '-340px';
    document.getElementById('articles').src = 'https://76crimes.com/tag/' + country;
  } else {
    content = '<b>' + country + '</b><br>This country is LGTB friendly!';
    while (country.indexOf(' ') >= 0){
      country = country.substr(0, country.indexOf(' ')) + '_' + country.substr(country.indexOf(' ') + 1);
    }
    if (country == 'United_States_of_America') {
      country = 'United_States';
    }
    document.getElementById('left').style.borderStyle = 'inset';
    document.getElementById('right').style.borderStyle = 'outset';
    document.getElementById('articles').style.marginTop = '0px';
    document.getElementById('articles').src = 'https://en.wikipedia.org/wiki/List_of_LGBT_events#' + country;
    safe = true;
  }
  document.getElementById('articles').style.display = 'initial';
  infoWindow.setOptions(
    { 
     content: content,
     position: FTevent.latLng,
     pixelOffset: FTevent.pixelOffset
    });
  infoWindow.open(map);
  //Add flight booking feature
  if (safe) {
    for (var i = 0; i < airports.length; i++) {
      if (airports[i].country_code == code) {
        if (flights == null) {
          flights = document.createElement('div');
          flights.innerHTML = 'Book a flight to ' + FTevent.row['admin'].value;
          flights.classList.add('flight');
        }
        link = document.createElement('a');
        link.href = 'https://flights.airberlin.com/en-US/flights-to-melbourne';
        button = document.createElement('button');
        button.innerHTML = airports[i].name;
        link.appendChild(button);
        flights.appendChild(link);
        count++;
      }
    }
    if (count > 0) {
      document.getElementsByClassName('gm-style-iw')[0].parentNode.appendChild(flights);
      height = count * 20 + 25;
      flights.style.top = (50 - height) + 'px';
      element = document.getElementsByClassName('gm-style-iw')[0].parentNode;
      element.childNodes[1].style.top = (-1 * height) + 'px';
      element.childNodes[2].style.top = (-1 * height) + 'px';
      element = element.childNodes[0];
      element.childNodes[1].style.top = (-10 - height) + 'px';
      element.childNodes[1].style.height = (parseInt(element.childNodes[1].style.height.slice(0, -2)) + height + 10) + 'px';
      element.childNodes[3].style.top = (-10 - height) + 'px';
      element.childNodes[3].style.height = (parseInt(element.childNodes[3].style.height.slice(0, -2)) + height + 10) + 'px';
    }
  }
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
    }, {
      where: "admin = 'Lithuania'",
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
    document.getElementById('articles').style.marginTop = '-340px';
    document.getElementById('articles').src = 'https://76crimes.com/tag/' + country;
  });
  //Retreive list of AirBerlin airports
  var xmlhttp = new XMLHttpRequest();
  var url = "https://xap.ix-io.net/api/v1/airberlin_lab_2016/airports?fields%5Bairports%5D=name%2Clongitude%2Ccountry_code%2Ccity_code%2Clatitude%2Ccode&sort=code&page%5Bnumber%5D=1&page%5Bsize%5D=100";
  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var response = JSON.parse(xmlhttp.responseText);
          airports = response.airports;
      }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.setRequestHeader("Authorization", "ab16_Friendly_Borders:0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
  xmlhttp.setRequestHeader("Accept", "application/json")
  xmlhttp.send();
}