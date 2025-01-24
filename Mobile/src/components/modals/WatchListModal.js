import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WatchListModal = ({ visible, onClose, onSave }) => {
    const { theme, language } = useTheme();
    const colors = theme.colors;

    const translations = {
        en: {
            newList: "New List",
            enterListName: "Enter list name",
            cancel: "Cancel",
            create: "Create",
        },
        tr: {
            newList: "Yeni Liste",
            enterListName: "Liste adını girin",
            cancel: "İptal",
            create: "Oluştur",
        }
    };

    const t = translations[language];
    const [listName, setListName] = useState('');

    const handleSave = () => {
        if (listName.trim()) {
            onSave(listName.trim());
            setListName('');
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: colors.text }]}>
                                {t.newList}
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={onClose}
                            >
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    borderColor: colors.border
                                }
                            ]}
                            placeholder={t.enterListName}
                            placeholderTextColor={colors.textSecondary}
                            value={listName}
                            onChangeText={setListName}
                            autoFocus
                        />

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
                                style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
                                onPress={handleSave}
                            >
                                <Text style={[styles.buttonText, { color: colors.background }]}>
                                    {t.create}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.lg,
        fontSize: typography.sizes.md,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.sm,
    },
    button: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        borderWidth: 1,
    },
    saveButton: {
        elevation: 2,
    },
    buttonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
});

export default WatchListModal; 