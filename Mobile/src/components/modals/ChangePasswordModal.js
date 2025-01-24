import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SuccessModal from './SuccessModal';

const ChangePasswordModal = ({ visible, onClose }) => {
    const { theme, language } = useTheme();
    const { user } = useAuth();
    const colors = theme.colors;

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const translations = {
        en: {
            changePassword: 'Change Password',
            oldPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm New Password',
            cancel: 'Cancel',
            save: 'Save',
            passwordMismatch: 'New passwords do not match',
            passwordRequired: 'All fields are required',
            passwordChanged: 'Password changed successfully',
            error: 'An error occurred',
            invalidOldPassword: 'Current password is incorrect',
            networkError: 'Network connection error'
        },
        tr: {
            changePassword: 'Şifre Değiştir',
            oldPassword: 'Mevcut Şifre',
            newPassword: 'Yeni Şifre',
            confirmPassword: 'Yeni Şifre Tekrar',
            cancel: 'İptal',
            save: 'Kaydet',
            passwordMismatch: 'Yeni şifreler eşleşmiyor',
            passwordRequired: 'Tüm alanlar zorunludur',
            passwordChanged: 'Şifre başarıyla değiştirildi',
            error: 'Bir hata oluştu',
            invalidOldPassword: 'Mevcut şifre hatalı',
            networkError: 'Bağlantı hatası'
        }
    };

    const t = translations[language];

    const handleSuccess = () => {
        setShowSuccessModal(false);
        handleClose();
    };

    const handleChangePassword = async () => {
        try {
            setError('');

            // Validation checks
            if (!oldPassword || !newPassword || !confirmPassword) {
                setError(t.passwordRequired);
                return;
            }

            if (newPassword !== confirmPassword) {
                setError(t.passwordMismatch);
                return;
            }

            setIsLoading(true);

            const requestBody = {
                userID: parseInt(user?.userID),
                password: oldPassword,
                newPassword: newPassword,
                updatedUserID: parseInt(user?.userID)
            };


            const response = await fetch('https://apiuser.findmovix.com/api/UserUpdate/UserPasswordUpdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

      

            if (response.status === 200) {
                const textResponse = await response.text();
            

                // 200 OK ve boş yanıt gelirse başarılı kabul et
                if (!textResponse || textResponse.trim() === '') {
                    setShowSuccessModal(true);
                    return;
                }

                // Eğer JSON yanıt varsa parse et
                try {
                    const data = JSON.parse(textResponse);
                    console.log('Parsed API Response:', data);
                    
                    if (data?.success) {
                        setShowSuccessModal(true);
                        return;
                    }
                    setError(data?.message || t.invalidOldPassword);
                } catch (parseError) {
                    // Parse hatası olursa ve status 200 ise başarılı kabul et
                    setShowSuccessModal(true);
                }
            } else {
                // HTTP hatası
                setError(t.networkError);
            }
        } catch (error) {
            console.error('Password change error:', error);
            setError(t.networkError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        onClose();
    };

    return (
        <>
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={handleClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {t.changePassword}
                            </Text>
                            <TouchableOpacity onPress={handleClose}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        {error ? (
                            <Text style={[styles.errorText, { color: colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            placeholder={t.oldPassword}
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />

                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            placeholder={t.newPassword}
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />

                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            placeholder={t.confirmPassword}
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, { 
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border 
                                }]}
                                onPress={handleClose}
                            >
                                <Text style={[styles.buttonText, { color: colors.text }]}>
                                    {t.cancel}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton, { 
                                    backgroundColor: colors.primary,
                                    opacity: isLoading ? 0.7 : 1
                                }]}
                                onPress={handleChangePassword}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={colors.background} />
                                ) : (
                                    <Text style={[styles.buttonText, { color: colors.background }]}>
                                        {t.save}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <SuccessModal
                visible={showSuccessModal}
                message={t.passwordChanged}
                onClose={handleSuccess}
            />
        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalContent: {
        width: '100%',
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modalTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    errorText: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
    },
    modalButton: {
        flex: 1,
        height: 48,
        borderRadius: radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: spacing.xs,
        borderWidth: 1,
    },
    cancelButton: {
        borderColor: 'transparent',
    },
    saveButton: {
        borderColor: 'transparent',
    },
    buttonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
});

export default ChangePasswordModal; 