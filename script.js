const searchInput = document.querySelector('#searchInput');
const resetTextSearchButton = document.querySelector('#resetTextSearchButton');
var map;
var markers;

var data = [
    {
        product: "Illuminazione sequenziale",
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
        warranty: {
            type: "Estesa",
            expiryTime: Date.now() - 1000,
        },
        notes: '21/7/2016 Sostituzione antano\n5/7/2017 Strombatura supercazzola'
    },
    {
        product: "Dissuasore di velocità",
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
        warranty: {
            type: "Standard",
            expiryTime: Date.now() + (1000 * 60 * 60 * 24 * 15),
        },
        notes: '10/12/2017 Sostituzione batteria\n2/2/2018 Sostituzione cavo',
    },
    {
        product: "Illuminazione galleria",
        dealer: {
            name: "DueBi Spa",
            id: "c2"
        },
        client: {
            name: "Comune di Brescia",
            id: "d2"
        },
        address: 'Corso Garibaldi 22 90100 Desenzano',
        ddt: 'KFKL98F879SFJK',
        coordinates: {
            lat: 45.4711908,
            lng: 10.5145592
        },
        imageSrc: "https://imgc.allpostersimages.com/img/print/posters/maximusnd-festive-background-with-natural-bokeh-and-bright-golden-lights-vintage-magic-background-with-color_a-G-13893087-14258384.jpg",
        warranty: {
            type: "Standard",
            expiryTime: Date.now() + (1000 * 60 * 60 * 24 * 110),
        },
        notes: '10/12/2017 Sostituzione batteria\n2/2/2018 Sostituzione cavo',
    },
    {
        product: "Led lampeggiante",
        dealer: {
            name: "Ippolito Spa",
            id: "c2"
        },
        client: {
            name: "Comune di Serle",
            id: "d2"
        },
        address: 'Via Po 34 20100 Serle (BS)',
        ddt: 'KFKL98F879SFJK',
        coordinates: {
            lat: 45.5647636,
            lng: 10.3199597
        },
        imageSrc: "https://images-na.ssl-images-amazon.com/images/I/71BMRSj0-YL._SL1500_.jpg",
        warranty: {
            type: "Standard",
            expiryTime: Date.now() + (1000 * 60 * 60 * 24 * 150),
        },
        notes: '10/12/2017 Sostituzione batteria\n2/2/2018 Sostituzione cavo',
    }
]

function calculatePinColor(expiryTime) {
    const daysLeft = (expiryTime - Date.now()) / (1000 * 60 * 60 * 24);
    var pinColor = daysLeft < 0 ? '888a85' : daysLeft < 30 ? 'cc0000' : daysLeft < 120 ? 'ed6c16' : '34ae15';

    return pinImage = new google.maps.MarkerImage(`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${pinColor}`,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));
}

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
            <dt class="infowindow__label">Prodotto: </dt>
            <dd class="infowindow__content">${markerInfo.product}</dd>
            <dt class="infowindow__label">Rivenditore: </dt>
            <dd class="infowindow__content">${markerInfo.dealer.name}</dd>
            <dt class="infowindow__label">Cliente: </dt>
            <dd class="infowindow__content">${markerInfo.client.name}</dd>
            <dt class="infowindow__label">Indirizzo:</dt>
            <dd class="infowindow__content">${markerInfo.address}</dd>
            <dt class="infowindow__label">DDT Detas:</dt>
            <dd class="infowindow__content">${markerInfo.ddt}</dd>
            <dt class="infowindow__label">Tipo garanzia: </dt>
            <dd class="infowindow__content">${markerInfo.warranty.type}</dd>
            <dt class="infowindow__label">Scadenza garanzia: </dt>
            <dd class="infowindow__content">${dateFormatter.format(new Date(markerInfo.warranty.expiryTime))}</dd>
            <dt class="infowindow__label">Note:</dt>
            <dd class="infowindow__content">${markerInfo.notes.replace('\n', '<br/>')}</dd>
            </dl>
        </div>`;
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        var isOpen = false;
        var marker = new google.maps.Marker({
            position: markerInfo.coordinates,
            map: map,
            title: markerInfo.product,
            icon: calculatePinColor(markerInfo.warranty.expiryTime),
        });
        marker.addListener('click', function () {
            infowindow[isOpen ? 'close' : 'open'](map, marker);
            isOpen = !isOpen;
            if (isOpen) {
                markers.forEach((m) => {
                    if (m.dinamco.infowindow !== infowindow) {
                        m.dinamco.infowindow.close(map, m);
                    }
                });
            }
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
    return function (marker) {
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

searchInput.addEventListener('keyup', function () {
    performSearch(this.value);
});

resetTextSearchButton.addEventListener('click', function () {
    searchInput.value = '';
    performSearch('');
})