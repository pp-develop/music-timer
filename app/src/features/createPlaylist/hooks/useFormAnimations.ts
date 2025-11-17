import { useRef, useEffect } from 'react';
import { Animated, Easing, Dimensions, PanResponder } from 'react-native';

const { height } = Dimensions.get('window');

/**
 * フォームのアニメーション管理フック
 */
export const useFormAnimations = (
    isAnimating: boolean,
    isLoading: boolean,
    setIsLoading: (loading: boolean) => void,
    setIsAnimating: (animating: boolean) => void
) => {
    // Animated Values
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

    // 共通のPanResponder設定を作成する関数
    const createSwipePanResponder = () => {
        return PanResponder.create({
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
        });
    };

    // メインPanResponderとSpotifyエリア用PanResponderを同じ設定で作成
    const panResponder = useRef(createSwipePanResponder()).current;
    const spotifyPanResponder = useRef(createSwipePanResponder()).current;

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

    return {
        animatedValues: {
            failureOpacity,
            mainScreenTranslateY,
            mainScreenOpacity,
            playlistScreenTranslateY,
            loadingOpacity,
            waveAnimations,
            swipeIndicatorOpacity,
            swipeIndicatorTranslateY,
        },
        panHandlers: {
            panResponder,
            spotifyPanResponder,
        },
        controls: {
            startAnimation,
            stopAnimation,
            startLoading,
            finishLoading,
        }
    };
};
