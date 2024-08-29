import React, { useEffect, useState, useRef } from "react";
import { ScrollView, ActivityIndicator, View } from 'react-native';
import { Chip, Avatar } from '@rneui/themed';
import { Text } from "@rneui/base";
import { useTheme } from '../../../config/ThemeContext';
import { t } from '../../../locales/i18n';
import { ResponseContext } from '../hooks/useContext';
import { GetFollowedArtists, Artist } from '../api/getFollowedArtists';
import useHorizontalScroll from '../hooks/useHorizontalScroll';

export const SelectFollowedArtists = () => {
    const theme = useTheme();
    const context = React.useContext(ResponseContext);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChips, setSelectedChips] = useState([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const chipStyle = {
        marginRight: 1,
        marginLeft: 1,
        height: 65,
        borderRadius: 25,
    };
    const scrollViewRef = useRef(null);
    const { onMouseEnter, onMouseLeave } = useHorizontalScroll(scrollViewRef);

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
    }, []);

    const toggleChip = (chip) => {
        setSelectedChips(currentSelectedChips => {
            const newSelectedChips = currentSelectedChips.includes(chip)
                ? currentSelectedChips.filter(c => c !== chip)
                : [...currentSelectedChips, chip];

            context.followedArtistIds = newSelectedChips;
            return newSelectedChips;
        });
    };

    const renderArtistChips = (startIndex, endIndex) => (
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
                    marginTop: 15,
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
};
