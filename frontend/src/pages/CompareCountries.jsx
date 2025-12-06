// components/CompareCountries.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Use separate API calls for basic info and detailed info
const BASIC_COUNTRIES_API = 'https://restcountries.com/v3.1/all?fields=name,flags,cca3';
const COVID_API = 'https://disease.sh/v3/covid-19/countries';

const CompareCountries = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([null, null]);
  const [countryData, setCountryData] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch(BASIC_COUNTRIES_API);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter out countries without common names and sort
        const sortedCountries = data
          .filter(country => country.name?.common && country.cca3)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to load countries list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const fetchCountryDetails = async (countryCode, index) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch detailed country info using the alpha endpoint (no fields limit)
      const countryResponse = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      if (!countryResponse.ok) {
        throw new Error(`Country data not found for ${countryCode}`);
      }
      
      const countryDataArray = await countryResponse.json();
      const country = countryDataArray[0];

      // Fetch COVID data with error handling
      let covidData = null;
      try {
        const covidResponse = await fetch(`${COVID_API}/${countryCode}`);
        if (covidResponse.ok) {
          covidData = await covidResponse.json();
        }
      } catch (covidError) {
        console.warn(`COVID data not available for ${countryCode}:`, covidError);
        // Continue without COVID data
      }

      // Format languages properly - handle object structure
      const languages = country.languages ? Object.values(country.languages) : [];
      
      // Format currencies properly
      const currencies = country.currencies ? 
        Object.values(country.currencies).map(curr => curr.name) : [];

      const formattedData = {
        name: country.name?.common || 'Unknown',
        officialName: country.name?.official || '',
        flag: country.flags?.png || country.flags?.svg,
        population: country.population || 0,
        area: country.area || 0,
        region: country.region || 'Unknown',
        subregion: country.subregion || 'Unknown',
        capital: country.capital?.[0] || 'N/A',
        languages: languages,
        currencies: currencies,
        timezones: country.timezones || [],
        covidCases: covidData?.cases || 0,
        covidDeaths: covidData?.deaths || 0,
        covidRecovered: covidData?.recovered || 0,
        covidActive: covidData?.active || 0,
        covidTests: covidData?.tests || 0,
        covidTodayCases: covidData?.todayCases || 0,
        covidTodayDeaths: covidData?.todayDeaths || 0,
      };

      const newCountryData = [...countryData];
      newCountryData[index] = formattedData;
      setCountryData(newCountryData);

    } catch (error) {
      console.error('Error fetching country details:', error);
      setError(`Failed to load data for selected country: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (country, index) => {
    const newSelected = [...selectedCountries];
    newSelected[index] = country;
    setSelectedCountries(newSelected);
    setError(null);
    
    if (country) {
      fetchCountryDetails(country.cca3, index);
    } else {
      // Clear the data if country is deselected
      const newCountryData = [...countryData];
      newCountryData[index] = null;
      setCountryData(newCountryData);
    }
  };

  const formatNumber = (num) => {
    if (num === 0 || num === null || num === undefined) return '0';
    return new Intl.NumberFormat().format(num);
  };

  const getComparisonColor = (value1, value2, higherIsBetter = false) => {
    if (value1 === null || value2 === null || value1 === undefined || value2 === undefined) return '';
    
    const num1 = typeof value1 === 'number' ? value1 : parseFloat(value1) || 0;
    const num2 = typeof value2 === 'number' ? value2 : parseFloat(value2) || 0;
    
    if (num1 === num2) return 'text-yellow-600 bg-yellow-50';
    
    const isFirstBetter = higherIsBetter ? num1 > num2 : num1 < num2;
    return isFirstBetter ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const swapCountries = () => {
    setSelectedCountries([selectedCountries[1], selectedCountries[0]]);
    setCountryData([countryData[1], countryData[0]]);
  };

  // Safe function to get languages array
  const getLanguages = (country) => {
    if (!country || !country.languages) return [];
    return Array.isArray(country.languages) ? country.languages : [];
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Compare Countries</h1>
          <p className="text-gray-600">Compare two countries side by side</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Loading for initial countries list */}
        {loading && !countries.length && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading countries list...</p>
          </div>
        )}

        {/* Country Selectors */}
        {countries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[0, 1].map((index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Country {index + 1}
                </h3>
                
                <select
                  value={selectedCountries[index]?.cca3 || ''}
                  onChange={(e) => {
                    const country = e.target.value ? 
                      countries.find(c => c.cca3 === e.target.value) : null;
                    handleCountrySelect(country, index);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Select a country...</option>
                  {countries.map((country) => (
                    <option key={country.cca3} value={country.cca3}>
                      {country.name.common}
                    </option>
                  ))}
                </select>

                {selectedCountries[index] && (
                  <div className="mt-4 flex items-center space-x-3">
                    <img
                      src={selectedCountries[index].flags?.png}
                      alt={`${selectedCountries[index].name.common} flag`}
                      className="w-12 h-8 object-cover rounded border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <span className="font-semibold text-gray-800">
                      {selectedCountries[index].name.common}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Swap Button */}
        {selectedCountries[0] && selectedCountries[1] && (
          <div className="flex justify-center mb-8">
            <button
              onClick={swapCountries}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Swap Countries</span>
            </button>
          </div>
        )}

        {/* Loading for comparison data */}
        {loading && (selectedCountries[0] || selectedCountries[1]) && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading comparison data...</p>
          </div>
        )}

        {/* Comparison Results */}
        {countryData[0] && countryData[1] && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-6 border-b border-gray-200">
              <div className="text-center">
                <img
                  src={countryData[0].flag}
                  alt={`${countryData[0].name} flag`}
                  className="w-16 h-12 object-cover rounded border mx-auto mb-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-gray-400 text-sm">No flag</div>
                <h3 className="font-bold text-lg text-gray-800">{countryData[0].name}</h3>
              </div>
              <div className="text-center flex items-center justify-center">
                <span className="text-gray-500 font-semibold">VS</span>
              </div>
              <div className="text-center">
                <img
                  src={countryData[1].flag}
                  alt={`${countryData[1].name} flag`}
                  className="w-16 h-12 object-cover rounded border mx-auto mb-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-gray-400 text-sm">No flag</div>
                <h3 className="font-bold text-lg text-gray-800">{countryData[1].name}</h3>
              </div>
            </div>

            {/* Basic Info Comparison */}
            <div className="p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h4>
              <div className="space-y-4">
                {[
                  { label: 'Population', key: 'population', format: formatNumber },
                  { label: 'Area (km²)', key: 'area', format: formatNumber },
                  { label: 'Region', key: 'region' },
                  { label: 'Subregion', key: 'subregion' },
                  { label: 'Capital', key: 'capital' },
                ].map((item) => (
                  <div key={item.key} className="grid grid-cols-3 gap-4 items-center">
                    <div className={`text-right p-3 rounded-lg ${getComparisonColor(
                      countryData[0][item.key], 
                      countryData[1][item.key],
                      item.key === 'population' || item.key === 'area'
                    )}`}>
                      {item.format ? item.format(countryData[0][item.key]) : (countryData[0][item.key] || 'N/A')}
                    </div>
                    <div className="text-center text-gray-500 font-medium">
                      {item.label}
                    </div>
                    <div className={`text-left p-3 rounded-lg ${getComparisonColor(
                      countryData[1][item.key], 
                      countryData[0][item.key],
                      item.key === 'population' || item.key === 'area'
                    )}`}>
                      {item.format ? item.format(countryData[1][item.key]) : (countryData[1][item.key] || 'N/A')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COVID-19 Comparison */}
            <div className="p-6 bg-gray-50">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">COVID-19 Statistics</h4>
              <div className="space-y-4">
                {[
                  { label: 'Total Cases', key: 'covidCases', format: formatNumber, higherIsBetter: false },
                  { label: 'Total Deaths', key: 'covidDeaths', format: formatNumber, higherIsBetter: false },
                  { label: 'Recovered', key: 'covidRecovered', format: formatNumber, higherIsBetter: true },
                  { label: 'Active Cases', key: 'covidActive', format: formatNumber, higherIsBetter: false },
                  { label: 'Tests', key: 'covidTests', format: formatNumber, higherIsBetter: true },
                ].map((item) => (
                  <div key={item.key} className="grid grid-cols-3 gap-4 items-center">
                    <div className={`text-right p-3 rounded-lg ${getComparisonColor(
                      countryData[0][item.key], 
                      countryData[1][item.key],
                      item.higherIsBetter
                    )}`}>
                      {item.format(countryData[0][item.key])}
                    </div>
                    <div className="text-center text-gray-500 font-medium">
                      {item.label}
                    </div>
                    <div className={`text-left p-3 rounded-lg ${getComparisonColor(
                      countryData[1][item.key], 
                      countryData[0][item.key],
                      item.higherIsBetter
                    )}`}>
                      {item.format(countryData[1][item.key])}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages Comparison */}
            <div className="p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Languages</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-right">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {getLanguages(countryData[0]).slice(0, 3).map((lang, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {lang}
                      </span>
                    ))}
                    {getLanguages(countryData[0]).length > 3 && (
                      <span className="text-gray-500 text-sm">
                        +{getLanguages(countryData[0]).length - 3} more
                      </span>
                    )}
                    {getLanguages(countryData[0]).length === 0 && (
                      <span className="text-gray-500 text-sm">No data</span>
                    )}
                  </div>
                </div>
                <div className="text-center text-gray-500 font-medium">
                  Languages
                </div>
                <div className="text-left">
                  <div className="flex flex-wrap gap-1">
                    {getLanguages(countryData[1]).slice(0, 3).map((lang, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {lang}
                      </span>
                    ))}
                    {getLanguages(countryData[1]).length > 3 && (
                      <span className="text-gray-500 text-sm">
                        +{getLanguages(countryData[1]).length - 3} more
                      </span>
                    )}
                    {getLanguages(countryData[1]).length === 0 && (
                      <span className="text-gray-500 text-sm">No data</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Currencies Comparison */}
            <div className="p-6 bg-gray-50">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Currencies</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-right">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {countryData[0].currencies.slice(0, 3).map((currency, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                        {currency}
                      </span>
                    ))}
                    {countryData[0].currencies.length > 3 && (
                      <span className="text-gray-500 text-sm">
                        +{countryData[0].currencies.length - 3} more
                      </span>
                    )}
                    {countryData[0].currencies.length === 0 && (
                      <span className="text-gray-500 text-sm">No data</span>
                    )}
                  </div>
                </div>
                <div className="text-center text-gray-500 font-medium">
                  Currencies
                </div>
                <div className="text-left">
                  <div className="flex flex-wrap gap-1">
                    {countryData[1].currencies.slice(0, 3).map((currency, idx) => (
                      <span key={idx} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                        {currency}
                      </span>
                    ))}
                    {countryData[1].currencies.length > 3 && (
                      <span className="text-gray-500 text-sm">
                        +{countryData[1].currencies.length - 3} more
                      </span>
                    )}
                    {countryData[1].currencies.length === 0 && (
                      <span className="text-gray-500 text-sm">No data</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!countryData[0] && !countryData[1] && !loading && countries.length > 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-gray-500 text-lg mb-2">
              Select two countries to compare
            </div>
            <p className="text-gray-400">Choose countries from the dropdowns above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareCountries;