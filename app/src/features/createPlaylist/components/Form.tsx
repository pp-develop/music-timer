import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Header } from "../../../components/Parts/Header";
import { DeletePlaylist } from "../../deletePlaylist/components/DeletePlaylistButton";
import { CreatePlaylistButton } from "./CreatePlaylistButton";
import { SelectFollowedArtists } from "./SelectFollowedArtists";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { t } from '../../../locales/i18n';
import PlaylistContext from '../../deletePlaylist/hooks/useContext';
import { InitTracksData } from '../api/initTracksData';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { CreatePlaylist } from "../api/createPlaylist";
import { CreatePlaylistWithSpecifyArtists } from "../api/createPlaylistWithSpecifyArtists";
import { CreatePlaylistWithFavoriteTracks } from "../api/createPlaylistWithFavoriteTracks";
import { CreatePlaylistDialog } from "./CreatePlaylistDialog";
import ReactGA from 'react-ga4';
import { router } from 'expo-router';
import { MAX_INPUT_WIDTH } from '../../../config';
const { width } = Dimensions.get('window');

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
        const fetchTracks = async () => {
            if (!localStorage.getItem('initTrackData')) {
                InitTracksData();
                localStorage.setItem('initTrackData', 'true');
            }
        };

        fetchTracks();
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
        <>
            <Header />

            <View style={styles.inputContainer}>
                <Controller
                    control={control}
                    name="minute"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                            <TextInput
                                errorMessage={errors.minute?.message}
                                style={styles.input}
                                value={value}
                                onChangeText={onChange}
                                placeholder="再生時間"
                                placeholderTextColor="#6B7280"
                                keyboardType="number-pad"
                                onSubmitEditing={handleSubmit(onSubmit)}
                            >
                            </TextInput>
                            <Text style={styles.unitText}>分</Text>
                        </>
                    )}
                />
            </View>
            {/* {errors && <Text style={styles.errorText}>{errors.minute?.message}</Text>} */}

            <SelectFollowedArtists ref={followedArtistsRef} />

            <View style={styles.buttonContainer}>
                <CreatePlaylistButton
                    minute={minuteValue}
                    createPlaylist={handleSubmit(onSubmit)}
                />
                <DeletePlaylist />
            </View>

            <CreatePlaylistDialog
                isOpen={isOpen}
                httpStatus={httpStatus}
                toggle={toggle}
                playlistId={playlistId}
                isLoading={isLoading}
            />
        </>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#374151',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        maxWidth: MAX_INPUT_WIDTH,
        alignSelf: 'stretch',
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: Math.min(24, width * 0.06), // レスポンシブなフォントサイズ
        padding: 0,
    },
    unitText: {
        color: '#9CA3AF',
        fontSize: Math.min(20, width * 0.05), // レスポンシブなフォントサイズ
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        maxWidth: MAX_INPUT_WIDTH,
        alignSelf: 'stretch',
    },
    errorText: {
        color: '#DC2626', // 赤色で表示
        fontSize: 12,
        marginTop: 4,
    },
});