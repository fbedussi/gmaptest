const searchInput = document.querySelector('#searchInput');
const resetTextSearchButton = document.querySelector('#resetTextSearchButton');
var map;
var markers;

var data = [
    {
        dealer: {
            name: "Nord Impianti Srl",
            id: "a"
        },
        client: {
            name: "Autostrade",
            id: "b"
        },
        address: 'Via delle rose 1 40100 Brescia',
        ddt: 'DFDSF4545DFSDF',
        coordinates: {
            lat: 45.5060243,
            lng: 10.3348542
        },
        imageSrc: "https://www.creativelive.com/blog/wp-content/uploads/2016/01/pexels-photo-620x413.jpg",
        warrantyExpiryTime: 1536061896280,
        notes: '21/7/2016 Sostituzione antano\n5/7/2017 Strombatura supercazzola'
    },
    {
        dealer: {
            name: "SicurStrada Srl",
            id: "c"
        },
        client: {
            name: "Provincia di Brescia",
            id: "d"
        },
        address: 'Via Mazzini 2 80100 Sirmione',
        ddt: 'FSDFS98FS89DF8DS9',
        coordinates: {
            lat: 45.5086064,
            lng: 10.1722621
        },
        imageSrc: "https://www.creativelive.com/blog/wp-content/uploads/2016/01/lights-night-unsharp-blured-620x349.jpg",
        warrantyExpiryTime: 1536061896280,
        notes: '10/12/2017 Sostituzione batteria\n2/2/2018 Sostituzione cavo',
    }
]

function setupMarkerOnMap(map) {
    const dateFormatter = new Intl.DateTimeFormat('it-it', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return function setupMarker(markerInfo) {
        var contentString = `<div class="infowindow">
        <img class="infowindow__img" src="${markerInfo.imageSrc}"/>
        <dl>
          <dt class="infowindow__label">Rivenditore: </dt>
          <dd class="infowindow__content">${markerInfo.dealer.name}</dd>
          <dt class="infowindow__label">Cliente: </dt>
          <dd class="infowindow__content">${markerInfo.client.name}</dd>
          <dt class="infowindow__label">Indirizzo:</dt>
          <dd class="infowindow__content">${markerInfo.address}</dd>
          <dt class="infowindow__label">DDT Detas:</dt>
          <dd class="infowindow__content">${markerInfo.ddt}</dd>
          <dt class="infowindow__label">Scadenza garanzia: </dt>
          <dd class="infowindow__content">${dateFormatter.format(new Date(markerInfo.warrantyExpiryTime))}</dd>
          <dt class="infowindow__label">Note:</dt>
          <dd class="infowindow__content">${markerInfo.notes.replace('\n', '<br/>')}</dd>
        </dl>
      </div>`;
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        var isOpen = false;
        var marker = new google.maps.Marker({ position: markerInfo.coordinates, map: map });
        marker.addListener('click', function () {
            infowindow[isOpen ? 'close' : 'open'](map, marker);
            isOpen = !isOpen;
        });
        marker.dinamco = {
            infowindow,
        }

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
    markers = data.map(setupMarker);
}

function isSearchTermInMarkerText(marker, searchTerm) {
    return marker.dinamco.infowindow.content.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
}

function filterMarkerBySearchTerm(searchTerm) {
    return function(marker) {
        const isVisible = isSearchTermInMarkerText(marker, searchTerm);
        marker.setVisible(isVisible);
        if (!isVisible) {
            marker.dinamco.infowindow.close(map, marker);
        }
        return marker;
    }
}

function performSearch(searchTerm) {
    markers = markers.map(filterMarkerBySearchTerm(searchTerm));
}

searchInput.addEventListener('keyup', function() {
    performSearch(this.value);
});

resetTextSearchButton.addEventListener('click', function() {
    searchInput.value = '';
    performSearch('');
})