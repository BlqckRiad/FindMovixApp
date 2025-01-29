import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import EmptyAreaModal from '../../components/modals/EmptyAreaModal';
import { useAuth } from '../../context/AuthContext'; // AuthContext'i import ettik.

const translations = {
    en: {
        screenTitle: "Movie Recommendations",
        moodTitle: "How Are You Feeling?",
        genreTitle: "Select Movie Genres",
        yearTitle: "Movie Year",
        durationTitle: "Movie Duration",
        getRecommendations: "Get Recommendations",
        alertitle : "Let's Fill in the Blanks",
        alermessage:"Please fill in the required fields and try again.",
        minutes: "min",
        moods: [
            { emoji: '😊', value: 'happy', label: 'Happy' },
            { emoji: '😢', value: 'sad', label: 'Sad' },
            { emoji: '😴', value: 'calm', label: 'Calm' },
            { emoji: '🤔', value: 'thoughtful', label: 'Thoughtful' },
            { emoji: '😰', value: 'anxious', label: 'Anxious' },
        ],
        genres: [
            'Drama', 'Comedy', 'Action', 'Romance',
            'Science Fiction', 'Horror', 'Adventure', 'Animation'
        ]
    },
    tr: {
        screenTitle: "Film Önerileri",
        moodTitle: "Ruh Haliniz Nasıl?",
        genreTitle: "Film Türü Seçin",
        yearTitle: "Film Yılı",
        durationTitle: "Film Süresi",
        getRecommendations: "Film Önerisi Al",
        alertitle : "Boşlukları Dolduralım",
        alermessage:"Lütfen gerekli alanları doldurun ve tekrar deneyin.",
        minutes: "dakika",
        moods: [
            { emoji: '😊', value: 'mutlu', label: 'Mutlu' },
            { emoji: '😢', value: 'üzgün', label: 'Üzgün' },
            { emoji: '😴', value: 'sakin', label: 'Sakin' },
            { emoji: '🤔', value: 'düşünceli', label: 'Düşünceli' },
            { emoji: '😰', value: 'gergin', label: 'Gergin' },
        ],
        genres: [
            'Dram', 'Komedi', 'Aksiyon', 'Romantik',
            'Bilim Kurgu', 'Korku', 'Macera', 'Animasyon'
        ]
    }
};

const MoodSelector = ({ onSelect, selectedMood, moods }) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    return (
        <View style={styles.moodContainer}>
            {moods.map((mood) => (
                <TouchableOpacity
                    key={mood.value}
                    style={[
                        styles.moodButton,
                        selectedMood === mood.value && styles.selectedMood,
                        { backgroundColor: selectedMood === mood.value ? colors.primary : colors.surface }
                    ]}
                    onPress={() => onSelect(mood.value)}
                >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={[styles.moodLabel, { color: colors.text }]}>
                        {mood.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const GenreSelector = ({ onSelect, selectedGenres, genres }) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    return (
        <View style={styles.genreContainer}>
            {genres.map((genre) => (
                <TouchableOpacity
                    key={genre}
                    style={[
                        styles.genreChip,
                        selectedGenres.includes(genre) && styles.selectedGenre,
                        { 
                            backgroundColor: selectedGenres.includes(genre) 
                                ? colors.primary 
                                : colors.surface 
                        }
                    ]}
                    onPress={() => {
                        if (selectedGenres.includes(genre)) {
                            onSelect(selectedGenres.filter(g => g !== genre));
                        } else {
                            onSelect([...selectedGenres, genre]);
                        }
                    }}
                >
                    <Text style={[
                        styles.genreText,
                        { color: selectedGenres.includes(genre) ? colors.background : colors.text }
                    ]}>
                        {genre}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const MovieRecommendationScreen = () => {
    const { theme, language, user } = useTheme(); // Kullanıcı bilgilerini almak için useTheme'den user'ı aldık.
    const colors = theme.colors;
    const navigation = useNavigation();
    const t = translations[language];
    
    const [mood, setMood] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [yearRange, setYearRange] = useState({ start: 2000, end: 2024 });
    const [duration, setDuration] = useState({ min: 60, max: 180 });
    const [modalVisible, setModalVisible] = useState(false);

  

    const handleGetRecommendations = () => {
        if (!mood || selectedGenres.length === 0) {
            setModalVisible(true);
            return;
        }
       
        navigation.navigate('MovieRecommendationResult', {
            preferences: {
                mood,
                genres: selectedGenres,
                yearRange,
                duration
            }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header]}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.openDrawer()}
                >
                    <Ionicons name="menu" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>{t.screenTitle}</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t.moodTitle}
                    </Text>
                    <MoodSelector
                        selectedMood={mood}
                        onSelect={setMood}
                        moods={t.moods}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t.genreTitle}
                    </Text>
                    <GenreSelector
                        selectedGenres={selectedGenres}
                        onSelect={setSelectedGenres}
                        genres={t.genres}
                    />
                </View>
       
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t.yearTitle}: {yearRange.start} - {yearRange.end}
                    </Text>
                    <View style={styles.sliderContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={1950}
                            maximumValue={2024}
                            step={1}
                            value={yearRange.start}
                            onValueChange={(value) => setYearRange(prev => ({ ...prev, start: Math.floor(value) }))}
                            minimumTrackTintColor={colors.primary}
                            maximumTrackTintColor={colors.inactive}
                            thumbTintColor={colors.primary}
                        />
                        <Slider
                            style={styles.slider}
                            minimumValue={1950}
                            maximumValue={2024}
                            step={1}
                            value={yearRange.end}
                            onValueChange={(value) => setYearRange(prev => ({ ...prev, end: Math.floor(value) }))}
                            minimumTrackTintColor={colors.primary}
                            maximumTrackTintColor={colors.inactive}
                            thumbTintColor={colors.primary}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t.durationTitle}: {duration.min} - {duration.max} {t.minutes}
                    </Text>
                    <View style={styles.sliderContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={30}
                            maximumValue={240}
                            step={5}
                            value={duration.min}
                            onValueChange={(value) => setDuration(prev => ({ ...prev, min: Math.floor(value) }))}
                            minimumTrackTintColor={colors.primary}
                            maximumTrackTintColor={colors.inactive}
                            thumbTintColor={colors.primary}
                        />
                        <Slider
                            style={styles.slider}
                            minimumValue={30}
                            maximumValue={240}
                            step={5}
                            value={duration.max}
                            onValueChange={(value) => setDuration(prev => ({ ...prev, max: Math.floor(value) }))}
                            minimumTrackTintColor={colors.primary}
                            maximumTrackTintColor={colors.inactive}
                            thumbTintColor={colors.primary}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={handleGetRecommendations}
                >
                    <Text style={[styles.buttonText, { color: colors.background }]}>
                        {t.getRecommendations}
                    </Text>
                </TouchableOpacity>

                <EmptyAreaModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    title={t.alertitle}
                    message={t.alermessage}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 16,
        backgroundColor: 'transparent',
    },
    menuButton: {
        padding: 12,
        borderRadius: 12,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 12,
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    sliderContainer: {
        marginHorizontal: 8,
    },
    slider: {
        height: 40,
        marginBottom: 8,
    },
    button: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    moodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    moodButton: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        width: '18%',
    },
    selectedMood: {
        elevation: 4,
    },
    moodEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    moodLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
    },
    genreChip: {
        padding: 8,
        borderRadius: 16,
        margin: 4,
    },
    selectedGenre: {
        elevation: 4,
    },
    genreText: {
        fontSize: 14,
    },
});

export default MovieRecommendationScreen; 