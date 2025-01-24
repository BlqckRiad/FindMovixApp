import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePickerModal from './DatePickerModal';

const ProfileEditModal = ({ 
    visible, 
    onClose, 
    onSave, 
    type, 
    initialValues = {},
    title
}) => {
    const { theme, t } = useTheme();
    const colors = theme.colors;
    const [values, setValues] = useState(initialValues);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (visible) {
            setValues(initialValues);
        }
    }, [visible, initialValues]);

    const handleDateSelect = (date) => {
        setValues(prev => ({ 
            ...prev, 
            userDate: date 
        }));
        setShowDatePicker(false);
    };

    const hasChanges = () => {
        switch (type) {
            case 'fullName':
                return values.name !== initialValues.name || 
                       values.surName !== initialValues.surName;
            case 'userName':
                return values.userName !== initialValues.userName;
            case 'birthDate':
                return values.userDate !== initialValues.userDate;
            case 'gender':
                return values.userSexsID !== initialValues.userSexsID;
            case 'email':
                return values.email !== initialValues.email;
            case 'phone':
                return values.phone !== initialValues.phone;
            default:
                return false;
        }
    };

    const handleSave = () => {
        if (hasChanges()) {
            onSave(values);
        }
        onClose();
    };

    const renderContent = () => {
        switch (type) {
            case 'fullName':
                return (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>{t.fullName}</Text>
                            <TextInput
                                style={[styles.input, { 
                                    color: colors.text,
                                    backgroundColor: colors.surface
                                }]}
                                placeholder={t.fullNamePlaceholder}
                                placeholderTextColor={colors.textSecondary}
                                value={values.name}
                                onChangeText={(text) => setValues(prev => ({ ...prev, name: text }))}
                                autoCapitalize="words"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>{t.surName}</Text>
                            <TextInput
                                style={[styles.input, { 
                                    color: colors.text,
                                    backgroundColor: colors.surface
                                }]}
                                placeholder={t.surNamePlaceholder}
                                placeholderTextColor={colors.textSecondary}
                                value={values.surName}
                                onChangeText={(text) => setValues(prev => ({ ...prev, surName: text }))}
                                autoCapitalize="words"
                            />
                        </View>
                    </>
                );
            case 'userName':
                return (
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>{t.username}</Text>
                        <TextInput
                            style={[styles.input, { 
                                color: colors.text,
                                backgroundColor: colors.surface
                            }]}
                            placeholder={t.usernamePlaceholder}
                            placeholderTextColor={colors.textSecondary}
                            value={values.userName}
                            onChangeText={(text) => setValues(prev => ({ ...prev, userName: text }))}
                            autoCapitalize="none"
                        />
                    </View>
                );
            case 'birthDate':
                return (
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>{t.birthDate}</Text>
                        <TouchableOpacity
                            style={[styles.input, { 
                                color: colors.text,
                                backgroundColor: colors.surface,
                                justifyContent: 'center'
                            }]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={{ color: colors.text }}>
                                {values.userDate ? new Date(values.userDate).toLocaleDateString() : t.selectDate}
                            </Text>
                        </TouchableOpacity>
                        <DatePickerModal
                            visible={showDatePicker}
                            onClose={() => setShowDatePicker(false)}
                            onSelect={handleDateSelect}
                            currentDate={values.userDate}
                        />
                    </View>
                );
            case 'gender':
                return (
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>{t.gender}</Text>
                        <TouchableOpacity
                            style={[styles.genderOption, { 
                                backgroundColor: values.userSexsID === 1 ? colors.primary : colors.surface
                            }]}
                            onPress={() => setValues(prev => ({ ...prev, userSexsID: 1 }))}
                        >
                            <Text style={{ color: values.userSexsID === 1 ? colors.background : colors.text }}>
                                {t.male}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.genderOption, { 
                                backgroundColor: values.userSexsID === 2 ? colors.primary : colors.surface,
                                marginTop: spacing.sm
                            }]}
                            onPress={() => setValues(prev => ({ ...prev, userSexsID: 2 }))}
                        >
                            <Text style={{ color: values.userSexsID === 2 ? colors.background : colors.text }}>
                                {t.female}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'email':
                return (
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>{t.email}</Text>
                        <TextInput
                            style={[styles.input, { 
                                color: colors.text,
                                backgroundColor: colors.surface
                            }]}
                            placeholder={t.emailPlaceholder}
                            placeholderTextColor={colors.textSecondary}
                            value={values.email}
                            onChangeText={(text) => setValues(prev => ({ ...prev, email: text }))}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                );
            case 'phone':
                return (
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>{t.phone}</Text>
                        <TextInput
                            style={[styles.input, { 
                                color: colors.text,
                                backgroundColor: colors.surface
                            }]}
                            placeholder={t.phonePlaceholder}
                            placeholderTextColor={colors.textSecondary}
                            value={values.phone}
                            onChangeText={(text) => setValues(prev => ({ ...prev, phone: text }))}
                            keyboardType="phone-pad"
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <KeyboardAvoidingView 
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={[styles.content, { backgroundColor: colors.background }]}
                        >
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color={colors.text} />
                                </TouchableOpacity>
                                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                                <TouchableOpacity 
                                    onPress={handleSave}
                                    style={[
                                        styles.saveButton,
                                        { opacity: hasChanges() ? 1 : 0.5 }
                                    ]}
                                >
                                    <Text style={[
                                        styles.saveText, 
                                        { color: colors.primary }
                                    ]}>
                                        {t.save}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.body}>
                                {renderContent()}
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    saveText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
    body: {
        paddingHorizontal: spacing.lg,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: typography.sizes.sm,
        marginBottom: spacing.xs,
    },
    input: {
        height: 50,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.md,
        fontSize: typography.sizes.md,
    },
    genderOption: {
        height: 50,
        borderRadius: radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ProfileEditModal; 