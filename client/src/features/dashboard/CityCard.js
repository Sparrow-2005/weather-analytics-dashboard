
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCurrentWeatherQuery } from "../../services/weatherApi";
import WeatherIcon from "../../components/WeatherIcon";

const CityCard = ({ city, onRemove }) => {
  const { unit } = useSelector((state) => state.settings); 
  const { data, error, isLoading } = useGetCurrentWeatherQuery(city, {
    pollingInterval: 60000, // Re-fetch every 60 seconds
  });

  if (isLoading)
    return (
      <div className="text-center text-gray-500 animate-pulse p-8 bg-white rounded-2xl shadow-md">
        Loading {city}...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 p-8 bg-white rounded-2xl shadow-md">
        Error fetching data for {city}
      </div>
    );

  const { current, location } = data;

  const temperature =
    unit === "F" ? (current.temp_c * 9) / 5 + 32 : current.temp_c;
  const tempUnit = unit === "F" ? "°F" : "°C";

  return (
    <div
      className="group bg-white border border-gray-200 rounded-3xl shadow-lg 
      hover:shadow-2xl hover:scale-105 hover:border-blue-300 
      transition-all duration-300 ease-out p-8 w-72 
      flex flex-col items-center justify-between"
    >
      {/* Weather Link Section */}
      <Link
        to={`/weather/${location.name}`}
        className="w-full text-center transition-transform duration-300 group-hover:translate-y-[-4px]"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {location.name},{" "}
          <span className="text-gray-500 text-sm">{location.country}</span>
        </h3>

        {/* Weather Icon */}
        <div className="flex justify-center my-6 transform group-hover:scale-110 transition-transform duration-300">
          <WeatherIcon code={current.condition.code} isDay={current.is_day} />
        </div>

        {/* Weather Info */}
        <div className="space-y-2 text-gray-700">
          <p className="text-lg">
            🌡️ <span className="font-semibold">{temperature.toFixed(1)}{tempUnit}</span>
          </p>
          <p className="text-base">
            💧 Humidity: <span className="font-medium">{current.humidity}%</span>
          </p>
          <p className="text-base">
            🌬️ Wind: <span className="font-medium">{current.wind_kph} kph</span>
          </p>
        </div>
      </Link>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(city)}
        className="mt-6 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 
        hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl 
        shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        Remove
      </button>
    </div>
  );
};

export default CityCard;
