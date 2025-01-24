import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Platform,
    Modal,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjhmYTUyOGQ5OGQ4ZjJkMzMwMGM4YjhmNzZjMTMwYyIsIm5iZiI6MTczNTMwODYzMC42NTkwMDAyLCJzdWIiOiI2NzZlYjU1NmUyOTc2YmE3NWI5MmI4NTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FzRKxUDAxhy4GLFM88-1ihfw0xaFJjiL8LtJkhWFrEE';

const WatchListDetailScreen = ({ route, navigation }) => {
    const { listId, listName } = route.params;
    const { theme, language } = useTheme();
    const colors = theme.colors;
    
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ visible: false, movieId: null, movieTitle: '' });
    const [activeTab, setActiveTab] = useState('unwatched'); // 'watched' veya 'unwatched'

    const translations = {
        en: {
            noMovies: "No movies in this list",
            removeFromList: "Remove from list",
            error: "Error loading movies",
            retry: "Retry",
            confirmDelete: "Remove from List",
            confirmDeleteMessage: "Are you sure you want to remove this movie from your list?",
            cancel: "Cancel",
            remove: "Remove",
            markAsWatched: "Mark as Watched",
            markAsUnwatched: "Mark as Unwatched",
            watched: "Watched",
            unwatched: "To Watch"
        },
        tr: {
            noMovies: "Bu listede film bulunmuyor",
            removeFromList: "Listeden çıkar",
            error: "Filmler yüklenirken hata oluştu",
            retry: "Tekrar dene",
            confirmDelete: "Listeden Çıkar",
            confirmDeleteMessage: "Bu filmi listenizden çıkarmak istediğinizden emin misiniz?",
            cancel: "İptal",
            remove: "Çıkar",
            markAsWatched: "İzlendi Olarak İşaretle",
            markAsUnwatched: "İzlenmedi Olarak İşaretle",
            watched: "İzlenenler",
            unwatched: "İzlenecekler"
        }
    };

    const t = translations[language];

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const listsJson = await AsyncStorage.getItem('watchLists');
            const lists = JSON.parse(listsJson);
            const currentList = lists.find(list => list.id === listId);

            if (!currentList || !currentList.movies) {
                setMovies([]);
                setIsLoading(false);
                return;
            }

            const moviePromises = currentList.movies.map(async movieId => {
                const response = await fetch(`${BASE_URL}/movie/${movieId}?language=tr-TR`, {
                    headers: {
                        'Authorization': API_KEY,
                        'accept': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.success === false || !data.id) return null;
                
                // İzlenme durumunu kontrol et
                const watchedMoviesJson = await AsyncStorage.getItem('watchedMovies');
                const watchedMovies = watchedMoviesJson ? JSON.parse(watchedMoviesJson) : {};
                const isWatched = watchedMovies[listId]?.includes(movieId);
                
                return {
                    ...data,
                    isWatched: isWatched
                };
            });

            const movieDetails = await Promise.all(moviePromises);
            const validMovies = movieDetails.filter(movie => movie !== null);
            setMovies(validMovies);
        } catch (error) {
            console.error('Error loading movies:', error);
            setError(t.error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleWatchStatus = async (movieId) => {
        try {
            const watchedMoviesJson = await AsyncStorage.getItem('watchedMovies');
            let watchedMovies = watchedMoviesJson ? JSON.parse(watchedMoviesJson) : {};
            
            if (!watchedMovies[listId]) {
                watchedMovies[listId] = [];
            }

            const updatedMovies = movies.map(movie => {
                if (movie.id === movieId) {
                    const isWatched = !movie.isWatched;
                    
                    if (isWatched) {
                        watchedMovies[listId] = [...watchedMovies[listId], movieId];
                    } else {
                        watchedMovies[listId] = watchedMovies[listId].filter(id => id !== movieId);
                    }
                    
                    return { ...movie, isWatched };
                }
                return movie;
            });

            await AsyncStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
            setMovies(updatedMovies);
        } catch (error) {
            console.error('Error toggling watch status:', error);
        }
    };

    const removeFromList = async (movieId) => {
        try {
            const listsJson = await AsyncStorage.getItem('watchLists');
            const lists = JSON.parse(listsJson);
            
            const updatedLists = lists.map(list => {
                if (list.id === listId) {
                    return {
                        ...list,
                        movies: list.movies.filter(id => id !== movieId)
                    };
                }
                return list;
            });

            await AsyncStorage.setItem('watchLists', JSON.stringify(updatedLists));
            
            // Mevcut ekranın film listesini güncelle
            setMovies(movies.filter(movie => movie.id !== movieId));
            
            // Önceki ekrana dönüş için event gönder
            if (navigation.getParent()) {
                const parentNav = navigation.getParent();
                parentNav.setParams({ listUpdated: Date.now() });
            }
        } catch (error) {
            console.error('Error removing movie:', error);
        }
    };

    const showDeleteConfirmation = (movieId, movieTitle) => {
        setDeleteModal({
            visible: true,
            movieId,
            movieTitle
        });
    };

    const handleDelete = async () => {
        if (deleteModal.movieId) {
            await removeFromList(deleteModal.movieId);
        }
        setDeleteModal({ visible: false, movieId: null, movieTitle: '' });
    };

    const renderMovie = ({ item }) => (
        <TouchableOpacity
            style={[styles.movieCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('MovieDetail', { movie: item })}
        >
            <Image
                source={{
                    uri: item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                }}
                style={styles.moviePoster}
                resizeMode="cover"
            />
            <View style={styles.movieInfo}>
                <Text style={[styles.movieTitle, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={[styles.movieYear, { color: colors.textSecondary }]}>
                    {item.release_date?.split('-')[0]}
                </Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color={colors.warning} />
                    <Text style={[styles.rating, { color: colors.text }]}>
                        {item.vote_average?.toFixed(1)}
                    </Text>
                </View>
            </View>
            <View style={styles.movieActions}>
                <TouchableOpacity
                    style={[
                        styles.watchButton,
                        { backgroundColor: item.isWatched ? colors.success : colors.primary }
                    ]}
                    onPress={() => toggleWatchStatus(item.id)}
                >
                    <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                        {item.isWatched ? t.markAsUnwatched : t.markAsWatched}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: colors.error }]}
                    onPress={() => showDeleteConfirmation(item.id, item.title)}
                >
                    <Text style={[styles.buttonText, { color: colors.background }]}>
                        {t.removeFromList}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const filteredMovies = movies.filter(movie => 
        activeTab === 'watched' ? movie.isWatched : !movie.isWatched
    );

    if (error) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
                <TouchableOpacity
                    style={[styles.retryButton, { backgroundColor: colors.primary }]}
                    onPress={loadMovies}
                >
                    <Text style={[styles.retryButtonText, { color: colors.background }]}>
                        {t.retry}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.surface }]}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                    {listName}
                </Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        { 
                            borderColor: colors.border,
                            backgroundColor: activeTab === 'unwatched' ? colors.primary : colors.surface
                        }
                    ]}
                    onPress={() => setActiveTab('unwatched')}
                >
                    <View style={styles.tabContent}>
                        <Ionicons 
                            name="time-outline" 
                            size={20} 
                            color={activeTab === 'unwatched' ? colors.background : colors.text} 
                        />
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'unwatched' ? colors.background : colors.text }
                        ]}>
                            {t.unwatched}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        { 
                            borderColor: colors.border,
                            backgroundColor: activeTab === 'watched' ? colors.success : colors.surface
                        }
                    ]}
                    onPress={() => setActiveTab('watched')}
                >
                    <View style={styles.tabContent}>
                        <Ionicons 
                            name="checkmark-circle-outline" 
                            size={20} 
                            color={activeTab === 'watched' ? colors.background : colors.text} 
                        />
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'watched' ? colors.background : colors.text }
                        ]}>
                            {t.watched}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredMovies}
                renderItem={renderMovie}
                keyExtractor={item => String(item?.id || Math.random())}
                contentContainerStyle={styles.movieList}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            {t.noMovies}
                        </Text>
                    </View>
                }
            />

            <Modal
                visible={deleteModal.visible}
                transparent
                animationType="fade"
                onRequestClose={() => setDeleteModal({ visible: false, movieId: null, movieTitle: '' })}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <View style={styles.modalHeader}>
                            <Ionicons name="trash-outline" size={32} color={colors.error} />
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {t.confirmDelete}
                            </Text>
                        </View>
                        
                        <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
                            {t.confirmDeleteMessage}
                        </Text>
                        
                        <Text style={[styles.movieTitleInModal, { color: colors.text }]}>
                            "{deleteModal.movieTitle}"
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                onPress={() => setDeleteModal({ visible: false, movieId: null, movieTitle: '' })}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                                    {t.cancel}
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.modalButton, styles.deleteButton, { backgroundColor: colors.error }]}
                                onPress={handleDelete}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.background }]}>
                                    {t.remove}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        paddingTop: Platform.OS === 'ios' ? 60 : spacing.xl,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    headerTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        flex: 1,
    },
    movieList: {
        padding: spacing.md,
    },
    movieCard: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        borderRadius: radius.lg,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    moviePoster: {
        width: 100,
        height: 150,
    },
    movieInfo: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    movieTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.xs,
    },
    movieYear: {
        fontSize: typography.sizes.sm,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        marginLeft: spacing.xs,
        fontSize: typography.sizes.sm,
    },
    removeButton: {
        padding: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: spacing.sm,
        borderRadius: radius.md,
    },
    removeButtonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    emptyText: {
        fontSize: typography.sizes.lg,
        textAlign: 'center',
    },
    errorText: {
        fontSize: typography.sizes.lg,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    retryButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
    },
    retryButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalContent: {
        width: '100%',
        borderRadius: radius.lg,
        padding: spacing.lg,
        alignItems: 'center',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    modalTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        marginTop: spacing.sm,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: typography.sizes.md,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    movieTitleInModal: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
        marginHorizontal: spacing.xs,
        borderWidth: 1,
    },
    cancelButton: {
        borderColor: 'transparent',
    },
    deleteButton: {
        borderColor: 'transparent',
    },
    modalButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        gap: spacing.sm,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    tabText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
    movieActions: {
        padding: spacing.md,
        gap: spacing.sm,
    },
    watchButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.xs,
    },
    buttonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        textAlign: 'center',
    },
});

export default WatchListDetailScreen; 