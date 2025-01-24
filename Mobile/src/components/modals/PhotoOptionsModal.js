import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PhotoOptionsModal = ({ visible, onClose, onTakePhoto, onChoosePhoto, onDeletePhoto }) => {
    const { theme, t } = useTheme();
    const colors = theme.colors;

    const Option = ({ icon, label, onPress }) => (
        <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.surface }]}
            onPress={onPress}
        >
            <Ionicons name={icon} size={24} color={colors.primary} />
            <Text style={[styles.optionText, { color: colors.text }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View style={[styles.content, { backgroundColor: colors.background }]}>
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: colors.text }]}>{t.photoOptions}</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color={colors.text} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.options}>
                                <Option
                                    icon="camera-outline"
                                    label={t.takePhoto}
                                    onPress={onTakePhoto}
                                />
                                <Option
                                    icon="image-outline"
                                    label={t.choosePhoto}
                                    onPress={onChoosePhoto}
                                />
                                <Option
                                    icon="trash-outline"
                                    label={t.deletePhoto}
                                    onPress={onDeletePhoto}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
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
        borderRadius: radius.xl,
        padding: spacing.lg,
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
    options: {
        gap: spacing.md,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: radius.lg,
        gap: spacing.md,
    },
    optionText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
});

export default PhotoOptionsModal; 