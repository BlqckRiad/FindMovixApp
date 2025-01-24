import axios from 'axios';
import { API_ENDPOINTS } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SSL sertifika kontrolünü devre dışı bırak (sadece development ortamı için)
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    // SSL sertifika doğrulamasını devre dışı bırak
    httpsAgent: {
        rejectUnauthorized: false
    }
});

// Storage Keys
export const STORAGE_KEYS = {
    USER_ID: 'userID',
    NAME: 'name',
    SURNAME: 'surName',
    USERNAME: 'userName',
    EMAIL: 'userEmail',
    PHONE: 'userTelNo',
    TOKEN: 'userToken',
    ROLE_ID: 'userRoleID',
    SEX_ID: 'userSexsID',
    IMAGE_ID: 'userImageID',
    IMAGE_URL: 'userImageUrl'
};

export const registerUser = async (userData) => {
    try {
        const requestData = {
            name: userData.name,
            surName: userData.surName,
            userName: userData.userName,
            userEmail: userData.userEmail,
            password: userData.password,
            userTelNo: userData.userTelNo
        };

        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, requestData);

        if (response.status >= 400) {
            throw new Error(response.data.message || 'Kayıt işlemi başarısız oldu');
        }

        return response.data;
    } catch (error) {
        console.error('Register hatası:', error);
        if (error.response) {
            // Sunucudan gelen hata mesajı
            throw new Error(error.response.data.message || 'Kayıt işlemi başarısız oldu');
        } else if (error.request) {
            // Sunucuya ulaşılamadı
            throw new Error('Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.');
        } else {
            // İstek oluşturulurken hata oluştu
            throw new Error('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
};

export const loginUser = async (emailOrTelNo, password) => {
    try {
        const requestData = {
            emailOrTelNo,
            password
        };

        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, requestData);

        if (response.status >= 400) {
            throw new Error(response.data.message || 'Giriş işlemi başarısız oldu');
        }

        // Kullanıcı verilerini AsyncStorage'a kaydet
        const userData = response.data;
        await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.USER_ID, String(userData.userID)),
            AsyncStorage.setItem(STORAGE_KEYS.NAME, userData.name),
            AsyncStorage.setItem(STORAGE_KEYS.SURNAME, userData.surName),
            AsyncStorage.setItem(STORAGE_KEYS.USERNAME, userData.userName),
            AsyncStorage.setItem(STORAGE_KEYS.EMAIL, userData.userEmail),
            AsyncStorage.setItem(STORAGE_KEYS.PHONE, userData.userTelNo),
            AsyncStorage.setItem(STORAGE_KEYS.TOKEN, userData.userToken),
            AsyncStorage.setItem(STORAGE_KEYS.ROLE_ID, String(userData.userRoleID)),
            AsyncStorage.setItem(STORAGE_KEYS.SEX_ID, String(userData.userSexsID)),
            AsyncStorage.setItem(STORAGE_KEYS.IMAGE_ID, String(userData.userImageID)),
            userData.userImageUrl && AsyncStorage.setItem(STORAGE_KEYS.IMAGE_URL, userData.userImageUrl)
        ]);

        return userData;
    } catch (error) {
        console.error('Login hatası:', error);
        throw error;
    }
}; 