
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { setUser } from './store/authSlice';
import { getProfile } from './services/userApi';

// Components
import Navbar from './components/Navbar'; // ✅ Make sure path is correct
import GlobalStyle from './styles/GlobalStyle';

// Pages
import DashboardPage from './pages/DashboardPage';
import DetailedWeatherPage from './pages/DetailedWeatherPage';
//import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          dispatch(setUser(profile));
        }
      } catch (error) {
        console.log('Not authenticated');
      }
    };
    checkUserStatus();
  }, [dispatch]);

  return (
    <>
      <GlobalStyle />
      <Router>
        {/* ✅ Navbar appears on all pages */}
        <Navbar />

        {/* ✅ Route configuration */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favourite" element={<DashboardPage />} />
          <Route path="/weather/:city" element={<DetailedWeatherPage />} />
          {/* //<Route path="/login" element={<LoginPage />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
