

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetForecastQuery } from "../services/weatherApi";
import TemperatureChart from "../features/charts/TemperatureChart";
import PrecipitationChart from "../features/charts/PrecipitationChart";

const DetailedWeatherPage = () => {
  const { city } = useParams();
  const { data, error, isLoading } = useGetForecastQuery({ city, days: 3 });

  // 🌡️ Toggle between Celsius and Fahrenheit
  const [unit, setUnit] = useState("C");
  const toggleUnit = () => setUnit((prev) => (prev === "C" ? "F" : "C"));

  // 🌡️ Conversion helper
  const convertTemp = (tempC) => (unit === "C" ? tempC : (tempC * 9) / 5 + 32);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600 animate-pulse">
        Loading detailed weather for{" "}
        <span className="font-semibold ml-1 text-blue-600">{city}</span>...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        ❌ Error fetching weather details. Please try again later.
      </div>
    );

  if (!data || !data.forecast?.forecastday)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        No forecast data available for {city}.
      </div>
    );

  const current = data.current;
  const forecast = data.forecast.forecastday;

  // Chart data (Day 1)
  const hourlyTempData = forecast[0].hour.map((h) => ({
    time: new Date(h.time_epoch * 1000).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temp_c: convertTemp(h.temp_c),
  }));

  const hourlyPrecipData = forecast[0].hour.map((h) => ({
    time: new Date(h.time_epoch * 1000).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
    precip_mm: h.precip_mm,
  }));

  // 🌤️ Derived insights
  const avgTemp =
    forecast.reduce((sum, day) => sum + convertTemp(day.day.avgtemp_c), 0) /
    forecast.length;
  const maxTemp = Math.max(
    ...forecast.map((d) => convertTemp(d.day.maxtemp_c))
  );
  const minTemp = Math.min(
    ...forecast.map((d) => convertTemp(d.day.mintemp_c))
  );
  const avgHumidity = (
    forecast.map((day) => day.day.avghumidity).reduce((a, b) => a + b, 0) /
    forecast.length
  ).toFixed(1);

  const dominantWind = forecast
    .flatMap((day) => day.hour.map((h) => h.wind_dir))
    .sort(
      (a, b) =>
        forecast.flatMap((d) => d.hour.filter((h) => h.wind_dir === b).length) -
        forecast.flatMap((d) => d.hour.filter((h) => h.wind_dir === a).length)
    )[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FA] via-[#B2EBF2] to-[#80DEEA] p-8 transition-colors duration-500">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-wide">
          {data.location.name}, {data.location.country}
        </h1>

        {/* 🌡️ Toggle Button */}
        <button
          onClick={toggleUnit}
          className="mt-4 bg-white border border-blue-300 text-blue-600 font-medium px-6 py-2 rounded-full shadow-md hover:bg-blue-100 hover:shadow-lg transition-all duration-300"
        >
          Switch to °{unit === "C" ? "F" : "C"}
        </button>
      </div>

      {/* Current Weather Summary */}
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-3xl mx-auto mb-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Current Temperature</p>
            <p className="text-5xl font-semibold text-blue-600">
              {convertTemp(current.temp_c).toFixed(1)}°{unit}
            </p>
            <p className="text-gray-500 capitalize mt-1">
              {current.condition.text}
            </p>
            <div className="mt-3 text-gray-700 space-y-1 text-sm">
              <p>💧 Humidity: {current.humidity}%</p>
              <p>
                🌬️ Wind: {current.wind_kph} kph {current.wind_dir}
              </p>
              <p>☀️ UV Index: {current.uv}</p>
              <p>🌫️ Visibility: {current.vis_km} km</p>
              <p>
                🌡️ Feels Like: {convertTemp(current.feelslike_c).toFixed(1)}°
                {unit}
              </p>
              <p>📉 Pressure: {current.pressure_mb} mb</p>
            </div>
          </div>
          <img
            src={current.condition.icon}
            alt={current.condition.text}
            className="w-24 h-24 transform transition-transform duration-300 hover:scale-110"
          />
        </div>
      </div>

      {/* Hourly Temperature Chart */}
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-5xl mx-auto mb-10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Hourly Temperature Trend (°{unit})
        </h2>
        <TemperatureChart data={hourlyTempData} unit={unit} />
      </div>

      {/* Hourly Precipitation Chart */}
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-5xl mx-auto mb-12 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Hourly Precipitation (mm)
        </h2>
        <PrecipitationChart data={hourlyPrecipData} />
      </div>

      {/* 🌤️ Weather Insights */}
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-5xl mx-auto mb-12 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Analytical Weather Insights
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-700 text-center">
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="font-medium text-gray-800">Average Temp</p>
            <p className="text-xl font-bold text-blue-600">
              {avgTemp.toFixed(1)}°{unit}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="font-medium text-gray-800">Highest Temp</p>
            <p className="text-xl font-bold text-red-500">
              {maxTemp.toFixed(1)}°{unit}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="font-medium text-gray-800">Lowest Temp</p>
            <p className="text-xl font-bold text-blue-500">
              {minTemp.toFixed(1)}°{unit}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="font-medium text-gray-800">Avg Humidity</p>
            <p className="text-xl font-bold text-green-600">{avgHumidity}%</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="font-medium text-gray-800">Dominant Wind Direction</p>
            <p className="text-xl font-bold text-yellow-600">{dominantWind}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="font-medium text-gray-800">Comfort Index</p>
            <p className="text-xl font-bold text-purple-600">
              {current.feelslike_c - current.temp_c > 2
                ? "Humid"
                : "Comfortable"}
            </p>
          </div>
        </div>
      </div>

      {/* 🌦️ 3-Day Forecast */}
      <div className="max-w-7xl mx-auto overflow-x-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 mt-6 text-center">
          3-Day Forecast
        </h2>
        <div className="flex gap-6 justify-center min-w-max px-4">
          {forecast.map((day) => (
            <div
              key={day.date}
              className="bg-white rounded-2xl shadow-md p-6 text-center w-64 hover:shadow-xl hover:scale-[1.05] transition-all duration-300 hover:bg-blue-50"
            >
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {new Date(day.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <img
                src={day.day.condition.icon}
                alt={day.day.condition.text}
                className="w-20 h-20 mx-auto transform transition-transform duration-300 hover:scale-110"
              />
              <p className="text-gray-600 capitalize mb-2">
                {day.day.condition.text}
              </p>
              <p className="text-xl font-bold text-blue-600">
                {convertTemp(day.day.avgtemp_c).toFixed(1)}°{unit}
              </p>
              <div className="mt-3 text-gray-700 text-sm space-y-1">
                <p>
                  🌡️ Max: {convertTemp(day.day.maxtemp_c).toFixed(1)}°{unit}
                </p>
                <p>
                  🌡️ Min: {convertTemp(day.day.mintemp_c).toFixed(1)}°{unit}
                </p>
                <p>💧 Humidity: {day.day.avghumidity}%</p>
                <p>🌅 Sunrise: {day.astro.sunrise}</p>
                <p>🌇 Sunset: {day.astro.sunset}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedWeatherPage;
