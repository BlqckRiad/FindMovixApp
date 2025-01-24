import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Linking,
    ActivityIndicator,
    FlatList,
    Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommentSection from '../../components/movie/CommentSection';
import { useFavorites } from '../../context/FavoritesContext';
import AddToWatchListModal from '../../components/modals/AddToWatchListModal';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.7;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;
const CAST_IMAGE_SIZE = width * 0.25;

const BASE_URL = 'https://api.themoviedb.org/3';

const PersonCard = ({ person, role, onPress }) => (
    <TouchableOpacity style={styles.personCard} onPress={onPress}>
        <Image
            source={{ 
                uri: person.profile_path 
                    ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Image'
            }}
            style={styles.personImage}
            resizeMode="cover"
        />
        <Text style={styles.personName} numberOfLines={2}>{person.name}</Text>
        <Text style={styles.personRole} numberOfLines={1}>{role}</Text>
    </TouchableOpacity>
);

const MovieCard = ({ movie, onPress }) => (
    <TouchableOpacity style={styles.similarMovieCard} onPress={onPress}>
        <Image
            source={{ 
                uri: movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Image'
            }}
            style={styles.similarMovieImage}
            resizeMode="cover"
        />
        <Text style={styles.similarMovieTitle} numberOfLines={2}>{movie.title || movie.name}</Text>
        <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
        </View>
    </TouchableOpacity>
);

const STREAMING_PLATFORMS = {
    netflix: {
        name: 'Netflix',
        icon: 'play-circle',
        color: '#E50914',
        borderColor: 'rgba(229, 9, 20, 0.3)',
        url: 'https://www.netflix.com/search?q=',
    },
    prime: {
        name: 'Prime',
        icon: 'caret-forward-circle',
        color: '#00A8E1',
        borderColor: 'rgba(0, 168, 225, 0.3)',
        url: 'https://www.primevideo.com/search?k=',
    },
    disney: {
        name: 'Disney+',
        icon: 'star',
        color: '#113CCF',
        borderColor: 'rgba(17, 60, 207, 0.3)',
        url: 'https://www.disneyplus.com/search?q=',
    },
    mubi: {
        name: 'MUBI',
        icon: 'videocam',
        color: '#000000',
        borderColor: 'rgba(0, 0, 0, 0.3)',
        url: 'https://mubi.com/tr/search?q=',
    },
    blutv: {
        name: 'BluTV',
        icon: 'play',
        color: '#1FB8FF',
        borderColor: 'rgba(31, 184, 255, 0.3)',
        url: 'https://www.blutv.com/arama?q=',
    }
};

const PlatformCard = ({ platform, onPress }) => {
    const platformInfo = STREAMING_PLATFORMS[platform];
    return (
        <TouchableOpacity
            style={[
                styles.platformButton,
                { 
                    borderColor: platformInfo.borderColor,
                    backgroundColor: colors.surface,
                }
            ]}
            onPress={onPress}
        >
            <View style={[styles.iconContainer, { backgroundColor: platformInfo.color }]}>
                <Ionicons
                    name={platformInfo.icon}
                    size={24}
                    color="white"
                />
            </View>
            <Text style={[styles.platformName, { color: platformInfo.color }]}>
                {platformInfo.name}
            </Text>
        </TouchableOpacity>
    );
};

const MovieDetailScreen = ({ route, navigation }) => {
    const { movie } = route.params;
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [director, setDirector] = useState(null);
    const { isMovieFavorite, toggleMovieFavorite } = useFavorites();
    const [isFavorite, setIsFavorite] = useState(false);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [availablePlatforms, setAvailablePlatforms] = useState([]);
    const [error, setError] = useState(null);
    const [watchListModalVisible, setWatchListModalVisible] = useState(false);

    useEffect(() => {
        if (movie?.id) {
            setIsFavorite(isMovieFavorite(movie.id));
        }
    }, [movie]);

    useEffect(() => {
        fetchMovieDetails();
    }, []);

    const getRegionFromLanguage = (language) => {
        switch (language) {
            case 'tr':
                return 'TR';
            case 'es':
            case 'fr':
            case 'it':
            case 'de':
                return 'europe';
            case 'ko':
                return 'KR';
            case 'ja':
                return 'JP';
            case 'hi':
                return 'IN';
            default:
                return null;
        }
    };

    const getSimilarContentTitle = (details) => {
        const region = getRegionFromLanguage(details?.original_language);
        const mainGenre = details?.genres?.[0]?.name;

        if (region === 'TR') {
            return `Benzer Türk ${mainGenre ? mainGenre + ' Filmleri' : 'Yapımları'}`;
        } else if (region === 'europe') {
            return `Benzer Avrupa ${mainGenre ? mainGenre + ' Filmleri' : 'Yapımları'}`;
        } else if (region === 'KR') {
            return `Benzer Kore ${mainGenre ? mainGenre + ' Filmleri' : 'Yapımları'}`;
        } else if (region === 'JP') {
            return `Benzer Japon ${mainGenre ? mainGenre + ' Filmleri' : 'Yapımları'}`;
        } else if (region === 'IN') {
            return `Benzer Hint ${mainGenre ? mainGenre + ' Filmleri' : 'Yapımları'}`;
        }
        return mainGenre ? `Benzer ${mainGenre} Filmleri` : 'Benzer İçerikler';
    };

    const fetchMovieDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const mediaType = movie.media_type || 'movie';
            const endpoint = mediaType === 'tv' ? 'tv' : 'movie';

            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjhmYTUyOGQ5OGQ4ZjJkMzMwMGM4YjhmNzZjMTMwYyIsIm5iZiI6MTczNTMwODYzMC42NTkwMDAyLCJzdWIiOiI2NzZlYjU1NmUyOTc2YmE3NWI5MmI4NTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FzRKxUDAxhy4GLFM88-1ihfw0xaFJjiL8LtJkhWFrEE'
                }
            };

            const detailsResponse = await fetch(
                `${BASE_URL}/${endpoint}/${movie.id}?append_to_response=credits,videos,keywords&language=tr-TR`, 
                options
            );

            if (!detailsResponse.ok) {
                throw new Error('API response was not ok');
            }

            const detailsData = await detailsResponse.json();
            const originalLanguage = detailsData.original_language;
            const region = getRegionFromLanguage(originalLanguage);
            const genreIds = detailsData.genres?.map(genre => genre.id).join(',');
            const keywords = detailsData.keywords?.keywords || detailsData.keywords?.results || [];

            // Tür ve anahtar kelimelere göre discover URL'i oluştur
            let discoverUrl = `${BASE_URL}/discover/${endpoint}?language=tr-TR&sort_by=popularity.desc`;

            // Tür filtresini ekle
            if (genreIds) {
                discoverUrl += `&with_genres=${genreIds}`;
            }

            // Bölge bazlı filtreleme
            if (region === 'TR') {
                discoverUrl += '&with_original_language=tr';
            } else if (region === 'europe') {
                discoverUrl += '&with_original_language=es|fr|it|de';
            } else if (region) {
                discoverUrl += `&with_original_language=${originalLanguage}`;
            }

            // Özel durumlar için keyword filtreleme
            const relevantKeywords = keywords
                .filter(k => k.name.toLowerCase().includes('heist') || 
                           k.name.toLowerCase().includes('robbery') ||
                           k.name.toLowerCase().includes('crime'))
                .map(k => k.id);

            if (relevantKeywords.length > 0) {
                discoverUrl += `&with_keywords=${relevantKeywords.join('|')}`;
            }

            const similarResponse = await fetch(discoverUrl, options);

            if (!similarResponse.ok) {
                throw new Error('API response was not ok');
            }

            const similarData = await similarResponse.json();

            if (mediaType === 'tv') {
                detailsData.title = detailsData.name;
                detailsData.release_date = detailsData.first_air_date;
                if (similarData.results) {
                    similarData.results = similarData.results.map(show => ({
                        ...show,
                        title: show.name,
                        release_date: show.first_air_date
                    }));
                }
            }
            
            let director = null;
            if (mediaType === 'tv') {
                director = detailsData.created_by?.[0] || null;
            } else {
                director = detailsData.credits?.crew?.find(person => person.job === "Director") || null;
            }

            const filteredSimilarContent = similarData.results?.filter(item => item.id !== movie.id) || [];
            
            // Platform kontrolü
            const platforms = [];
            
            // Türk filmi kontrolü
            if (detailsData.original_language === 'tr') {
                platforms.push('blutv');
            }
            
            // Yapım yılı kontrolü
            const releaseYear = new Date(detailsData.release_date).getFullYear();
            if (releaseYear >= 2015) {
                platforms.push('netflix', 'prime');
            }
            
            // IMDB puanı kontrolü
            if (detailsData.vote_average >= 7.5) {
                platforms.push('mubi');
            }
            
            // Disney içeriği kontrolü
            const isDisneyContent = detailsData.production_companies?.some(
                company => company.name.toLowerCase().includes('disney') || 
                          company.name.toLowerCase().includes('marvel') || 
                          company.name.toLowerCase().includes('pixar')
            );
            if (isDisneyContent) {
                platforms.push('disney');
            }

            // Benzersiz platformları al
            const uniquePlatforms = [...new Set(platforms)];
            setAvailablePlatforms(uniquePlatforms);

            setDirector(director);
            setMovieDetails(detailsData);
            setSimilarMovies(filteredSimilarContent.slice(0, 10));
        } catch (error) {
            console.error('Error fetching movie details:', error);
            setError('Detaylar yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePersonPress = (personId) => {
        navigation.navigate('PersonDetail', { personId });
    };

    const handleWatchTrailer = async () => {
        if (movieDetails?.videos?.results?.length > 0) {
            const trailer = movieDetails.videos.results.find(video => video.type === "Trailer") || movieDetails.videos.results[0];
            const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
            const supported = await Linking.canOpenURL(trailerUrl);
            if (supported) {
                await Linking.openURL(trailerUrl);
            }
        }
    };

    const handleFavoritePress = async () => {
        const newStatus = await toggleMovieFavorite(movie);
        setIsFavorite(newStatus);
    };

    const handleWatchOnPlatform = (platform) => {
        const platformInfo = STREAMING_PLATFORMS[platform];
        const searchQuery = encodeURIComponent(movieDetails?.title || '');
        const url = platformInfo.url + searchQuery;
        Linking.openURL(url);
    };

    const handleWatchListPress = () => {
        setWatchListModalVisible(true);
    };

    const renderSimilarMovies = () => {
        if (similarMovies.length === 0) return null;

        return (
            <View style={styles.similarMoviesSection}>
                <Text style={styles.sectionTitle}>
                    {getSimilarContentTitle(movieDetails)}
                </Text>
                <FlatList
                    data={similarMovies}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MovieCard
                            movie={item}
                            onPress={() => {
                                navigation.push('MovieDetail', { 
                                    movie: {
                                        ...item,
                                        media_type: movie.media_type || 'movie'
                                    }
                                });
                            }}
                        />
                    )}
                    contentContainerStyle={styles.similarMoviesContainer}
                />
            </View>
        );
    };

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={fetchMovieDetails}
                >
                    <Text style={[styles.retryButtonText, { color: colors.text }]}>Tekrar Dene</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header with Back Button and Favorite Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleFavoritePress}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorite ? colors.error : colors.text}
                    />
                </TouchableOpacity>
            </View>

            {/* Movie Poster */}
            <View style={styles.posterContainer}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}` }}
                    style={styles.poster}
                    resizeMode="cover"
                />
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color={colors.warning} />
                    <Text style={styles.rating}>{movieDetails?.vote_average?.toFixed(1)}</Text>
                </View>
            </View>

            {/* Movie Info */}
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <View style={styles.titleWrapper}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title} numberOfLines={2}>{movieDetails?.title || movieDetails?.name}</Text>
                            <TouchableOpacity
                                style={[styles.watchListButton, { backgroundColor: colors.error }]}
                                onPress={handleWatchListPress}
                            >
                                <Text style={[styles.watchListButtonText, { color: colors.background }]}>
                                    İzleme Listesine Ekle
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
                <View style={styles.metaInfo}>
                    <Text style={styles.metaText}>
                        {movieDetails?.release_date?.split('-')[0] || movieDetails?.first_air_date?.split('-')[0]}
                    </Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>
                        {movieDetails?.runtime ? `${movieDetails.runtime} dk` : 'TV Dizisi'}
                    </Text>
                </View>

                <View style={styles.genreContainer}>
                    {movieDetails?.genres?.map((genre) => (
                        <View key={genre.id} style={styles.genreTag}>
                            <Text style={styles.genreText}>{genre.name}</Text>
                        </View>
                    ))}
                </View>

                {movieDetails?.videos?.results?.length > 0 && (
                    <TouchableOpacity 
                        style={styles.trailerButton}
                        onPress={handleWatchTrailer}
                    >
                        <Ionicons name="play-circle-outline" size={24} color={colors.text} />
                        <Text style={styles.trailerButtonText}>Fragmanı İzle</Text>
                    </TouchableOpacity>
                )}

                {/* Yönetmen Bölümü */}
                {director && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Yönetmen</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <PersonCard
                                person={director}
                                role="Yönetmen"
                                onPress={() => handlePersonPress(director.id)}
                            />
                        </ScrollView>
                    </View>
                )}

                {/* Oyuncular Bölümü */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Oyuncular</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {movieDetails?.credits?.cast?.slice(0, 10).map((actor) => (
                            <PersonCard
                                key={actor.id}
                                person={actor}
                                role={actor.character}
                                onPress={() => handlePersonPress(actor.id)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {renderSimilarMovies()}
                
                {/* İzleme Platformları */}
                {availablePlatforms.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>İzleme Seçenekleri</Text>
                        <FlatList
                            data={availablePlatforms}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item}
                            contentContainerStyle={styles.platformsContainer}
                            renderItem={({ item }) => (
                                <PlatformCard
                                    platform={item}
                                    onPress={() => handleWatchOnPlatform(item)}
                                />
                            )}
                        />
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Özet</Text>
                    <Text style={styles.description}>{movieDetails?.overview || movie.description}</Text>
                </View>

                <View style={styles.divider} />

                {/* Comments Section */}
                <CommentSection 
                    movieId={movie.id}
                    comments={[]}
                />
            </View>

            <AddToWatchListModal
                visible={watchListModalVisible}
                onClose={() => setWatchListModalVisible(false)}
                movieId={movie.id}
                movieTitle={movie.title || movie.name}
            />
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
    posterContainer: {
        alignItems: 'center',
        paddingTop: spacing.lg,
    },
    poster: {
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        borderRadius: radius.lg,
    },
    ratingContainer: {
        position: 'absolute',
        bottom: spacing.lg,
        right: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: spacing.sm,
        borderRadius: radius.md,
    },
    rating: {
        color: colors.text,
        marginLeft: spacing.xs,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
    infoContainer: {
        padding: spacing.lg,
    },
    titleContainer: {
        marginBottom: spacing.md,
    },
    titleWrapper: {
        width: '100%',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.md,
    },
    title: {
        fontSize: typography.sizes.xl,
        color: colors.text,
        fontWeight: typography.weights.bold,
        flex: 1,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    metaText: {
        color: colors.textSecondary,
        fontSize: typography.sizes.md,
    },
    metaDot: {
        color: colors.textSecondary,
        marginHorizontal: spacing.sm,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.lg,
    },
    genreTag: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.lg,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
    },
    genreText: {
        color: colors.text,
        fontSize: typography.sizes.sm,
    },
    trailerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: radius.lg,
        marginBottom: spacing.xl,
    },
    trailerButtonText: {
        color: colors.text,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
        marginLeft: spacing.sm,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        paddingTop: spacing.lg,
        fontSize: typography.sizes.lg,
        color: colors.text,
        fontWeight: typography.weights.semiBold,
        marginBottom: spacing.xs,
    },
    sectionText: {
        color: colors.textSecondary,
        fontSize: typography.sizes.md,
        lineHeight: 24,
    },
    description: {
        color: colors.textSecondary,
        fontSize: typography.sizes.md,
        lineHeight: 24,
    },
    divider: {
        height: 1,
        backgroundColor: colors.surface,
        marginVertical: spacing.xl,
    },
    personCard: {
        width: CAST_IMAGE_SIZE,
        marginRight: spacing.md,
        alignItems: 'center',
    },
    personImage: {
        width: CAST_IMAGE_SIZE,
        height: CAST_IMAGE_SIZE * 1.5,
        borderRadius: radius.md,
        marginBottom: spacing.xs,
        backgroundColor: colors.surface,
    },
    personName: {
        color: colors.text,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semiBold,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    personRole: {
        color: colors.textSecondary,
        fontSize: typography.sizes.xs,
        textAlign: 'center',
    },
    similarMovieCard: {
        width: width * 0.35,
        marginHorizontal: 5,
        backgroundColor: colors.surface,
        borderRadius: radius.m,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    similarMovieImage: {
        width: '100%',
        height: width * 0.5,
        borderTopLeftRadius: radius.m,
        borderTopRightRadius: radius.m,
    },
    similarMovieTitle: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.text,
        padding: spacing.s,
        textAlign: 'center',
    },
    similarMoviesSection: {
        marginTop: spacing.m,
        marginBottom: spacing.m,
    },
    similarMoviesContainer: {
        paddingHorizontal: spacing.s,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: spacing.s,
    },
    ratingText: {
        fontSize: typography.sizes.xs,
        color: colors.text,
        marginLeft: spacing.xs,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    errorText: {
        fontSize: typography.sizes.lg,
        textAlign: 'center',
        marginBottom: spacing.l,
    },
    retryButton: {
        backgroundColor: colors.primary,
        padding: spacing.m,
        borderRadius: radius.m,
    },
    retryButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
    platformButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.s,
        borderRadius: radius.xl,
        borderWidth: 2,
        width: 80,
        height: 100,
        marginHorizontal: spacing.xs,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    platformsContainer: {
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.s,
        gap: spacing.s,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    platformName: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        textAlign: 'center',
    },
    actionButton: {
        padding: spacing.sm,
        borderRadius: radius.full,
        backgroundColor: colors.surface,
        marginLeft: spacing.sm,
    },
    watchListButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
    },
    watchListButtonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
    },
});

export default MovieDetailScreen;