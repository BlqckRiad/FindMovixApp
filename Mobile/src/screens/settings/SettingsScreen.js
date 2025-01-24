import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LogoutModal from '../../components/modals/LogoutModal';
import LanguageModal from '../../components/language/LanguageModal';
import ChangePasswordModal from '../../components/modals/ChangePasswordModal';
import { Linking } from 'react-native';

const SettingItem = ({ icon, title, value, onPress, type = 'arrow' }) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    return (
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.surface }]} onPress={onPress}>
            <View style={styles.settingLeft}>
                <Ionicons name={icon} size={24} color={colors.text} />
                <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
            </View>
            <View style={styles.settingRight}>
                {type === 'switch' ? (
                    <Switch
                        value={value}
                        onValueChange={onPress}
                        trackColor={{ false: colors.inactive, true: colors.primary }}
                        thumbColor={colors.text}
                    />
                ) : type === 'text' ? (
                    <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>
                ) : (
                    <Ionicons name="chevron-forward" size={24} color={colors.text} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const SettingsScreen = ({ navigation }) => {
    const { isDarkMode, toggleTheme, theme, language, changeLanguage, t } = useTheme();
    const { logout } = useAuth();
    const colors = theme.colors;
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setShowLogoutModal(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleSettingPress = (setting) => {
        switch (setting) {
            case 'about':
                navigation.navigate('About');
                break;
            case 'logout':
                setShowLogoutModal(true);
                break;
            case 'language':
                setShowLanguageModal(true);
                break;
            case 'password':
                setShowPasswordModal(true);
                break;
            default:
                Alert.alert('Bilgi', 'Bu özellik yakında eklenecek');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.surface }]}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.openDrawer()}
                >
                    <Text style={[styles.menuIcon, { color: colors.text }]}>☰</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t.settings}</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.appearance}</Text>
                    <SettingItem
                        icon="moon"
                        title={t.darkMode}
                        value={isDarkMode}
                        onPress={toggleTheme}
                        type="switch"
                    />
                    <SettingItem
                        icon="language"
                        title={t.language}
                        value={language === 'tr' ? 'Türkçe' : 'English'}
                        onPress={() => handleSettingPress('language')}
                        type="text"
                    />
                </View>
                {/* 

               Notification ayarları yeni versiyon için eklenecek

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.preferences}</Text>
                    <SettingItem
                        icon="notifications"
                        title={t.notifications}
                        onPress={() => navigation.navigate('NotificationSettings')}
                    />
                </View>
               
               */}

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.account}</Text>
                    <SettingItem
                        icon="person"
                        title={t.editProfile}
                        onPress={() => navigation.navigate('Profile')}
                    />
                    <SettingItem
                        icon="key"
                        title={t.changePassword}
                        onPress={() => handleSettingPress('password')}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.about}</Text>
                    <SettingItem
                        icon="information-circle-outline"
                        title={t.about}
                        onPress={() => handleSettingPress('about')}
                    />
                    <SettingItem
                        icon="star"
                        title={t.rateApp}
                        onPress={() => {/* Değerlendirme işlemi */ }}
                    />
                    <SettingItem
                        icon="share-social"
                        title={t.shareApp}
                        onPress={() => {/* Paylaşım işlemi */ }}
                    />
                </View>



                <TouchableOpacity
                    style={[styles.logoutButton, {
                        backgroundColor: colors.surface,
                        borderColor: colors.error
                    }]}
                    onPress={() => handleSettingPress('logout')}
                >
                    <Ionicons name="log-out" size={24} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>{t.logout}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.logoutButton,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.error
                        }
                    ]}
                    onPress={() => Linking.openURL('https://findmovix.com/delete-account.html')}
                >
                    <Ionicons name="ban" size={24} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>
                        {t.deleteaccount}
                    </Text>
                </TouchableOpacity>


            </ScrollView>

            <LanguageModal
                visible={showLanguageModal}
                onClose={() => setShowLanguageModal(false)}
                onSelectLanguage={changeLanguage}
            />

            <LogoutModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onLogout={handleLogout}
            />

            <ChangePasswordModal
                visible={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />
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
    menuIcon: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 12,
    },
    content: {
        flex: 1,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
        marginHorizontal: spacing.lg,
        marginVertical: spacing.md,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        marginHorizontal: spacing.md,
        marginBottom: spacing.xs,
        borderRadius: radius.lg,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingTitle: {
        fontSize: typography.sizes.md,
        marginLeft: spacing.md,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: typography.sizes.md,
        marginRight: spacing.sm,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        marginHorizontal: spacing.md,
        marginVertical: spacing.xl,
        borderRadius: radius.lg,
        borderWidth: 1,
    },
    logoutText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
        marginLeft: spacing.sm,
    },
});

export default SettingsScreen; 