
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/authSlice";
import { toggleUnit } from "../store/settingsSlice";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { unit } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {}, { withCredentials: true });
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  // const handleSignup = () => {
  //   navigate("/signup");
  // };

  const hideToggle = location.pathname.startsWith("/weather/");

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-bold cursor-pointer hover:text-blue-400 transition duration-200"
          >
            WeatherWise
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 py-1">
            <Link to="/" className="hover:text-blue-400 transition duration-200">
              Home
            </Link>
            <Link to="/favourite" className="hover:text-blue-400 transition duration-200">
              Favourites
            </Link>

            {/* 🌡️ Temperature Toggle Button (hidden on /weather/:city) */}
            {!hideToggle && (
              <button
                onClick={() => dispatch(toggleUnit())}
                className="ml-3 bg-gray-800 hover:bg-gray-700 px-4 py-1 rounded-lg text-sm border border-gray-700 transition duration-200"
              >
                {unit === "C" ? "°C → °F" : "°F → °C"}
              </button>
            )}
          </div>
        </div>

        {/* Right Section (Auth Buttons) */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-300">
                Hi, {user?.displayName || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleGoogleLogin}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Login with Google
              </button>
              {/* <button
                onClick={handleSignup}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Sign Up
              </button> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
