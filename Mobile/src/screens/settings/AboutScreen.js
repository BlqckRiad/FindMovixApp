import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
    Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AboutScreen = ({ navigation }) => {
    const { theme, t } = useTheme();
    const colors = theme.colors;

    const handleLink = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.error('URL desteklenmiyor:', url);
            }
        } catch (error) {
            console.error('URL açma hatası:', error);
        }
    };

    const AboutItem = ({ icon, title, subtitle, onPress }) => (
        <TouchableOpacity
            style={[styles.aboutItem, { backgroundColor: colors.surface }]}
            onPress={onPress}
        >
            <View style={styles.aboutItemLeft}>
                <Ionicons name={icon} size={24} color={colors.primary} />
                <View style={styles.aboutItemTexts}>
                    <Text style={[styles.aboutItemTitle, { color: colors.text }]}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={[styles.aboutItemSubtitle, { color: colors.textSecondary }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.surface }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t.about}</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.logoSection}>
                    <View style={[styles.logoTextContainer, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.logoText, { color: colors.primary }]}>Find</Text>
                        <Text style={[styles.logoText, { color: colors.text }]}>Movix</Text>
                    </View>
                    <Text style={[styles.version, { color: colors.textSecondary }]}>
                        {t.version} 1.0.0
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                        {t.appInfo}
                    </Text>

                    <AboutItem
                        icon="globe-outline"
                        title={t.website}
                        subtitle="www.findmovix.com"
                        onPress={() => handleLink('https://www.findmovix.com')}
                    />

                    <AboutItem
                        icon="mail-outline"
                        title={t.contact}
                        subtitle="findmovix@gmail.com"
                        onPress={() => handleLink('mailto:findmovix@gmail.com')}
                    />

                    <AboutItem
                        icon="logo-instagram"
                        title="Instagram"
                        subtitle="@findmovix"
                        onPress={() => handleLink('https://www.instagram.com/findmovix/')}
                    />

                    
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                        {t.legal}
                    </Text>

                    <AboutItem
                        icon="document-text-outline"
                        title={t.privacyPolicy}
                        onPress={() => handleLink('https://findmovix.com/privacy.html')}
                    />

                    <AboutItem
                        icon="document-outline"
                        title={t.termsOfService}
                        onPress={() => handleLink('https://findmovix.com/terms.html')}
                    />
                </View>

                <Text style={[styles.copyright, { color: colors.textSecondary }]}>
                    © 2025 FindMovix. {t.allRightsReserved}
                </Text>
            </ScrollView>
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
    backButton: {
        marginRight: spacing.md,
        padding: spacing.xs,
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
    logoSection: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    logoTextContainer: {
        flexDirection: 'row',
        padding: spacing.lg,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
    },
    logoText: {
        fontSize: 32,
        fontWeight: typography.weights.bold,
    },
    version: {
        fontSize: typography.sizes.md,
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
    aboutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        marginHorizontal: spacing.md,
        marginBottom: spacing.xs,
        borderRadius: radius.lg,
    },
    aboutItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    aboutItemTexts: {
        marginLeft: spacing.md,
    },
    aboutItemTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
        marginBottom: spacing.xs,
    },
    aboutItemSubtitle: {
        fontSize: typography.sizes.sm,
    },
    copyright: {
        textAlign: 'center',
        fontSize: typography.sizes.sm,
        paddingVertical: spacing.xl,
    },
});

export default AboutScreen; 