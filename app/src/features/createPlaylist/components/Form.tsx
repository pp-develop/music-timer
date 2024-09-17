import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text } from 'react-native';
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CreatePlaylistButton } from "./CreatePlaylistButton";
import { SelectFollowedArtists } from "./SelectFollowedArtists";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';
import PlaylistContext from '../../deletePlaylist/hooks/useContext';
import { UpdateFavoriteTracks } from '../api/updateFavoriteTracks';
import { UpdateTracksFromFollowedArtists } from '../api/updateTracksFromFollowedArtists';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { CreatePlaylist } from "../api/createPlaylist";
import { CreatePlaylistWithSpecifyArtists } from "../api/createPlaylistWithSpecifyArtists";
import { CreatePlaylistWithFavoriteTracks } from "../api/createPlaylistWithFavoriteTracks";
import { CreatePlaylistDialog } from "./CreatePlaylistDialog";
import ReactGA from 'react-ga4';
import { router } from 'expo-router';

const schema = yup.object().shape({
    minute: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .required(t('form.specifyTime.required'))
        .typeError(t('form.specifyTime.typeError'))
        .min(3, t('form.specifyTime.range'))
        .max(100, t('form.specifyTime.range'))
});

export const Form = () => {
    const theme = useTheme();
    const { toggle, open, isOpen } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [httpStatus, setHttpStatus] = useState(0);
    const [playlistId, setPlaylistId] = useState("");
    const { setShowDeleteButton } = useContext(PlaylistContext);
    const followedArtistsRef = useRef(null);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { minute: "25" },  // デフォルト値はローカルストレージが無い場合に適用
    });

    useEffect(() => {
        const storedMinute = localStorage.getItem('minute');
        if (storedMinute) {
            setValue('minute', storedMinute);  // フォームの初期値をローカルストレージの値で更新
        }
    }, []);

    useEffect(() => {
        if (!sessionStorage.getItem('tracksSaved')) {
            UpdateTracksFromFollowedArtists();
            // お気に入り曲機能
            // UpdateFavoriteTracks();
            sessionStorage.setItem('tracksSaved', 'true');
        }
    }, []);

    // minuteフィールドの値を監視し、変更があるたびにローカルストレージを更新
    const minuteValue = watch('minute');
    useEffect(() => {
        if (minuteValue !== undefined) {
            localStorage.setItem('minute', minuteValue);
        }
    }, [minuteValue]);

    const onSubmit = async (data: any) => {
        try {
            const minute = data.minute;

            ReactGA.event({
                category: 'User Interaction',
                action: 'Click',
                label: 'Create Playlist Button',
                value: minute
            });
            open();
            setIsLoading(true);

            // アーティスト情報を並べ替える
            if (followedArtistsRef.current) {
                followedArtistsRef.current.sortArtists();
            }

            // ローカルストレージから選択されたアーティストIDを取得
            let selectedArtistIds = localStorage.getItem('selectedChips');
            // 取得した値が存在する場合はJSON形式から配列に変換
            selectedArtistIds = selectedArtistIds ? JSON.parse(selectedArtistIds) : [];

            const isFavoriteTracks = JSON.parse(localStorage.getItem('isFavoriteTracks') || 'false');

            let response;
            if (isFavoriteTracks) {
                response = await CreatePlaylistWithFavoriteTracks(minute, selectedArtistIds);
            } else if (selectedArtistIds && selectedArtistIds.length > 0) {
                response = await CreatePlaylistWithSpecifyArtists(minute, selectedArtistIds)
            }
            else {
                response = await CreatePlaylist(minute, selectedArtistIds);
            }

            if (response.httpStatus === 201) {
                setPlaylistId(response.playlistId);
                setTimeout(() => {
                    setIsLoading(false);
                    setShowDeleteButton(true);
                }, 2000);
            }
            setHttpStatus(response.httpStatus);
        } catch (error) {
            if (error.httpStatus === 303 || error.httpStatus === 401) {
                router.replace("/");
            } else if (error.httpStatus >= 500 && error.httpStatus < 600 || !error.httpStatus) {
                // 5xx 系のエラー処理
                router.replace("/error");
            }
            setIsLoading(false);
            setHttpStatus(error.httpStatus);
        }
    };

    return (
        <View style={{ alignItems: 'center' }}>
            <Controller
                control={control}
                name="minute"
                render={({ field: { onChange, value } }) => (
                    <Input
                        keyboardType='numeric'
                        containerStyle={{ maxWidth: 400, marginTop: 15, marginBottom: 10, marginLeft: 'auto', marginRight: 'auto', width: "80%" }}
                        errorMessage={errors.minute?.message}
                        inputStyle={{ color: theme.tertiary, textAlign: 'center' }}
                        leftIcon={<Icon name="clock-outline" size={20} />}
                        placeholder={t('form.specifyTime.placeholder')}
                        placeholderTextColor={'#454c5091'}
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={handleSubmit(onSubmit)}
                        rightIcon={<Text style={{ color: theme.tertiary, marginRight: 10 }}>{t('form.specifyTime.minute')}</Text>}
                    />
                )}
            />
            <SelectFollowedArtists ref={followedArtistsRef} />
            <CreatePlaylistButton
                createPlaylist={handleSubmit(onSubmit)}
            />
            <CreatePlaylistDialog
                isOpen={isOpen}
                httpStatus={httpStatus}
                toggle={toggle}
                playlistId={playlistId}
                isLoading={isLoading}
            />
        </View>
    );
};
