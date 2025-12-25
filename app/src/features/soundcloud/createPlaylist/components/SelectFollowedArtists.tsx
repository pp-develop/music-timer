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
import { CheckFavoritesExists } from '../api/checkFavoritesExists';
import useHorizontalScroll from '../../../common/hooks/useHorizontalScroll';
import { Svg, Path, Polyline, Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingAnimation = () => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

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
                    colors={['#FF5500', '#FF7700']}
                    style={styles.loadingGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </Animated.View>
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

// お気に入り無効時のトースト通知コンポーネント
const DisabledToast = ({ visible, onHide }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-50)).current;

    useEffect(() => {
        if (visible) {
            // 表示アニメーション（上から降りてくる）
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();

            // 3秒後に自動で非表示
            const timer = setTimeout(() => {
                hideToast();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -50,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
        });
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.toastContainer,
                {
                    opacity,
                    transform: [{ translateY }],
                }
            ]}
        >
            <TouchableOpacity
                style={styles.toastContent}
                onPress={hideToast}
                activeOpacity={0.9}
            >
                <View style={styles.toastIconContainer}>
                    <MaterialIcons name="favorite-border" size={24} color="#FF5500" />
                </View>
                <View style={styles.toastTextContainer}>
                    <Text style={styles.toastTitle}>{t('createPlaylist.favoriteTracks')}</Text>
                    <Text style={styles.toastMessage}>{t('createPlaylist.favoriteTracks.disabled.soundcloud')}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const FavoriteTracksIcon = ({ isSelected, onSelect, itemWidth, disabled = false, onDisabledPress }) => {
    const handlePress = () => {
        if (disabled) {
            onDisabledPress?.();
            return;
        }
        onSelect();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={disabled ? 0.8 : 0.7}
            style={[{ width: itemWidth }]}
        >
            <LinearGradient
                colors={isSelected ? ['#A1A1AA', '#2D3748'] : ['#374151', '#374151']}
                style={[styles.artistButton, disabled && styles.disabledButton]}
            >
                {isSelected && (
                    <View style={styles.checkmark}>
                        <CheckIcon />
                    </View>
                )}
                <MaterialIcons
                    name="favorite"
                    size={32}
                    color={disabled ? '#6B7280' : (isSelected ? '#FFFFFF' : '#9CA3AF')}
                    style={styles.favoriteIcon}
                />
                <Text
                    style={[
                        styles.artistName,
                        { color: disabled ? '#6B7280' : (isSelected ? '#FFFFFF' : '#9CA3AF') }
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
            <MaterialIcons name="music-note" size={32} color="#FF5500" style={styles.icon} />
            <Text style={styles.emptyTitle}>
                {t('createPlaylist.findArtistsTitle')}
            </Text>
            <Text style={styles.emptyText}>
                {t('createPlaylist.followedArtistsEmpty.soundcloud')}
            </Text>
            <View style={styles.divider} />
            <TouchableOpacity
                style={styles.soundcloudButton}
                onPress={() => Linking.openURL('https://soundcloud.com/discover')}
            >
                <Text style={styles.buttonText}>{t('createPlaylist.findArtists.soundcloud')}</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
            <MaterialIcons name="wifi-off" size={32} color="#EF4444" style={styles.icon} />
            <Text style={styles.emptyTitle}>
                {t('common.networkError')}
            </Text>
            <Text style={styles.emptyText}>
                {t('common.networkErrorDescription')}
            </Text>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.buttonText}>{t('common.retry')}</Text>
            </TouchableOpacity>
        </View>
    </View>
);

interface SelectFollowedArtistsProps {
    onSelectionChange?: (hasSelection: boolean) => void;
}

export const SelectFollowedArtists = forwardRef<any, SelectFollowedArtistsProps>(({ onSelectionChange }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [artists, setArtists] = useState([]);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [selectionCounts, setSelectionCounts] = useState({});
    const [isFavoriteSelected, setIsFavoriteSelected] = useState(false);
    const [favoritesExists, setFavoritesExists] = useState(true);
    const [showDisabledToast, setShowDisabledToast] = useState(false);
    const scrollViewRef = useRef(null);
    const { resetScroll } = useHorizontalScroll(scrollViewRef);
    const [containerWidth, setContainerWidth] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const gap = 8;
    const itemWidth = (containerWidth - (2 * gap)) / 3;

    const handleArtistClick = (artistId: string) => {
        setSelectedIds(prev => {
            if (!prev.includes(artistId)) {
                if (isFavoriteSelected) {
                    setIsFavoriteSelected(false);
                    AsyncStorage.setItem('soundcloud_isFavoriteTracks', JSON.stringify(false));
                }

                const newIds = [...prev, artistId];
                AsyncStorage.setItem('soundcloud_selectedIds', JSON.stringify(newIds));

                setSelectionCounts(prevCounts => {
                    const newCounts = { ...prevCounts, [artistId]: (prevCounts[artistId] || 0) + 1 };
                    AsyncStorage.setItem('soundcloud_selectionCounts', JSON.stringify(newCounts));
                    return newCounts;
                });

                return newIds;
            } else {
                const newIds = prev.filter(id => id !== artistId);
                AsyncStorage.setItem('soundcloud_selectedIds', JSON.stringify(newIds));
                return newIds;
            }
        });
    };
    const toggleFavorite = () => {
        setIsFavoriteSelected(prev => {
            const newState = !prev;
            AsyncStorage.setItem('soundcloud_isFavoriteTracks', JSON.stringify(newState));

            if (newState && selectedIds.length > 0) {
                setSelectedIds([]);
                AsyncStorage.setItem('soundcloud_selectedIds', JSON.stringify([]));
            }

            return newState;
        });
    };

    const sortArtists = () => {
        if (artists.length > 0) {
            const selectedArtists = artists.filter(artist => selectedIds.includes(artist.ID));
            const unselectedArtists = artists.filter(artist => !selectedIds.includes(artist.ID));

            const sortByCount = (a, b) => {
                const countA = selectionCounts[a.ID] || 0;
                const countB = selectionCounts[b.ID] || 0;
                return countB - countA;
            };

            const sortedSelectedArtists = selectedArtists.sort(sortByCount);
            const sortedUnselectedArtists = unselectedArtists.sort(sortByCount);

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
                // お気に入りトラックの存在チェックとアーティスト取得を並行実行
                const [exists, artistsData] = await Promise.all([
                    CheckFavoritesExists(),
                    GetFollowedArtists()
                ]);

                setFavoritesExists(exists);

                if (artistsData.httpStatus === 200) {
                    const processedArtists = artistsData.artists.map(artist => ({
                        ...artist,
                        Color: getRandomElement(colorsArray)
                    }));
                    setArtists(processedArtists);

                    // Load saved state - フォロー解除されたアーティストを除去
                    const currentArtistIds = new Set(processedArtists.map(a => a.ID));

                    try {
                        const savedIds = await AsyncStorage.getItem('soundcloud_selectedIds');
                        const parsedIds: string[] = savedIds ? JSON.parse(savedIds) : [];
                        const validIds = parsedIds.filter(id => currentArtistIds.has(id));
                        setSelectedIds(validIds);
                        AsyncStorage.setItem('soundcloud_selectedIds', JSON.stringify(validIds));

                        const savedCounts = await AsyncStorage.getItem('soundcloud_selectionCounts');
                        const parsedCounts: Record<string, number> = savedCounts ? JSON.parse(savedCounts) : {};
                        const validCounts = Object.fromEntries(
                            Object.entries(parsedCounts).filter(([id]) => currentArtistIds.has(id))
                        );
                        setSelectionCounts(validCounts);
                        AsyncStorage.setItem('soundcloud_selectionCounts', JSON.stringify(validCounts));

                        const savedFavorite = await AsyncStorage.getItem('soundcloud_isFavoriteTracks');
                        if (savedFavorite) {
                            const wasFavoriteSelected = JSON.parse(savedFavorite);
                            // お気に入りが存在しない場合は選択状態をクリア
                            if (wasFavoriteSelected && !exists) {
                                setIsFavoriteSelected(false);
                                AsyncStorage.setItem('soundcloud_isFavoriteTracks', JSON.stringify(false));
                            } else {
                                setIsFavoriteSelected(wasFavoriteSelected);
                            }
                        }
                    } catch {
                        // ローカルストレージ破損時はデフォルト値で続行
                    }
                }
            } catch (err) {
                setError('Network error');
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, [retryCount]);

    useEffect(() => {
        if (!isLoading) {
            sortArtists();
        }
    }, [isLoading]);

    useEffect(() => {
        if (!isLoading && containerWidth > 0) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoading, containerWidth]);

    // 選択状態が変わったら親に通知
    useEffect(() => {
        const hasSelection = isFavoriteSelected || selectedIds.length > 0;
        onSelectionChange?.(hasSelection);
    }, [selectedIds, isFavoriteSelected, onSelectionChange]);

    if (isLoading) return <LoadingAnimation />;
    if (error) return <ErrorState onRetry={() => { setError(null); setRetryCount(c => c + 1); }} />;
    if (artists.length === 0) {
        return <EmptyState />;
    }

    return (
        <>
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
                            disabled={!favoritesExists}
                            onDisabledPress={() => setShowDisabledToast(true)}
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
            <DisabledToast
                visible={showDisabledToast}
                onHide={() => setShowDisabledToast(false)}
            />
        </>
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
        paddingHorizontal: 2,
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
        backgroundColor: '#2D3748',
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

    soundcloudButton: {
        backgroundColor: '#FF5500',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        marginTop: 8,
    },

    retryButton: {
        backgroundColor: '#374151',
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

    disabledButton: {
        opacity: 0.7,
    },

    // Toast 通知用のスタイル
    toastContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 1000,
    },

    toastContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(55, 65, 81, 0.95)',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 85, 0, 0.3)',
    },

    toastIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 85, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    toastTextContainer: {
        flex: 1,
    },

    toastTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },

    toastMessage: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 13,
        lineHeight: 18,
    },
});
