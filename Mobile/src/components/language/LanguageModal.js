import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    Animated,
} from 'react-native';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useTheme } from '../../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const LANGUAGE_ITEM_SIZE = width * 0.25;

const languages = [
    {
        code: 'tr',
        name: 'Türkçe',
        flag: require('../../assets/flags/tr.png'),
    },
    {
        code: 'en',
        name: 'English',
        flag: require('../../assets/flags/en.png'),
    }
];

const LanguageItem = ({ language, isSelected, onPress, colors }) => (
    <TouchableOpacity
        style={[
            styles.languageItem,
            {
                backgroundColor: colors.surface,
                borderColor: isSelected ? colors.primary : colors.inactive,
            },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Image source={language.flag} style={styles.flag} />
        <Text style={[styles.languageName, { color: colors.text }]}>
            {language.name}
        </Text>
        {isSelected && (
            <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={16} color={colors.text} />
            </View>
        )}
    </TouchableOpacity>
);

const LanguageModal = ({ visible, onClose, onSelectLanguage }) => {
    const { theme, language: currentLanguage, t } = useTheme();
    const colors = theme.colors;

    const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 0.9,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleLanguageSelect = (languageCode) => {
        onSelectLanguage(languageCode);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    backgroundColor: colors.background,
                                    transform: [{ scale: scaleAnim }],
                                    opacity: opacityAnim,
                                },
                            ]}
                        >
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: colors.text }]}>
                                    {t.selectLanguage}
                                </Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={onClose}
                                >
                                    <Ionicons name="close" size={24} color={colors.text} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.languagesContainer}>
                                {languages.map((lang) => (
                                    <LanguageItem
                                        key={lang.code}
                                        language={lang}
                                        isSelected={currentLanguage === lang.code}
                                        onPress={() => handleLanguageSelect(lang.code)}
                                        colors={colors}
                                    />
                                ))}
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        borderRadius: radius.xl,
        padding: spacing.lg,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    closeButton: {
        padding: spacing.xs,
    },
    languagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
    },
    languageItem: {
        width: LANGUAGE_ITEM_SIZE,
        aspectRatio: 1,
        margin: spacing.xs,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    flag: {
        width: LANGUAGE_ITEM_SIZE * 0.5,
        height: LANGUAGE_ITEM_SIZE * 0.3,
        marginBottom: spacing.sm,
        borderRadius: radius.sm,
    },
    languageName: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
    },
    checkmark: {
        position: 'absolute',
        top: -spacing.xs,
        right: -spacing.xs,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LanguageModal; 