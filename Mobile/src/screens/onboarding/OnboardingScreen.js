import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Dil Seçimi / Language',
    description: 'Tercih ettiğiniz dili seçin\nChoose your preferred language',
    image: 'https://i.imgur.com/8nLFCVP.png',
    type: 'language'
  },
  {
    id: '2',
    title: 'FindMovix\'e Hoşgeldiniz',
    description: 'Film keşfetme ve takip etme yolculuğunuzda size eşlik edecek kişisel film asistanınız.',
    image: 'https://img.freepik.com/free-vector/online-cinema-banner-with-movie-theater-elements_1419-2242.jpg',
  },
  {
    id: '3',
    title: 'Keşfet & İncele',
    description: 'Binlerce film arasında gezinin, size özel öneriler alın ve sevebileceğiniz gizli hazineleri keşfedin.',
    image: 'https://img.freepik.com/free-vector/cinema-realistic-poster-with-illuminated-bucket-popcorn-drink-3d-glasses-reel-tickets-blue-background-with-tapes-vector-illustration_1284-77070.jpg',
  },
  {
    id: '4',
    title: 'Takip Et & Kaydet',
    description: 'İzleme listeleri oluşturun, favorilerinizi işaretleyin ve izlemek istediğiniz filmleri asla kaçırmayın.',
    image: 'https://img.freepik.com/free-vector/cinema-movie-background-popcorn-3d-glasses_1017-33458.jpg',
  }
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const { completeOnboarding } = useAuth();
  const { theme, changeLanguage } = useTheme();
  const colors = theme.colors;

  const renderLanguageButtons = () => (
    <View style={styles.languageButtonsContainer}>
      <TouchableOpacity
        style={[styles.languageButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          changeLanguage('tr');
          handleNext();
        }}
      >
        <Text style={[styles.languageButtonText, { color: colors.background }]}>Türkçe</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.languageButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          changeLanguage('en');
          handleNext();
        }}
      >
        <Text style={[styles.languageButtonText, { color: colors.background }]}>English</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: colors.background }]}>
        {currentIndex > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={[styles.skipButtonText, { color: colors.text }]}>Geç</Text>
        </TouchableOpacity>
        <Image 
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
        </View>
        {item.type === 'language' ? renderLanguageButtons() : (
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={[styles.nextButtonText, { color: colors.background }]}>
              {currentIndex === onboardingData.length - 1 ? 'Başla' : 'İlerle'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      await completeOnboarding();
      navigation.goBack();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({
        index: currentIndex - 1,
        animated: true
      });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
                { 
                  backgroundColor: index === currentIndex ? colors.primary : colors.surface,
                }
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginTop: height * 0.15,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 40,
  },
  languageButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  languageButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 40,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 20,
  },
});

export default OnboardingScreen; 