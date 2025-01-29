import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LanguageModal from '../../components/language/LanguageModal';

const LoginScreen = ({ navigation }) => {
    const { theme, t, language, changeLanguage } = useTheme();
    const { login, setFakeAuth } = useAuth();
    const colors = theme.colors;
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(t.error, t.emailRequired);
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            Alert.alert(t.error, error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFakeAuth = () => {
        console.log('HandleFakeAuth');
        setFakeAuth();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
                style={[styles.container, { backgroundColor: colors.background }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.primary }]}>
                        {t.welcome}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.fakeAuthButton, { backgroundColor: colors.primary }]}
                    onPress={handleFakeAuth}
                >
                    <Text style={[styles.fakeAuthButtonText, { color: colors.background }]}>
                       {t.dontlogin}
                    </Text>
                </TouchableOpacity>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color={colors.text} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder={t.emailOrPhone}
                            placeholderTextColor={colors.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={24} color={colors.text} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder={t.password}
                            placeholderTextColor={colors.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!loading}
                        />
                    </View>

                    <TouchableOpacity 
                        style={[
                            styles.loginButton, 
                            { 
                                backgroundColor: colors.primary,
                                opacity: loading ? 0.7 : 1 
                            }
                        ]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={[styles.loginButtonText, { color: colors.text }]}>
                            {loading ? t.loading : t.login}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.forgotPassword}
                        onPress={() => {/* Şifremi unuttum işlemi */}}
                    >
                        <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                            {t.forgotPassword}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.languageButton}
                        onPress={() => setShowLanguageModal(true)}
                    >
                        <Text style={[styles.languageButtonText, { color: colors.textSecondary }]}>
                            {t.selectLanguage}
                        </Text>
                        <Text style={[styles.languageCode, { color: colors.primary }]}>
                            {language === 'tr' ? 'Türkçe' : 'English'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={[styles.registerText, { color: colors.textSecondary }]}>
                            {t.dontHaveAccount}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={[styles.registerButton, { color: colors.primary }]}>
                                {t.register}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <LanguageModal
                    visible={showLanguageModal}
                    onClose={() => setShowLanguageModal(false)}
                    onSelectLanguage={changeLanguage}
                />
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: typography.sizes.xl * 1.2,
        fontWeight: typography.weights.bold,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
        height: 50,
        borderRadius: radius.lg,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: typography.sizes.md,
    },
    loginButton: {
        height: 50,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.md,
    },
    loginButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    forgotPasswordText: {
        fontSize: typography.sizes.sm,
    },
    languageButton: {
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    languageButtonText: {
        fontSize: typography.sizes.sm,
        marginBottom: spacing.xs,
    },
    languageCode: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    registerText: {
        fontSize: typography.sizes.md,
        marginRight: spacing.xs,
    },
    registerButton: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
    onboardingButton: {
        height: 40,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        alignSelf: 'center',
    },
    onboardingButtonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semiBold,
    },
    fakeAuthButton: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    fakeAuthButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;