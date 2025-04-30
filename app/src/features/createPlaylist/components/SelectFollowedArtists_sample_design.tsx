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
import { Chip, Avatar } from '@rneui/themed';
import { t } from '../../../locales/i18n';
import { GetFollowedArtists, Artist } from '../api/getFollowedArtists';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Svg, Path, Polyline, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2}>
        <Polyline points="20 6 9 17 4 12" />
    </Svg>
);

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const colorsArray = [
    ['#3B82F6', '#1D4ED8'],
    ['#8B5CF6', '#6D28D9'],
    ['#6B7280', '#374151'],
    ['#22C55E', '#15803D'],
    ['#EF4444', '#B91C1C'],
    ['#6366F1', '#4338CA']
]

const ArtistIcon = ({ imageUrl }) => {
    if (imageUrl) {
        return (
            <View style={styles.artistImageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.artistImage}
                    defaultSource={require('../../../../assets/images/artist-icon.png')} // プレースホルダー画像
                />
            </View>
        );
    }

    // 画像URLがない場合は従来のアイコンを表示
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

export const SelectFollowedArtists = forwardRef((props, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [selectedChips, setSelectedChips] = useState<string[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectionCounts, setSelectionCounts] = useState<{ [key: string]: number }>({});
    const [isSortComplete, setIsSortComplete] = useState(false);
    const chipStyle = {
        marginRight: 1,
        marginLeft: 1,
        height: 65,
        borderRadius: 25,
    };
    const scrollViewRef = useRef(null);
    const { onMouseEnter, onMouseLeave, resetScroll } = useHorizontalScroll(scrollViewRef);

    const truncateText = (text) => {
        if (text.length > 20) {
            return text.substring(0, 20);
        }
        return text;
    };

    const toggleArtistSelection = (artistName) => {
        setSelectedArtists(prev =>
            prev.includes(artistName)
                ? prev.filter(name => name !== artistName)
                : [...prev, artistName]
        );
    };

    /**
     * 古いチップと選択カウントを有効なアーティストIDに基づいて整理します。
     * 有効なIDだけをフィルタリングし、ローカルストレージと状態を更新します。
     */
    const cleanUpOldChips = () => {
        const validArtistIds = new Set(artists.map(artist => artist.ID));
        const filteredChips = selectedChips.filter(chip => validArtistIds.has(chip));

        // localStorage のチップとカウントを更新
        AsyncStorage.setItem('selectedChips', JSON.stringify(filteredChips));
        setSelectedChips(filteredChips);

        setSelectionCounts(prevCounts => {
            const updatedCounts = Object.keys(prevCounts)
                .filter(id => validArtistIds.has(id))
                .reduce((obj, key) => {
                    obj[key] = prevCounts[key];
                    return obj;
                }, {} as { [key: string]: number });

            AsyncStorage.setItem('selectionCounts', JSON.stringify(updatedCounts));
            return updatedCounts;
        });
    };

    const sortArtists = () => {
        // 画面更新時のみアーティストの順序を並べ替え
        if (artists.length > 0) {
            const sortedArtists = [...artists].sort((a, b) => {
                const countA = selectionCounts[a.ID] || 0;
                const countB = selectionCounts[b.ID] || 0;
                const isASelected = selectedChips.includes(a.ID);
                const isBSelected = selectedChips.includes(b.ID);

                // 選択回数が多いアーティストを先頭に表示
                if (countA !== countB) return countB - countA;
                if (isASelected && !isBSelected) return -1;
                if (!isASelected && isBSelected) return 1;
                return 0;
            });

            // 選択済みアーティストを先頭にする
            const selectedArtists = sortedArtists.filter(artist => selectedChips.includes(artist.ID));
            const unselectedArtists = sortedArtists.filter(artist => !selectedChips.includes(artist.ID));
            setArtists([...selectedArtists, ...unselectedArtists]);
        }
        setIsSortComplete(true);
        resetScroll()
    };

    useImperativeHandle(ref, () => ({
        sortArtists,
    }));

    useEffect(() => {
        const fetchArtists = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const artistsData = await GetFollowedArtists();
                if (artistsData.httpStatus === 200) {
                    artistsData.artists.map((artist) => {
                        artist.Color = getRandomElement(colorsArray)
                    })
                    setArtists(artistsData.artists);
                }
            } catch (err) {
                setError('Network error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArtists();

        // localStorage から選択情報とカウント情報を取得して状態を初期化
        const savedChips = AsyncStorage.getItem('selectedChips');
        if (savedChips) {
            setSelectedChips(JSON.parse(savedChips));
        }

        if (JSON.parse(AsyncStorage.getItem('isFavoriteTracks') || 'false')) {
            setSelectedChips(['favorite']);
        }

        const savedCounts = AsyncStorage.getItem('selectionCounts');
        if (savedCounts) {
            setSelectionCounts(JSON.parse(savedCounts));
        }
    }, []);

    useEffect(() => {
        if (JSON.parse(AsyncStorage.getItem('isFavoriteTracks') || 'false')) return
        if (!isLoading) {
            cleanUpOldChips();
        }
    }, [artists]);

    useEffect(() => {
        sortArtists()
    }, [isLoading]);

    const toggleChip = (chip: string) => {
        setSelectedChips(currentSelectedChips => {
            // お気に入りのチップの選択処理
            if (chip === 'favorite') {
                if (currentSelectedChips.includes('favorite')) {
                    // お気に入りが選択されている場合は解除
                    const newSelectedChips = currentSelectedChips.filter(c => c !== 'favorite');
                    AsyncStorage.setItem('selectedChips', JSON.stringify(newSelectedChips));
                    AsyncStorage.setItem('isFavoriteTracks', JSON.stringify(false));
                    return newSelectedChips;
                } else {
                    // お気に入りを新たに選択（他のチップと共存可能にする）
                    const newSelectedChips = [...currentSelectedChips, 'favorite'];
                    AsyncStorage.setItem('selectedChips', JSON.stringify(newSelectedChips));
                    AsyncStorage.setItem('isFavoriteTracks', JSON.stringify(true));
                    return newSelectedChips;
                }
            } else {
                // 他のチップの選択処理
                const newSelectedChips = currentSelectedChips.includes(chip)
                    ? currentSelectedChips.filter(c => c !== chip)
                    : [...currentSelectedChips, chip];

                // 選択されたチップをローカルストレージに保存
                AsyncStorage.setItem('selectedChips', JSON.stringify(newSelectedChips));

                // 選択カウントの更新
                setSelectionCounts(prevCounts => {
                    const newCounts = { ...prevCounts };

                    if (!currentSelectedChips.includes(chip) && !newSelectedChips.includes(chip)) {
                        delete newCounts[chip];
                    } else if (!currentSelectedChips.includes(chip) && newSelectedChips.includes(chip)) {
                        newCounts[chip] = (newCounts[chip] || 0) + 1;
                    }

                    // 選択カウントをローカルストレージに保存
                    AsyncStorage.setItem('selectionCounts', JSON.stringify(newCounts));
                    return newCounts;
                });

                return newSelectedChips;
            }
        });
    };


    const renderArtistChips = (startIndex: number, endIndex: number) => (
        <View style={{ flexDirection: 'row' }}>
            {/* お気に入り曲機能 */}
            {startIndex === 0 && (
                <Chip
                    key="favorite"
                    title={t('form.favoriteTracks')}
                    onPress={() => toggleChip('favorite')}
                    type={selectedChips.includes('favorite') ? 'solid' : 'outline'}
                    containerStyle={chipStyle}
                    titleStyle={{ fontSize: 16 }}
                    icon={
                        <View style={{
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                        }}>
                            <MaterialIcons
                                name="favorite"
                                size={20}
                                color="#2089dc"
                                style={{
                                    marginTop: 'auto',
                                    marginBottom: 'auto',
                                }}
                            />
                        </View>
                    }
                />
            )}
            {artists.slice(startIndex, endIndex).map(artist => (
                <Chip
                    key={artist.ID}
                    title={artist.Name}
                    onPress={() => toggleChip(artist.ID)}
                    type={selectedChips.includes(artist.ID) ? 'solid' : 'outline'}
                    containerStyle={chipStyle}
                    titleStyle={{ fontSize: 16 }}
                    icon={
                        artist.ImageUrl ? (
                            <Avatar
                                source={{ uri: artist.ImageUrl }}
                                size={40}
                                rounded
                            />
                        ) : (
                            <View style={{
                                width: 0,
                                height: 40
                            }} />
                        )
                    }
                />
            ))}
        </View>
    );

    return (
        <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.artistGrid}>
                {artists.slice().reverse().map((artist) => (
                    <TouchableOpacity
                        key={artist.Name}
                        onPress={() => {
                            toggleArtistSelection(artist.Name)
                            toggleChip(artist.ID)
                        }
                        }
                        activeOpacity={0.7}
                        style={styles.artistItem}
                    >
                        <LinearGradient
                            colors={selectedArtists.includes(artist.Name) ? artist.Color : ['#374151', '#374151']}
                            style={styles.artistButton}
                        >
                            {selectedArtists.includes(artist.Name) && (
                                <View style={styles.checkmark}>
                                    <CheckIcon />
                                </View>
                            )}
                            <ArtistIcon
                                imageUrl={artist.ImageUrl}
                            />
                            <Text
                                style={[
                                    styles.artistName,
                                    { color: selectedArtists.includes(artist.Name) ? '#FFFFFF' : '#9CA3AF' }
                                ]}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {truncateText(artist.Name)}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
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
});
