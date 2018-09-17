const searchInput = document.querySelector('#searchInput');
const resetTextSearchButton = document.querySelector('#resetTextSearchButton');
const searchAllBtn = document.querySelector('#searchAll');
const advancedSearchBtns = [].slice.call(document.querySelectorAll('.advancedSearch__btn'));
const advancedSearchSelects = [].slice.call(document.querySelectorAll('.advancedSearch__select'));
var map;
var markers;

const warrantyType = Object.freeze({
    gold: 1,
    silver: 2,
    bronze: 3,
});

var data = [
    {
        
        id: 'inst1',
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
            type: warrantyType.gold,
            expiryTime: Date.now() - 1000,
        },
        notes: '21/7/2016 Sostituzione antano\n5/7/2017 Strombatura supercazzola'
    },
    {
        id: 'inst2',
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
            type: warrantyType.silver,
            expiryTime: Date.now() + (1000 * 60 * 60 * 24 * 15),
        },
        notes: '10/12/2017 Sostituzione batteria\n2/2/2018 Sostituzione cavo',
    },
    {
        id: 'inst3',
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
            type: warrantyType.bronze,
            expiryTime: Date.now() + (1000 * 60 * 60 * 24 * 110),
        },
        notes: '10/12/2017 Sostituzione batteria\n2/2/2018 Sostituzione cavo',
    },
    {
        id: 'inst4',
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
            type: warrantyType.gold,
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

function debounce(fn, interval) {
    var oldTime = Date.now();
    var timeout;
    return function(...args) {
        var newTime = Date.now();
        clearTimeout(timeout);
        if (newTime - oldTime > interval) {
            fn.apply(fn, ...args);
            oldTime = newTime;
        } else {
            timeout = setTimeout(fn.bind(fn, args), interval);
        }
    }
}

function setupMarkerOnMap(map) {
    const dateFormatter = new Intl.DateTimeFormat('it-it', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return function setupMarker(installationData) {
        var contentString = `<div class="infowindow">
            <dl>
            <dt class="infowindow__label">Prodotto: </dt>
            <dd class="infowindow__content">${installationData.product}</dd>
            <dt class="infowindow__label">Rivenditore: </dt>
            <dd class="infowindow__content">${installationData.dealer.name}</dd>
            <dt class="infowindow__label">Cliente: </dt>
            <dd class="infowindow__content">${installationData.client.name}</dd>
            </dl>
        </div>`;
        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            disableAutoPan: true,
        });
        var marker = new google.maps.Marker({
            position: installationData.coordinates,
            map: map,
            title: installationData.product,
            icon: calculatePinColor(installationData.warranty.expiryTime),
        });
        marker.addListener('click', function () {
            var openWindow = window.open(`installation.html?id=${installationData.id}`, installationData.id, '');
            openWindow.installationInfo = installationData; // dataFromParent is a variable in child.html
            openWindow.addEventListener('load', function(){
                openWindow.init();
            });
        });
        marker.addListener('mouseover', debounce(function () {
            infowindow.open(map, marker);
        }, 150));
        marker.addListener('mouseout', debounce(function () {
            infowindow.close(map, marker);
        }, 150));
        marker.dinamco = {
            infowindow,
            installationData,
            isOpen: false,
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

function getFieldText(data, key) {
    switch (key) {
        case 'client':
        case 'dealer':
            return data[key].name;
        default:
            return data[key];
    }
}

function getTextToSearch(marker) {
    const fieldsToSearch = advancedSearchBtns
        .filter((btn) => btn.checked)
        .map((btn) => btn.dataset.fieldName);
    
    return Object.keys(marker.dinamco.installationData)
        .reduce((textToSearch, fieldName) => 
            fieldsToSearch.includes(fieldName) ? 
                textToSearch += ' ' + getFieldText(marker.dinamco.installationData, fieldName)
                : textToSearch, 
            '');
}

function isSearchTermInMarkerText(marker, searchTerm) {
    const textToSearch = getTextToSearch(marker);
    return textToSearch.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
}

function setMarkerVisibility(marker, isVisible) {
    marker.setVisible(isVisible);
    if (!isVisible) {
        marker.dinamco.infowindow.close(map, marker);
    }
    return marker;
}
function setMarkerVisibilityByCriteria(criteria) {
    return function (marker) {
        const isVisible = criteria(marker);
        return setMarkerVisibility(marker, isVisible);
    }
}

function performTextSearch(searchTerm) {
    markers = markers.map(setMarkerVisibilityByCriteria((marker) => isSearchTermInMarkerText(marker, searchTerm)));
}

function isKeyAndValueInMarker(marker, {key, value}) {
    return value === "all" 
        || marker.dinamco.installationData[key] 
        && (marker.dinamco.installationData[key] === value || 
            Object.keys(marker.dinamco.installationData[key]).some((subkey) => marker.dinamco.installationData[key][subkey] == value)
        ); 
}

function performIndexedSearch(keyAndValue) {
    markers = markers.map(setMarkerVisibilityByCriteria((marker) => isKeyAndValueInMarker(marker, keyAndValue)));
}

searchInput.addEventListener('keyup', function () {
    performTextSearch(this.value);
});

resetTextSearchButton.addEventListener('click', function () {
    searchInput.value = '';
    performTextSearch('');
});

searchAllBtn.addEventListener('click', function(ev) {
    advancedSearchBtns.forEach((btn) => btn.checked = this.checked);
    performTextSearch(searchInput.value);
});

advancedSearchBtns.forEach((btn) => btn.addEventListener('click', function(ev) {
    performTextSearch(searchInput.value);
}));

advancedSearchSelects.forEach((select) => select.addEventListener('change', function(ev) {
    const key = this.dataset.fieldName;
    const value = this.value;
    performIndexedSearch({key, value});
}));