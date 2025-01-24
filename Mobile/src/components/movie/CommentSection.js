import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const CommentCard = ({ comment, onLike }) => {
    const [showSpoiler, setShowSpoiler] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    return (
        <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{comment.user}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color={colors.warning} />
                        <Text style={styles.ratingText}>{comment.rating}</Text>
                    </View>
                </View>
                <Text style={styles.dateText}>{formatDate(comment.date)}</Text>
            </View>

            {comment.containsSpoiler && !showSpoiler ? (
                <TouchableOpacity 
                    style={styles.spoilerWarning}
                    onPress={() => setShowSpoiler(true)}
                >
                    <Ionicons name="warning-outline" size={20} color={colors.warning} />
                    <Text style={styles.spoilerText}>
                        Bu yorum spoiler içeriyor. Görüntülemek için dokun.
                    </Text>
                </TouchableOpacity>
            ) : (
                <Text style={styles.commentText}>{comment.comment}</Text>
            )}

            <View style={styles.commentFooter}>
                <TouchableOpacity 
                    style={styles.likeButton}
                    onPress={onLike}
                >
                    <Ionicons 
                        name="heart-outline" 
                        size={20} 
                        color={colors.primary} 
                    />
                    <Text style={styles.likeCount}>{comment.likes}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const SortButton = ({ title, isActive, onPress, icon }) => (
    <TouchableOpacity
        style={[
            styles.sortButton,
            isActive && styles.sortButtonActive
        ]}
        onPress={onPress}
    >
        <Ionicons
            name={icon}
            size={16}
            color={isActive ? colors.primary : colors.textSecondary}
            style={styles.sortIcon}
        />
        <Text style={[
            styles.sortButtonText,
            isActive && styles.sortButtonTextActive
        ]}>
            {title}
        </Text>
    </TouchableOpacity>
);

const CommentSection = ({ movieId, comments = [] }) => {
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [containsSpoiler, setContainsSpoiler] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'liked', 'rating'

    const sortedComments = useMemo(() => {
        if (!comments) return [];
        const sortedArray = [...comments];
        switch (sortBy) {
            case 'newest':
                return sortedArray.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'liked':
                return sortedArray.sort((a, b) => b.likes - a.likes);
            case 'rating':
                return sortedArray.sort((a, b) => b.rating - a.rating);
            default:
                return sortedArray;
        }
    }, [comments, sortBy]);

    const handleAddComment = () => {
        if (newComment.trim() === '') {
            Alert.alert('Uyarı', 'Yorum alanı boş olamaz.');
            return;
        }
        if (rating === 0) {
            Alert.alert('Uyarı', 'Lütfen bir puan verin.');
            return;
        }
        // TODO: Implement comment adding logic
        console.log({ movieId, newComment, rating, containsSpoiler });
        setNewComment('');
        setRating(0);
        setContainsSpoiler(false);
    };

    const renderStars = () => {
        return Array(5).fill(0).map((_, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => setRating(index + 1)}
            >
                <Ionicons
                    name={index < rating ? "star" : "star-outline"}
                    size={24}
                    color={colors.warning}
                    style={styles.star}
                />
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Yorumlar</Text>
                <View style={styles.sortButtons}>
                    <SortButton
                        title="En Yeni"
                        icon="time-outline"
                        isActive={sortBy === 'newest'}
                        onPress={() => setSortBy('newest')}
                    />
                    <SortButton
                        title="En Beğenilen"
                        icon="heart-outline"
                        isActive={sortBy === 'liked'}
                        onPress={() => setSortBy('liked')}
                    />
                    <SortButton
                        title="En Yüksek Puan"
                        icon="star-outline"
                        isActive={sortBy === 'rating'}
                        onPress={() => setSortBy('rating')}
                    />
                </View>
            </View>

            {/* Add Comment Section */}
            <View style={styles.addCommentSection}>
                <View style={styles.ratingStars}>
                    {renderStars()}
                </View>
                
                <TextInput
                    style={styles.input}
                    placeholder="Yorumunuzu yazın..."
                    placeholderTextColor={colors.textSecondary}
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                />

                <View style={styles.commentOptions}>
                    <TouchableOpacity
                        style={[
                            styles.spoilerButton,
                            containsSpoiler && styles.spoilerButtonActive
                        ]}
                        onPress={() => setContainsSpoiler(!containsSpoiler)}
                    >
                        <Ionicons
                            name={containsSpoiler ? "warning" : "warning-outline"}
                            size={20}
                            color={containsSpoiler ? colors.warning : colors.textSecondary}
                        />
                        <Text style={[
                            styles.spoilerButtonText,
                            containsSpoiler && styles.spoilerButtonTextActive
                        ]}>
                            Spoiler İçerir
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleAddComment}
                    >
                        <Text style={styles.submitButtonText}>Yorum Yap</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Comments List */}
            {sortedComments && sortedComments.map((comment) => (
                <CommentCard
                    key={comment.id}
                    comment={comment}
                    onLike={() => console.log('Liked comment:', comment.id)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        color: colors.text,
        fontWeight: typography.weights.semiBold,
        marginBottom: spacing.lg,
    },
    addCommentSection: {
        marginBottom: spacing.xl,
    },
    ratingStars: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    star: {
        marginRight: spacing.xs,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        color: colors.text,
        fontSize: typography.sizes.md,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: spacing.md,
    },
    commentOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    spoilerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: radius.md,
    },
    spoilerButtonActive: {
        backgroundColor: colors.surface,
    },
    spoilerButtonText: {
        color: colors.textSecondary,
        marginLeft: spacing.xs,
        fontSize: typography.sizes.sm,
    },
    spoilerButtonTextActive: {
        color: colors.warning,
    },
    submitButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
    },
    submitButtonText: {
        color: colors.text,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
    },
    commentCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        color: colors.text,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
        marginRight: spacing.sm,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: colors.warning,
        marginLeft: spacing.xs,
        fontSize: typography.sizes.sm,
    },
    dateText: {
        color: colors.textSecondary,
        fontSize: typography.sizes.sm,
    },
    commentText: {
        color: colors.text,
        fontSize: typography.sizes.md,
        lineHeight: 22,
        marginBottom: spacing.sm,
    },
    spoilerWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.sm,
    },
    spoilerText: {
        color: colors.warning,
        marginLeft: spacing.sm,
        fontSize: typography.sizes.sm,
    },
    commentFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.xs,
    },
    likeCount: {
        color: colors.primary,
        marginLeft: spacing.xs,
        fontSize: typography.sizes.sm,
    },
    sectionHeader: {
        marginBottom: spacing.lg,
    },
    sortButtons: {
        flexDirection: 'row',
        marginTop: spacing.md,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.md,
        marginRight: spacing.sm,
        backgroundColor: colors.surface,
    },
    sortButtonActive: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    sortIcon: {
        marginRight: spacing.xs,
    },
    sortButtonText: {
        color: colors.textSecondary,
        fontSize: typography.sizes.sm,
    },
    sortButtonTextActive: {
        color: colors.primary,
        fontWeight: typography.weights.medium,
    },
});

export default CommentSection; 