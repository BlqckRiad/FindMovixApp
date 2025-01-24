import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, Animated } from 'react-native';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageModal from '../components/language/LanguageModal';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MovieRecommendationScreen from '../screens/movie/MovieRecommendationScreen';
import WatchlistScreen from '../screens/watchlist/WatchlistScreen';
import WatchlistDetailScreen from '../screens/watchlist/WatchlistDetailScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DEFAULT_PROFILE_IMAGE = 'https://randomuser.me/api/portraits/men/1.jpg';
const APP_VERSION = '1.0.0';

const DrawerItem = ({ label, icon, onPress, isActive }) => {
    const { theme } = useTheme();
    const colors = theme.colors;
    const scale = new Animated.Value(1);

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => onPress());
    };

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
                style={[
                    styles.drawerItem,
                    isActive && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={handlePress}
            >
                <View style={styles.drawerItemLeft}>
                    <Ionicons 
                        name={icon} 
                        size={24} 
                        color={isActive ? colors.primary : colors.text} 
                    />
                    <Text style={[
                        styles.drawerItemText,
                        { color: isActive ? colors.primary : colors.text }
                    ]}>
                        {label}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const CustomDrawerContent = ({ navigation, state }) => {
    const { isDarkMode, toggleTheme, theme, t, language, changeLanguage } = useTheme();
    const { user } = useAuth();
    const colors = theme.colors;
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const [name, surName, userName, userEmail, userImageUrl] = await Promise.all([
                AsyncStorage.getItem('name'),
                AsyncStorage.getItem('surName'),
                AsyncStorage.getItem('userName'),
                AsyncStorage.getItem('userEmail'),
                AsyncStorage.getItem('userImageUrl')
            ]);

            setUserData({
                name,
                surName,
                userName,
                userEmail,
                userImageUrl: userImageUrl || DEFAULT_PROFILE_IMAGE
            });
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    return (
        <View style={[styles.drawerContent, { backgroundColor: colors.background }]}>
            <TouchableOpacity 
                style={styles.profileSection}
                onPress={() => navigation.navigate('Profile')}
            >
                <View style={styles.profileImageContainer}>
                    <Image 
                        source={{ uri: userData?.userImageUrl || DEFAULT_PROFILE_IMAGE }} 
                        style={styles.profileImage}
                    />
                </View>
                <Text style={[styles.username, { color: colors.text }]}>
                    {userData ? `${userData.name} ${userData.surName}` : 'Loading...'}
                </Text>
                <Text style={[styles.email, { color: colors.textSecondary }]}>
                    {userData?.userEmail || 'Loading...'}
                </Text>
            </TouchableOpacity>

            <View style={styles.drawerItems}>
                <DrawerItem
                    label={t.home}
                    icon="home-outline"
                    onPress={() => navigation.navigate('Home')}
                    isActive={state.routeNames[state.index] === 'Home'}
                />
                <DrawerItem
                    label={t.movieRecommendations}
                    icon="film-outline"
                    onPress={() => navigation.navigate('MovieRecommendations')}
                    isActive={state.routeNames[state.index] === 'MovieRecommendations'}
                />
                <DrawerItem
                    label={t.watchLists}
                    icon="list-outline"
                    onPress={() => navigation.navigate('WatchList')}
                    isActive={state.routeNames[state.index] === 'WatchList'}
                />
                <DrawerItem
                    label={t.favorites}
                    icon="heart-outline"
                    onPress={() => navigation.navigate('Favorites')}
                    isActive={state.routeNames[state.index] === 'Favorites'}
                />
                <DrawerItem
                    label={t.profile}
                    icon="person-outline"
                    onPress={() => navigation.navigate('Profile')}
                    isActive={state.routeNames[state.index] === 'Profile'}
                />
                <DrawerItem
                    label={t.settings}
                    icon="settings-outline"
                    onPress={() => navigation.navigate('Settings')}
                    isActive={state.routeNames[state.index] === 'Settings'}
                />
            </View>

            <View style={[styles.separator, { backgroundColor: colors.surface }]} />

            <View style={styles.themeContainer}>
                <TouchableOpacity
                    style={styles.themeRow}
                    onPress={() => setShowLanguageModal(true)}
                >
                    <Ionicons name="language-outline" size={24} color={colors.text} />
                    <Text style={[styles.themeText, { color: colors.text }]}>{t.language}</Text>
                    <Text style={[styles.languageCode, { color: colors.textSecondary }]}>
                        {language.toUpperCase()}
                    </Text>
                </TouchableOpacity>
        
                <View style={styles.themeRow}>
                    <Ionicons 
                        name={isDarkMode ? "moon" : "sunny"} 
                        size={24} 
                        color={colors.text} 
                    />
                    <Text style={[styles.themeText, { color: colors.text }]}>{t.darkMode}</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{ false: colors.inactive, true: colors.primary }}
                        thumbColor={colors.text}
                    />
                </View>
            </View>

            <View style={styles.versionContainer}>
                <Text style={[styles.versionText, { color: colors.textSecondary }]}>
                    Version {APP_VERSION}
                </Text>
            </View>

            <LanguageModal
                visible={showLanguageModal}
                onClose={() => setShowLanguageModal(false)}
                onSelectLanguage={changeLanguage}
            />
        </View>
    );
};

const WatchListStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="WatchListMain" component={WatchlistScreen} />
            <Stack.Screen name="WatchListDetail" component={WatchlistDetailScreen} />
        </Stack.Navigator>
    );
};

const DrawerNavigator = () => {
    const { theme, t } = useTheme();
    const colors = theme.colors;

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: colors.background,
                    width: '75%',
                },
                drawerType: 'slide',
            }}
            drawerContent={props => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen 
                name="Home" 
                component={HomeScreen}
                options={{
                    drawerLabel: ({ focused }) => (
                        <Text style={[
                            styles.drawerLabel,
                            { color: focused ? colors.primary : colors.text }
                        ]}>
                            {t.home}
                        </Text>
                    ),
                    drawerIcon: ({ focused }) => (
                        <Ionicons
                            name="home-outline"
                            size={22}
                            color={focused ? colors.primary : colors.text}
                        />
                    )
                }}
            />
            <Drawer.Screen 
                name="MovieRecommendations" 
                component={MovieRecommendationScreen}
                options={{
                    drawerLabel: ({ focused }) => (
                        <Text style={[
                            styles.drawerLabel,
                            { color: focused ? colors.primary : colors.text }
                        ]}>
                            {t.movieRecommendations}
                        </Text>
                    ),
                    drawerIcon: ({ focused }) => (
                        <Ionicons
                            name="film-outline"
                            size={22}
                            color={focused ? colors.primary : colors.text}
                        />
                    )
                }}
            />
            <Drawer.Screen
                name="WatchList"
                component={WatchListStack}
                options={{
                    drawerLabel: ({ focused }) => (
                        <Text style={[
                            styles.drawerLabel,
                            { color: focused ? colors.primary : colors.text }
                        ]}>
                            {t.watchLists}
                        </Text>
                    ),
                    drawerIcon: ({ focused }) => (
                        <Ionicons
                            name="list-outline"
                            size={22}
                            color={focused ? colors.primary : colors.text}
                        />
                    )
                }}
            />
            <Drawer.Screen 
                name="Favorites" 
                component={FavoritesScreen}
                options={{
                    drawerLabel: ({ focused }) => (
                        <Text style={[
                            styles.drawerLabel,
                            { color: focused ? colors.primary : colors.text }
                        ]}>
                            {t.favorites}
                        </Text>
                    ),
                    drawerIcon: ({ focused }) => (
                        <Ionicons
                            name="heart-outline"
                            size={22}
                            color={focused ? colors.primary : colors.text}
                        />
                    )
                }}
            />
            <Drawer.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{
                    drawerLabel: ({ focused }) => (
                        <Text style={[
                            styles.drawerLabel,
                            { color: focused ? colors.primary : colors.text }
                        ]}>
                            {t.profile}
                        </Text>
                    ),
                    drawerIcon: ({ focused }) => (
                        <Ionicons
                            name="person-outline"
                            size={22}
                            color={focused ? colors.primary : colors.text}
                        />
                    )
                }}
            />
            <Drawer.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{
                    drawerLabel: ({ focused }) => (
                        <Text style={[
                            styles.drawerLabel,
                            { color: focused ? colors.primary : colors.text }
                        ]}>
                            {t.settings}
                        </Text>
                    ),
                    drawerIcon: ({ focused }) => (
                        <Ionicons
                            name="settings-outline"
                            size={22}
                            color={focused ? colors.primary : colors.text}
                        />
                    )
                }}
            />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        paddingTop: spacing.xl,
    },
    profileSection: {
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    profileImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: spacing.md,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
    },
    username: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.xs,
    },
    email: {
        fontSize: typography.sizes.sm,
    },
    drawerItems: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderRadius: radius.lg,
        marginBottom: spacing.xs,
    },
    drawerItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    drawerItemText: {
        marginLeft: spacing.md,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
    separator: {
        height: 1,
        marginVertical: spacing.md,
    },
    themeContainer: {
        padding: spacing.lg,
    },
    themeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    themeText: {
        flex: 1,
        marginLeft: spacing.md,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
    languageCode: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semiBold,
    },
    versionContainer: {
        padding: spacing.lg,
        alignItems: 'center',
    },
    versionText: {
        fontSize: typography.sizes.sm,
    },
    drawerLabel: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
});

export default DrawerNavigator; 