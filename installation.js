var installationInfo;
const dateFormatter = new Intl.DateTimeFormat('it-it', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

function init() {
    var contentString = `<div class="infowindow">
                <img class="infowindow__img" src="${installationInfo.imageSrc}"/>
                <dl>
                <dt class="infowindow__label">Prodotto: </dt>
                <dd class="infowindow__content">${installationInfo.product}</dd>
                <dt class="infowindow__label">Rivenditore: </dt>
                <dd class="infowindow__content">${installationInfo.dealer.name}</dd>
                <dt class="infowindow__label">Cliente: </dt>
                <dd class="infowindow__content">${installationInfo.client.name}</dd>
                <dt class="infowindow__label">Indirizzo:</dt>
                <dd class="infowindow__content">${installationInfo.address}</dd>
                <dt class="infowindow__label">DDT Detas:</dt>
                <dd class="infowindow__content">${installationInfo.ddt}</dd>
                <dt class="infowindow__label">Tipo garanzia: </dt>
                <dd class="infowindow__content">${installationInfo.warranty.type}</dd>
                <dt class="infowindow__label">Scadenza garanzia: </dt>
                <dd class="infowindow__content">${dateFormatter.format(new Date(installationInfo.warranty.expiryTime))}</dd>
                <dt class="infowindow__label">Note:</dt>
                <dd class="infowindow__content">${installationInfo.notes.replace('\n', '<br/>')}</dd>
                </dl>
            </div>`;
    console.log('content: ', contentString);
    document.querySelector('#installationDetails').innerHTML = contentString;
}