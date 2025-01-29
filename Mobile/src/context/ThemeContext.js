import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Dil çevirileri
export const translations = {
    tr: {
        // Önemliler 
        hataGuest : 'Misafir Kullanıcı Hatası ', 
        hataGuest2:'Bu sayfayı misafir kullanıcı ile görüntüleyemezsiniz. Lütfen kullanıcı girişi yapınız!',

        // Giriş Ekranı
        welcome: 'FindMovix\'e Hoş Geldiniz',
        email: 'E-posta',
        emailOrPhone: 'E-posta',
        password: 'Şifre',
        login: 'Giriş Yap',
        register: 'Kayıt Ol',
        forgotPassword: 'Şifremi Unuttum',
        emailRequired: 'E-posta adresi gerekli',
        passwordRequired: 'Şifre gerekli',
        invalidEmail: 'Geçersiz e-posta adresi',
        invalidPassword: 'Şifre en az 6 karakter olmalıdır',
        selectLanguage: 'Dil Seçin',
        dontHaveAccount: 'Hesabınız Yok Mu?',
        dontlogin:'Giriş Yapmadan Devam Et',
        
        // Ana Sayfa
        home: 'Ana Sayfa',
        movies: 'Filmler',
        tvShows: 'Diziler',
        people: 'Kişiler',
        search: 'Film, Dizi veya Kişi Ara...',
        popularMovies: 'Popüler Filmler',
        topRatedMovies: 'En İyi Filmler',
        seeAll: 'Tümünü Gör',
        
        // Favoriler
        favorites: 'Favoriler',
        noFavoriteMovies: 'Favori film bulunmuyor',
        noFavoriteTVShows: 'Favori dizi bulunmuyor',
        noFavoritePeople: 'Favori kişi bulunmuyor',
        
        // Ayarlar
        settings: 'Ayarlar',
        appearance: 'Görünüm',
        darkMode: 'Karanlık Mod',
        preferences: 'Tercihler',
        notifications: 'Bildirimler',
        language: 'Dil',
        account: 'Hesap',
        editProfile: 'Profili Düzenle',
        changePassword: 'Şifre Değiştir',
        about: 'Hakkında',
        rateApp: 'Uygulamayı Değerlendir',
        shareApp: 'Arkadaşlarına Öner',
        logout: 'Çıkış Yap',
        logoutConfirm: 'Çıkış yapmak istediğinizden emin misiniz?',
        cancel: 'İptal',
        version: 'Versiyon',
        deleteaccount : 'Hesabı Sil',
        
        // Film Detay
        director: 'Yönetmen',
        cast: 'Oyuncular',
        summary: 'Özet',
        watchTrailer: 'Fragmanı İzle',
        
        // Genel
        loading: 'Yükleniyor...',
        error: 'Hata',
        tryAgain: 'Tekrar Dene',
        ok: 'Tamam',
        
        // Kayıt Ekranı
        fullName: 'Ad Soyad',
        fullNamePlaceholder: 'Adınız ve Soyadınız',
        username: 'Kullanıcı Adı',
        usernamePlaceholder: 'Kullanıcı adınız',
        emailPlaceholder: 'ornek@email.com',
        phone: 'Telefon Numarası',
        phonePlaceholder: '5XX XXX XX XX',
        passwordPlaceholder: 'Şifreniz',
        confirmPassword: 'Şifre Tekrar',
        confirmPasswordPlaceholder: 'Şifrenizi tekrar girin',
        haveAccount: 'Zaten hesabınız var mı?',
        profile: 'Profil',
        personalInfo: 'Kişisel Bilgiler',
        birthDate: 'Doğum Tarihi',
        save: 'Kaydet',
        movieRecommendations: 'Film Önerileri',
        selectMood: 'Ruh Haliniz Nasıl?',
        selectGenres: 'Film Türü Seçin',
        selectYearRange: 'Film Yılı',
        selectDuration: 'Film Süresi',
        getRecommendations: 'Film Önerisi Al',
        gender: 'Cinsiyet',
        male: 'Erkek',
        female: 'Kadın',
        notSpecified: 'Belirtilmemiş',
        surName: 'Soyad',
        surNamePlaceholder: 'Soyadınız',
        selectDate: 'Tarih Seçin',
        editFullName: 'Ad Soyad Düzenle',
        editUsername: 'Kullanıcı Adı Düzenle',
        editPhone: 'Telefon Numarası Düzenle',
        editBirthDate: 'Doğum Tarihi Düzenle',
        editEmail: 'E-posta Düzenle',
        selectDay: 'Gün Seçin',
        selectMonth: 'Ay Seçin',
        selectYear: 'Yıl Seçin',
        day: 'Gün',
        month: 'Ay',
        year: 'Yıl',
        photoOptions: 'Fotoğraf Seçenekleri',
        takePhoto: 'Fotoğraf Çek',
        choosePhoto: 'Fotoğraf Yükle',
        deletePhoto: 'Fotoğraf Sil',
        emailVerification: 'Email Doğrulama',
        verificationCodeSent: 'Doğrulama kodu şu adrese gönderildi:',
        checkSpam: 'Eğer göremiyorsanız spam kutunuzu kontrol edin.',
        canResendNow: 'Şimdi tekrar gönderebilirsiniz',
        canResendIn: 'Tekrar gönderebilmek için kalan süre:',
        resendCode: 'Tekrar Gönder',
        verify: 'Doğrula',
        appInfo: 'Uygulama Bilgileri',
        website: 'Web Sitesi',
        contact: 'İletişim',
        legal: 'Yasal',
        privacyPolicy: 'Gizlilik Politikası',
        termsOfService: 'Kullanım Koşulları',
        allRightsReserved: 'Tüm hakları saklıdır.',
        watchLists: "İzleme Listeleri",
        addNewList: "Yeni Liste Ekle",
        newListTitle: "Yeni Liste",
        enterListName: "Liste adını girin",
        deleteList: "Listeyi Sil",
        deleteConfirm: "Bu listeyi silmek istediğinizden emin misiniz?",
        removeMovie: "Filmi Kaldır",
        removeConfirm: "Bu filmi listeden kaldırmak istediğinizden emin misiniz?",
        noMovies: "Bu listede henüz film yok",
        noLists: "İzleme listesi bulunamadı. Bir tane oluşturun!",
    },
    en: {
        hataGuest:'Guest User Problems',
        hataGuest2 :'You cannot view this type with a guest user. Please log in as user!',
        // Login Screen
        welcome: 'Welcome to FindMovix',
        email: 'Email',
        emailOrPhone: 'Email',
        password: 'Password',
        login: 'Login',
        register: 'Register',
        forgotPassword: 'Forgot Password',
        emailRequired: 'Email address is required',
        passwordRequired: 'Password is required',
        invalidEmail: 'Invalid email address',
        invalidPassword: 'Password must be at least 6 characters',
        selectLanguage: 'Select Language',
        dontHaveAccount: 'Don\'t have an account?',
        dontlogin : 'Continue Without Login',
        
        // Home
        home: 'Home',
        movies: 'Movies',
        tvShows: 'TV Shows',
        people: 'People',
        search: 'Search Movies, TV Shows or People...',
        popularMovies: 'Popular Movies',
        topRatedMovies: 'Top Rated Movies',
        seeAll: 'See All',
        
        // Favorites
        favorites: 'Favorites',
        noFavoriteMovies: 'No favorite movies',
        noFavoriteTVShows: 'No favorite TV shows',
        noFavoritePeople: 'No favorite people',
        
        // Settings
        settings: 'Settings',
        appearance: 'Appearance',
        darkMode: 'Dark Mode',
        preferences: 'Preferences',
        notifications: 'Notifications',
        language: 'Language',
        account: 'Account',
        editProfile: 'Edit Profile',
        changePassword: 'Change Password',
        about: 'About',
        rateApp: 'Rate App',
        shareApp: 'Share with Friends',
        logout: 'Logout',
        logoutConfirm: 'Are you sure you want to logout?',
        cancel: 'Cancel',
        version: 'Version',
        deleteaccount : 'Delete Account',
        
        // Movie Detail
        director: 'Director',
        cast: 'Cast',
        summary: 'Summary',
        watchTrailer: 'Watch Trailer',
        
        // General
        loading: 'Loading...',
        error: 'Error',
        tryAgain: 'Try Again',
        ok: 'OK',
        
        // Registration Screen
        fullName: 'Full Name',
        fullNamePlaceholder: 'Your full name',
        username: 'Username',
        usernamePlaceholder: 'Your username',
        emailPlaceholder: 'example@email.com',
        phone: 'Phone Number',
        phonePlaceholder: '5XX XXX XX XX',
        passwordPlaceholder: 'Your password',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Confirm your password',
        haveAccount: 'Already have an account?',
        profile: 'Profile',
        personalInfo: 'Personal Information',
        birthDate: 'Birth Date',
        email: 'Email',
        save: 'Save',
        movieRecommendations: 'Movie Recommendations',
        selectMood: 'How Are You Feeling?',
        selectGenres: 'Select Movie Genres',
        selectYearRange: 'Movie Year',
        selectDuration: 'Movie Duration',
        getRecommendations: 'Get Recommendations',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        notSpecified: 'Not Specified',
        surName: 'Surname',
        surNamePlaceholder: 'Your surname',
        selectDate: 'Select Date',
        editFullName: 'Edit Full Name',
        editUsername: 'Edit Username',
        editPhone: 'Edit Phone Number',
        editBirthDate: 'Edit Birth Date',
        editEmail: 'Edit Email',
        selectDay: 'Select Day',
        selectMonth: 'Select Month',
        selectYear: 'Select Year',
        day: 'Day',
        month: 'Month',
        year: 'Year',
        photoOptions: 'Photo Options',
        takePhoto: 'Take Photo',
        choosePhoto: 'Choose Photo',
        deletePhoto: 'Delete Photo',
        emailVerification: 'Email Verification',
        verificationCodeSent: 'Verification code has been sent to:',
        checkSpam: 'If you cannot see it, please check your spam folder.',
        canResendNow: 'You can resend now',
        canResendIn: 'Time remaining to resend:',
        resendCode: 'Resend',
        verify: 'Verify',
        appInfo: 'App Information',
        website: 'Website',
        contact: 'Contact',
        legal: 'Legal',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        allRightsReserved: 'All rights reserved.',
        watchLists: "Watch Lists",
        addNewList: "Add New List",
        newListTitle: "New List",
        enterListName: "Enter list name",
        deleteList: "Delete List",
        deleteConfirm: "Are you sure you want to delete this list?",
        removeMovie: "Remove Movie",
        removeConfirm: "Are you sure you want to remove this movie from the list?",
        noMovies: "No movies in this list yet",
        noLists: "No watch lists found. Create one!",
    }
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [language, setLanguage] = useState('tr');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const themeMode = await AsyncStorage.getItem('themeMode');
            const savedLanguage = await AsyncStorage.getItem('language');
            
            if (themeMode !== null) {
                setIsDarkMode(themeMode === 'dark');
            }
            
            if (savedLanguage !== null) {
                setLanguage(savedLanguage);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const toggleTheme = async () => {
        try {
            const newThemeMode = !isDarkMode;
            await AsyncStorage.setItem('themeMode', newThemeMode ? 'dark' : 'light');
            setIsDarkMode(newThemeMode);
        } catch (error) {
            console.error('Error saving theme mode:', error);
        }
    };

    const changeLanguage = async (newLanguage) => {
        try {
            await AsyncStorage.setItem('language', newLanguage);
            setLanguage(newLanguage);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    // Tema renkleri
    const theme = {
        colors: isDarkMode ? {
            background: '#121212',
            surface: '#1E1E1E',
            primary: '#BB86FC',
            secondary: '#03DAC6',
            error: '#CF6679',
            text: '#FFFFFF',
            textSecondary: '#B3B3B3',
            inactive: '#4E4E4E',
            warning: '#FFD700',
        } : {
            background: '#FFFFFF',
            surface: '#F5F5F5',
            primary: '#6200EE',
            secondary: '#03DAC6',
            error: '#B00020',
            text: '#000000',
            textSecondary: '#666666',
            inactive: '#CCCCCC',
            warning: '#FFA000',
        }
    };

    const t = translations[language];

    return (
        <ThemeContext.Provider value={{
            isDarkMode,
            toggleTheme,
            theme,
            language,
            changeLanguage,
            t,
        }}>
            {children}
        </ThemeContext.Provider>
    );
}; 