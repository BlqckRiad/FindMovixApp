import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.4;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjhmYTUyOGQ5OGQ4ZjJkMzMwMGM4YjhmNzZjMTMwYyIsIm5iZiI6MTczNTMwODYzMC42NTkwMDAyLCJzdWIiOiI2NzZlYjU1NmUyOTc2YmE3NWI5MmI4NTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FzRKxUDAxhy4GLFM88-1ihfw0xaFJjiL8LtJkhWFrEE';

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState('movie'); // 'movie', 'tv', 'person'

    const searchTypes = [
        { id: 'movie', label: 'Filmler', icon: 'film-outline' },
        { id: 'tv', label: 'Diziler', icon: 'tv-outline' },
        { id: 'person', label: 'Kişiler', icon: 'people-outline' },
    ];

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: API_KEY
                }
            };

            let endpoint = '';
            switch (selectedType) {
                case 'movie':
                    endpoint = '/search/movie';
                    break;
                case 'tv':
                    endpoint = '/search/tv';
                    break;
                case 'person':
                    endpoint = '/search/person';
                    break;
            }

            const response = await fetch(
                `${BASE_URL}${endpoint}?query=${encodeURIComponent(query)}&language=tr-TR&page=1`,
                options
            );
            const data = await response.json();
            setSearchResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderSearchTypeButton = ({ id, label, icon }) => (
        <TouchableOpacity
            style={[
                styles.typeButton,
                selectedType === id && styles.selectedTypeButton
            ]}
            onPress={() => {
                setSelectedType(id);
                if (searchQuery) handleSearch(searchQuery);
            }}
        >
            <Ionicons 
                name={icon} 
                size={20} 
                color={selectedType === id ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
                styles.typeButtonText,
                selectedType === id && styles.selectedTypeButtonText
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => {
        if (selectedType === 'person') {
            return (
                <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => navigation.navigate('PersonDetail', { personId: item.id })}
                >
                    <Image
                        source={{
                            uri: item.profile_path
                                ? `https://image.tmdb.org/t/p/w200${item.profile_path}`
                                : 'https://via.placeholder.com/200x300?text=No+Image'
                        }}
                        style={styles.itemImage}
                    />
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemSubtitle}>
                        {item.known_for_department || 'Oyuncu'}
                    </Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => navigation.navigate('MovieDetail', { 
                        movie: {
                            ...item,
                            title: selectedType === 'tv' ? item.name : item.title
                        }
                    })}
                >
                    <Image
                        source={{
                            uri: item.poster_path
                                ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                                : 'https://via.placeholder.com/200x300?text=No+Image'
                        }}
                        style={styles.itemImage}
                    />
                    <Text style={styles.itemTitle}>
                        {selectedType === 'tv' ? item.name : item.title}
                    </Text>
                    <Text style={styles.itemSubtitle}>
                        {item.first_air_date || item.release_date
                            ? new Date(item.first_air_date || item.release_date).getFullYear()
                            : 'Tarih yok'}
                    </Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color={colors.warning} />
                        <Text style={styles.rating}>
                            {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Search Header */}
            <View style={styles.searchHeader}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Film, Dizi veya Kişi Ara..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (text.trim().length > 0) {
                                handleSearch(text);
                            } else {
                                setSearchResults([]);
                            }
                        }}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setSearchQuery('');
                                setSearchResults([]);
                            }}
                        >
                            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Search Type Buttons */}
            <View style={styles.typeButtonsContainer}>
                {searchTypes.map(type => renderSearchTypeButton(type))}
            </View>

            {/* Results */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : searchQuery.trim().length > 0 ? (
                <FlatList
                    data={searchResults}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${selectedType}-${item.id}`}
                    numColumns={2}
                    contentContainerStyle={styles.resultsList}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
                        </View>
                    }
                />
            ) : (
                <View style={styles.initialStateContainer}>
                    <Ionicons name="search" size={48} color={colors.textSecondary} />
                    <Text style={styles.initialStateText}>
                        Film, dizi veya kişi aramak için yazmaya başlayın
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchHeader: {
        padding: spacing.lg,
        paddingTop: spacing.xl * 2,
        backgroundColor: colors.surface,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.md,
        height: 45,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        color: colors.text,
        fontSize: typography.sizes.md,
    },
    typeButtonsContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
        marginHorizontal: spacing.xs,
        borderRadius: radius.lg,
        backgroundColor: colors.background,
    },
    selectedTypeButton: {
        backgroundColor: colors.primary + '20',
    },
    typeButtonText: {
        marginLeft: spacing.xs,
        color: colors.textSecondary,
        fontSize: typography.sizes.sm,
    },
    selectedTypeButtonText: {
        color: colors.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultsList: {
        padding: spacing.md,
    },
    resultItem: {
        flex: 1,
        margin: spacing.xs,
        alignItems: 'center',
        maxWidth: ITEM_WIDTH,
    },
    itemImage: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
    },
    itemTitle: {
        marginTop: spacing.xs,
        color: colors.text,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semiBold,
        textAlign: 'center',
    },
    itemSubtitle: {
        color: colors.textSecondary,
        fontSize: typography.sizes.xs,
        marginTop: spacing.xs,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    rating: {
        color: colors.warning,
        fontSize: typography.sizes.xs,
        marginLeft: spacing.xs,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: typography.sizes.md,
        textAlign: 'center',
    },
    initialStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    initialStateText: {
        color: colors.textSecondary,
        fontSize: typography.sizes.md,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});

export default SearchScreen; 