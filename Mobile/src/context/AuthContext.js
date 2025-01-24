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

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            hasSeenOnboarding,
            login,
            logout,
            completeOnboarding,
            updateUser
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