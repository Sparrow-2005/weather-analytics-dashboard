
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "../features/search/SearchBar";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to weather details only if logged in
  const handleCitySelect = (city) => {
    if (!isAuthenticated) {
      alert("Please log in to search for city forecasts.");
      return;
    }

    if (city.trim()) {
      navigate(`/weather/${city.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FA] via-[#B2EBF2] to-[#80DEEA] flex items-center justify-center px-6 transition-colors duration-500">
      {/* Centered Main Container */}
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-10 border border-blue-100/40 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300">
        
        {/* Header */}
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-8 tracking-wide">
          ☀️ WeatherWise
        </h1>

        {/* Subtext */}
        <p className="text-center text-gray-600 mb-10 text-lg">
          Search any city to explore its detailed forecast 🌍
        </p>

        {/* Search Bar */}
        <div className="mb-10 flex justify-center">
          <div className="w-full max-w-xl">
            <SearchBar onCitySelect={handleCitySelect} />
          </div>
        </div>

        {/* Login prompt for guests */}
        {!isAuthenticated && (
          <p className="text-center text-red-500 font-medium mb-4">
            You must log in to use the search feature.
          </p>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6 text-base">
          Stay informed with accurate weather analytics powered by WeatherWise ⚡
        </p>
      </div>
    </div>
  );
};

export default HomePage;
