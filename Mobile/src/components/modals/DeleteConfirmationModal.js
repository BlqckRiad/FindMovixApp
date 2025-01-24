import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DeleteConfirmationModal = ({ visible, onClose, onConfirm, listName }) => {
    const { theme, language } = useTheme();
    const colors = theme.colors;

    const translations = {
        en: {
            deleteList: "Delete List",
            deleteConfirm: "Are you sure you want to delete",
            listText: "list?",
            thisAction: "This action cannot be undone.",
            cancel: "Cancel",
            delete: "Delete",
        },
        tr: {
            deleteList: "Listeyi Sil",
            deleteConfirm: "Silmek istediğinizden emin misiniz",
            listText: "listesini",
            thisAction: "Bu işlem geri alınamaz.",
            cancel: "İptal",
            delete: "Sil",
        }
    };

    const t = translations[language];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <View style={styles.iconContainer}>
                            <View style={[styles.iconCircle, { backgroundColor: colors.error + '20' }]}>
                                <Ionicons name="trash" size={32} color={colors.error} />
                            </View>
                        </View>

                        <Text style={[styles.title, { color: colors.error }]}>
                            {t.deleteList}
                        </Text>

                        <Text style={[styles.message, { color: colors.text }]}>
                            {t.deleteConfirm} "{listName}" {t.listText}
                        </Text>

                        <Text style={[styles.warning, { color: colors.textSecondary }]}>
                            {t.thisAction}
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                                onPress={onClose}
                            >
                                <Text style={[styles.buttonText, { color: colors.text }]}>
                                    {t.cancel}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.deleteButton, { backgroundColor: colors.error }]}
                                onPress={onConfirm}
                            >
                                <Text style={[styles.buttonText, { color: colors.background }]}>
                                    {t.delete}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        borderRadius: radius.lg,
        padding: spacing.lg,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: spacing.md,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.sm,
    },
    message: {
        fontSize: typography.sizes.md,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    warning: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
    },
    deleteButton: {
        elevation: 2,
    },
    buttonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
});

export default DeleteConfirmationModal; 