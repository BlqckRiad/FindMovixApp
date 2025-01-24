import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmailVerificationModal = ({
    visible,
    onClose,
    onVerify,
    onResend,
    newEmail,
    loading,
    error
}) => {
    const { theme, t } = useTheme();
    const colors = theme.colors;
    const [verificationCode, setVerificationCode] = useState('');
    const [timer, setTimer] = useState(120); // 2 minutes
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval;
        if (visible && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [visible, timer]);

    const handleResend = () => {
        if (canResend) {
            setTimer(120);
            setCanResend(false);
            onResend();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerify = () => {
        if (verificationCode.length === 6) {
            onVerify(verificationCode);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: colors.text }]}>
                                    {t.emailVerification}
                                </Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color={colors.text} />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.description, { color: colors.textSecondary }]}>
                                {t.verificationCodeSent} {newEmail}. {t.checkSpam}
                            </Text>

                            <TextInput
                                style={[styles.input, { 
                                    backgroundColor: colors.surface,
                                    color: colors.text,
                                    borderColor: error ? colors.error : colors.border
                                }]}
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                placeholder="000000"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="number-pad"
                                maxLength={6}
                            />

                            {error && (
                                <Text style={[styles.errorText, { color: colors.error }]}>
                                    {error}
                                </Text>
                            )}

                            <View style={styles.timerContainer}>
                                <Text style={[styles.timerText, { color: colors.textSecondary }]}>
                                    {canResend ? t.canResendNow : `${t.canResendIn} ${formatTime(timer)}`}
                                </Text>
                                <TouchableOpacity 
                                    onPress={handleResend}
                                    disabled={!canResend || loading}
                                    style={[
                                        styles.resendButton,
                                        { opacity: canResend && !loading ? 1 : 0.5 }
                                    ]}
                                >
                                    <Text style={[styles.resendText, { color: colors.primary }]}>
                                        {t.resendCode}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.verifyButton,
                                    { 
                                        backgroundColor: colors.primary,
                                        opacity: verificationCode.length === 6 && !loading ? 1 : 0.5
                                    }
                                ]}
                                onPress={handleVerify}
                                disabled={verificationCode.length !== 6 || loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={colors.background} />
                                ) : (
                                    <Text style={[styles.verifyText, { color: colors.background }]}>
                                        {t.verify}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
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
    modalContainer: {
        width: '90%',
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
    description: {
        fontSize: typography.sizes.sm,
        marginBottom: spacing.lg,
        lineHeight: 20,
    },
    input: {
        height: 50,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.medium,
        textAlign: 'center',
        borderWidth: 1,
        marginBottom: spacing.sm,
    },
    errorText: {
        fontSize: typography.sizes.sm,
        marginBottom: spacing.md,
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    timerText: {
        fontSize: typography.sizes.sm,
    },
    resendButton: {
        padding: spacing.sm,
    },
    resendText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
    },
    verifyButton: {
        height: 50,
        borderRadius: radius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
});

export default EmailVerificationModal; 