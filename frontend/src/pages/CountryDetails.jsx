// components/CountryDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const CountryDetails = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [covidData, setCovidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch detailed country information
        const countryResponse = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}`
        );
        
        if (!countryResponse.ok) {
          throw new Error('Country not found');
        }

        const countryData = await countryResponse.json();
        const countryInfo = countryData[0];

        // Fetch COVID-19 data
        const covidResponse = await fetch(
          `https://disease.sh/v3/covid-19/countries/${countryCode}`
        );

        let covidInfo = null;
        if (covidResponse.ok) {
          covidInfo = await covidResponse.json();
        }

        // Format country data
        const formattedCountry = {
          name: countryInfo.name?.common,
          officialName: countryInfo.name?.official,
          flag: countryInfo.flags?.png,
          population: countryInfo.population,
          region: countryInfo.region,
          subregion: countryInfo.subregion,
          capital: countryInfo.capital?.[0] || 'No capital',
          languages: countryInfo.languages ? Object.values(countryInfo.languages) : [],
          currencies: countryInfo.currencies ? Object.values(countryInfo.currencies).map(curr => curr.name) : [],
          timezones: countryInfo.timezones || [],
          area: countryInfo.area,
          borders: countryInfo.borders || [],
          coatOfArms: countryInfo.coatOfArms?.png,
          maps: countryInfo.maps,
          startOfWeek: countryInfo.startOfWeek,
          status: countryInfo.status,
          unMember: countryInfo.unMember,
        };

        setCountry(formattedCountry);
        setCovidData(covidInfo);

      } catch (error) {
        console.error('Error fetching country details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (countryCode) {
      fetchCountryDetails();
    }
  }, [countryCode]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <h3 className="font-bold text-lg mb-2">Error Loading Country Details</h3>
            <p className="mb-4">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
              <Link 
                to="/"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Country Not Found</h2>
          <Link 
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Countries
          </button>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Flag */}
            <div className="flex-shrink-0">
              <img
                src={country.flag}
                alt={`${country.name} flag`}
                className="w-48 h-32 lg:w-64 lg:h-48 object-cover rounded-lg shadow-lg border border-gray-200"
              />
            </div>

            {/* Basic Info */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{country.name}</h1>
              <p className="text-xl text-gray-600 mb-6">{country.officialName}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Population:</span>
                    <span className="text-gray-800">{formatNumber(country.population)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Region:</span>
                    <span className="text-gray-800">{country.region}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Subregion:</span>
                    <span className="text-gray-800">{country.subregion}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Capital:</span>
                    <span className="text-gray-800">{country.capital}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Area:</span>
                    <span className="text-gray-800">
                      {country.area ? `${formatNumber(country.area)} km²` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">UN Member:</span>
                    <span className="text-gray-800">{country.unMember ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Status:</span>
                    <span className="text-gray-800 capitalize">{country.status || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Country Details */}
          <div className="space-y-6">
            {/* Languages */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {country.languages.length > 0 ? (
                  country.languages.map((language, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No languages data available</p>
                )}
              </div>
            </div>

            {/* Currencies */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Currencies</h3>
              <div className="flex flex-wrap gap-2">
                {country.currencies.length > 0 ? (
                  country.currencies.map((currency, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {currency}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No currencies data available</p>
                )}
              </div>
            </div>

            {/* Timezones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Timezones</h3>
              <div className="flex flex-wrap gap-2">
                {country.timezones.length > 0 ? (
                  country.timezones.slice(0, 6).map((timezone, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {timezone}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No timezones data available</p>
                )}
                {country.timezones.length > 6 && (
                  <span className="text-gray-500 text-sm">
                    +{country.timezones.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* COVID-19 Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">COVID-19 Statistics</h3>
              
              {covidData ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="text-blue-700 font-bold text-lg mb-1">Total Cases</div>
                    <div className="text-blue-600 text-2xl font-bold">{formatNumber(covidData.cases)}</div>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <div className="text-red-700 font-bold text-lg mb-1">Total Deaths</div>
                    <div className="text-red-600 text-2xl font-bold">{formatNumber(covidData.deaths)}</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="text-green-700 font-bold text-lg mb-1">Recovered</div>
                    <div className="text-green-600 text-2xl font-bold">{formatNumber(covidData.recovered)}</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="text-purple-700 font-bold text-lg mb-1">Active</div>
                    <div className="text-purple-600 text-2xl font-bold">{formatNumber(covidData.active)}</div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                    <div className="text-orange-700 font-bold text-lg mb-1">Today Cases</div>
                    <div className="text-orange-600 text-2xl font-bold">{formatNumber(covidData.todayCases)}</div>
                  </div>
                  
                  <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
                    <div className="text-pink-700 font-bold text-lg mb-1">Today Deaths</div>
                    <div className="text-pink-600 text-2xl font-bold">{formatNumber(covidData.todayDeaths)}</div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 col-span-2">
                    <div className="text-indigo-700 font-bold text-lg mb-1">Tests</div>
                    <div className="text-indigo-600 text-2xl font-bold">{formatNumber(covidData.tests)}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">No COVID-19 data available</div>
                  <p className="text-gray-500">COVID-19 statistics are not available for this country</p>
                </div>
              )}
            </div>

            {/* Additional Links */}
            {country.maps && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Maps & Location</h3>
                <div className="space-y-3">
                  {country.maps.googleMaps && (
                    <a
                      href={country.maps.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Google Maps
                    </a>
                  )}
                  {country.maps.openStreetMaps && (
                    <a
                      href={country.maps.openStreetMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      View on OpenStreetMap
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;