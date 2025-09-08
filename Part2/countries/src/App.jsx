import { useState, useEffect } from "react";
import countryService from "./services/countries";
import axios from "axios"

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    countryService.getAll().then(data => setCountries(data));
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setSelectedCountry(null); // reset when typing
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div>
        find countries{" "}
        <input value={filter} onChange={handleFilterChange} />
      </div>

      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length > 1 ? (
        <ul>
          {filteredCountries.map(c => (
            <li key={c.cca3}>
              {c.name.common}{" "}
              <button onClick={() => setSelectedCountry(c)}>show</button>
            </li>
          ))}
        </ul>
      ) : filteredCountries.length === 1 ? (
        <Country country={filteredCountries[0]} />
      ) : (
        <p>No matches</p>
      )}

      {selectedCountry && <Country country={selectedCountry} />}
    </div>
  );
}
const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_SOME_KEY;

  useEffect(() => {
    const capital = country.capital[0];
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
      )
      .then(response => {
        setWeather(response.data);
      });
  }, [country, api_key]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />

      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>temperature {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default App;
