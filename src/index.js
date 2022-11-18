import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import countryCard from './templates/countryCard.hbs';
import countryItem from './templates/countryItem.hbs';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const onInput = event => {
  if (event.target.value === '') {
    countryInfoEl.innerHTML = '';
    countryListEl.innerHTML = '';
    return;
  }
    
  const countryName = event.target.value.trim();

  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length > 1 && data.length <= 10) {
        countryInfoEl.innerHTML = '';
        return (countryListEl.innerHTML = countryItem(data));
      } else {
        const createCountryCard = data => {
          countryListEl.innerHTML = '';
          countryInfoEl.innerHTML = countryCard(data);
        };
        let { name, capital, population, flags, languages } = data[0];
        let coyntryObj = {
          name,
          capital,
          population,
          flags,
          lengCh: Object.values(languages).join(', '),
        };
        createCountryCard(coyntryObj);
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        countryInfoEl.innerHTML = '';
        countryListEl.innerHTML = '';
      }
    });
}

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
