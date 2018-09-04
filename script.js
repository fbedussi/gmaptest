var map;
var marker;

var data = [
    {
        title: "Impianto sequenziale",
        dealer: {
            name: "Nord Impianti Srl",
            id: "a"
        },
        client: {
            name: "Autostrade",
            id: "b"
        },
        coordinates: {
            lat: 45.5060243,
            lng: 10.3348542
        },
        imageSrc: "https://www.creativelive.com/blog/wp-content/uploads/2016/01/pexels-photo-620x413.jpg",
        warrantyExpiryTime: 1536061896280
    },
    {
        title: "Controllo velocità",
        dealer: {
            name: "SicurStrada Srl",
            id: "c"
        },
        client: {
            name: "Provincia di Brescia",
            id: "d"
        },
        coordinates: {
            lat: 45.5086064,
            lng: 10.1722621
        },
        imageSrc: "https://www.creativelive.com/blog/wp-content/uploads/2016/01/lights-night-unsharp-blured-620x349.jpg",
        warrantyExpiryTime: 1536061896280
    }
]

function setupMarkerOnMap(map) {
    return function setupMarker(markerInfo) {
        var contentString = `<div>
        <h1 style="color: red">${markerInfo.title}</h1>
        <img src="${markerInfo.imageSrc}"/>
        <dl>
          <dt>Rivenditore: </dt>
          <dd>${markerInfo.dealer}</dd>
          <dt>Cliente: </dt>
          <dd>${markerInfo.client}</dd>
          <dt>Scadenza garanzia: </dt>
          <dd>${new Date(markerInfo.warrantyExpiryTime)}</dd>
        </dl>
      </div>`;
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        var isOpen = false;
        var marker = new google.maps.Marker({ position: markerInfo.coordinates, map: map, title: markerInfo.title });
        marker.addListener('click', function () {
            infowindow[isOpen ? 'close' : 'open'](map, marker);
            isOpen = !isOpen;
        });

        return marker;
    }
}

function getCentralCoordinate(coordiantes) {
    var { lat, lng } = coordiantes
        .reduce((result, coordinate) => {
            return ({
                lat: result.lat.concat(coordinate.lat),
                lng: result.lng.concat(coordinate.lng)
            })
        }
            , { lat: [], lng: [] });
    var averageLat = lat.reduce((l, tot) => tot + l, 0) / lat.length
    var averageLng = lng.reduce((l, tot) => tot + l, 0) / lng.length

    return {
        lat: averageLat,
        lng: averageLng
    }
}

function initMap() {
    var mapCenter = getCentralCoordinate(data.map((d) => d.coordinates));
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 12
    });
    var setupMarker = setupMarkerOnMap(map);
    data.forEach(setupMarker);
}
