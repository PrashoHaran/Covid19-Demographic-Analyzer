// components/VisualAnalytics.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const COUNTRIES_API = 'https://restcountries.com/v3.1/all?fields=name,flags,population,region,cca3,capital,area';
const COVID_API = 'https://disease.sh/v3/covid-19/countries';

const VisualAnalytics = () => {
  const [countries, setCountries] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('population');
  const [sortBy, setSortBy] = useState('value');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const countriesResponse = await fetch(COUNTRIES_API);
        const countriesData = await countriesResponse.json();
        
        const covidResponse = await fetch(COVID_API);
        const covidData = await covidResponse.json();
        
        const mergedData = countriesData.map(country => {
          const covidInfo = covidData.find(covid => 
            covid.countryInfo?.iso3 === country.cca3 || 
            covid.country === country.name?.common
          );
          
          return {
            id: country.cca3,
            name: country.name?.common,
            flag: country.flags?.png,
            population: country.population,
            area: country.area,
            region: country.region,
            capital: country.capital?.[0],
            covidCases: covidInfo?.cases || 0,
            covidDeaths: covidInfo?.deaths || 0,
            covidRecovered: covidInfo?.recovered || 0,
            covidActive: covidInfo?.active || 0,
            covidTests: covidInfo?.tests || 0,
          };
        }).filter(country => country.name);

        setCountries(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(countries.map(country => country.region))];
    return uniqueRegions.filter(region => region).sort();
  }, [countries]);

  const filteredAndSortedCountries = useMemo(() => {
    let filtered = countries;
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(country => country.region === selectedRegion);
    }
    
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;
      
      switch (selectedMetric) {
        case 'population':
          aValue = a.population;
          bValue = b.population;
          break;
        case 'area':
          aValue = a.area || 0;
          bValue = b.area || 0;
          break;
        case 'covidCases':
          aValue = a.covidCases;
          bValue = b.covidCases;
          break;
        case 'covidDeaths':
          aValue = a.covidDeaths;
          bValue = b.covidDeaths;
          break;
        default:
          aValue = a.population;
          bValue = b.population;
      }
      
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return sorted.slice(0, 20); // Show top 20
  }, [countries, selectedRegion, selectedMetric, sortBy, sortOrder]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getMetricLabel = (metric) => {
    const labels = {
      population: 'Population',
      area: 'Area (km²)',
      covidCases: 'COVID-19 Cases',
      covidDeaths: 'COVID-19 Deaths',
    };
    return labels[metric] || metric;
  };

  const getMaxValue = () => {
    if (filteredAndSortedCountries.length === 0) return 1;
    return Math.max(...filteredAndSortedCountries.map(country => {
      switch (selectedMetric) {
        case 'population': return country.population;
        case 'area': return country.area || 0;
        case 'covidCases': return country.covidCases;
        case 'covidDeaths': return country.covidDeaths;
        default: return country.population;
      }
    }));
  };

  const getBarColor = (country) => {
    const value = getCountryValue(country);
    const maxValue = getMaxValue();
    const percentage = (value / maxValue) * 100;
    
    if (selectedMetric.includes('covid')) {
      return percentage > 80 ? 'bg-red-500' : 
             percentage > 60 ? 'bg-orange-500' : 
             percentage > 40 ? 'bg-yellow-500' : 
             percentage > 20 ? 'bg-blue-500' : 'bg-green-500';
    }
    
    return percentage > 80 ? 'bg-purple-600' : 
           percentage > 60 ? 'bg-blue-600' : 
           percentage > 40 ? 'bg-green-600' : 
           percentage > 20 ? 'bg-yellow-600' : 'bg-red-600';
  };

  const getCountryValue = (country) => {
    switch (selectedMetric) {
      case 'population': return country.population;
      case 'area': return country.area || 0;
      case 'covidCases': return country.covidCases;
      case 'covidDeaths': return country.covidDeaths;
      default: return country.population;
    }
  };

  const handleCountryClick = (countryCode) => {
    navigate(`/country/${countryCode}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Visual Analytics</h1>
          <p className="text-gray-600">Explore country data through interactive visualizations</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Metric Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="population">Population</option>
                <option value="area">Area</option>
                <option value="covidCases">COVID-19 Cases</option>
                <option value="covidDeaths">COVID-19 Deaths</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="value">Value</option>
                <option value="name">Name</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Top 20 Countries by {getMetricLabel(selectedMetric)}
          </h2>
          
          <div className="space-y-3">
            {filteredAndSortedCountries.map((country, index) => {
              const value = getCountryValue(country);
              const percentage = (value / getMaxValue()) * 100;
              
              return (
                <div
                  key={country.id}
                  onClick={() => handleCountryClick(country.id)}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="w-8 text-sm font-medium text-gray-500 text-right">
                    {index + 1}
                  </div>
                  
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-10 h-6 object-cover rounded border"
                  />
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {country.name}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {formatNumber(value)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${getBarColor(country)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{country.region}</span>
                      <span>{Math.round(percentage)}% of max</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Countries</h3>
            <p className="text-3xl font-bold text-blue-600">{filteredAndSortedCountries.length}</p>
            <p className="text-sm text-blue-600 mt-2">in {selectedRegion === 'all' ? 'all regions' : selectedRegion}</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Highest Value</h3>
            <p className="text-3xl font-bold text-green-600">
              {filteredAndSortedCountries.length > 0 ? formatNumber(getMaxValue()) : 0}
            </p>
            <p className="text-sm text-green-600 mt-2">
              {filteredAndSortedCountries.length > 0 ? filteredAndSortedCountries[0].name : 'N/A'}
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Average Value</h3>
            <p className="text-3xl font-bold text-purple-600">
              {filteredAndSortedCountries.length > 0 ? 
                formatNumber(Math.round(
                  filteredAndSortedCountries.reduce((sum, country) => sum + getCountryValue(country), 0) / 
                  filteredAndSortedCountries.length
                )) : 0}
            </p>
            <p className="text-sm text-purple-600 mt-2">average per country</p>
          </div>
        </div>

        {/* Region Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Regional Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {regions.map(region => {
              const regionCountries = countries.filter(country => country.region === region);
              const regionValue = regionCountries.reduce((sum, country) => sum + getCountryValue(country), 0);
              
              return (
                <div key={region} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-800">{region}</div>
                  <div className="text-2xl font-bold text-blue-600 my-2">
                    {formatNumber(regionValue)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {regionCountries.length} countries
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualAnalytics;