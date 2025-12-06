import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const about = () => {
  const navigate = useNavigate()
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch countries data with required fields
        const countriesResponse = await fetch(import.meta.env.VITE_COUNTRIES_API);
        if (!countriesResponse.ok) {
          throw new Error(`Countries API failed with status: ${countriesResponse.status}`);
        }
        const countriesData = await countriesResponse.json();

        // Fetch COVID data
        const covidResponse = await fetch(import.meta.env.VITE_COVID_API);
        if (!covidResponse.ok) {
          throw new Error(`COVID API failed with status: ${covidResponse.status}`);
        }
        const covidData = await covidResponse.json();

        // Merge data
        const mergedData = countriesData.map(country => {
          let covidInfo = null;

          if (country.cca3) {
            covidInfo = covidData.find(covid =>
              covid.countryInfo?.iso3 === country.cca3
            );
          }

          if (!covidInfo && country.name?.common) {
            covidInfo = covidData.find(covid =>
              covid.country?.toLowerCase() === country.name.common.toLowerCase() ||
              (covid.countryInfo?.iso2 === country.cca2)
            );
          }

          return {
            id: country.cca3 || country.cca2,
            name: country.name?.common || 'Unknown Country',
            officialName: country.name?.official || '',
            flag: country.flags?.png || country.flags?.svg,
            population: country.population || 0,
            region: country.region || 'Unknown Region',
            subregion: country.subregion || '',
            capital: country.capital?.[0] || 'No capital',
            countryCode: country.cca3 || country.cca2,
            languages: country.languages || {},
            currencies: country.currencies || {},
            timezones: country.timezones || [],
            covidCases: covidInfo?.cases || 0,
            covidDeaths: covidInfo?.deaths || 0,
            covidRecovered: covidInfo?.recovered || 0,
            covidActive: covidInfo?.active || 0,
            covidTests: covidInfo?.tests || 0,
            covidTodayCases: covidInfo?.todayCases || 0,
            covidTodayDeaths: covidInfo?.todayDeaths || 0,
          };
        }).filter(country => country.name && country.name !== 'Unknown Country');

        // Sort countries by name
        mergedData.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(mergedData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter countries based on search term
  const filteredCountries = useMemo(() => {
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.officialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.capital.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCountries = filteredCountries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCountryClick = (countryCode) => {
    navigate(`/country/${countryCode}`);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading countries data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <h3 className="font-bold mb-2">Error Loading Data</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            World Countries & COVID-19 Stats
          </h1>
          <p className="text-gray-600">
            Explore {formatNumber(countries.length)} countries with their latest COVID-19 information
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search countries by name, region, or capital..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 pl-12 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Showing {formatNumber(filteredCountries.length)} of {formatNumber(countries.length)} countries
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Countries Grid */}
        {currentCountries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentCountries.map((country) => (
              <div
                key={country.id}
                onClick={() => handleCountryClick(country.countryCode)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 cursor-pointer transform hover:-translate-y-1"
              >
                {/* Flag */}
                <div className="h-32 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                  {country.flag ? (
                    <img
                      src={country.flag}
                      alt={`${country.name} flag`}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                {/* Country Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{country.name}</h3>
                  {country.officialName && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{country.officialName}</p>
                  )}

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Region:</span>
                      <span className="text-gray-800">{country.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Capital:</span>
                      <span className="text-gray-800">{country.capital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Population:</span>
                      <span className="text-gray-800">{formatNumber(country.population)}</span>
                    </div>
                  </div>

                  {/* COVID Stats */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                      COVID-19 Statistics
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
                        <div className="font-bold text-blue-700 mb-1">Cases</div>
                        <div className="text-blue-600 font-semibold">{formatNumber(country.covidCases)}</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2 text-center border border-red-100">
                        <div className="font-bold text-red-700 mb-1">Deaths</div>
                        <div className="text-red-600 font-semibold">{formatNumber(country.covidDeaths)}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors">
                        Click for details →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-gray-500 text-lg mb-2">
              No countries found matching "{searchTerm}"
            </div>
            <p className="text-gray-400">Try searching with different terms</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-8">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} • {formatNumber(filteredCountries.length)} countries
            </div>

            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default about