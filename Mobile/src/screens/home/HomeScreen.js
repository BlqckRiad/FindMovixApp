import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    FlatList,
    Image,
    Dimensions,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from 'react-native';
import {
    spacing,
    radius
} from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const MOVIE_CARD_WIDTH = width * 0.6;
const MOVIE_CARD_HEIGHT = MOVIE_CARD_WIDTH * 1.5;
const SEARCH_RESULT_WIDTH = width * 0.4;
const SEARCH_RESULT_HEIGHT = SEARCH_RESULT_WIDTH * 1.5;

const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjhmYTUyOGQ5OGQ4ZjJkMzMwMGM4YjhmNzZjMTMwYyIsIm5iZiI6MTczNTMwODYzMC42NTkwMDAyLCJzdWIiOiI2NzZlYjU1NmUyOTc2YmE3NWI5MmI4NTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FzRKxUDAxhy4GLFM88-1ihfw0xaFJjiL8LtJkhWFrEE';
const BASE_URL = 'https://api.themoviedb.org/3';

const MovieCard = React.memo(({ title, image, imdbRating, onPress }) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    return (
        <TouchableOpacity
            style={[styles.movieCard, { backgroundColor: colors.surface }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: image }}
                style={styles.movieImage}
                resizeMode="cover"
            />
            <View style={[styles.movieInfo, { backgroundColor: colors.surface }]}>
                <Text style={[styles.movieTitle, { color: colors.text }]} numberOfLines={1}>
                    {title}
                </Text>
                <View style={styles.ratingContainer}>
                    <Text style={[styles.ratingText, { color: colors.text }]}>IMDb: {imdbRating}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const SearchResultCard = React.memo(({ title, image, type, onPress }) => {
    const { theme, t } = useTheme();
    const colors = theme.colors;

    return (
        <TouchableOpacity
            style={[styles.searchResultCard, { backgroundColor: colors.surface }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: image }}
                style={styles.searchResultImage}
                resizeMode="cover"
            />
            <View style={styles.searchResultInfo}>
                <Text style={[styles.searchResultTitle, { color: colors.text }]} numberOfLines={2}>
                    {title}
                </Text>
                <Text style={[styles.searchResultType, { color: colors.textSecondary }]}>
                    {type === 'movie' ? t.movies : type === 'tv' ? t.tvShows : t.people}
                </Text>
            </View>
        </TouchableOpacity>
    );
});

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [isLoadingMovies, setIsLoadingMovies] = useState(true);
    const [popularPage, setPopularPage] = useState(1);
    const [topRatedPage, setTopRatedPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { theme, t } = useTheme();
    const colors = theme.colors;

    useEffect(() => {
        fetchMovies();
    }, [t.language]);

    const fetchMovies = async (page = 1, type = 'both') => {
        if (page === 1) {
            setIsLoadingMovies(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const fetchPromises = [];

            if (type === 'both' || type === 'popular') {
                fetchPromises.push(
                    fetch(
                        `${BASE_URL}/movie/popular?language=${t.language === 'tr' ? 'tr-TR' : 'en-US'}&page=${page}`,
                        {
                            headers: {
                                Authorization: API_KEY,
                                'Content-Type': 'application/json',
                            },
                        }
                    )
                );
            }

            if (type === 'both' || type === 'top_rated') {
                fetchPromises.push(
                    fetch(
                        `${BASE_URL}/movie/top_rated?language=${t.language === 'tr' ? 'tr-TR' : 'en-US'}&page=${page}`,
                        {
                            headers: {
                                Authorization: API_KEY,
                                'Content-Type': 'application/json',
                            },
                        }
                    )
                );
            }

            const responses = await Promise.all(fetchPromises);
            const data = await Promise.all(responses.map(response => response.json()));

            if (type === 'both' || type === 'popular') {
                const popularData = data[type === 'both' ? 0 : 0];
                const newPopularMovies = popularData.results.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                    imdbRating: movie.vote_average.toFixed(1),
                    year: movie.release_date?.split('-')[0] || '',
                    overview: movie.overview,
                }));

                if (page === 1) {
                    setPopularMovies(newPopularMovies);
                } else {
                    setPopularMovies(prev => [...prev, ...newPopularMovies]);
                }
            }

            if (type === 'both' || type === 'top_rated') {
                const topRatedData = data[type === 'both' ? 1 : 0];
                const newTopRatedMovies = topRatedData.results.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                    imdbRating: movie.vote_average.toFixed(1),
                    year: movie.release_date?.split('-')[0] || '',
                    overview: movie.overview,
                }));

                if (page === 1) {
                    setTopRatedMovies(newTopRatedMovies);
                } else {
                    setTopRatedMovies(prev => [...prev, ...newTopRatedMovies]);
                }
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            if (page === 1) {
                setIsLoadingMovies(false);
            } else {
                setIsLoadingMore(false);
            }
        }
    };

    const handleLoadMore = (type) => {
        if (isLoadingMore) return;

        if (type === 'popular') {
            const nextPage = popularPage + 1;
            setPopularPage(nextPage);
            fetchMovies(nextPage, 'popular');
        } else if (type === 'top_rated') {
            const nextPage = topRatedPage + 1;
            setTopRatedPage(nextPage);
            fetchMovies(nextPage, 'top_rated');
        }
    };

    const handleSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=${t.language === 'tr' ? 'tr-TR' : 'en-US'}`,
                {
                    headers: {
                        Authorization: API_KEY,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = await response.json();
            setSearchResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [t.language]);

    const handleMoviePress = (movie) => {
        setShowSearchModal(false);
        navigation.navigate('MovieDetail', { movie });
    };

    const renderMovieSection = (title, data, type) => (
        <View style={styles.movieSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            <FlatList
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MovieCard
                        title={item.title}
                        image={item.image}
                        imdbRating={item.imdbRating}
                        onPress={() => handleMoviePress(item)}
                    />
                )}
                contentContainerStyle={styles.movieList}
                onEndReached={() => handleLoadMore(type)}
                onEndReachedThreshold={0.5}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                initialNumToRender={5}
                ListFooterComponent={
                    isLoadingMore ? (
                        <View style={styles.loadingMore}>
                            <ActivityIndicator size="small" color={colors.primary} />
                        </View>
                    ) : null
                }
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView style={styles.scrollView}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.surface }]}>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => navigation.openDrawer()}
                        >
                            <Text style={[styles.menuIcon, { color: colors.text }]}>☰</Text>
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: colors.primary }]}>FindMovix</Text>
                    </View>

                    {/* Search Bar */}
                    <TouchableOpacity
                        style={styles.searchContainer}
                        onPress={() => setShowSearchModal(true)}
                    >
                        <View style={[styles.searchInput, {
                            backgroundColor: colors.surface,
                            borderColor: colors.inactive
                        }]}>
                            <View style={styles.searchIconContainer}>
                                <Ionicons name="search" size={20} color={colors.textSecondary} />
                            </View>
                            <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
                                {t.search}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Movie Sections */}
                    {isLoadingMovies ? (
                        <ActivityIndicator
                            style={styles.loader}
                            size="large"
                            color={colors.primary}
                        />
                    ) : (
                        <>
                            {renderMovieSection(t.popularMovies, popularMovies, 'popular')}
                           
                            {renderMovieSection(t.topRatedMovies, topRatedMovies, 'top_rated')}
                        </>
                    )}
                </ScrollView>
            </TouchableWithoutFeedback>

            {/* Search Modal */}
            <Modal
                visible={showSearchModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowSearchModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowSearchModal(false)}>
                    <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                                <View style={[styles.searchHeader, { borderBottomColor: colors.surface }]}>
                                    <TouchableOpacity
                                        onPress={() => setShowSearchModal(false)}
                                        style={styles.backButton}
                                    >
                                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[styles.modalSearchInput, {
                                            backgroundColor: colors.surface,
                                            color: colors.text,
                                            borderColor: colors.inactive
                                        }]}
                                        placeholder={t.search}
                                        placeholderTextColor={colors.textSecondary}
                                        value={searchQuery}
                                        onChangeText={(text) => {
                                            setSearchQuery(text);
                                            handleSearch(text);
                                        }}
                                        autoFocus
                                    />
                                </View>

                                {isLoading ? (
                                    <ActivityIndicator
                                        style={styles.loader}
                                        size="large"
                                        color={colors.primary}
                                    />
                                ) : (
                                    <FlatList
                                        data={searchResults}
                                        numColumns={2}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <SearchResultCard
                                                title={item.title || item.name}
                                                image={`https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`}
                                                type={item.media_type}
                                                onPress={() => handleMoviePress(item)}
                                            />
                                        )}
                                        contentContainerStyle={styles.searchResults}
                                        maxToRenderPerBatch={8}
                                        windowSize={5}
                                        removeClippedSubviews={true}
                                        initialNumToRender={8}
                                        ListEmptyComponent={
                                            searchQuery ? (
                                                <View style={styles.emptyContainer}>
                                                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                                        {t.noResults}
                                                    </Text>
                                                </View>
                                            ) : null
                                        }
                                    />
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.xl,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        paddingTop: spacing.xl,
        borderBottomWidth: 1,
    },
    menuButton: {
        marginRight: spacing.md,
    },
    menuIcon: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
    },
    searchContainer: {
        padding: spacing.lg,
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: radius.lg,
        borderWidth: 1,
        height: 50,
    },
    searchIconContainer: {
        paddingHorizontal: spacing.md,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: typography.sizes.md,
    },
    movieSection: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semiBold,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    movieList: {
        paddingHorizontal: spacing.md,
    },
    movieCard: {
        width: MOVIE_CARD_WIDTH,
        marginHorizontal: spacing.sm,
        borderRadius: radius.lg,
        overflow: 'hidden',
    },
    movieImage: {
        width: MOVIE_CARD_WIDTH,
        height: MOVIE_CARD_HEIGHT,
        borderRadius: radius.lg,
    },
    movieInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.md,
        borderBottomLeftRadius: radius.lg,
        borderBottomRightRadius: radius.lg,
    },
    movieTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
        marginBottom: spacing.xs,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '90%',
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: spacing.md,
        padding: spacing.xs,
    },
    modalSearchInput: {
        flex: 1,
        height: 40,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.lg,
        borderWidth: 1,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchResults: {
        padding: spacing.md,
    },
    searchResultCard: {
        width: SEARCH_RESULT_WIDTH,
        margin: spacing.xs,
        borderRadius: radius.lg,
        overflow: 'hidden',
    },
    searchResultImage: {
        width: SEARCH_RESULT_WIDTH,
        height: SEARCH_RESULT_HEIGHT,
        borderRadius: radius.lg,
    },
    searchResultInfo: {
        padding: spacing.sm,
    },
    searchResultTitle: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semiBold,
        marginBottom: spacing.xs,
    },
    searchResultType: {
        fontSize: typography.sizes.xs,
    },
    loadingMore: {
        width: 50,
        height: MOVIE_CARD_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
    },
    bottomBanner: {
        alignSelf: 'center',
        marginVertical: spacing.m,
    },
});

export default HomeScreen; 