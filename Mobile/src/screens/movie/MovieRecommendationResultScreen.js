import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { getMovieRecommendations } from '../../services/ai';
import { fetchMovieDetails } from '../../services/apiConfig';

const translations = {
    en: {
        screenTitle: "Our Picks for You",
        loadingTitle: "AI is analyzing your preferences...",
        loadingSubtitle: "Our advanced AI is searching through millions of movies to find your perfect matches",
        loadingSteps: [
            "Analyzing your mood...",
            "Processing genre preferences...",
            "Calculating movie scores...",
            "Generating personalized recommendations..."
        ],
        loadingMore: "AI is finding more movies for you...",
        duration: "min",
    },
    tr: {
        screenTitle: "Sizin İçin Seçtiklerimiz",
        loadingTitle: "Yapay zeka tercihlerinizi analiz ediyor...",
        loadingSubtitle: "Gelişmiş yapay zekamız milyonlarca film arasından size en uygun olanları buluyor",
        loadingSteps: [
            "Ruh haliniz analiz ediliyor...",
            "Tür tercihleri işleniyor...",
            "Film puanları hesaplanıyor...",
            "Kişisel öneriler oluşturuluyor..."
        ],
        loadingMore: "Yapay zeka sizin için daha fazla film buluyor...",
        duration: "dakika",
    }
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const LoadingScreen = ({ colors, t }) => {
    const animation = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % t.loadingSteps.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <LottieView
                ref={animation}
                source={require('../../../assets/animations/movie-loading.json')}
                style={styles.lottie}
                autoPlay
                loop
            />
            <Text style={[styles.loadingText, { color: colors.text }]}>
                {t.loadingTitle}
            </Text>
            <Text style={[styles.loadingSubText, { color: colors.textSecondary }]}>
                {t.loadingSubtitle}
            </Text>
            <Text style={[styles.loadingStep, { color: colors.primary }]}>
                {t.loadingSteps[currentStep]}
            </Text>
        </View>
    );
};

const MovieRecommendationResultScreen = ({ route }) => {
    const { preferences } = route.params;
    const { theme, language } = useTheme();
    const colors = theme.colors;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMorePages, setHasMorePages] = useState(true);
    const t = translations[language];

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async (page = 1) => {
        try {
            const startTime = Date.now();

            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            // AI'dan film önerileri al
            const aiRecommendations = await getMovieRecommendations(preferences, page);
            
            // Her bir film için TMDB'den detayları al
            const movieDetailsPromises = aiRecommendations.recommendations.map(async (rec) => {
                try {
                    const details = await fetchMovieDetails(rec.tmdb_id);
                    return {
                        ...details,
                        reason: rec.reason
                    };
                } catch (error) {
                    console.error(`Error fetching movie details for ID ${rec.tmdb_id}:`, error);
                    return null;
                }
            });

            // Tüm film detaylarını bekle
            const movieDetails = await Promise.all(movieDetailsPromises);
            
            // Null olmayan sonuçları filtrele
            const validMovies = movieDetails.filter(movie => movie !== null);

            // İşlem süresini hesapla
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 2000 - elapsedTime);

            // Minimum 2 saniye bekle
            await new Promise(resolve => setTimeout(resolve, remainingTime));

            // Sayfa 1'se recommendations'ı sıfırla, değilse ekle
            if (page === 1) {
                setRecommendations(validMovies);
            } else {
                setRecommendations(prev => [...prev, ...validMovies]);
            }

            // Daha fazla sayfa var mı kontrol et
            setHasMorePages(validMovies.length > 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMorePages) {
            fetchRecommendations(currentPage + 1);
        }
    };

    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingMoreText, { color: colors.text }]}>
                    {t.loadingMore}
                </Text>
            </View>
        );
    };

    const renderMovieCard = ({ item }) => (
        <TouchableOpacity
            style={[styles.movieCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('MovieDetail', { movie: { id: item.id } })}
        >
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.poster}
                resizeMode="cover"
            />
            <View style={styles.movieInfo}>
                <Text style={[styles.movieTitle, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={[styles.movieOverview, { color: colors.textSecondary }]} numberOfLines={3}>
                    {item.overview}
                </Text>
                <View style={styles.ratingContainer}>
                    <Text style={[styles.rating, { color: colors.primary }]}>
                        ⭐️ {item.vote_average.toFixed(1)}
                    </Text>
                    <Text style={[styles.runtime, { color: colors.textSecondary }]}>
                        {item.runtime} {t.duration}
                    </Text>
                </View>
                <Text style={[styles.reason, { color: colors.textSecondary }]}>
                    {item.reason}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <LoadingScreen colors={colors} t={t} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.closeButtonText, { color: colors.text }]}>×</Text>
                </TouchableOpacity>
                <Text style={[styles.header, { color: colors.text }]}>
                    {t.screenTitle}
                </Text>
            </View>
            <FlatList
                data={recommendations}
                renderItem={renderMovieCard}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 48,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    lottie: {
        width: 200,
        height: 200,
    },
    loadingText: {
        marginTop: 24,
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    loadingSubText: {
        marginTop: 8,
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 48,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 48,
        right: 16,
        zIndex: 1,
        padding: 8,
    },
    closeButtonText: {
        fontSize: 32,
        fontWeight: '300',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    listContainer: {
        padding: 16,
    },
    movieCard: {
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    poster: {
        width: '100%',
        height: 250,
    },
    movieInfo: {
        padding: 16,
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    movieOverview: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    rating: {
        fontSize: 16,
        fontWeight: '600',
    },
    runtime: {
        fontSize: 14,
    },
    reason: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 8,
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingStep: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        fontStyle: 'italic'
    },
    loadingMoreText: {
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic'
    }
});

export default MovieRecommendationResultScreen; 