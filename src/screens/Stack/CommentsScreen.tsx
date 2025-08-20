import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { BallIndicator } from 'react-native-indicators';

//Redux
import { RootState } from '@Redux/store';

//Utils
import { i18n } from '@Utils/localization';
import useGetComments from '@Utils/api/rest/comments/getComments';
import formatViews from '@Utils/formatters/views';
import useGetRepliesByComment from '@Utils/api/rest/comments/getRepliesByComment';
import formatDateComment from '@Utils/formatters/comment';

//Components
import BackButton from '@Components/buttons/Back';
import { useAlert } from '@Components/alert/AlertContext';
import SendIcon from '@Components/icons/SendIcon';

//Interfaces
import { IComment } from '@Interfaces/comments.interface';
import useChangeLikeComment from '@Utils/api/rest/comments/changeLikeComment';
import useAddComment from '@Utils/api/rest/comments/addComment';
import LikeIcon from '@Components/icons/LikeIcon';
import { getTokenFromStorage } from '@Utils/functions/token';
import CrownIcon from '@Components/icons/CrownIcon';

interface IReplyingUser {
    messageId: string;
    userId: string;
    username: string;
}

const CommentsScreen = ({ navigation, route }) => {
    const { animeId, commentsCount } = route.params;
    const { showAlert } = useAlert();
    const userId = useSelector((state: RootState) => state.userReducer.uuid);

    const [comments, setComments] = useState<IComment[]>([]);
    const [openedReplies, setOpenedReplies] = useState<{ [commentId: string]: boolean }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [textInput, setTextInput] = useState<string>('');
    const [replyingUser, setReplyingUser] = useState<IReplyingUser>({
        messageId: '',
        userId: '',
        username: ''
    });
    const [isCommentVerify, setCommentVerify] = useState<boolean>(false);
    const [repliesPagination, setRepliesPagination] = useState<{ [commentId: string]: number }>({});
    const [commentsCountNew, setCommentsCountNew] = useState<number>(0);

    const { getComments } = useGetComments();
    const { getRepliesByComment } = useGetRepliesByComment();
    const { changeLikeComment } = useChangeLikeComment();
    const { addComment } = useAddComment();


    const inputRef = useRef<TextInput>(null);

    const loadComments = async () => {
        if (loading || (repliesPagination && repliesPagination[animeId] >= commentsCount)) return;
        setLoading(true);

        setCommentsCountNew(commentsCount);
        const data = await getComments(animeId, page);
        if (data) {
            setComments(prev => [...prev, ...data]);
            setPage(prev => prev + 1);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadComments();
    }, []);

    useEffect(() => {
        if (textInput.length > 150) {
            showAlert('The comment cannot be longer than 150 characters.');
            setCommentVerify(false);
        } else {
            const codePattern = /<script|<\/script|<|>/i;
            if (codePattern.test(textInput)) {
                showAlert('Comments cannot contain code or HTML tags.');
                setCommentVerify(false);
            } else {
                setCommentVerify(true);
            }
        }
    }, [textInput]);

    const getParentUsername = (parentCommentId: string): string => {
        const parentComment = comments.find(comment => comment.id === parentCommentId);
        return parentComment ? parentComment.username : '';
    };

    const handleReply = (id: string, userId: string, username: string) => {
        inputRef.current?.focus();
        setReplyingUser({
            messageId: id,
            userId: userId,
            username: username
        });
    };

    const handleBlur = () => {
        inputRef.current?.blur();
        setReplyingUser({
            messageId: '',
            userId: '',
            username: ''
        });
    };

    const handleToggleReplies = async (commentId: string, totalRepliesCount: number) => {
        const loadedCount = repliesPagination[commentId] || 0;

        if (openedReplies[commentId] && loadedCount >= totalRepliesCount) {
            setOpenedReplies(prev => ({ ...prev, [commentId]: false }));
            setRepliesPagination(prev => {
                const newState = { ...prev };
                delete newState[commentId];
                return newState;
            });
            setComments(prev =>
                prev.map(comment =>
                    comment.id === commentId
                        ? { ...comment, replies: [] }
                        : comment
                )
            );
            return;
        }

        const nextPage = Math.floor(loadedCount / 5) + 1;
        const data = await getRepliesByComment(animeId, commentId, nextPage);
        if (data) {
            setComments(prev =>
                prev.map(comment =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            replies: [...(comment.replies || []), ...data]
                        }
                        : comment
                )
            );
            setOpenedReplies(prev => ({ ...prev, [commentId]: true }));
            setRepliesPagination(prev => ({
                ...prev,
                [commentId]: loadedCount + data.length
            }));
        }
    };

    const isCommentLikedByUser = (likedByUserIds: string[]): boolean => {
        return likedByUserIds.includes(userId);
    };

    const handleChangeLike = async (commentId: string, action: 'like' | 'dislike') => {
        const token = await getTokenFromStorage();
        if (token) {
            const data = await changeLikeComment(token, animeId, commentId, action);
            if (data) {
                setComments(prevComments =>
                    prevComments.map(comment => {
                        const updateLikes = (item) => {
                            let newLikedByUserIds = [...(item.likedByUserIds || [])];
                            let newLikes = item.likes;

                            if (action === 'like') {
                                if (!newLikedByUserIds.includes(userId)) {
                                    newLikedByUserIds.push(userId);
                                    newLikes += 1;
                                }
                            } else {
                                if (newLikedByUserIds.includes(userId)) {
                                    newLikedByUserIds = newLikedByUserIds.filter(id => id !== userId);
                                    newLikes = Math.max(0, newLikes - 1);
                                }
                            }

                            return {
                                ...item,
                                likedByUserIds: newLikedByUserIds,
                                likes: newLikes
                            };
                        };

                        if (comment.id === commentId) {
                            comment = updateLikes(comment);
                        }

                        comment.replies = comment.replies.map(reply => {
                            if (reply.id === commentId) {
                                return updateLikes(reply);
                            }
                            return reply;
                        });

                        return comment;
                    })
                );
            } else {
                showAlert('Error updating like');
            }
        }
    };

    const handleSendComment = async () => {
        const token = await getTokenFromStorage();

        const data = await addComment(token, animeId, textInput, replyingUser.messageId && replyingUser.messageId);
        if (data) {
            setCommentsCountNew(prevCount => prevCount + 1);

            if (data.parentCommentId) {
                setComments(prevComments =>
                    prevComments.map(comment => {
                        if (comment.id === replyingUser.messageId) {
                            return {
                                ...comment,
                                replies: [
                                    ...comment.replies,
                                    data
                                ]
                            };
                        }
                        return comment;
                    })
                );
            } else {
                setComments(prevComments => [
                    ...prevComments,
                    data
                ]);
            }
            setTextInput('');
        };

        handleBlur();
    };

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <BackButton navigation={navigation} text={`${formatViews(commentsCountNew)} ${i18n.t('anime.comments')}`} />
            <FlatList
                data={comments}
                style={{ width: '98%', marginTop: 15 }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View>
                        <View style={styles.commentContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.userId })}>
                                <Image
                                    source={{ uri: item.avatar }}
                                    style={styles.avatar} />
                            </TouchableOpacity>
                            <View style={styles.commentContent}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    {item.premium && <CrownIcon Width={32} Height={28} Color={'#06C149'} />}
                                    <Text style={styles.username}>
                                        {item.username}
                                    </Text>
                                </View>
                                <Text style={styles.commentText}>
                                    {item.text}
                                </Text>
                                <View style={styles.commentFooter}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={styles.commentInfo}>
                                            <Text style={styles.commentDate}>{formatDateComment(item.createdAt)}</Text>
                                            {!item.parentCommentId && (
                                                <TouchableOpacity onPress={() => handleReply(item.id, item.userId, item.username)}>
                                                    <Text style={styles.replyText}>Reply</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <View style={styles.likesContainer}>
                                            <TouchableOpacity onPress={() => handleChangeLike(item.id, isCommentLikedByUser(item.likedByUserIds) ? 'dislike' : 'like')}>
                                                <LikeIcon Color={isCommentLikedByUser(item.likedByUserIds) ? '#06C049' : '#fff'} Style={{}} />
                                            </TouchableOpacity>
                                            <Text style={styles.likesCount}>{formatViews(item.likes)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginLeft: 25 }}>
                            {openedReplies[item.id] && item.replies && item.replies.map((reply, index) => (
                                <View key={index} style={styles.replyContainer}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.userId })}>
                                        <Image
                                            source={{ uri: item.avatar }}
                                            style={styles.avatar} />
                                    </TouchableOpacity>
                                    <View style={styles.commentContent}>
                                        {reply.parentCommentId && (
                                            <Text style={styles.replyLabel}>
                                                Ответ → {getParentUsername(reply.parentCommentId)}
                                            </Text>
                                        )}
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                            {item.premium && <CrownIcon Width={32} Height={28} Color={'#06C149'} />}
                                            <Text style={styles.username}>
                                                {item.username}
                                            </Text>
                                        </View>
                                        <Text style={styles.commentText}>
                                            {reply.text}
                                        </Text>
                                        <View style={styles.commentFooter}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View style={styles.commentInfo}>
                                                    <Text style={styles.commentDate}>{formatDateComment(reply.createdAt)}</Text>
                                                    {!reply.parentCommentId && (
                                                        <TouchableOpacity onPress={() => handleReply(reply.id, reply.userId, reply.username)}>
                                                            <Text style={styles.replyText}>Reply</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                                <View style={styles.likesContainer}>
                                                    <TouchableOpacity onPress={() => handleChangeLike(reply.id, isCommentLikedByUser(reply.likedByUserIds) ? 'dislike' : 'like')}>
                                                        <LikeIcon Color={isCommentLikedByUser(reply.likedByUserIds) ? '#06C049' : '#fff'} Style={{}} />
                                                    </TouchableOpacity>
                                                    <Text style={styles.likesCount}>{formatViews(reply.likes)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                            {item.repliesCount > 0 && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.line} />
                                    <TouchableOpacity
                                        onPress={() => handleToggleReplies(item.id, item.repliesCount)}>
                                        <Text style={styles.replyViewText}>
                                            {openedReplies[item.id]
                                                ? ((repliesPagination[item.id] || 0) >= item.repliesCount
                                                    ? 'Hide'
                                                    : `View ${item.repliesCount - (repliesPagination[item.id] || 0)} more replies`)
                                                : `View ${item.repliesCount} Replies`
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                )}
                onEndReached={loadComments}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={<BallIndicator color="#06C049" size={50} animationDuration={700} />}
            />
            <View style={styles.footer}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    onBlur={handleBlur}
                    placeholderTextColor="#7A7D84"
                    placeholder={replyingUser.username ? `Replying to ${replyingUser.username}` : "Add comment..."}
                    keyboardType="default"
                    onChangeText={(newText) => setTextInput(newText)}
                    value={textInput} />
                <TouchableOpacity
                    onPress={() => handleSendComment()}
                    disabled={!isCommentVerify}
                    style={[styles.buttonApplyContainer, isCommentVerify ? { backgroundColor: '#15D75A' } : { backgroundColor: '#06C149' }]}>
                    <SendIcon Color={'#fff'} Style={{}} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    input: {
        height: 60,
        width: '70%',
        paddingLeft: 20,
        borderColor: '#21212C',
        borderWidth: 1,
        borderRadius: 15,
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Outfit',
        backgroundColor: '#1F222B'
    },
    footer: {
        backgroundColor: '#181A20',
        borderColor: '#35383F',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        width: '102%',
        height: 110,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonApplyContainer: {
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    replyViewText: {
        fontFamily: 'Outfit',
        fontSize: 10,
        marginLeft: 10,
        color: '#ccc',
    },
    line: {
        width: '16%',
        backgroundColor: '#35383F',
        height: 2,
        marginTop: 2,
        borderRadius: 50,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 7,
        width: '100%'
    },
    commentInfo: {
        flexDirection: 'row',
    },
    replyText: {
        fontFamily: 'Outfit',
        fontSize: 11,
        color: '#ccc',
        marginLeft: 10
    },
    replyContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 7,
        width: '100%',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#464648',
    },
    commentContent: {
        flex: 1,
        marginLeft: 10,
    },
    replyLabel: {
        color: '#aaa',
        fontSize: 12,
        fontFamily: 'Outfit',
    },
    username: {
        fontFamily: 'Outfit',
        color: '#fff',
        fontSize: 14,
    },
    commentText: {
        color: '#ccc',
        fontSize: 12,
        marginTop: 2,
        fontFamily: 'Outfit',
    },
    commentFooter: {
        marginTop: 4,
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    likeIcon: {
        fontSize: 14,
        color: '#ccc',
        marginRight: 5,
        fontFamily: 'Outfit',
    },
    likesCount: {
        color: '#ccc',
        fontSize: 12,
        fontFamily: 'Outfit',
        marginLeft: 5
    },
    commentDate: {
        color: '#888',
        fontSize: 11,
        fontFamily: 'Outfit',
    },
});

export default CommentsScreen;