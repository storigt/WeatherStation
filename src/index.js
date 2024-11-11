import { el, empty } from './lib/elements.js';
import { weatherSearch } from './lib/weather.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';


/**
 * @typedef {Object} SearchLocation
 * @property {string} title
 * @property {number} lat
 * @property {number} lng
 */

/**
 * Allar staðsetning sem hægt er að fá veður fyrir.
 * @type Array<SearchLocation>
 */
const locations = [
  {
    title: 'Mín staðsetning',
    lat: null,
    lng: null,
  },
  {
    title: 'Reykjavík',
    lat: 64.1355,
    lng: -21.8954,
  },
  {
    title: 'Akureyri',
    lat: 65.6835,
    lng: -18.0878,
  },
  {
    title: 'New York',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    title: 'Tokyo',
    lat: 35.6764,
    lng: 139.65,
  },
  {
    title: 'Sydney',
    lat: -33.8688,
    lng: 151.2093,
  },
];

/**
 * Birtir niðurstöður í viðmóti.
 * @param {SearchLocation} location
 * @param {Array<import('./lib/weather.js').Forecast>} results
 */
function renderResults(location, results) {
  const header = el(
    'tr',
    {},
    el('th', {}, 'Klukkutími'),
    el('th', {}, 'Hiti (°C)'),
    el('th', {}, 'Úrkoma (mm)'),
    el('th', {}, 'Vindur (m/s)'),
    el('th', {}, 'Raki (%)')
  );

  const bodyRows = results.map((forecast) =>
    el(
      'tr',
      {},
      el('td', {}, forecast.time.slice(11, 16)),
      el('td', {}, forecast.temperature),
      el('td', {}, forecast.precipitation === 0 ? '0' : forecast.precipitation),
      el('td', {}, forecast.windspeed),
      el('td', {}, forecast.humidity)
    )
  );

  const resultsTable = el('table', { class: 'forecast' }, header, ...bodyRows);

  const section = el(
    'section',
    {},
    el('h2', {}, location.title),
    el('p', {}, `Spá fyrir daginn í breiddargráðu ${location.lat.toFixed(4)} og lengdargráðu ${location.lng.toFixed(4)}`), // Display coordinates
    resultsTable
  );

  renderIntoResultsContent(section);

  renderMap(location.lat, location.lng);
}




/**
 * Birta villu í viðmóti.
 * @param {Error} error
 */
function renderError(error) {
  console.log(error);
  const message = error.message;
  renderIntoResultsContent(el('p', {}, `Villa: ${message}`));
}

/**
 * Birta biðstöðu í viðmóti.
 */
function renderLoading() {
  renderIntoResultsContent(el('p', {}, 'Leita...'));
}

/**
 * Framkvæmir leit að veðri fyrir gefna staðsetningu.
 * Birtir biðstöðu, villu eða niðurstöður í viðmóti.
 * @param {SearchLocation} location Staðsetning sem á að leita eftir.
 */
async function onSearch(location) {
  renderLoading();

  let results;
  try {
    results = await weatherSearch(location.lat, location.lng);
  } catch (error) {
    renderError(error);
    return;
  }

  renderResults(location, results ?? []);
}

/**
 * Framkvæmir leit að veðri fyrir núverandi staðsetningu.
 * Biður notanda um leyfi gegnum vafra.
 */
async function onSearchMyLocation() {
  if (!navigator.geolocation) {
    renderError(new Error("Geolocation is not supported by your browser"));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      renderLoading();
      try {
        const results = await weatherSearch(latitude, longitude);
        renderResults({ title: "Núverandi staðsetning", lat: latitude, lng: longitude }, results);
      } catch (error) {
        renderError(error);
      }
    },
    () => {
      renderError(new Error("Gat ekki sótt staðsetningu"));
    }
  );
}


/**
 * Býr til takka fyrir staðsetningu.
 * @param {string} locationTitle
 * @param {() => void} onSearch
 * @returns {HTMLElement}
 */
function renderLocationButton(locationTitle, onSearch) {
  // Notum `el` fallið til að búa til element og spara okkur nokkur skref.
  const locationElement = el(
    'li',
    { class: 'locations__location' },
    el(
      'button',
      { class: 'locations__button', click: onSearch },
      locationTitle,
    ),
  );

  /* Til smanburðar við el fallið ef við myndum nota DOM aðgerðir
  const locationElement = document.createElement('li');
  locationElement.classList.add('locations__location');
  const locationButton = document.createElement('button');
  locationButton.appendChild(document.createTextNode(locationTitle));
  locationButton.addEventListener('click', onSearch);
  locationElement.appendChild(locationButton);
  */

  return locationElement;
}

/**
 * Býr til grunnviðmót: haus og lýsingu, lista af staðsetningum og niðurstöður (falið í byrjun).
 * @param {Element} container HTML element sem inniheldur allt.
 * @param {Array<SearchLocation>} locations Staðsetningar sem hægt er að fá veður fyrir.
 * @param {(location: SearchLocation) => void} onSearch
 * @param {() => void} onSearchMyLocation
 */
function render(container, locations, onSearch, onSearchMyLocation) {
  const parentElement = document.createElement('main');
  parentElement.classList.add('weather');

  const headerElement = document.createElement('header');
  const heading = document.createElement('h1');
  heading.appendChild(document.createTextNode('Veðrið'));
  headerElement.appendChild(heading);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Veldu stað til að sjá hita- og úrkomuspá.';
  headerElement.appendChild(subtitle);

  parentElement.appendChild(headerElement);

  const locationsElement = document.createElement('div');
  locationsElement.classList.add('locations');

  const locationsListElement = document.createElement('ul');
  locationsListElement.classList.add('locations__list');
  locationsElement.appendChild(locationsListElement);

  for (const location of locations) {
    const buttonClickHandler =
      location.title === 'Mín staðsetning' ? onSearchMyLocation : () => onSearch(location);

    const liButtonElement = renderLocationButton(location.title, buttonClickHandler);
    locationsListElement.appendChild(liButtonElement);
  }

  parentElement.appendChild(locationsElement);

  const outputElement = document.createElement('div');
  outputElement.classList.add('output');
  parentElement.appendChild(outputElement);

  container.appendChild(parentElement);

    const searchForm = el(
      'form',
      { class: 'search-form', submit: onSearchByName },
      el('input', {
        type: 'text',
        name: 'location',
        placeholder: 'Leita að stað',
        required: true,
      }),
      el('button', { type: 'submit' }, 'Leita')
    );
  
    parentElement.appendChild(searchForm);
}


// Þetta fall býr til grunnviðmót og setur það í `document.body`
render(document.body, locations, onSearch, onSearchMyLocation);

function renderMap(lat, lng) {
  let mapContainer = document.getElementById('map');

  if (mapContainer) {
    mapContainer.parentNode.removeChild(mapContainer);
  }

  mapContainer = el('div', { id: 'map' });
  const outputElement = document.querySelector('.output');
  outputElement.appendChild(mapContainer);

  const map = L.map('map').setView([lat, lng], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, lng]).addTo(map);

  map.on('click', async function (e) {
    const { lat, lng } = e.latlng;

    renderLoading();
    try {
      const results = await weatherSearch(lat, lng);
      const location = {
        title: `Valin staðsetning (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat,
        lng,
      };
      renderResults(location, results);
    } catch (error) {
      renderError(error);
    }
  });
}

/**
 * Hreinsar fyrri niðurstöður, passar að niðurstöður séu birtar og birtir element.
 * @param {Element} element
 */
function renderIntoResultsContent(element) {
  const outputElement = document.querySelector('.output');

  if (!outputElement) {
    console.warn('fann ekki .output');
    return;
  }

  empty(outputElement);

  outputElement.appendChild(element);
}

async function onSearchByName(event) {
  event.preventDefault();

  const form = event.target;
  const locationName = form.location.value.trim();

  if (!locationName) {
    return;
  }

  renderLoading();

  try {
    const coords = await geocodeLocation(locationName);

    if (!coords) {
      renderError(new Error('Gat ekki fundið staðsetningu'));
      return;
    }

    const { lat, lng } = coords;
    const results = await weatherSearch(lat, lng);
    const location = {
      title: locationName,
      lat,
      lng,
    };
    renderResults(location, results);
  } catch (error) {
    renderError(error);
  }
}

async function geocodeLocation(locationName) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.search = new URLSearchParams({
    q: locationName,
    format: 'json',
    limit: 1,
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Villa við að sækja staðsetningu');
  }

  const data = await response.json();
  if (data.length === 0) {
    return null;
  }

  const { lat, lon } = data[0];
  return { lat: parseFloat(lat), lng: parseFloat(lon) };
}
