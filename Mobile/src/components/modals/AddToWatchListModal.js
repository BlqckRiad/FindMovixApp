import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddToWatchListModal = ({ visible, onClose, movieId, movieTitle }) => {
    const { theme, language } = useTheme();
    const colors = theme.colors;
    const [watchLists, setWatchLists] = useState([]);
    const [selectedLists, setSelectedLists] = useState(new Set());

    const translations = {
        en: {
            addToList: "Add to Watch List",
            selectLists: "Select lists to add",
            noLists: "No watch lists found",
            createList: "Create New List",
            save: "Save",
            cancel: "Cancel",
            added: "Added to list",
            removed: "Removed from list"
        },
        tr: {
            addToList: "İzleme Listesine Ekle",
            selectLists: "Eklenecek listeleri seçin",
            noLists: "İzleme listesi bulunamadı",
            createList: "Yeni Liste Oluştur",
            save: "Kaydet",
            cancel: "İptal",
            added: "Listeye eklendi",
            removed: "Listeden çıkarıldı"
        }
    };

    const t = translations[language];

    useEffect(() => {
        if (visible) {
            loadWatchLists();
        }
    }, [visible]);

    const loadWatchLists = async () => {
        try {
            const listsJson = await AsyncStorage.getItem('watchLists');
            const lists = listsJson ? JSON.parse(listsJson) : [];
            
            // Film hangi listelerde var kontrol et
            const selectedListIds = new Set();
            lists.forEach(list => {
                if (list.movies && list.movies.includes(movieId)) {
                    selectedListIds.add(list.id);
                }
            });
            
            setWatchLists(lists);
            setSelectedLists(selectedListIds);
        } catch (error) {
            console.error('Error loading watch lists:', error);
        }
    };

    const toggleList = (listId) => {
        setSelectedLists(prev => {
            const newSet = new Set(prev);
            if (newSet.has(listId)) {
                newSet.delete(listId);
            } else {
                newSet.add(listId);
            }
            return newSet;
        });
    };

    const handleSave = async () => {
        try {
            const updatedLists = watchLists.map(list => {
                const isSelected = selectedLists.has(list.id);
                const hasMovie = list.movies.includes(movieId);

                if (isSelected && !hasMovie) {
                    // Listeye ekle
                    return {
                        ...list,
                        movies: [...list.movies, movieId]
                    };
                } else if (!isSelected && hasMovie) {
                    // Listeden çıkar
                    return {
                        ...list,
                        movies: list.movies.filter(id => id !== movieId)
                    };
                }
                return list;
            });

            await AsyncStorage.setItem('watchLists', JSON.stringify(updatedLists));
            onClose();
        } catch (error) {
            console.error('Error saving watch lists:', error);
        }
    };

    const renderListItem = ({ item }) => {
        const isSelected = selectedLists.has(item.id);
        const movieCount = item.movies ? item.movies.length : 0;

        return (
            <TouchableOpacity
                style={[
                    styles.listItem,
                    { backgroundColor: colors.surface },
                    isSelected && { borderColor: colors.primary, borderWidth: 2 }
                ]}
                onPress={() => toggleList(item.id)}
            >
                <View style={styles.listItemContent}>
                    <Ionicons
                        name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                        size={24}
                        color={isSelected ? colors.primary : colors.text}
                    />
                    <Text style={[styles.listItemText, { color: colors.text }]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.movieCount, { color: colors.textSecondary }]}>
                        {movieCount}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={[styles.content, { backgroundColor: colors.background }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {t.addToList}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {movieTitle}
                    </Text>

                    <FlatList
                        data={watchLists}
                        renderItem={renderListItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    {t.noLists}
                                </Text>
                            </View>
                        }
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText, { color: colors.text }]}>
                                {t.cancel}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
                            onPress={handleSave}
                        >
                            <Text style={[styles.buttonText, { color: colors.background }]}>
                                {t.save}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        padding: spacing.lg,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    subtitle: {
        fontSize: typography.sizes.md,
        marginBottom: spacing.lg,
    },
    closeButton: {
        padding: spacing.xs,
    },
    listContainer: {
        flexGrow: 1,
    },
    listItem: {
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    listItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemText: {
        fontSize: typography.sizes.md,
        marginLeft: spacing.md,
        flex: 1,
    },
    movieCount: {
        fontSize: typography.sizes.sm,
        marginLeft: spacing.sm,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: typography.sizes.md,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.sm,
        marginTop: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    button: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        borderWidth: 1,
    },
    saveButton: {
        elevation: 2,
    },
    buttonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
});

export default AddToWatchListModal; 