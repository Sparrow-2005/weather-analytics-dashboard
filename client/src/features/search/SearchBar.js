
import React, { useState, useEffect, useRef } from "react";
import { useLazySearchCitiesQuery } from "../../services/weatherApi";
import useDebounce from "../../hooks/useDebounce";

const SearchBar = ({ onCitySelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [cache, setCache] = useState({});
  const [triggerSearch, { data: cities, isFetching }] =
    useLazySearchCitiesQuery();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const wrapperRef = useRef(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored);
  }, []);

  // Fetch cities when user types (with caching)
  useEffect(() => {
    const fetchCities = async () => {
      if (debouncedSearchTerm) {
        // Check cache first
        if (cache[debouncedSearchTerm]) {
          setShowDropdown(true);
        } else {
          triggerSearch(debouncedSearchTerm);
          setShowDropdown(true);
        }
      } else {
        setShowDropdown(false);
      }
    };
    fetchCities();
  }, [debouncedSearchTerm, triggerSearch, cache]);

  // Cache fetched data when available
  useEffect(() => {
    if (debouncedSearchTerm && cities) {
      setCache((prev) => ({
        ...prev,
        [debouncedSearchTerm]: cities,
      }));
    }
  }, [debouncedSearchTerm, cities]);

  // Detect outside click — close dropdown + clear input
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchTerm(""); // clear input when clicking outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle city select
  const handleSelect = (cityName) => {
    onCitySelect(cityName);
    setShowDropdown(false);
    setSearchTerm("");

    // Update recent searches
    const updated = [cityName, ...recentSearches.filter((c) => c !== cityName)];
    const trimmed = updated.slice(0, 5); // keep only last 5
    setRecentSearches(trimmed);
    localStorage.setItem("recentSearches", JSON.stringify(trimmed));
  };

  // Dropdown data source (cached if available)
  const displayedCities =
    debouncedSearchTerm && cache[debouncedSearchTerm]
      ? cache[debouncedSearchTerm]
      : cities;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      {/* Input */}
      <input
        type="text"
        placeholder="Search for a city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Loading */}
      {isFetching && (
        <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow p-3 text-center text-sm text-gray-500">
          Loading...
        </div>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <ul className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto z-10">
          {/* Show recent searches if no input */}
          {!searchTerm && recentSearches.length > 0 && (
            <>
              <li className="px-4 py-2 text-gray-500 text-sm bg-gray-50">
                Recent Searches
              </li>
              {recentSearches.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelect(city)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-700 transition"
                >
                  {city}
                </li>
              ))}
              <hr className="my-1" />
            </>
          )}

          {/* Show city suggestions */}
          {displayedCities &&
            searchTerm &&
            displayedCities.map((city) => (
              <li
                key={city.id}
                onClick={() => handleSelect(city.name)}
                className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-700 transition"
              >
                {city.name}, {city.country}
              </li>
            ))}

          {/* Empty state */}
          {searchTerm &&
            !isFetching &&
            (!displayedCities || displayedCities.length === 0) && (
              <li className="px-4 py-2 text-center text-gray-500">
                No results found
              </li>
            )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

