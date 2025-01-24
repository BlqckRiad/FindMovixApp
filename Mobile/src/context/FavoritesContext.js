import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [favoriteTVShows, setFavoriteTVShows] = useState([]);
    const [favoritePeople, setFavoritePeople] = useState([]);

    // AsyncStorage'dan favori listelerini yükle
    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const movies = await AsyncStorage.getItem('favoriteMovies');
            const tvShows = await AsyncStorage.getItem('favoriteTVShows');
            const people = await AsyncStorage.getItem('favoritePeople');
            setFavoriteMovies(movies ? JSON.parse(movies) : []);
            setFavoriteTVShows(tvShows ? JSON.parse(tvShows) : []);
            setFavoritePeople(people ? JSON.parse(people) : []);
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    // Favori filmleri güncelle
    const updateFavoriteMovies = async (movies) => {
        try {
            await AsyncStorage.setItem('favoriteMovies', JSON.stringify(movies));
            setFavoriteMovies(movies);
        } catch (error) {
            console.error('Error saving favorite movies:', error);
        }
    };

    // Favori dizileri güncelle
    const updateFavoriteTVShows = async (shows) => {
        try {
            await AsyncStorage.setItem('favoriteTVShows', JSON.stringify(shows));
            setFavoriteTVShows(shows);
        } catch (error) {
            console.error('Error saving favorite TV shows:', error);
        }
    };

    // Favori kişileri güncelle
    const updateFavoritePeople = async (people) => {
        try {
            await AsyncStorage.setItem('favoritePeople', JSON.stringify(people));
            setFavoritePeople(people);
        } catch (error) {
            console.error('Error saving favorite people:', error);
        }
    };

    // Film favorilere ekle/çıkar
    const toggleMovieFavorite = async (movie) => {
        const exists = favoriteMovies.some(m => m.id === movie.id);
        let updatedMovies;
        
        if (exists) {
            updatedMovies = favoriteMovies.filter(m => m.id !== movie.id);
        } else {
            updatedMovies = [...favoriteMovies, movie];
        }
        
        await updateFavoriteMovies(updatedMovies);
        return !exists; // Yeni durumu döndür (true: eklendi, false: çıkarıldı)
    };

    // Dizi favorilere ekle/çıkar
    const toggleTVShowFavorite = async (show) => {
        const exists = favoriteTVShows.some(s => s.id === show.id);
        let updatedShows;
        
        if (exists) {
            updatedShows = favoriteTVShows.filter(s => s.id !== show.id);
        } else {
            updatedShows = [...favoriteTVShows, show];
        }
        
        await updateFavoriteTVShows(updatedShows);
        return !exists;
    };

    // Kişi favorilere ekle/çıkar
    const togglePersonFavorite = async (person) => {
        const exists = favoritePeople.some(p => p.id === person.id);
        let updatedPeople;
        
        if (exists) {
            updatedPeople = favoritePeople.filter(p => p.id !== person.id);
        } else {
            updatedPeople = [...favoritePeople, person];
        }
        
        await updateFavoritePeople(updatedPeople);
        return !exists;
    };

    // Favori durumunu kontrol et
    const isMovieFavorite = (movieId) => favoriteMovies.some(m => m.id === movieId);
    const isTVShowFavorite = (showId) => favoriteTVShows.some(s => s.id === showId);
    const isPersonFavorite = (personId) => favoritePeople.some(p => p.id === personId);

    return (
        <FavoritesContext.Provider value={{
            favoriteMovies,
            favoriteTVShows,
            favoritePeople,
            toggleMovieFavorite,
            toggleTVShowFavorite,
            togglePersonFavorite,
            isMovieFavorite,
            isTVShowFavorite,
            isPersonFavorite,
        }}>
            {children}
        </FavoritesContext.Provider>
    );
}; 