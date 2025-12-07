import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Animated,
    Easing,
    Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from '../../../../locales/i18n';
import { GetFollowedArtists, Artist } from '../api/getFollowedArtists';
import useHorizontalScroll from '../../../common/hooks/useHorizontalScroll';
import { Svg, Path, Polyline, Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ローディングアニメーション用のコンポーネント
const LoadingAnimation = () => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // 回転アニメーション
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // 拡大縮小アニメーション
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 800,
                    easing: Easing.bezier(0.42, 0, 0.58, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 800,
                    easing: Easing.bezier(0.42, 0, 0.58, 1),
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.loadingContainer}>
            <Animated.View
                style={[
                    styles.loadingCircle,
                    {
                        transform: [
                            { rotate },
                            { scale: scaleAnim }
                        ],
                    }
                ]}
            >
                <LinearGradient
                    colors={['#3B82F6', '#8B5CF6']}
                    style={styles.loadingGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </Animated.View>
            {/* <Text style={styles.loadingText}>{t('common.loading')}</Text> */}
        </View>
    );
};

const CheckIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2}>
        <Polyline points="20 6 9 17 4 12" />
    </Svg>
);

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const colorsArray = [
    // ['#3B82F6', '#1D4ED8'],
    // ['#8B5CF6', '#6D28D9'],
    // ['#22C55E', '#15803D'],
    // ['#EF4444', '#B91C1C'],
    // ['#6366F1', '#4338CA'],
    ['#A1A1AA', '#2D3748']
];

const ArtistIcon = ({ artist, isSelected, onSelect, selectionCount, itemWidth }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (imageLoaded) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [imageLoaded]);

    const renderImage = () => {
        return (
            <View style={[styles.artistImageContainer, { width: '55%', height: '55%' }]}>
                {/* 常に表示される背景色のあるプレースホルダー */}
                <View style={styles.imagePlaceholder} />

                {artist.ImageUrl && (
                    <Animated.View style={[styles.imageWrapper, { opacity: fadeAnim }]}>
                        <Image
                            source={{ uri: artist.ImageUrl }}
                            style={styles.artistImage}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </Animated.View>
                )}
            </View>
        );
    };

    return (
        <TouchableOpacity
            onPress={() => onSelect(artist.ID)}
            activeOpacity={0.7}
            style={[{ width: itemWidth }]}
        >
            <LinearGradient
                colors={isSelected ? artist.Color : ['#374151', '#374151']}
                style={styles.artistButton}
            >
                {isSelected && (
                    <View style={styles.checkmark}>
                        <CheckIcon />
                    </View>
                )}
                {renderImage()}
                <Text
                    style={[
                        styles.artistName,
                        { color: isSelected ? '#FFFFFF' : '#9CA3AF' }
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {artist.Name.length > 20 ? artist.Name.substring(0, 20) : artist.Name}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const FavoriteTracksIcon = ({ isSelected, onSelect, itemWidth }) => {
    return (
        <TouchableOpacity
            onPress={onSelect}
            activeOpacity={0.7}
            style={[{ width: itemWidth }]}
        >
            <LinearGradient
                colors={isSelected ? ['#A1A1AA', '#2D3748'] : ['#374151', '#374151']}
                style={styles.artistButton}
            >
                {isSelected && (
                    <View style={styles.checkmark}>
                        <CheckIcon />
                    </View>
                )}
                <MaterialIcons
                    name="favorite"
                    size={32}
                    color={isSelected ? '#FFFFFF' : '#9CA3AF'}
                    style={styles.favoriteIcon}
                />
                <Text
                    style={[
                        styles.artistName,
                        { color: isSelected ? '#FFFFFF' : '#9CA3AF' }
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {t('createPlaylist.favoriteTracks')}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const EmptyState = () => (
    <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
            <MaterialIcons name="music-note" size={32} color="#4F46E5" style={styles.icon} />
            <Text style={styles.emptyTitle}>
                {t('createPlaylist.findArtistsTitle')}
            </Text>
            <Text style={styles.emptyText}>
                {t('createPlaylist.followedArtistsEmpty')}
            </Text>
            <View style={styles.divider} />
            <TouchableOpacity
                style={styles.spotifyButton}
                onPress={() => Linking.openURL('https://open.spotify.com/search')}
            >
                <Text style={styles.buttonText}>{t('createPlaylist.findArtists')}</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export const SelectFollowedArtists = forwardRef((props, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [artists, setArtists] = useState([]);
    const [error, setError] = useState(null);
    const [selectionCounts, setSelectionCounts] = useState({});
    const [isFavoriteSelected, setIsFavoriteSelected] = useState(false);
    const scrollViewRef = useRef(null);
    const { resetScroll } = useHorizontalScroll(scrollViewRef);
    const [containerWidth, setContainerWidth] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // 画面幅を取得し、アイテム幅を計算
    const gap = 8; // グリッド間のギャップ
    const itemWidth = (containerWidth - (2 * gap)) / 3;

    const handleArtistClick = (artistId: string) => {
        setSelectedIds(prev => {
            // アーティストが新しく選択された場合（配列に含まれていない場合）
            if (!prev.includes(artistId)) {
                // お気に入りが選択されていたら解除する
                if (isFavoriteSelected) {
                    setIsFavoriteSelected(false);
                    AsyncStorage.setItem('isFavoriteTracks', JSON.stringify(false));
                }

                const newIds = [...prev, artistId];
                AsyncStorage.setItem('selectedIds', JSON.stringify(newIds));

                // selectionCountsを更新
                setSelectionCounts(prevCounts => {
                    const newCounts = { ...prevCounts, [artistId]: (prevCounts[artistId] || 0) + 1 };
                    AsyncStorage.setItem('selectionCounts', JSON.stringify(newCounts));
                    return newCounts;
                });

                return newIds;
            } else {
                // 選択解除の場合
                const newIds = prev.filter(id => id !== artistId);
                AsyncStorage.setItem('selectedIds', JSON.stringify(newIds));
                return newIds;
            }
        });
    };
    const toggleFavorite = () => {
        setIsFavoriteSelected(prev => {
            const newState = !prev;
            AsyncStorage.setItem('isFavoriteTracks', JSON.stringify(newState));

            // お気に入りを選択する場合、アーティスト選択をクリアする
            if (newState && selectedIds.length > 0) {
                setSelectedIds([]);
                AsyncStorage.setItem('selectedIds', JSON.stringify([]));
            }

            return newState;
        });
    };

    const sortArtists = () => {
        if (artists.length > 0) {
            // 選択済みと未選択のアーティストを分離
            const selectedArtists = artists.filter(artist => selectedIds.includes(artist.ID));
            const unselectedArtists = artists.filter(artist => !selectedIds.includes(artist.ID));

            // それぞれのグループ内で選択回数でソート
            const sortByCount = (a, b) => {
                const countA = selectionCounts[a.ID] || 0;
                const countB = selectionCounts[b.ID] || 0;
                return countB - countA;
            };

            const sortedSelectedArtists = selectedArtists.sort(sortByCount);
            const sortedUnselectedArtists = unselectedArtists.sort(sortByCount);

            // 選択済みアーティストを先頭に配置
            setArtists([...sortedSelectedArtists, ...sortedUnselectedArtists]);
        }
        resetScroll();
    };

    useImperativeHandle(ref, () => ({
        sortArtists,
    }));

    useEffect(() => {
        const initializeData = async () => {
            setIsLoading(true);
            try {
                const artistsData = await GetFollowedArtists();
                if (artistsData.httpStatus === 200) {
                    const processedArtists = artistsData.artists.map(artist => ({
                        ...artist,
                        Color: getRandomElement(colorsArray)
                    }));
                    setArtists(processedArtists);
                }

                // Load saved state
                const currentArtistIds = new Set(processedArtists.map(a => a.ID));

                // selectedIds: フォロー中のアーティストのみに絞り込み
                const savedIds = await AsyncStorage.getItem('selectedIds');
                if (savedIds) {
                    const parsedIds: string[] = JSON.parse(savedIds);
                    const validIds = parsedIds.filter(id => currentArtistIds.has(id));
                    setSelectedIds(validIds);
                    // ゴーストIDが除去された場合は保存を更新
                    if (validIds.length !== parsedIds.length) {
                        AsyncStorage.setItem('selectedIds', JSON.stringify(validIds));
                    }
                }

                // selectionCounts: フォロー中のアーティストのみに絞り込み
                const savedCounts = await AsyncStorage.getItem('selectionCounts');
                if (savedCounts) {
                    const parsedCounts: Record<string, number> = JSON.parse(savedCounts);
                    const validCounts: Record<string, number> = {};
                    for (const id of Object.keys(parsedCounts)) {
                        if (currentArtistIds.has(id)) {
                            validCounts[id] = parsedCounts[id];
                        }
                    }
                    setSelectionCounts(validCounts);
                    // ゴーストIDが除去された場合は保存を更新
                    if (Object.keys(validCounts).length !== Object.keys(parsedCounts).length) {
                        AsyncStorage.setItem('selectionCounts', JSON.stringify(validCounts));
                    }
                }

                setIsFavoriteSelected(JSON.parse(await AsyncStorage.getItem('isFavoriteTracks') || 'false'));
            } catch (err) {
                setError('Network error');
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            sortArtists();
        }
    }, [isLoading]);

    // containerWidth が確定したらフェードイン開始
    useEffect(() => {
        if (!isLoading && containerWidth > 0) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoading, containerWidth]);

    if (isLoading) return <LoadingAnimation />;
    if (error) return <Text style={styles.errorText}>{error}</Text>;
    if (artists.length === 0) {
        return <EmptyState />;
    }

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setContainerWidth(width);
                }}
            >
                <View style={[styles.artistGrid, { gap }]}>
                    <FavoriteTracksIcon
                        isSelected={isFavoriteSelected}
                        onSelect={toggleFavorite}
                        itemWidth={itemWidth}
                    />
                    {artists.map((artist) => (
                        <ArtistIcon
                            key={artist.ID}
                            artist={artist}
                            isSelected={selectedIds.includes(artist.ID)}
                            onSelect={handleArtistClick}
                            selectionCount={selectionCounts[artist.ID] || 0}
                            itemWidth={itemWidth}
                        />
                    ))}
                </View>
            </ScrollView>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    artistScrollContainer: {
        paddingHorizontal: 4,
        paddingVertical: 8,
        gap: 12,
        flexDirection: 'row',
    },

    scrollContainer: {
        flex: 1,
        marginTop: 24,
        marginBottom: 24,
    },

    scrollContentContainer: {
        flexGrow: 1,
    },

    artistGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },

    artistButton: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },

    artistName: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 2,
        width: '100%',
        paddingHorizontal: 2, // テキストの左右のパディングを小さく
    },

    artistImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 16,
    },

    checkmark: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 2,
    },

    artistImageContainer: {
        width: '60%',
        height: '60%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 4,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    imagePlaceholder: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#2D3748', // ダークグレーの背景色
        borderRadius: 16,
    },

    imageWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 16,
        overflow: 'hidden',
    },

    favoriteIcon: {
        marginBottom: 4,
    },

    errorText: {
        color: '#EF4444',
        textAlign: 'center',
        padding: 16,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    emptyCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },

    icon: {
        marginBottom: 16,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },

    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 20,
    },

    divider: {
        height: 1,
        backgroundColor: '#2D2D2D',
        width: '100%',
        marginVertical: 20,
    },

    spotifyButton: {
        backgroundColor: '#1DB954', // Spotifyのブランドカラー
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        marginTop: 8,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },

    // ローディングアニメーション用のスタイル
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    loadingCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    loadingGradient: {
        width: '100%',
        height: '100%',
    },
});
