import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useFavorites } from '../../context/FavoritesContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.44;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

const TabButton = ({ title, isActive, onPress, colors }) => (
    <TouchableOpacity
        style={[
            styles.tabButton, 
            { 
                backgroundColor: isActive ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: isActive ? colors.primary : colors.border,
            }
        ]}
        onPress={onPress}
    >
        <Text style={[
            styles.tabButtonText, 
            { 
                color: isActive ? colors.background : colors.text,
                fontWeight: isActive ? '600' : '400'
            }
        ]}>
            {title}
        </Text>
    </TouchableOpacity>
);

const FavoriteItem = ({ item, type, onPress, onDelete, colors }) => (
    <TouchableOpacity 
        style={[styles.itemContainer, { 
            backgroundColor: colors.surface,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3
        }]} 
        onPress={onPress}
    >
        <Image
            source={{
                uri: type === 'person'
                    ? item.profile_path
                        ? `https://image.tmdb.org/t/p/w200${item.profile_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    : item.image
                        ? `https://image.tmdb.org/t/p/w200${item.image}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
            }}
            style={styles.itemImage}
            resizeMode="cover"
        />
        <View style={styles.itemInfo}>
            <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
                {type === 'person' ? item.name : item.title}
            </Text>
            {type !== 'person' && (
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color={colors.warning} />
                    <Text style={[styles.rating, { color: colors.text }]}>
                        {item.imdbRating}
                    </Text>
                </View>
            )}
        </View>
        <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => onDelete(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="close-circle" size={24} color={colors.error} />
        </TouchableOpacity>
    </TouchableOpacity>
);

const FavoritesScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('movies');
    const { theme, t } = useTheme();
    const colors = theme.colors;
    const { 
        favoriteMovies, 
        favoriteTVShows, 
        favoritePeople,
        toggleMovieFavorite,
        toggleTVShowFavorite,
        togglePersonFavorite
    } = useFavorites();

    const handleItemPress = (item, type) => {
        switch (type) {
            case 'movie':
                navigation.navigate('MovieDetail', { movie: item });
                break;
            case 'tv':
                navigation.navigate('MovieDetail', { movie: item }); // TV detay sayfası yapılınca değişecek
                break;
            case 'person':
                navigation.navigate('PersonDetail', { personId: item.id });
                break;
        }
    };

    const handleDelete = async (item, type) => {
        switch (type) {
            case 'movie':
                await toggleMovieFavorite(item);
                break;
            case 'tv':
                await toggleTVShowFavorite(item);
                break;
            case 'person':
                await togglePersonFavorite(item);
                break;
        }
    };

    const renderContent = () => {
        let data = [];
        let type = '';

        switch (activeTab) {
            case 'movies':
                data = favoriteMovies;
                type = 'movie';
                break;
            case 'tv':
                data = favoriteTVShows;
                type = 'tv';
                break;
            case 'people':
                data = favoritePeople;
                type = 'person';
                break;
        }

        return (
            <FlatList
                data={data}
                numColumns={2}
                renderItem={({ item }) => (
                    <FavoriteItem
                        item={item}
                        type={type}
                        onPress={() => handleItemPress(item, type)}
                        onDelete={() => handleDelete(item, type)}
                        colors={colors}
                    />
                )}
                keyExtractor={item => `${type}-${item.id}`}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            {activeTab === 'movies' && t.noFavoriteMovies}
                            {activeTab === 'tv' && t.noFavoriteTVShows}
                            {activeTab === 'people' && t.noFavoritePeople}
                        </Text>
                    </View>
                }
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header]}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.openDrawer()}
                >
                    <Ionicons name="menu" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t.favorites}</Text>
                <View style={styles.headerRight} />
            </View>

            <View style={styles.tabContainer}>
                <TabButton
                    title={t.movies}
                    isActive={activeTab === 'movies'}
                    onPress={() => setActiveTab('movies')}
                    colors={colors}
                />
                <TabButton
                    title={t.tvShows}
                    isActive={activeTab === 'tv'}
                    onPress={() => setActiveTab('tv')}
                    colors={colors}
                />
                <TabButton
                    title={t.people}
                    isActive={activeTab === 'people'}
                    onPress={() => setActiveTab('people')}
                    colors={colors}
                />
            </View>

            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 16,
        backgroundColor: 'transparent',
    },
    menuButton: {
        padding: 12,
        borderRadius: 12,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 12,
    },
    headerRight: {
        width: 48,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 4,
    },
    tabButtonText: {
        fontSize: 15,
    },
    listContent: {
        padding: 16,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        marginHorizontal: 8,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    itemImage: {
        width: '100%',
        height: ITEM_HEIGHT,
        borderRadius: 16,
    },
    itemInfo: {
        padding: 12,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontSize: 14,
    },
    deleteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default FavoritesScreen; 