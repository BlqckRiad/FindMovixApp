import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
    ActivityIndicator,
    Image,
    Modal,
    Button
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { registerUser } from '../../services/authService';

const countries = [
    {
        code: 'TR',
        flag: require('../../assets/flags/tr.png'),
        prefix: '+90',
        format: '(5XX) XXX XX XX'
    },
    {
        code: 'GB',
        flag: require('../../assets/flags/en.png'),
        prefix: '+44',
        format: 'XXXX XXXXXX'
    }
];

const RegisterScreen = ({ navigation }) => {
    const { theme, t } = useTheme();
    const colors = theme.colors;
    const [loading, setLoading] = useState(false);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [formData, setFormData] = useState({
        name: '',
        surName: '',
        userName: '',
        userEmail: '',
        password: '',
        userTelNo: ''
    });
    
    
    const [modalVisible, setModalVisible] = useState(false);

    const closeModal = () => {
        setModalVisible(false);
        navigation.navigate('Login');
    };
    const formatPhoneNumber = (text) => {
        // Sadece rakamları al
        const numbers = text.replace(/\D/g, '');
        
        if (selectedCountry.code === 'TR') {
            if (numbers.length <= 10) {
                // (5XX) XXX XX XX formatı
                return numbers
                    .replace(/(\d{3})/, '($1)')
                    .replace(/(\(\d{3}\))(\d{3})/, '$1 $2')
                    .replace(/(\s\d{3})(\d{2})/, '$1 $2')
                    .replace(/(\s\d{2})(\d{2})/, '$1 $2');
            }
        } else if (selectedCountry.code === 'GB') {
            if (numbers.length <= 10) {
                // XXXX XXXXXX formatı
                return numbers
                    .replace(/(\d{4})/, '$1 ')
                    .replace(/(\s\d{6})/, '$1');
            }
        }
        return numbers;
    };

    const handleInputChange = (field, value) => {
        if (field === 'userTelNo') {
            value = formatPhoneNumber(value);
        }
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRegister = async () => {
        // Form validasyonu
        if (!formData.name || !formData.surName || !formData.userName || 
            !formData.userEmail || !formData.password) {
            Alert.alert(t.error, 'Lütfen tüm alanları doldurun.');
            return;
        }

        // Email formatı kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.userEmail)) {
            Alert.alert(t.error, t.invalidEmail);
            return;
        }

        // // Telefon numarası kontrolü
        // const phoneNumbers = formData.userTelNo.replace(/\D/g, '');
        // if (selectedCountry.code === 'TR' && phoneNumbers.length !== 10) {
        //     Alert.alert(t.error, 'Geçerli bir telefon numarası girin.');
        //     return;
        // }
        // if (selectedCountry.code === 'GB' && phoneNumbers.length !== 10) {
        //     Alert.alert(t.error, 'Geçerli bir telefon numarası girin.');
        //     return;
        // }

        // Şifre uzunluğu kontrolü
        if (formData.password.length < 6) {
            Alert.alert(t.error, t.invalidPassword);
            return;
        }

        setLoading(true);
        try {
            const phoneWithPrefix = selectedCountry.prefix + formData.userTelNo.replace(/\D/g, '');
            const registerData = {
                ...formData
                //userTelNo: phoneWithPrefix
            };
            
            await registerUser(registerData);
            Alert.alert(
                'Başarılı',
                'Kayıt işlemi başarıyla tamamlandı. Giriş yapabilirsiniz.',
                [
                    {
                        text: 'Tamam',
                        onPress: () => navigation.navigate('Login')
                    }
                ]
            );

        } catch (error) {
            Alert.alert(t.error, error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (icon, placeholder, field, keyboardType = 'default', secureTextEntry = false) => {
        if (field === 'userTelNo') {
            return (
                <View style={styles.inputContainer}>
                    <TouchableOpacity 
                        style={styles.countrySelector}
                        onPress={() => setShowCountryModal(true)}
                    >
                        <Image 
                            source={selectedCountry.flag} 
                            style={styles.flagIcon}
                        />
                        <Text style={[styles.countryPrefix, { color: colors.text }]}>
                            {selectedCountry.prefix}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={colors.text} />
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder={selectedCountry.format}
                        placeholderTextColor={colors.textSecondary}
                        value={formData[field]}
                        onChangeText={(value) => handleInputChange(field, value)}
                        keyboardType="phone-pad"
                    />
                </View>
            );
        }

        return (
            <View style={styles.inputContainer}>
                <Ionicons name={icon} size={24} color={colors.text} />
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    value={formData[field]}
                    onChangeText={(value) => handleInputChange(field, value)}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={field === 'userEmail' ? 'none' : field === 'userName' ? 'none' : 'words'}
                />
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[styles.appTitle, { color: colors.primary }]}>
                        FindMovix
                    </Text>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Hesap Oluştur
                    </Text>
                </View>

                <View style={styles.form}>
                    {renderInput('person-outline', 'Ad', 'name')}
                    {renderInput('person-outline', 'Soyad', 'surName')}
                    {renderInput('person-circle-outline', 'Kullanıcı Adı', 'userName')}
                    {renderInput('mail-outline', 'E-posta', 'userEmail', 'email-address')}
                    {/**
                     *  /* 
                     {renderInput('call-outline', 'Telefon', 'userTelNo', 'phone-pad')}
                     *
                     */}
                    {renderInput('lock-closed-outline', 'Şifre', 'password', 'default', true)}

                    <TouchableOpacity 
                        style={[
                            styles.registerButton, 
                            { 
                                backgroundColor: colors.primary,
                                opacity: loading ? 0.7 : 1 
                            }
                        ]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.text} />
                        ) : (
                            <Text style={[styles.registerButtonText, { color: colors.text }]}>
                                Kayıt Ol
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                            Zaten hesabın var mı?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.loginButton, { color: colors.primary }]}>
                                Giriş Yap
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={showCountryModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCountryModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Ülke Seçin
                            </Text>
                            <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        {countries.map((country) => (
                            <TouchableOpacity
                                key={country.code}
                                style={styles.countryItem}
                                onPress={() => {
                                    setSelectedCountry(country);
                                    setFormData(prev => ({ ...prev, userTelNo: '' }));
                                    setShowCountryModal(false);
                                }}
                            >
                                <Image source={country.flag} style={styles.flagIcon} />
                                <Text style={[styles.countryName, { color: colors.text }]}>
                                    {country.code === 'TR' ? 'Türkiye' : 'İngiltere'}
                                </Text>
                                <Text style={[styles.countryPrefix, { color: colors.textSecondary }]}>
                                    {country.prefix}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}>
                        <Text style={{ marginBottom: 15, textAlign: 'center' }}>Kayıt işlemi başarılı!</Text>
                        <Button
                            onPress={() => setModalVisible(!modalVisible)}
                            title="Tamam"
                        />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    appTitle: {
        fontSize: typography.sizes.xxxl,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.md,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
        height: 50,
        borderRadius: radius.lg,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: typography.sizes.md,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: spacing.sm,
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.2)',
    },
    flagIcon: {
        width: 24,
        height: 24,
        marginRight: spacing.xs,
    },
    countryPrefix: {
        fontSize: typography.sizes.md,
        marginRight: spacing.xs,
    },
    registerButton: {
        height: 50,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.md,
    },
    registerButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    loginText: {
        fontSize: typography.sizes.md,
        marginRight: spacing.xs,
    },
    loginButton: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
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
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    countryName: {
        flex: 1,
        fontSize: typography.sizes.md,
        marginLeft: spacing.md,
    },
});

export default RegisterScreen;