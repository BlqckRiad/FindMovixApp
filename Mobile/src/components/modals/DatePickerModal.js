import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    FlatList
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

const DatePickerModal = ({ 
    visible, 
    onClose, 
    onSelect,
    currentDate
}) => {
    const { theme, t } = useTheme();
    const colors = theme.colors;
    const [selectedDate, setSelectedDate] = useState(currentDate ? new Date(currentDate) : new Date());
    
    const days = Array.from({ length: 31 }, (_, i) => ({
        value: i + 1,
        label: String(i + 1).padStart(2, '0')
    }));
    
    const months = [
        { value: 0, label: 'Ocak' },
        { value: 1, label: 'Şubat' },
        { value: 2, label: 'Mart' },
        { value: 3, label: 'Nisan' },
        { value: 4, label: 'Mayıs' },
        { value: 5, label: 'Haziran' },
        { value: 6, label: 'Temmuz' },
        { value: 7, label: 'Ağustos' },
        { value: 8, label: 'Eylül' },
        { value: 9, label: 'Ekim' },
        { value: 10, label: 'Kasım' },
        { value: 11, label: 'Aralık' }
    ];
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => ({
        value: currentYear - i,
        label: String(currentYear - i)
    }));

    const dayRef = useRef();
    const monthRef = useRef();
    const yearRef = useRef();

    const scrollToInitialPositions = () => {
        try {
            const dayIndex = selectedDate.getDate() - 1;
            const monthIndex = selectedDate.getMonth();
            const yearIndex = years.findIndex(y => y.value === selectedDate.getFullYear());

            // Güvenli scroll işlemleri
            if (dayIndex >= 0) {
                setTimeout(() => {
                    dayRef.current?.scrollToIndex({
                        index: dayIndex,
                        animated: false,
                        viewPosition: 0.5
                    });
                }, 100);
            }

            if (monthIndex >= 0) {
                setTimeout(() => {
                    monthRef.current?.scrollToIndex({
                        index: monthIndex,
                        animated: false,
                        viewPosition: 0.5
                    });
                }, 100);
            }

            if (yearIndex >= 0) {
                setTimeout(() => {
                    yearRef.current?.scrollToIndex({
                        index: yearIndex,
                        animated: false,
                        viewPosition: 0.5
                    });
                }, 100);
            }
        } catch (error) {
            console.error('Scroll error:', error);
        }
    };

    const getItemLayout = (data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });

    const handleValueChange = (type, value) => {
        const newDate = new Date(selectedDate);
        switch (type) {
            case 'day':
                newDate.setDate(value);
                break;
            case 'month':
                newDate.setMonth(value);
                // Ayın son gününü kontrol et
                const lastDayOfMonth = new Date(newDate.getFullYear(), value + 1, 0).getDate();
                if (newDate.getDate() > lastDayOfMonth) {
                    newDate.setDate(lastDayOfMonth);
                    // Güvenli scroll
                    setTimeout(() => {
                        dayRef.current?.scrollToIndex({
                            index: lastDayOfMonth - 1,
                            animated: true,
                            viewPosition: 0.5
                        });
                    }, 100);
                }
                break;
            case 'year':
                newDate.setFullYear(value);
                break;
        }
        setSelectedDate(newDate);
    };

    const handleSave = () => {
        onSelect(selectedDate.toISOString());
        onClose();
    };

    const renderItem = ({ item, index }, type) => {
        const isSelected = type === 'day' ? selectedDate.getDate() === item.value :
                          type === 'month' ? selectedDate.getMonth() === item.value :
                          selectedDate.getFullYear() === item.value;

        return (
            <TouchableOpacity
                style={[styles.pickerItem, {
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                }]}
                onPress={() => handleValueChange(type, item.value)}
            >
                <Text style={[
                    styles.pickerItemText,
                    { color: isSelected ? colors.background : colors.text }
                ]}>
                    {item.label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
            onShow={scrollToInitialPositions}
        >
            <View style={styles.container}>
                <View style={[styles.content, { backgroundColor: colors.background }]}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {t.birthDate}
                        </Text>
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={[styles.saveText, { color: colors.primary }]}>
                                {t.save}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pickerContainer}>
                        <View style={styles.pickerColumn}>
                            <Text style={[styles.pickerLabel, { color: colors.textSecondary }]}>
                                {t.day}
                            </Text>
                            <FlatList
                                ref={dayRef}
                                data={days}
                                renderItem={(props) => renderItem(props, 'day')}
                                keyExtractor={item => `day-${item.value}`}
                                showsVerticalScrollIndicator={false}
                                getItemLayout={getItemLayout}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                style={styles.picker}
                            />
                        </View>

                        <View style={styles.pickerColumn}>
                            <Text style={[styles.pickerLabel, { color: colors.textSecondary }]}>
                                {t.month}
                            </Text>
                            <FlatList
                                ref={monthRef}
                                data={months}
                                renderItem={(props) => renderItem(props, 'month')}
                                keyExtractor={item => `month-${item.value}`}
                                showsVerticalScrollIndicator={false}
                                getItemLayout={getItemLayout}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                style={styles.picker}
                            />
                        </View>

                        <View style={styles.pickerColumn}>
                            <Text style={[styles.pickerLabel, { color: colors.textSecondary }]}>
                                {t.year}
                            </Text>
                            <FlatList
                                ref={yearRef}
                                data={years}
                                renderItem={(props) => renderItem(props, 'year')}
                                keyExtractor={item => `year-${item.value}`}
                                showsVerticalScrollIndicator={false}
                                getItemLayout={getItemLayout}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                style={styles.picker}
                            />
                        </View>
                    </View>
                </View>
            </View>
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
        height: height * 0.5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    saveText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
    },
    pickerColumn: {
        flex: 1,
        alignItems: 'center',
    },
    pickerLabel: {
        fontSize: typography.sizes.sm,
        marginBottom: spacing.sm,
    },
    picker: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
    },
    pickerItem: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius.lg,
    },
    pickerItemText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
});

export default DatePickerModal; 