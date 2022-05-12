document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('[data-element="dropdown"]') as HTMLElement;
  const list = document.querySelector('[data-element="list"]') as HTMLElement;
  const item = document.querySelector('[data-element="item"]') as HTMLElement;
  const hiddenInput = document.querySelector('input[name="countryCode"]') as HTMLInputElement;

  (async () => {
    // Start by clearing the list
    list.innerHTML = '';

    // Fetch countries from restcountries.com
    const countries = await getCountries();

    // Trace user location
    const location = await getLocation();

    // Loop through the countries and populate list items
    for (const country of countries) {
      const cloneItem = item.cloneNode(true) as HTMLElement;

      // Populating the item clone
      cloneItem.title = country.name.common;
      cloneItem.setAttribute('aria-title', country.name.common);
      cloneItem.setAttribute('data-cca2', country.cca2);
      (cloneItem.querySelector('[data-element="value"]') as HTMLElement).innerHTML = country.cca2;
      (cloneItem.querySelector('img') as HTMLImageElement).src = country.flags.svg;
      (cloneItem.querySelector('img') as HTMLImageElement).alt = country.name.common + ' Flag';

      // Attach click event listener
      cloneItem.addEventListener('click', () => {
        // Reset aria attributes and webflow's current states
        list.querySelectorAll('[data-element="item"]').forEach((e) => {
          e.setAttribute('aria-selected', 'false');
          e.classList.remove('w--current');
        });
        // Set the aria attribute and webflow's current state
        cloneItem.setAttribute('aria-selected', 'true');
        cloneItem.classList.add('w--current');
        // Set the dropdown values
        (dropdown.querySelector('[data-element="flag"]') as HTMLImageElement).src = country.flags.svg;
        (dropdown.querySelector('[data-element="flag"]') as HTMLImageElement).alt = country.name.common + ' Flag';
        (dropdown.querySelector('[data-element="value"]') as HTMLElement).innerHTML =
          country.idd.root + (country.idd.suffixes.length === 1 ? country.idd.suffixes : '');
        // Set the hidden input value
        hiddenInput.setAttribute('value', country.cca2);
      });
      // Append the clone to the list
      list.appendChild(cloneItem);
    }

    // Set default location onload
    (document.querySelector('[data-element="item"][data-cca2="' + location + '"]') as HTMLAnchorElement).click();
  })();
});

// Fetch countries
const getCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd');
    const countries = await response.json();

    return countries;
  } catch (e) {
    return [];
  }
};

// Trace user location
const getLocation = async () => {
  try {
    const response = await fetch('https://1.1.1.1/cdn-cgi/trace');
    const t = await response.text();

    let data = t.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
    data = '{"' + data.slice(0, data.lastIndexOf('","')) + '"}';
    const trace = JSON.parse(data);

    return trace.loc;
  } catch (e) {
    return 'US';
  }
};
