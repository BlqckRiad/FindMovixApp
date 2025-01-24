import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

const EmptyAreaModal = ({ visible, onClose, title, message }) => {
      const { theme } = useTheme();
        const colors = theme.colors;
        return (
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={onClose}
            >
                <View style={styles.container}>
                    <View style={[styles.content, { backgroundColor: colors.background }]}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                            <Ionicons name="arrow-undo-outline" size={40} color={colors.background} />
                        </View>
                        
                        <Text style={[styles.title, { color: colors.text }]}>
                            {title}
                        </Text>
                        
                        <Text style={[styles.message, { color: colors.textSecondary }]}>
                            {message}
                        </Text>
                        
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.primary }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText, { color: colors.background }]}>
                                Tamam
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: spacing.lg,
        },
        content: {
            width: '100%',
            maxWidth: 320,
            borderRadius: radius.xl,
            padding: spacing.xl,
            alignItems: 'center',
        },
        iconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.lg,
        },
        title: {
            fontSize: typography.sizes.lg,
            fontWeight: typography.weights.bold,
            marginBottom: spacing.sm,
            textAlign: 'center',
        },
        message: {
            fontSize: typography.sizes.md,
            textAlign: 'center',
            marginBottom: spacing.xl,
        },
        button: {
            width: '100%',
            height: 50,
            borderRadius: radius.lg,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontSize: typography.sizes.md,
            fontWeight: typography.weights.semiBold,
        },
    });
    

export default EmptyAreaModal

