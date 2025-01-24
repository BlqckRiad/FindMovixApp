import { TMDB_API_KEY, TMDB_BASE_URL } from './apiConfig';

export const API_KEY = 'sk-Ue0Hs0Hs0Hs0Hs0Hs0Hs0Hs0Hs0Hs0Hs0Hs0Hs0H';

const genreMap = {
    'Aksiyon': 28,
    'Macera': 12,
    'Animasyon': 16,
    'Komedi': 35,
    'Suç': 80,
    'Belgesel': 99,
    'Dram': 18,
    'Aile': 10751,
    'Fantastik': 14,
    'Tarih': 36,
    'Korku': 27,
    'Müzik': 10402,
    'Gizem': 9648,
    'Romantik': 10749,
    'Bilim Kurgu': 878,
    'TV Film': 10770,
    'Gerilim': 53,
    'Savaş': 10752,
    'Vahşi Batı': 37
};

const moodGenreMap = {
    'mutlu': ['Komedi', 'Animasyon', 'Aile', 'Romantik', 'Macera'],
    'üzgün': ['Dram', 'Romantik', 'Müzik', 'Aile'],
    'heyecanlı': ['Aksiyon', 'Macera', 'Bilim Kurgu', 'Gerilim'],
    'düşünceli': ['Dram', 'Gizem', 'Belgesel', 'Tarih'],
    'gergin': ['Gerilim', 'Gizem', 'Suç', 'Korku']
};

// Öneri sonuçları için cache
const recommendationCache = new Map();
const RECOMMENDATION_CACHE_DURATION = 30 * 60 * 1000; // 30 dakika

// Cache kontrolü için yardımcı fonksiyon
const getCachedRecommendations = (preferences) => {
    const key = JSON.stringify(preferences);
    const cachedItem = recommendationCache.get(key);
    if (cachedItem && Date.now() - cachedItem.timestamp < RECOMMENDATION_CACHE_DURATION) {
        return cachedItem.data;
    }
    recommendationCache.delete(key);
    return null;
};

// Cache'e öneri kaydetme
const setCacheRecommendations = (preferences, data) => {
    const key = JSON.stringify(preferences);
    recommendationCache.set(key, {
        data,
        timestamp: Date.now()
    });
};

export const getMovieRecommendations = async (userPreferences, page = 1) => {
    try {
        // Cache kontrolü
        const cachedRecommendations = getCachedRecommendations({ ...userPreferences, page });
        if (cachedRecommendations) {
            return cachedRecommendations;
        }

        // Seçilen türlerin ID'lerini al
        const genreIds = userPreferences.genres
            .map(genre => genreMap[genre])
            .filter(id => id)
            .join(',');
    
        const url = `${TMDB_BASE_URL}/discover/movie?` +
            `language=tr-TR&` +
            `sort_by=popularity.desc&` +
            `vote_count.gte=100&` +
            `with_genres=${genreIds}&` +
            `primary_release_date.gte=${userPreferences.yearRange.start}-01-01&` +
            `primary_release_date.lte=${userPreferences.yearRange.end}-12-31&` +
            `with_runtime.gte=${userPreferences.duration.min}&` +
            `with_runtime.lte=${userPreferences.duration.max}&` +
            `page=${page}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 saniye timeout

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': TMDB_API_KEY,
                'accept': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('TMDB API Hatası:', response.status, errorText);
            throw new Error('Movie recommendations fetch failed');
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return page === 1 ? sampleRecommendations : { recommendations: [] };
        }
        
        const recommendations = {
            recommendations: data.results.slice(0, 5).map(movie => ({
                tmdb_id: movie.id.toString(),
                reason: generateReasonBasedOnPreferences(movie, userPreferences)
            }))
        };

        // Öneriyi cache'e kaydet
        setCacheRecommendations({ ...userPreferences, page }, recommendations);
     
        return recommendations;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Öneri isteği zaman aşımına uğradı');
        } else {
            console.error('Recommendation Error:', error);
        }
        return page === 1 ? sampleRecommendations : { recommendations: [] };
    }
};

function generateReasonBasedOnPreferences(movie, preferences) {
    const reasons = [];
    
    // Film türüne göre neden
    if (movie.genre_ids) {
        const movieGenres = movie.genre_ids.map(id => 
            Object.entries(genreMap).find(([_, value]) => value === id)?.[0]
        ).filter(Boolean);

        if (movieGenres.some(genre => preferences.genres.includes(genre))) {
            reasons.push(`Seçtiğiniz ${preferences.genres.join(' ve ')} türlerinde`);
        }
    }

    // Ruh haline göre neden
    if (preferences.mood === 'mutlu') {
        reasons.push('keyifli ve eğlenceli');
    } else if (preferences.mood === 'üzgün') {
        reasons.push('duygusal derinliği olan');
    } else if (preferences.mood === 'heyecanlı') {
        reasons.push('heyecan dolu');
    } else if (preferences.mood === 'düşünceli') {
        reasons.push('düşündürücü');
    } else if (preferences.mood === 'gergin') {
        reasons.push('sürükleyici');
    }

    // Puana göre neden
    if (movie.vote_average >= 8) {
        reasons.push('yüksek puana sahip');
    }

    // Yıla göre neden
    const year = new Date(movie.release_date).getFullYear();
    if (year >= 2020) {
        reasons.push('güncel');
    } else if (year <= 2000) {
        reasons.push('klasikleşmiş');
    }

    return reasons.join(', ') + ' bir film.';
}

// Yedek öneriler aynı kalacak
const sampleRecommendations = {
    recommendations: [
        {
            tmdb_id: "27205", // Inception
            reason: "Zihin bükücü hikayesi ve etkileyici görsel efektleriyle unutulmaz bir deneyim"
        },
        {
            tmdb_id: "155", // The Dark Knight
            reason: "Aksiyon ve drama türlerinin mükemmel bir karışımı"
        },
        {
            tmdb_id: "680", // Pulp Fiction
            reason: "Benzersiz anlatım tarzı ve unutulmaz karakterler"
        },
        {
            tmdb_id: "13", // Forrest Gump
            reason: "Duygusal derinliği olan bir yaşam hikayesi"
        },
        {
            tmdb_id: "238", // The Godfather
            reason: "Sinema tarihinin en etkileyici drama filmlerinden biri"
        }
    ]
}; 