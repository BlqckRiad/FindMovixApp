import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DrawerNavigator from './DrawerNavigator';
import MovieDetailScreen from '../screens/movie/MovieDetailScreen';
import MovieRecommendationResultScreen from '../screens/movie/MovieRecommendationResultScreen';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import PersonDetailScreen from '../screens/person/PersonDetailScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import AboutScreen from '../screens/settings/AboutScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { isAuthenticated } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                }}
            >
                {!isAuthenticated ? (
                    // Auth screens
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    </>
                ) : (
                    // App screens
                    <>
                        <Stack.Screen 
                            name="DrawerNavigator" 
                            component={DrawerNavigator}
                        />
                        <Stack.Screen 
                            name="MovieRecommendationResult" 
                            component={MovieRecommendationResultScreen}
                            options={{
                                headerShown: false,
                                presentation: 'modal',
                                animation: 'slide_from_bottom'
                            }}
                        />
                        <Stack.Screen 
                            name="MovieDetail" 
                            component={MovieDetailScreen}
                            options={{
                                animation: 'slide_from_right'
                            }}
                        />
                        <Stack.Screen 
                            name="PersonDetail" 
                            component={PersonDetailScreen}
                            options={{
                                headerShown: false,
                                presentation: 'modal'
                            }}
                        />
                        <Stack.Screen 
                            name="About" 
                            component={AboutScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator; 