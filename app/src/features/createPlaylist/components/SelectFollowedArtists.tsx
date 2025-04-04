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
import { t } from '../../../locales/i18n';
import { GetFollowedArtists, Artist } from '../api/getFollowedArtists';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import { Svg, Path, Polyline, Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';

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
    const renderImage = () => {
        if (artist.ImageUrl) {
            return (
                <View style={[styles.artistImageContainer, { width: '55%', height: '55%' }]}>
                    <Image
                        source={{ uri: artist.ImageUrl }}
                        style={styles.artistImage}
                        defaultSource={require('../../../../assets/images/artist-icon.png')}
                    />
                </View>
            );
        }

        return (
            <Svg width={32} height={32} viewBox="0 0 40 40">
                <Circle cx="20" cy="20" r="20" fill={'#4B5563'} />
                <Circle cx="20" cy="15" r="6" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <Path
                    d="M8 34 C8 26 32 26 32 34"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    fill="none"
                />
            </Svg>
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

    // 画面幅を取得し、アイテム幅を計算
    const gap = 8; // グリッド間のギャップ
    const itemWidth = (containerWidth - (2 * gap)) / 3;

    const toggleSelection = (artistId) => {
        setSelectedIds(prev => {
            const newSelection = prev.includes(artistId)
                ? prev.filter(id => id !== artistId)
                : [...prev, artistId];

            localStorage.setItem('selectedIds', JSON.stringify(newSelection));

            // Update selection counts
            setSelectionCounts(prevCounts => {
                const newCounts = { ...prevCounts };
                if (!prev.includes(artistId)) {
                    newCounts[artistId] = (newCounts[artistId] || 0) + 1;
                }
                localStorage.setItem('selectionCounts', JSON.stringify(newCounts));
                return newCounts;
            });

            return newSelection;
        });
    };

    const toggleFavorite = () => {
        setIsFavoriteSelected(prev => {
            const newState = !prev;
            localStorage.setItem('isFavoriteTracks', JSON.stringify(newState));
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
                const savedIds = localStorage.getItem('selectedIds');
                if (savedIds) setSelectedIds(JSON.parse(savedIds));

                const savedCounts = localStorage.getItem('selectionCounts');
                if (savedCounts) setSelectionCounts(JSON.parse(savedCounts));

                setIsFavoriteSelected(JSON.parse(localStorage.getItem('isFavoriteTracks') || 'false'));
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

    // LoadingAnimationコンポーネントを使用
    if (isLoading) return <LoadingAnimation />;
    if (error) return <Text style={styles.errorText}>{error}</Text>;
    if (artists.length === 0) {
        return <EmptyState />;
    }

    return (
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
                {artists.map((artist) => (
                    <ArtistIcon
                        key={artist.ID}
                        artist={artist}
                        isSelected={selectedIds.includes(artist.ID)}
                        onSelect={toggleSelection}
                        selectionCount={selectionCounts[artist.ID] || 0}
                        itemWidth={itemWidth}
                    />
                ))}
            </View>
        </ScrollView>
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
    },

    favoriteContainer: {
        paddingHorizontal: 8,
        paddingBottom: 16,
    },

    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 25,
        backgroundColor: '#F3F4F6',
        gap: 8,
    },

    favoriteButtonSelected: {
        backgroundColor: '#2089dc',
    },

    favoriteText: {
        fontSize: 16,
        color: '#2089dc',
        fontWeight: '600',
    },

    favoriteTextSelected: {
        color: '#FFFFFF',
    },

    countBadge: {
        position: 'absolute',
        top: 4,
        left: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 4,
        minWidth: 20,
        alignItems: 'center',
    },

    countText: {
        color: '#FFFFFF',
        fontSize: 10,
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

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
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
});