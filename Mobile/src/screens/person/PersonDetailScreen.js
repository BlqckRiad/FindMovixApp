import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '../../context/FavoritesContext';

const { width } = Dimensions.get('window');
const PROFILE_IMAGE_WIDTH = width * 0.4;
const MOVIE_CARD_WIDTH = width * 0.35;
const MOVIE_CARD_HEIGHT = MOVIE_CARD_WIDTH * 1.5;

const BASE_URL = 'https://api.themoviedb.org/3';

const MovieCard = ({ movie, onPress }) => (
    <TouchableOpacity style={styles.movieCard} onPress={onPress}>
        <Image
            source={{ 
                uri: movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Image'
            }}
            style={styles.movieImage}
            resizeMode="cover"
        />
        <View style={styles.movieInfo}>
            <Text style={styles.movieTitle} numberOfLines={2}>{movie.title}</Text>
            <Text style={styles.movieYear}>{movie.release_date?.split('-')[0] || 'N/A'}</Text>
            <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color={colors.warning} />
                <Text style={styles.ratingText}>{movie.vote_average?.toFixed(1)}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const PersonDetailScreen = ({ route, navigation }) => {
    const { personId } = route.params;
    const [personData, setPersonData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isPersonFavorite, togglePersonFavorite } = useFavorites();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (personId) {
            setIsFavorite(isPersonFavorite(personId));
        }
    }, [personId]);

    const handleFavoritePress = async () => {
        if (personData) {
            const newStatus = await togglePersonFavorite(personData);
            setIsFavorite(newStatus);
        }
    };

    useEffect(() => {
        fetchPersonDetails();
    }, [personId]);

    const fetchPersonDetails = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjhmYTUyOGQ5OGQ4ZjJkMzMwMGM4YjhmNzZjMTMwYyIsIm5iZiI6MTczNTMwODYzMC42NTkwMDAyLCJzdWIiOiI2NzZlYjU1NmUyOTc2YmE3NWI5MmI4NTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FzRKxUDAxhy4GLFM88-1ihfw0xaFJjiL8LtJkhWFrEE'
                }
            };

            // Kişi detaylarını al
            const personResponse = await fetch(`${BASE_URL}/person/${personId}?language=tr-TR`, options);
            const personDetails = await personResponse.json();

            // Film kredilerini al
            const creditsResponse = await fetch(`${BASE_URL}/person/${personId}/movie_credits?language=tr-TR`, options);
            const movieCredits = await creditsResponse.json();

            // Verileri birleştir
            setPersonData({
                ...personDetails,
                movie_credits: {
                    cast: movieCredits.cast || [],
                    crew: movieCredits.crew || []
                }
            });
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching person details:', error);
            Alert.alert(
                "Hata",
                "Kişi bilgileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
                [{ text: "Tamam" }]
            );
            setIsLoading(false);
        }
    };

    const renderMovieSection = (title, movies) => {
        if (!movies || movies.length === 0) return null;

        // Benzersiz filmleri al (aynı ID'ye sahip filmleri filtrele)
        const uniqueMovies = movies.reduce((unique, movie) => {
            const exists = unique.find(item => item.id === movie.id);
            if (!exists) {
                unique.push(movie);
            }
            return unique;
        }, []);

        // Puanlarına göre sırala ve ilk 10'unu al
        const sortedMovies = uniqueMovies
            .sort((a, b) => b.vote_average - a.vote_average)
            .slice(0, 10);

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <FlatList
                    data={sortedMovies}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => `${title}-${item.id}`}
                    renderItem={({ item }) => (
                        <MovieCard
                            movie={item}
                            onPress={() => navigation.push('MovieDetail', { movie: item })}
                        />
                    )}
                    contentContainerStyle={styles.movieList}
                />
            </View>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Bilgi yok';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!personData) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Kişi bilgileri yüklenemedi.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} bounces={false}>
            {/* Header with Back Button and Favorite Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={handleFavoritePress}
                >
                    <Ionicons 
                        name={isFavorite ? "heart" : "heart-outline"} 
                        size={24} 
                        color={isFavorite ? colors.primary : colors.text} 
                    />
                </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Image
                    source={{ 
                        uri: personData.profile_path 
                            ? `https://image.tmdb.org/t/p/w400${personData.profile_path}`
                            : 'https://via.placeholder.com/400x600?text=No+Image'
                    }}
                    style={styles.profileImage}
                    resizeMode="cover"
                />
                <Text style={styles.name}>{personData.name}</Text>
                
                {/* Kişisel Bilgiler */}
                <View style={styles.infoContainer}>
                    {personData.birthday && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Doğum Tarihi:</Text>
                            <Text style={styles.infoText}>{formatDate(personData.birthday)}</Text>
                        </View>
                    )}
                    {personData.place_of_birth && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Doğum Yeri:</Text>
                            <Text style={styles.infoText}>{personData.place_of_birth}</Text>
                        </View>
                    )}
                    {personData.known_for_department && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Meslek:</Text>
                            <Text style={styles.infoText}>{personData.known_for_department}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Biyografi */}
            {personData.biography && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Biyografi</Text>
                    <Text style={styles.biography}>{personData.biography}</Text>
                </View>
            )}

            {/* Filmografi */}
            {personData.movie_credits && (
                <>
                    {renderMovieSection('Oyuncu Olarak', personData.movie_credits.cast)}
                    {renderMovieSection('Ekip Üyesi Olarak', personData.movie_credits.crew)}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.lg,
    },
    errorText: {
        color: colors.error,
        fontSize: typography.sizes.md,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: spacing.lg,
        left: spacing.lg,
        right: spacing.lg,
        zIndex: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileSection: {
        alignItems: 'center',
        paddingTop: spacing.xl * 2,
        paddingHorizontal: spacing.lg,
    },
    profileImage: {
        width: PROFILE_IMAGE_WIDTH,
        height: PROFILE_IMAGE_WIDTH * 1.5,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
    },
    name: {
        fontSize: typography.sizes.xl,
        color: colors.text,
        fontWeight: typography.weights.bold,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    infoContainer: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    infoLabel: {
        color: colors.textSecondary,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
    },
    infoText: {
        color: colors.text,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.regular,
        flex: 1,
        textAlign: 'right',
        marginLeft: spacing.md,
    },
    section: {
        padding: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        color: colors.text,
        fontWeight: typography.weights.semiBold,
        marginBottom: spacing.md,
    },
    biography: {
        color: colors.textSecondary,
        fontSize: typography.sizes.md,
        lineHeight: 24,
    },
    movieList: {
        paddingRight: spacing.lg,
    },
    movieCard: {
        width: MOVIE_CARD_WIDTH,
        marginLeft: spacing.md,
    },
    movieImage: {
        width: MOVIE_CARD_WIDTH,
        height: MOVIE_CARD_HEIGHT,
        borderRadius: radius.md,
        marginBottom: spacing.xs,
        backgroundColor: colors.surface,
    },
    movieInfo: {
        padding: spacing.xs,
    },
    movieTitle: {
        color: colors.text,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semiBold,
        marginBottom: spacing.xs,
    },
    movieYear: {
        color: colors.textSecondary,
        fontSize: typography.sizes.xs,
        marginBottom: spacing.xs,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: colors.warning,
        fontSize: typography.sizes.xs,
        marginLeft: spacing.xs,
    },
});

export default PersonDetailScreen; 