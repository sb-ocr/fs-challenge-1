document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('[data-element="dropdown"]') as HTMLElement;
  const list = document.querySelector('[data-element="list"]') as HTMLElement;
  const item = document.querySelector('[data-element="item"]') as HTMLElement;
  const hiddenInput = document.querySelector('input[name="countryCode"]') as HTMLInputElement;

  (async () => {
    list.innerHTML = '';
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd');
    const countries = await response.json();
    // Trace user location
    fetch('https://1.1.1.1/cdn-cgi/trace')
      .then((trace) => {
        if (trace.ok) {
          return trace.text();
        }
        throw new Error('Trace went wrong');
      })
      .then((t) => {
        let data = t.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
        data = '{"' + data.slice(0, data.lastIndexOf('","')) + '"}';
        const jsondata = JSON.parse(data);
        hiddenInput.setAttribute('value', jsondata.loc);
      })
      .catch((e) => {
        hiddenInput.setAttribute('value', 'US');
        console.log(e);
      });
    // Loop and populate list items
    for (const country of countries) {
      const i = item?.cloneNode(true) as HTMLElement;
      // Populating the item clone
      (i.querySelector('[data-element="value"]') as HTMLElement).innerHTML = country.cca2;
      (i.querySelector('img') as HTMLImageElement).src = country.flags.svg;
      (i.querySelector('img') as HTMLImageElement).alt = country.name.common + ' Flag';
      i.title = country.name.common;
      i.setAttribute('aria-title', country.name.common);
      // Attach click event listener
      i.addEventListener('click', () => {
        list.querySelectorAll('[data-element="item"]').forEach((e) => {
          e.setAttribute('aria-selected', 'false');
          e.classList.remove('w--current');
        });
        i.setAttribute('aria-selected', 'true');
        i.classList.add('w--current');
        (dropdown.querySelector('[data-element="flag"]') as HTMLImageElement).src = country.flags.svg;
        (dropdown.querySelector('[data-element="flag"]') as HTMLImageElement).alt = country.name.common + ' Flag';
        (dropdown.querySelector('[data-element="value"]') as HTMLElement).innerHTML =
          country.idd.root + (country.idd.suffixes.length === 1 ? country.idd.suffixes : '');
        hiddenInput.setAttribute('value', country.cca2);
      });
      // Append the clone to the list
      list.appendChild(i);
    }
  })();
});
