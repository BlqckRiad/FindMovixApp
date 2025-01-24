import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Modal, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const WatchListScreen = ({ navigation }) => {
    const { theme, language } = useTheme();
    const colors = theme.colors;
    const [watchLists, setWatchLists] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [deleteModal, setDeleteModal] = useState({ visible: false, listId: null, listName: '' });
    const isFocused = useIsFocused();

    const translations = {
        en: {
            title: "Watch Lists",
            noLists: "No watch lists found",
            addList: "Add New List",
            newListTitle: "New List",
            cancel: "Cancel",
            create: "Create",
            enterListName: "Enter list name",
            confirmDelete: "Delete List",
            confirmDeleteMessage: "Are you sure you want to delete this list?",
            delete: "Delete"
        },
        tr: {
            title: "İzleme Listeleri",
            noLists: "İzleme listesi bulunamadı",
            addList: "Yeni Liste Ekle",
            newListTitle: "Yeni Liste",
            cancel: "İptal",
            create: "Oluştur",
            enterListName: "Liste adını girin",
            confirmDelete: "Listeyi Sil",
            confirmDeleteMessage: "Bu listeyi silmek istediğinizden emin misiniz?",
            delete: "Sil"
        }
    };

    const t = translations[language];

    // Her ekran odaklandığında listeleri yenile
    useEffect(() => {
        if (isFocused) {
            loadWatchLists();
        }
    }, [isFocused]);

    const loadWatchLists = async () => {
        try {
            const listsJson = await AsyncStorage.getItem('watchLists');
            if (!listsJson) {
                setWatchLists([]);
                return;
            }

            const lists = JSON.parse(listsJson);
            // Her listenin movies array'ini kontrol et
            const updatedLists = lists.map(list => ({
                ...list,
                movies: Array.isArray(list.movies) ? list.movies : []
            }));
            
            setWatchLists(updatedLists);
        } catch (error) {
            console.error('Error loading watch lists:', error);
            setWatchLists([]);
        }
    };

    const handleCreateList = async () => {
        if (!newListName.trim()) return;

        const newList = {
            id: Date.now().toString(),
            name: newListName.trim(),
            movies: []
        };

        const updatedLists = [...watchLists, newList];
        setWatchLists(updatedLists);

        try {
            await AsyncStorage.setItem('watchLists', JSON.stringify(updatedLists));
            setModalVisible(false);
            setNewListName('');
        } catch (error) {
            console.error('Error saving watch list:', error);
        }
    };

    const handleDeleteList = async () => {
        if (!deleteModal.listId) return;

        try {
            const updatedLists = watchLists.filter(list => list.id !== deleteModal.listId);
            await AsyncStorage.setItem('watchLists', JSON.stringify(updatedLists));
            setWatchLists(updatedLists);
            setDeleteModal({ visible: false, listId: null, listName: '' });
        } catch (error) {
            console.error('Error deleting watch list:', error);
        }
    };

    const renderWatchList = ({ item }) => {
        return (
            <TouchableOpacity
                style={[styles.listItem, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('WatchListDetail', { 
                    listId: item.id,
                    listName: item.name
                })}
            >
                <View style={styles.listItemContent}>
                    <Ionicons name="list" size={24} color={colors.primary} />
                    <Text style={[styles.listItemText, { color: colors.text }]}>
                        {item.name}
                    </Text>
                </View>
                <View style={styles.listItemActions}>
                    <TouchableOpacity
                        onPress={() => setDeleteModal({ 
                            visible: true, 
                            listId: item.id, 
                            listName: item.name 
                        })}
                        style={styles.deleteButton}
                    >
                        <Ionicons name="trash-outline" size={24} color={colors.error} />
                    </TouchableOpacity>
                    <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.openDrawer()}
                >
                    <Ionicons name="menu" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>{t.title}</Text>
            </View>

            <FlatList
                data={watchLists}
                renderItem={renderWatchList}
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

            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={24} color={colors.background} />
                <Text style={[styles.addButtonText, { color: colors.background }]}>
                    {t.addList}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setModalVisible(false);
                    setNewListName('');
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            {t.newListTitle}
                        </Text>
                        
                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            placeholder={t.enterListName}
                            placeholderTextColor={colors.textSecondary}
                            value={newListName}
                            onChangeText={setNewListName}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { borderColor: colors.border }]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setNewListName('');
                                }}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                                    {t.cancel}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                                onPress={handleCreateList}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.background }]}>
                                    {t.create}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={deleteModal.visible}
                transparent
                animationType="fade"
                onRequestClose={() => setDeleteModal({ visible: false, listId: null, listName: '' })}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <View style={styles.modalHeader}>
                            <Ionicons name="trash-outline" size={32} color={colors.error} />
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {t.confirmDelete}
                            </Text>
                        </View>
                        
                        <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
                            {t.confirmDeleteMessage}
                        </Text>
                        
                        <Text style={[styles.listNameInModal, { color: colors.text }]}>
                            "{deleteModal.listName}"
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { borderColor: colors.border }]}
                                onPress={() => setDeleteModal({ visible: false, listId: null, listName: '' })}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                                    {t.cancel}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.error }]}
                                onPress={handleDeleteList}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.background }]}>
                                    {t.delete}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 16,
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
        marginLeft: 12,
    },
    listContainer: {
        padding: 16,
        flexGrow: 1,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    listItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    listItemText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
        flex: 1,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        margin: 16,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContent: {
        width: '100%',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
        borderWidth: 1,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    listItemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        padding: 8,
        marginRight: 8,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12,
    },
    listNameInModal: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 24,
    },
});

export default WatchListScreen; 