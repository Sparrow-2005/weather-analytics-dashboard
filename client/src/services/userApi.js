import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/user`;

// Axios instance with credentials
const api = axios.create({
    withCredentials: true,
});

const addFavorite = async (city) => {
    const response = await api.post(`${API_URL}/favorites`, { city });
    return response.data;
};

const removeFavorite = async (city) => {
    const response = await api.delete(`${API_URL}/favorites`, { data: { city } });
    return response.data;
};

const getProfile = async () => {
    const response = await api.get(`${API_URL}/me`);
    return response.data;
};

export { addFavorite, removeFavorite, getProfile };