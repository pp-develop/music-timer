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
    Image,
    PanResponder
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
import { Svg, Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [containerWidth, setContainerWidth] = useState(0);

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

    // インジケーター用のアニメーション値を追加
    const swipeIndicatorOpacity = useRef(new Animated.Value(1)).current;
    const swipeIndicatorTranslateY = useRef(new Animated.Value(0)).current;

    // メインPanResponderの設定
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // 下方向のスワイプのみ検出
                return gestureState.dy > 20 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
            },
            onPanResponderRelease: (evt, gestureState) => {
                // スワイプダウンの場合、アニメーションを終了する
                if (gestureState.dy > 100) {
                    stopAnimation();
                } else {
                    // キャンセルされた場合は元の位置に戻す
                    Animated.spring(playlistScreenTranslateY, {
                        toValue: 0,
                        useNativeDriver: true
                    }).start();
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                // ジェスチャーの移動に合わせてプレイリスト画面を移動
                if (gestureState.dy > 0) {
                    playlistScreenTranslateY.setValue(gestureState.dy);
                }
            }
        })
    ).current;

    // Spotifyエリア用のPanResponder
    const spotifyPanResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dy > 20 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy > 100) {
                    stopAnimation();
                } else {
                    Animated.spring(playlistScreenTranslateY, {
                        toValue: 0,
                        useNativeDriver: true
                    }).start();
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dy > 0) {
                    playlistScreenTranslateY.setValue(gestureState.dy);
                }
            }
        })
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
        defaultValues: { minute: "25" },
    });

    useEffect(() => {
        const loadMinute = async () => {
            const storedMinute = await AsyncStorage.getItem('minute');
            if (storedMinute) {
                setValue('minute', storedMinute);
            }
        };

        loadMinute();
    }, []);

    useEffect(() => {
        const fetchTracks = async () => {
            const storedInitTrackData = await AsyncStorage.getItem('initTrackData')
            if (!storedInitTrackData) {
                InitTracksData();
                AsyncStorage.setItem('initTrackData', 'true');
            }
        };

        fetchTracks();
    }, []);

    // minuteフィールドの値を監視し、変更があるたびにローカルストレージを更新
    const minuteValue = watch('minute');
    useEffect(() => {
        if (minuteValue !== undefined) {
            AsyncStorage.setItem('minute', minuteValue);
        }
    }, [minuteValue]);

    // インジケーターのアニメーション
    useEffect(() => {
        const animateIndicator = () => {
            Animated.sequence([
                Animated.timing(swipeIndicatorTranslateY, {
                    toValue: -10,
                    duration: 500,
                    useNativeDriver: true
                }),
                Animated.timing(swipeIndicatorTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                })
            ]).start(() => {
                if (isAnimating) {
                    animateIndicator();
                }
            });
        };

        if (isAnimating) {
            // 5秒後にフェードアウト
            setTimeout(() => {
                Animated.timing(swipeIndicatorOpacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true
                }).start();
            }, 5000);

            // アニメーション開始
            animateIndicator();
        } else {
            // リセット
            swipeIndicatorOpacity.setValue(1);
            swipeIndicatorTranslateY.setValue(0);
        }
    }, [isAnimating]);

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
            let selectedArtistIds = await AsyncStorage.getItem('selectedIds');
            // 取得した値が存在する場合はJSON形式から配列に変換
            selectedArtistIds = selectedArtistIds ? JSON.parse(selectedArtistIds) : [];

            const isFavoriteTracks = JSON.parse(await AsyncStorage.getItem('isFavoriteTracks') || 'false');

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
            {isAnimating && (
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.playlistScreen,
                        {
                            transform: [{ translateY: playlistScreenTranslateY }]
                        }
                    ]}
                >
                    {/* フェードアウトするスワイプインジケーター */}
                    <Animated.View
                        style={[
                            styles.swipeIndicatorContainer,
                            {
                                opacity: swipeIndicatorOpacity,
                                transform: [{ translateY: swipeIndicatorTranslateY }]
                            }
                        ]}
                    >
                        <View style={styles.swipeBarContainer}>
                            <View style={styles.swipeBar} />
                        </View>

                        <View style={styles.swipeArrowContainer}>
                            <Svg width={16} height={8} viewBox="0 0 16 8" fill="none">
                                <Path
                                    d="M1 1L8 7L15 1"
                                    stroke="white"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </Svg>
                        </View>
                    </Animated.View>

                    {/* クローズボタンを追加 */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={stopAnimation}
                    >
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>

                    {/* タイトルを下に移動 */}
                    <Text style={styles.playlistTitle}>{t('dialog.createPlaylist.title')}</Text>

                    {/* Spotifyプレイリスト - オーバーレイでスワイプに対応 */}
                    <View style={styles.spotifyContainer}>
                        <Spotify
                            link={"https://open.spotify.com/playlist/" + playlistId}
                            style={{ width: "100%" }}
                        />
                        <View
                            {...spotifyPanResponder.panHandlers}
                            style={[styles.spotifyOverlay, { pointerEvents: "none" }]}
                        />
                    </View>

                    {/* Spotifyで開くボタン */}
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

            {/* 失敗メッセージオーバーレイ */}
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
        marginTop: 40,  // インジケーターとの間にスペースを追加
        marginBottom: 20
    },
    swipeIndicatorContainer: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 5,
        paddingVertical: 8
    },
    swipeBarContainer: {
        width: 40,
        height: 5,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    swipeBar: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 3
    },
    swipeArrowContainer: {
        height: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4
    },
    spotifyContainer: {
        width: '100%',
        position: 'relative',
        height: height > 600 ? height * 0.6 : 'auto',
        aspectRatio: 16 / 9, // Spotifyの推奨アスペクト比
    },
    spotifyOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        zIndex: 10,
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
        marginTop: 40, // インジケーターとの間にスペースを追加
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
        backgroundColor: 'rgb(31, 41, 55)',
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