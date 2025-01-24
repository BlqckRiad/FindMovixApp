import React from 'react';
import { Platform } from 'react-native';

// Android Emülatör için özel IP: 10.0.2.2
// iOS Simulator için: localhost
// Gerçek cihaz için: bilgisayarın IP adresi (örn: 192.168.1.104)

export const API_BASE_URL = 'https://apiuser.findmovix.com';
export const TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjhmYTUyOGQ5OGQ4ZjJkMzMwMGM4YjhmNzZjMTMwYyIsIm5iZiI6MTczNTMwODYzMC42NTkwMDAyLCJzdWIiOiI2NzZlYjU1NmUyOTc2YmE3NWI5MmI4NTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FzRKxUDAxhy4GLFM88-1ihfw0xaFJjiL8LtJkhWFrEE';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: `${API_BASE_URL}/api/Register/UserRegister`,
        LOGIN: `${API_BASE_URL}/api/Login/UserLogin`,
    }
};

// API İstekleri için varsayılan yapılandırma
const DEFAULT_TIMEOUT = 10000; // 10 saniye
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

// Cache kontrolü için yardımcı fonksiyon
const getCachedData = (key) => {
    const cachedItem = cache.get(key);
    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
        return cachedItem.data;
    }
    cache.delete(key);
    return null;
};

// Cache'e veri kaydetme
const setCacheData = (key, data) => {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
};

export const fetchMovieDetails = async (movieId) => {
    try {
        // Cache kontrolü
        const cacheKey = `movie_${movieId}`;
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}?language=tr-TR&append_to_response=credits,videos`,
            {
                method: 'GET',
                headers: {
                    'Authorization': TMDB_API_KEY,
                    'accept': 'application/json'
                },
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Movie details fetch failed');
        }

        const data = await response.json();
        
        // Veriyi cache'e kaydet
        setCacheData(cacheKey, data);
        
        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Request timed out');
        }
        console.error('Error fetching movie details:', error);
        throw error;
    }
}; 