import React from 'react';

const WeatherIcon = ({ code, isDay }) => {
    if (code === 1000) {
        return <span>{isDay? '☀️' : '🌙'}</span>;
    }
    if (code > 1000 && code < 1063) {
        return <span>☁️</span>;
    }
    return <span>-</span>;
};

export default WeatherIcon;