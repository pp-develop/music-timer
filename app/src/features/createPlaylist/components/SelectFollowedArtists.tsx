import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import { ScrollView, ActivityIndicator, View } from 'react-native';
import { Chip, Avatar } from '@rneui/themed';
import { Text } from "@rneui/base";
import { useTheme } from '../../../config/ThemeContext';
import { t } from '../../../locales/i18n';
import { ResponseContext } from '../hooks/useContext';
import { GetFollowedArtists, Artist } from '../api/getFollowedArtists';
import useHorizontalScroll from '../hooks/useHorizontalScroll';

export const SelectFollowedArtists = forwardRef((props, ref) => {
    const theme = useTheme();
    const context = React.useContext(ResponseContext);
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

        const savedCounts = localStorage.getItem('selectionCounts');
        if (savedCounts) {
            setSelectionCounts(JSON.parse(savedCounts));
        }
    }, []);

    useEffect(() => {
        sortArtists()
    }, [isLoading]);

    const toggleChip = (chip: string) => {
        // チップの選択状態を更新
        setSelectedChips(currentSelectedChips => {
            const newSelectedChips = currentSelectedChips.includes(chip)
                ? currentSelectedChips.filter(c => c !== chip)
                : [...currentSelectedChips, chip];

            localStorage.setItem('selectedChips', JSON.stringify(newSelectedChips));

            // 選択回数を更新
            setSelectionCounts(prevCounts => {
                const newCounts = { ...prevCounts };

                // chipが新しく追加された場合のみカウントアップ
                if (!currentSelectedChips.includes(chip) && !newSelectedChips.includes(chip)) {
                    // chipが削除された場合はカウントしない
                    delete newCounts[chip];
                } else if (!currentSelectedChips.includes(chip) && newSelectedChips.includes(chip)) {
                    // chipが新しく追加された場合はカウントアップ
                    newCounts[chip] = (newCounts[chip] || 0) + 1;
                }

                localStorage.setItem('selectionCounts', JSON.stringify(newCounts));
                return newCounts;
            });

            context.followedArtistIds = newSelectedChips;
            return newSelectedChips;
        });
    };

    const renderArtistChips = (startIndex: number, endIndex: number) => (
        <View style={{ flexDirection: 'row' }}>
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
                {isLoading && isSortComplete ? (
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
                                style={{
                                    flex: 1
                                }}
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                            >
                                <View>
                                    {renderArtistChips(0, Math.ceil(artists.length / 3))}
                                    {renderArtistChips(Math.ceil(artists.length / 3), Math.ceil(2 * artists.length / 3))}
                                    {renderArtistChips(Math.ceil(2 * artists.length / 3), artists.length)}
                                </View>
                            </ScrollView>
                        ) : (
                            <Text style={{ textAlign: 'center' }}>
                                {t('form.noFollowedArtists')}
                            </Text>
                        )}
                    </>
                )}
            </View>
        </>
    );
});
