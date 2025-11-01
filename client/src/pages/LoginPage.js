
import React from "react";

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] via-[#B2EBF2] to-[#80DEEA] px-6 transition-all duration-500">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100/40 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 w-full max-w-md p-10 text-center">
        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4 tracking-wide">
          ☀️ Login to WeatherWise
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg mb-8">
          Sign in with your Google account to save and view your favorite cities 🌍
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_64dp.png"
            alt="Google"
            className="w-6 h-6"
          />
          Sign in with Google
        </button>

        {/* Footer text */}
        <p className="text-gray-500 mt-8 text-sm">
          Powered by WeatherWise ⚡ Stay informed with accurate forecasts.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
