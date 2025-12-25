import React, { useState, useContext, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';
import { Header } from "../../../../components/Parts/Header";
import { DeletePlaylist } from "../../deletePlaylist/components/DeletePlaylistButton";
import { CreatePlaylistButton } from "./CreatePlaylistButton";
import { SelectFollowedArtists } from "./SelectFollowedArtists";
import { LoadingOverlay, ErrorOverlay, PlaylistSuccessScreen } from "./FormOverlays";
import { Controller } from 'react-hook-form';
import { t } from '../../../../locales/i18n';
import PlaylistContext from '../../deletePlaylist/hooks/useContext';
import { CreatePlaylist } from "../api/createPlaylist";
import { CreatePlaylistWithSpecifyArtists } from "../api/createPlaylistWithSpecifyArtists";
import { CreatePlaylistWithFavoriteTracks } from "../api/createPlaylistWithFavoriteTracks";
import { InitFavoriteTracksData, InitFollowedArtistsTracksData } from "../api/initTracksData";
import { ErrorCodes } from "../../../../types/errorCodes";
import ReactGA from 'react-ga4';
import { MAX_INPUT_WIDTH } from '../../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFormAnimations } from '../../../common/hooks/useFormAnimations';
import { useFormErrorHandling } from '../../../common/hooks/useFormErrorHandling';
import { useFormInput } from '../hooks/useFormInput';
import { openSpotify } from '../utils/openSpotify';

const { width } = Dimensions.get('window');

export const Form = () => {
    const [httpStatus, setHttpStatus] = useState(0);
    const [playlistId, setPlaylistId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { setShowDeleteButton } = useContext(PlaylistContext);
    const followedArtistsRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    // Animated Values
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [creationStatus, setCreationStatus] = useState<'idle' | 'success' | 'failure'>('idle');

    // カスタムフック
    const { animatedValues, panHandlers, controls } = useFormAnimations(isAnimating, isLoading, setIsLoading, setIsAnimating);
    const { showError, dismissError } = useFormErrorHandling(animatedValues.failureOpacity, setErrorMessage, setCreationStatus);
    const { control, handleSubmit, minuteValue, errors } = useFormInput();

    const onSubmit = async (data: any) => {
        controls.startLoading();

        try {
            const minute = data.minute;

            ReactGA.event({
                category: 'User Interaction',
                action: 'Click',
                label: 'Create Playlist Button',
                value: minute
            });

            // アーティスト情報を並べ替える
            if (followedArtistsRef.current) {
                followedArtistsRef.current.sortArtists();
            }

            // ローカルストレージから選択されたアーティストIDを取得
            let selectedArtistIds = await AsyncStorage.getItem('spotify_selectedIds');
            // 取得した値が存在する場合はJSON形式から配列に変換
            selectedArtistIds = selectedArtistIds ? JSON.parse(selectedArtistIds) : [];

            const isFavoriteTracks = JSON.parse(await AsyncStorage.getItem('spotify_isFavoriteTracks') || 'false');

            // プレイリスト作成関数（エラー時もレスポンスを返す）
            const executeCreatePlaylist = async () => {
                try {
                    if (isFavoriteTracks) {
                        return await CreatePlaylistWithFavoriteTracks(minute, selectedArtistIds);
                    } else if (selectedArtistIds && selectedArtistIds.length > 0) {
                        return await CreatePlaylistWithSpecifyArtists(minute, selectedArtistIds);
                    } else {
                        return await CreatePlaylist(minute, selectedArtistIds);
                    }
                } catch (error: any) {
                    return error; // rejectされたエラーオブジェクトをそのまま返す
                }
            };

            let response = await executeCreatePlaylist();

            // TRACKS_NOT_FOUNDの場合、サーバー側にトラックデータがキャッシュされていない可能性がある
            // リクエストの種類に応じたinitを実行してデータを準備し、5秒後にリトライする
            // ※ initの完了を待つと時間がかかりすぎるため、固定時間で待機する
            // 2回目も失敗した場合は本当にトラックが存在しないため、文脈に応じたエラーメッセージを表示する
            if (response.errorCode === ErrorCodes.TRACKS_NOT_FOUND) {
                if (isFavoriteTracks) {
                    InitFavoriteTracksData();
                } else {
                    InitFollowedArtistsTracksData();
                }
                await new Promise(resolve => setTimeout(resolve, 5000));
                response = await executeCreatePlaylist();
            }

            // 結果処理
            setHttpStatus(response.httpStatus);
            if (response.httpStatus === 201) {
                setPlaylistId(response.playlistId);
                setTimeout(() => {
                    setShowDeleteButton(true);
                }, 2000);
                controls.startAnimation();
            } else {
                // 2回目のTRACKS_NOT_FOUNDは文脈に応じたエラーメッセージ
                if (response.errorCode === ErrorCodes.TRACKS_NOT_FOUND) {
                    if (isFavoriteTracks) {
                        showError(ErrorCodes.NO_FAVORITE_TRACKS);
                    } else if (selectedArtistIds?.length > 0) {
                        showError(ErrorCodes.ARTIST_TRACKS_NOT_FOUND);
                    } else {
                        showError(response.errorCode);
                    }
                } else {
                    showError(response.errorCode);
                }
            }
        } catch (error: any) {
            showError(error.errorCode);
            setHttpStatus(error.httpStatus);
        } finally {
            controls.finishLoading();
        }
    };

    const handleOpenSpotify = () => {
        openSpotify(playlistId);
    };

    return (
        <>
            <View
                style={{ height: "100%" }}
                pointerEvents={isLoading ? 'none' : 'auto'}
            >
                <Animated.View
                    style={[
                        styles.mainScreen,
                        {
                            transform: [{ translateY: animatedValues.mainScreenTranslateY }],
                            opacity: animatedValues.mainScreenOpacity
                        }
                    ]}
                >
                    <Header />

                    <View style={styles.inputContainer}
                        onLayout={(event) => {
                            const { width } = event.nativeEvent.layout;
                            setContainerWidth(width);
                        }}>
                        <Controller
                            control={control}
                            name="minute"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <>
                                    <TextInput
                                        errorMessage={errors.minute?.message}
                                        style={[styles.input, {
                                            maxWidth: containerWidth - 16
                                        }]}
                                        value={value}
                                        onChangeText={onChange}
                                        placeholder={t('form.specifyTime.placeholder')}
                                        placeholderTextColor="#6B7280"
                                        keyboardType="number-pad"
                                        onSubmitEditing={handleSubmit(onSubmit)}
                                    >
                                    </TextInput>
                                    <Text style={styles.unitText}>{t('form.specifyTime.minute')}</Text>
                                </>
                            )}
                        />
                    </View>
                    {errors && <Text style={styles.errorText}>{errors.minute?.message}</Text>}

                    <SelectFollowedArtists ref={followedArtistsRef} />

                    <View style={styles.buttonContainer}>
                        <CreatePlaylistButton
                            minute={minuteValue}
                            createPlaylist={handleSubmit(onSubmit)}
                        />
                        <DeletePlaylist />
                    </View>
                </Animated.View>
            </View>

            {/* プレイリスト画面 */}
            <PlaylistSuccessScreen
                isAnimating={isAnimating}
                playlistId={playlistId}
                translateY={animatedValues.playlistScreenTranslateY}
                swipeIndicatorOpacity={animatedValues.swipeIndicatorOpacity}
                swipeIndicatorTranslateY={animatedValues.swipeIndicatorTranslateY}
                panResponder={panHandlers.panResponder}
                embedPanResponder={panHandlers.embedPanResponder}
                onClose={controls.stopAnimation}
                onOpenSpotify={handleOpenSpotify}
            />

            {/* ローディング画面 */}
            {isLoading && (
                <LoadingOverlay
                    opacity={animatedValues.loadingOpacity}
                    waveAnimations={animatedValues.waveAnimations}
                />
            )}

            {/* 失敗メッセージオーバーレイ */}
            <ErrorOverlay
                opacity={animatedValues.failureOpacity}
                errorMessage={errorMessage}
                creationStatus={creationStatus}
                onDismiss={dismissError}
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
        maxWidth: MAX_INPUT_WIDTH,
        alignSelf: 'stretch',
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: Math.min(24, width * 0.06),
        padding: 0,
        textAlign: "center"
    },
    unitText: {
        color: '#9CA3AF',
        fontSize: Math.min(20, width * 0.05),
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        maxWidth: MAX_INPUT_WIDTH,
        alignSelf: 'stretch',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 12,
        marginTop: 4,
    },
    mainScreen: {
        position: 'absolute',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        padding: 20,
        zIndex: 10
    },
});
