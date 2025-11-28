import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from '../../../locales/i18n';
import { InitFavoriteTracksData, InitFollowedArtistsTracksData } from '../api/initTracksData';

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

/**
 * フォーム入力管理フック
 */
export const useFormInput = () => {
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { minute: "25" },
    });

    // 保存された再生時間の読み込み
    useEffect(() => {
        const loadMinute = async () => {
            const storedMinute = await AsyncStorage.getItem('minute');
            if (storedMinute) {
                setValue('minute', storedMinute);
            }
        };

        loadMinute();
    }, []);

    // トラックデータの初期化（24時間有効期限付きキャッシュ）
    useEffect(() => {
        const fetchTracks = async () => {
            const lastFetchTime = await AsyncStorage.getItem('initTrackDataTimestamp');
            const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24時間（ミリ秒）
            const now = Date.now();

            // 初回 or キャッシュ期限切れの場合に実行
            if (!lastFetchTime || now - parseInt(lastFetchTime) > CACHE_DURATION) {
                // お気に入りトラックとフォローアーティストのトラックを並列で初期化（バックグラウンド実行）
                Promise.all([
                    InitFavoriteTracksData(),
                    InitFollowedArtistsTracksData()
                ]);
                await AsyncStorage.setItem('initTrackData', 'true');
                await AsyncStorage.setItem('initTrackDataTimestamp', now.toString());
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

    return {
        control,
        handleSubmit,
        minuteValue,
        errors,
    };
};
