import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import { ScrollView, ActivityIndicator, View } from 'react-native';
import { Chip, Avatar } from '@rneui/themed';
import { Text } from "@rneui/base";
import { useTheme } from '../../../config/ThemeContext';
import { t } from '../../../locales/i18n';
import { GetFollowedArtists, Artist } from '../api/getFollowedArtists';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const SelectFollowedArtists = forwardRef((props, ref) => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
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

    /**
     * 古いチップと選択カウントを有効なアーティストIDに基づいて整理します。
     * 有効なIDだけをフィルタリングし、ローカルストレージと状態を更新します。
     */
    const cleanUpOldChips = () => {
        const validArtistIds = new Set(artists.map(artist => artist.ID));
        const filteredChips = selectedChips.filter(chip => validArtistIds.has(chip));

        // localStorage のチップとカウントを更新
        localStorage.setItem('selectedChips', JSON.stringify(filteredChips));
        setSelectedChips(filteredChips);

        setSelectionCounts(prevCounts => {
            const updatedCounts = Object.keys(prevCounts)
                .filter(id => validArtistIds.has(id))
                .reduce((obj, key) => {
                    obj[key] = prevCounts[key];
                    return obj;
                }, {} as { [key: string]: number });

            localStorage.setItem('selectionCounts', JSON.stringify(updatedCounts));
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
        const savedChips = localStorage.getItem('selectedChips');
        if (savedChips) {
            setSelectedChips(JSON.parse(savedChips));
        }

        if (JSON.parse(localStorage.getItem('isFavoriteTracks') || 'false')) {
            setSelectedChips(['favorite']);
        }

        const savedCounts = localStorage.getItem('selectionCounts');
        if (savedCounts) {
            setSelectionCounts(JSON.parse(savedCounts));
        }
    }, []);

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('isFavoriteTracks') || 'false')) return
        if (!isLoading) {
            cleanUpOldChips();
        }
    }, [artists]);

    useEffect(() => {
        sortArtists()
    }, [isLoading]);

    const toggleChip = (chip: string) => {
        setSelectedChips(currentSelectedChips => {
            if (chip === 'favorite') {
                // 「お気に入りの曲」を選択した場合、他のチップの選択を解除
                if (currentSelectedChips.includes('favorite')) {
                    // 既に「お気に入りの曲」が選択されている場合は解除
                    localStorage.setItem('selectedChips', JSON.stringify([]));
                    localStorage.setItem('isFavoriteTracks', JSON.stringify(false));
                    return [];
                } else {
                    // 「お気に入りの曲」を新たに選択
                    localStorage.setItem('selectedChips', JSON.stringify([]));
                    localStorage.setItem('isFavoriteTracks', JSON.stringify(true));
                    return ['favorite'];
                }
            } else {
                // 他のチップを選択した場合は「お気に入りの曲」を解除
                if (currentSelectedChips.includes('favorite')) {
                    localStorage.setItem('selectedChips', JSON.stringify([chip]));
                    localStorage.setItem('isFavoriteTracks', JSON.stringify(false));
                    return [chip];
                } else {
                    const newSelectedChips = currentSelectedChips.includes(chip)
                        ? currentSelectedChips.filter(c => c !== chip)
                        : [...currentSelectedChips, chip];

                    // 選択されたチップをローカルストレージに保存
                    localStorage.setItem('selectedChips', JSON.stringify(newSelectedChips));

                    setSelectionCounts(prevCounts => {
                        const newCounts = { ...prevCounts };

                        if (!currentSelectedChips.includes(chip) && !newSelectedChips.includes(chip)) {
                            delete newCounts[chip];
                        } else if (!currentSelectedChips.includes(chip) && newSelectedChips.includes(chip)) {
                            newCounts[chip] = (newCounts[chip] || 0) + 1;
                        }

                        // 選択カウントをローカルストレージに保存
                        localStorage.setItem('selectionCounts', JSON.stringify(newCounts));
                        return newCounts;
                    });

                    return newSelectedChips;
                }
            }
        });
    };

    const renderArtistChips = (startIndex: number, endIndex: number) => (
        <View style={{ flexDirection: 'row' }}>
            {/* お気に入り曲機能 */}
            {/* {startIndex === 0 && (
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
            )} */}
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

    const containerStyle = {
        width: '80%',
        maxWidth: 400,
        minHeight: 210,
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15,
    };

    return (
        <>
            <Text
                h3
                h3Style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: theme.tertiary,
                }}
                style={{
                    maxWidth: 500,
                    marginTop: 10,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                {t('form.includeFavoriteArtists')}
            </Text>
            <View style={containerStyle}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={theme.tertiary} />
                ) : error ? (
                    <Text style={{ textAlign: 'center' }}>
                        {t('form.get.followedArtists.error')}
                    </Text>
                ) : (
                    <>
                        {artists.length > 0 ? (
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal={true}
                                style={{ flex: 1 }}
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                            >
                                <View>
                                    {renderArtistChips(0, Math.ceil(artists.length / 3))}
                                    {renderArtistChips(Math.ceil(artists.length / 3), Math.ceil(2 * artists.length / 3))}
                                    {renderArtistChips(Math.ceil(2 * artists.length / 3), artists.length)}
                                </View>
                            </ScrollView>
                        ) : artists.length === 0 ? (
                            <Text style={{ textAlign: 'center' }}>
                                {t('form.noFollowedArtists')}
                            </Text>
                        ) :
                            <Text style={{ textAlign: 'center' }}>
                                {t('form.get.followedArtists.error')}
                            </Text>}
                    </>
                )}
            </View>
        </>
    );
});
