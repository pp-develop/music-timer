import React, { useEffect, useState } from "react";
import { ScrollView } from 'react-native';
import { Chip } from '@rneui/themed';
import { Text } from "@rneui/base";
import { View } from 'react-native';
import { useTheme } from '../../../config/ThemeContext';
import { t } from '../../../locales/i18n';
import { ResponseContext } from '../hooks/useContext';
import { GetFollowedArtists, Artist } from '../api/getFollowedArtists';

export const SelectFollowedArtists = () => {
    const theme = useTheme()
    const context = React.useContext(ResponseContext);
    const [selectedChips, setSelectedChips] = useState([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const chipStyle = {
        margin: 0, // チップの周囲のスペース
        padding: 1, // チップ内のスペース
    };

    useEffect(() => {
        const fetchArtists = async () => {
            const artistsData = await GetFollowedArtists();
            setArtists(artistsData.artists);
        };

        fetchArtists();
    }, []); // 空の依存配列を指定して、コンポーネントのマウント時にのみ実行する

    const toggleChip = (chip) => {
        setSelectedChips(currentSelectedChips => {
            const newSelectedChips = currentSelectedChips.includes(chip)
                ? currentSelectedChips.filter(c => c !== chip)
                : [...currentSelectedChips, chip];

            context.followedArtistIds = newSelectedChips;
            return newSelectedChips;
        });
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
                    paddingTop: 20,
                    paddingBottom: 10,
                    maxWidth: 500,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                {t('form.includeFavoriteArtists')}
            </Text>

            {artists.length > 0 ? (
                <ScrollView horizontal={true} style={{
                    width: '80%',
                    maxWidth: 400,
                }}>
                    <View style={{}}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            {artists.slice(0, Math.ceil(artists.length / 2)).map(artist => (
                                <Chip
                                    key={artist.ID}
                                    title={artist.Name}
                                    onPress={() => toggleChip(artist.ID)}
                                    type={selectedChips.includes(artist.ID) ? 'solid' : 'outline'}
                                    containerStyle={chipStyle}
                                />
                            ))}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {artists.slice(Math.ceil(artists.length / 2)).map(artist => (
                                <Chip
                                    key={artist.ID}
                                    title={artist.Name}
                                    onPress={() => toggleChip(artist.ID)}
                                    type={selectedChips.includes(artist.ID) ? 'solid' : 'outline'}
                                    containerStyle={chipStyle}
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <Text style={{ textAlign: 'center' }}>
                    {t('form.noFollowedArtists')}
                </Text>
            )}
        </>
    );
};
