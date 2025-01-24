import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const LogoutModal = ({ visible, onClose, onLogout }) => {
    const { theme, t } = useTheme();
    const colors = theme.colors;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, { backgroundColor: colors.error + '20' }]}>
                            <Ionicons name="log-out-outline" size={32} color={colors.error} />
                        </View>
                    </View>
                    
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t.logoutConfirm}
                    </Text>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText, { color: colors.primary }]}>
                                {t.cancel}
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.button, styles.logoutButton, { backgroundColor: colors.error }]}
                            onPress={onLogout}
                        >
                            <Text style={[styles.buttonText, { color: colors.text }]}>
                                {t.logout}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.85,
        padding: spacing.xl,
        borderRadius: radius.xl,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: spacing.lg,
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semiBold,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        height: 45,
        borderRadius: radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: spacing.xs,
    },
    cancelButton: {
        borderWidth: 1,
    },
    logoutButton: {
        
    },
    buttonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
});

export default LogoutModal; 