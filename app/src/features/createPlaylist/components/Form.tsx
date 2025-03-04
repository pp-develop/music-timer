import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    TouchableOpacity,
    Pressable,
    Image
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
import { CreatePlaylist } from "../api/createPlaylist";
import { CreatePlaylistWithSpecifyArtists } from "../api/createPlaylistWithSpecifyArtists";
import { CreatePlaylistWithFavoriteTracks } from "../api/createPlaylistWithFavoriteTracks";
import ReactGA from 'react-ga4';
import { router } from 'expo-router';
import { MAX_INPUT_WIDTH } from '../../../config';
import { Spotify } from 'react-spotify-embed';
const { width, height } = Dimensions.get('window');

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
    const [httpStatus, setHttpStatus] = useState(0);
    const [playlistId, setPlaylistId] = useState("");
    const { setShowDeleteButton } = useContext(PlaylistContext);
    const followedArtistsRef = useRef(null);

    // Animated Values
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [creationStatus, setCreationStatus] = useState<'idle' | 'success' | 'failure'>('idle');
    const failureOpacity = useRef(new Animated.Value(0)).current;
    const mainScreenTranslateY = useRef(new Animated.Value(0)).current;
    const mainScreenOpacity = useRef(new Animated.Value(1)).current;
    const playlistScreenTranslateY = useRef(new Animated.Value(height)).current;
    const songAnimations = useRef(
        Array(5).fill().map(() => new Animated.Value(0))
    ).current;
    const loadingOpacity = useRef(new Animated.Value(0)).current;
    const waveAnimations = useRef(
        Array(3).fill().map(() => new Animated.Value(0))
    ).current;

    // ローディング開始関数
    const startLoading = () => {
        setIsLoading(true);
        Animated.timing(loadingOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start();
    };

    // ローディング終了関数
    const finishLoading = () => {
        Animated.timing(loadingOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        if (isLoading) {
            // 波のアニメーション
            const animations = waveAnimations.map((anim, index) =>
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(anim, {
                            toValue: 1,
                            duration: 800,
                            delay: index * 200,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true
                        }),
                        Animated.timing(anim, {
                            toValue: 0,
                            duration: 800,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true
                        })
                    ])
                )
            );

            // すべてのアニメーションを開始
            animations.forEach(anim => anim.start());

            // クリーンアップ
            return () => {
                animations.forEach(anim => anim.stop());
            };
        }
    }, [isLoading]);

    // アニメーション開始関数
    const startAnimation = () => {
        setIsAnimating(true);

        Animated.sequence([
            // メイン画面を下にスライドさせてフェードアウト
            Animated.parallel([
                Animated.timing(mainScreenTranslateY, {
                    toValue: 100,
                    duration: 500,
                    useNativeDriver: true
                }),
                Animated.timing(mainScreenOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                })
            ]),

            // プレイリスト画面をスライドイン
            Animated.timing(playlistScreenTranslateY, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            }),

            // 曲をステガードでフェードイン
            Animated.stagger(
                100,
                songAnimations.map(anim =>
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true
                    })
                )
            )
        ]).start();
    };

    // アニメーション終了関数
    const stopAnimation = () => {
        Animated.parallel([
            Animated.timing(mainScreenTranslateY, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.timing(mainScreenOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.timing(playlistScreenTranslateY, {
                toValue: height,
                duration: 500,
                useNativeDriver: true
            }),
            ...songAnimations.map(anim =>
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                })
            )
        ]).start(() => {
            setIsAnimating(false);
        });
    };
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
        startLoading();

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
            let selectedArtistIds = localStorage.getItem('selectedIds');
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
                    setShowDeleteButton(true);
                }, 2000);
            } else {
                setCreationStatus('failure');
                // Animate failure message
                Animated.timing(failureOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }).start(() => {
                    // Hide failure message after 2 seconds
                    setTimeout(() => {
                        Animated.timing(failureOpacity, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true
                        }).start(() => {
                            setCreationStatus('idle');
                        });
                    }, 4000);
                });
            }
            setHttpStatus(response.httpStatus);
            startAnimation()
        } catch (error) {
            setCreationStatus('failure');
            Animated.timing(failureOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(failureOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true
                    }).start(() => {
                        setCreationStatus('idle');
                    });
                }, 4000);
            });

            if (error.httpStatus === 303 || error.httpStatus === 401) {
                router.replace("/");
            } else if (error.httpStatus >= 500 && error.httpStatus < 600 || !error.httpStatus) {
                // 5xx 系のエラー処理
                router.replace("/error");
            }
            setHttpStatus(error.httpStatus);
        } finally {
            finishLoading();
        }
    };

    const openSpotify = () => {
        window.open("https://open.spotify.com/playlist/" + playlistId + '?go=1', '_blank');
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
                            transform: [{ translateY: mainScreenTranslateY }],
                            opacity: mainScreenOpacity
                        }
                    ]}
                >
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
            {isAnimating && (
                <Animated.View
                    style={[
                        styles.playlistScreen,
                        {
                            transform: [{ translateY: playlistScreenTranslateY }]
                        }
                    ]}
                >
                    {/* クローズボタンを追加 */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={stopAnimation}
                    >
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>

                    <Text style={styles.playlistTitle}>{t('dialog.createPlaylist.title')}</Text>
                    <Spotify
                        link={"https://open.spotify.com/playlist/" + playlistId}
                        style={
                            { width: "100%" }
                        }
                    />

                    <Pressable
                        style={[
                            {
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 14,
                                paddingHorizontal: 24,
                                borderRadius: 12,
                                backgroundColor: "#454C50",
                                marginTop: 25,
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                flexDirection: 'row',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }
                        ]}
                        onPress={openSpotify}
                    >
                        {({ pressed }) => (
                            <>
                                <Image
                                    source={require('../../../../assets/images/spotify-icon.png')}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        marginRight: 10,
                                        opacity: pressed ? 0.7 : 1
                                    }}
                                />
                                <Text style={[
                                    styles.buttonText,
                                    {
                                        color: pressed ? 'rgba(255,255,255,0.7)' : 'white',
                                        fontSize: 16,
                                    }
                                ]}>
                                    {t('dialog.createPlaylist.open')}
                                </Text>
                            </>
                        )}
                    </Pressable>

                </Animated.View>
            )}

            {/* ローディング画面 */}
            {isLoading && (
                <Animated.View
                    style={[
                        styles.loadingOverlay,
                        { opacity: loadingOpacity }
                    ]}
                >
                    <View style={styles.loadingContainer}>
                        <View style={styles.waveContainer}>
                            {waveAnimations.map((anim, index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.waveBar,
                                        {
                                            transform: [
                                                {
                                                    scaleY: anim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0.3, 1]
                                                    })
                                                }
                                            ],
                                            opacity: anim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.4, 1]
                                            })
                                        }
                                    ]}
                                />
                            ))}
                        </View>

                        <Text style={styles.loadingTitle}>{t('dialog.loading.title')}</Text>
                        <Text style={styles.loadingSubtext}>{t('dialog.loading.subtitle')}</Text>
                    </View>
                </Animated.View>
            )}

            {/* Failure Message Overlay */}
            <Animated.View
                style={[
                    styles.failureOverlay,
                    {
                        opacity: failureOpacity,
                        pointerEvents: creationStatus === 'failure' ? 'auto' : 'none'
                    }
                ]}
            >
                <View style={styles.failureContainer}>

                    {httpStatus == 404 ?
                        <>
                            <Text style={styles.failureTitle}>
                                {t('dialog.createPlaylist.not.created.title')}
                            </Text>
                            <Text style={styles.failureSubtext}>{t('dialog.createPlaylist.not.created')}</Text>
                        </>
                        :
                        <>
                            <Text style={styles.failureTitle}>
                                {t('dialog.createPlaylist.server.error.title')}
                            </Text>
                            <Text style={styles.failureSubtext}>{t('dialog.createPlaylist.server.error')}</Text>
                        </>
                    }
                </View>
            </Animated.View>
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
    mainScreen: {
        position: 'absolute',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        padding: 20,
        zIndex: 10
    },
    playlistScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: 'rgba(31,41,55,0.9)',
        padding: 20,
        zIndex: 20
    },
    playlistTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    songItem: {
        backgroundColor: 'rgba(55,65,81,0.6)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(31,41,55,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        pointerEvents: 'none'
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(55,65,81,0.2)',
        borderRadius: 20,
        padding: 30,
        width: '80%'
    },
    waveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        height: 50
    },
    waveBar: {
        width: 10,
        height: 30,
        backgroundColor: '#3B82F6',
        marginHorizontal: 5,
        borderRadius: 5
    },
    loadingTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10
    },
    loadingSubtext: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign: 'center'
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10
    },
    closeButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    },
    failureOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgb(31, 41, 55)', // Red-like background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 150,
    },
    failureContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 30,
        width: '80%',
        alignItems: 'center'
    },
    failureTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    failureSubtext: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        textAlign: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});