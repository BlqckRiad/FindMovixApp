import AsyncStorage from '@react-native-async-storage/async-storage';

// 6 haneli rastgele kod üretme
export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Doğrulama kodunu AsyncStorage'a kaydetme
export const saveVerificationCode = async (code, email) => {
    try {
        await AsyncStorage.setItem('emailVerificationCode', code);
        await AsyncStorage.setItem('pendingEmail', email);
    } catch (error) {
        console.error('Verification code save error:', error);
        throw error;
    }
};

// Doğrulama kodunu kontrol etme
export const verifyCode = async (inputCode) => {
    try {
        const savedCode = await AsyncStorage.getItem('emailVerificationCode');
        return savedCode === inputCode;
    } catch (error) {
        console.error('Verification check error:', error);
        throw error;
    }
};

// Email HTML template
export const getEmailTemplate = (code) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
                <h2 style="color: #1a73e8; margin-bottom: 20px;">Email Doğrulama Kodu</h2>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                    <h1 style="color: #202124; letter-spacing: 5px; font-size: 32px;">${code}</h1>
                </div>
                <p style="color: #5f6368; margin-bottom: 20px;">
                    Bu kod 2 dakika içinde geçerliliğini yitirecektir.
                </p>
                <p style="color: #5f6368; font-size: 12px;">
                    Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
                </p>
            </div>
        </div>
    `;
}; 