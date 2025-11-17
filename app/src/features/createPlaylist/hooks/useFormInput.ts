import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from '../../../locales/i18n';
import { InitTracksData } from '../api/initTracksData';

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

    // トラックデータの初期化
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

    return {
        control,
        handleSubmit,
        minuteValue,
        errors,
    };
};
