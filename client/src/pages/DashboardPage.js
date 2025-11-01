
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "../features/search/SearchBar";
import CityCard from "../features/dashboard/CityCard";
import { setUser } from "../store/authSlice";
import { addFavorite, removeFavorite, getProfile } from "../services/userApi";

const DashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && !user) {
      const fetchProfile = async () => {
        try {
          const profile = await getProfile();
          dispatch(setUser(profile));
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      };
      fetchProfile();
    }
  }, [isAuthenticated, user, dispatch]);

  const handleCitySelect = async (city) => {
    if (!isAuthenticated) {
      alert("Please log in to add favourites.");
      return;
    }
    try {
      await addFavorite(city);
      const updatedProfile = await getProfile();
      dispatch(setUser(updatedProfile));
    } catch (error) {
      console.error("Failed to add favorite", error);
    }
  };

  const handleRemoveCity = async (city) => {
    try {
      await removeFavorite(city);
      const updatedProfile = await getProfile();
      dispatch(setUser(updatedProfile));
    } catch (error) {
      console.error("Failed to remove favourite", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FA] via-[#B2EBF2] to-[#80DEEA] flex flex-col items-center py-10 px-6 transition-colors duration-500">
      {/* Dashboard Container */}
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-10 border border-blue-100/40 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300">
        
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 tracking-wide">
          🌤️ Favourite City
        </h1>

        {/* Search Bar */}
        <div className="mb-10">
          <SearchBar onCitySelect={handleCitySelect} />
        </div>

        {/* Favorite Cities Section */}
        {isAuthenticated && user ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 border-l-4 border-blue-400 pl-3 mb-6">
              Your Favourite Cities
            </h2>

            {user.favoriteCities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.favoriteCities.map((city) => (
                  <div
                    key={city}
                    className="transition-all transform hover:scale-[1.04] hover:-translate-y-1"
                  >
                    <CityCard city={city} onRemove={handleRemoveCity} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-8 text-lg">
                No favorite cities yet. Add some!
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 mt-8 text-lg">
            Please log in to see your favorite cities.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
