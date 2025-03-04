import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from '../../../locales/i18n';
import { GetFollowedArtists, Artist } from '../api/getFollowedArtists';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Svg, Path, Polyline, Circle } from 'react-native-svg';

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

const ArtistIcon = ({ artist, isSelected, onSelect, selectionCount }) => {
    const renderImage = () => {
        if (artist.ImageUrl) {
            return (
                <View style={styles.artistImageContainer}>
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
            style={styles.artistItem}
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
                {/* {selectionCount > 0 && (
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{selectionCount}</Text>
                    </View>
                )} */}
            </LinearGradient>
        </TouchableOpacity>
    );
};

export const SelectFollowedArtists = forwardRef((props, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [artists, setArtists] = useState([]);
    const [error, setError] = useState(null);
    const [selectionCounts, setSelectionCounts] = useState({});
    const [isFavoriteSelected, setIsFavoriteSelected] = useState(false);
    const scrollViewRef = useRef(null);
    const { resetScroll } = useHorizontalScroll(scrollViewRef);

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

    if (isLoading) return <View style={styles.loadingContainer} />;
    if (error) return <Text style={styles.errorText}>{error}</Text>;

    return (
        <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* <View style={styles.favoriteContainer}>
                <TouchableOpacity
                    onPress={toggleFavorite}
                    style={[
                        styles.favoriteButton,
                        isFavoriteSelected && styles.favoriteButtonSelected
                    ]}
                >
                    <MaterialIcons
                        name="favorite"
                        size={24}
                        color={isFavoriteSelected ? "#FFFFFF" : "#2089dc"}
                    />
                    <Text style={[
                        styles.favoriteText,
                        isFavoriteSelected && styles.favoriteTextSelected
                    ]}>
                        {t('form.favoriteTracks')}
                    </Text>
                </TouchableOpacity>
            </View> */}
            <View style={styles.artistGrid}>
                {artists.map((artist) => (
                    <ArtistIcon
                        key={artist.ID}
                        artist={artist}
                        isSelected={selectedIds.includes(artist.ID)}
                        onSelect={toggleSelection}
                        selectionCount={selectionCounts[artist.ID] || 0}
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
        marginBottom: 24,
    },

    scrollContentContainer: {
        flexGrow: 1,
    },

    artistGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 12,
        paddingVertical: 8,
    },

    artistItem: {
        width: `${(100 - 8) / 3}%`, // 3列表示（8%は2つのgapの合計）
    },

    artistButton: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        gap: 8,
    },

    artistName: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 4,
        width: '100%', // テキストの最大幅を設定
        paddingHorizontal: 4, // テキストの左右のパディング
    },

    checkmark: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 4,
    },

    artistImageContainer: {
        // width: 32,
        // height: 32, 
        width: '60%',
        height: '60%',
        borderRadius: 16,
        overflow: 'hidden',
    },

    artistImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    errorText: {
        color: '#EF4444',
        textAlign: 'center',
        padding: 16,
    },
});