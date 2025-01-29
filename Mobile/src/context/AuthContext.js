import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

    useEffect(() => {
        checkOnboardingStatus();
        checkAuthStatus();
    }, []);

    const updateUser = (newUserData) => {
        setUser(prev => ({ ...prev, ...newUserData }));
    };

    const checkAuthStatus = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                const userData = {
                    userID: await AsyncStorage.getItem('userID'),
                    name: await AsyncStorage.getItem('name'),
                    surName: await AsyncStorage.getItem('surName'),
                    userName: await AsyncStorage.getItem('userName'),
                    userEmail: await AsyncStorage.getItem('userEmail'),
                    userTelNo: await AsyncStorage.getItem('userTelNo'),
                    userToken: userToken,
                    userRoleID: await AsyncStorage.getItem('userRoleID'),
                    userSexsID: await AsyncStorage.getItem('userSexsID'),
                    userImageID: await AsyncStorage.getItem('userImageID'),
                    userImageUrl: await AsyncStorage.getItem('userImageUrl'),
                };
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    };

    const checkOnboardingStatus = async () => {
        try {
            const value = await AsyncStorage.getItem('hasSeenOnboarding');
            setHasSeenOnboarding(value === 'true');
        } catch (error) {
            console.error('Error checking onboarding status:', error);
        }
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            setHasSeenOnboarding(true);
        } catch (error) {
            console.error('Error saving onboarding status:', error);
        }
    };

    const login = async (emailOrTelNo, password) => {
        try {
            const userData = await loginUser(emailOrTelNo, password);
            setUser(userData);
            setIsAuthenticated(true);
            return userData;
        } catch (error) {
            throw new Error(error.message || 'Giriş işlemi başarısız oldu');
        }
    };

    const logout = async () => {
        try {
            // Tüm kullanıcı verilerini temizle
            await AsyncStorage.multiRemove([
                'userID',
                'name',
                'surName',
                'userName',
                'userEmail',
                'userTelNo',
                'userToken',
                'userRoleID',
                'userSexsID',
                'userImageID',
                'userImageUrl'
            ]);
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const setFakeAuth = async () => {
        const fakeUser = {
            userID: '0',
            name: 'Find',
            surName: 'Movix',
            userName: 'FindMovix',
            userEmail: 'Find@Movix.com',
            userTelNo: '0',
            userToken: 'fakeToken',
            userRoleID: '1',
            userSexsID: '0',
            userImageID: '9',
            userImageUrl: 'https://res.cloudinary.com/dsga1anfp/image/upload/v1738064609/9fb57b57-40e7-499b-afc5-755516beaf75.png',
        };
    
        const STORAGE_KEYS = {
            USER_ID: 'userID',
            NAME: 'name',
            SURNAME: 'surName',
            USERNAME: 'userName',
            EMAIL: 'userEmail',
            PHONE: 'userTelNo',
            TOKEN: 'userToken',
            ROLE_ID: 'userRoleID',
            SEX_ID: 'userSexsID',
            IMAGE_ID: 'userImageID',
            IMAGE_URL: 'userImageUrl',
        };
    
        try {
            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEYS.USER_ID, fakeUser.userID),
                AsyncStorage.setItem(STORAGE_KEYS.NAME, fakeUser.name),
                AsyncStorage.setItem(STORAGE_KEYS.SURNAME, fakeUser.surName),
                AsyncStorage.setItem(STORAGE_KEYS.USERNAME, fakeUser.userName),
                AsyncStorage.setItem(STORAGE_KEYS.EMAIL, fakeUser.userEmail),
                AsyncStorage.setItem(STORAGE_KEYS.PHONE, fakeUser.userTelNo),
                AsyncStorage.setItem(STORAGE_KEYS.TOKEN, fakeUser.userToken),
                AsyncStorage.setItem(STORAGE_KEYS.ROLE_ID, String(fakeUser.userRoleID)),
                AsyncStorage.setItem(STORAGE_KEYS.SEX_ID, String(fakeUser.userSexsID)),
                AsyncStorage.setItem(STORAGE_KEYS.IMAGE_ID, String(fakeUser.userImageID)),
                fakeUser.userImageUrl && AsyncStorage.setItem(STORAGE_KEYS.IMAGE_URL, fakeUser.userImageUrl),
            ]);
    
            setUser(fakeUser);
            setIsAuthenticated(true);
            return fakeUser;
        } catch (error) {
            console.error('Error setting user data:', error);
        }
    
        return fakeUser;
    };    
    

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            hasSeenOnboarding,
            login,
            logout,
            completeOnboarding,
            updateUser,
            setFakeAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};