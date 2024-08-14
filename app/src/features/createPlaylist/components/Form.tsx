import React, { useState, useEffect } from 'react';
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
import { getDefaultLanguage } from '../../../locales/i18n';
import { SaveTracks } from '../api/saveTracks';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { ResponseContext } from '../hooks/useContext';
import { CreatePlaylist } from "../api/createPlaylist";
import { CreatePlaylistWithSpecifyArtists } from "../api/createPlaylistWithSpecifyArtists";
import { CreatePlaylistDialog } from "./CreatePlaylistDialog";

const schema = yup.object().shape({
    minute: yup
        .number()
        .nullable() // 空の入力を許可する
        .transform((value, originalValue) => (originalValue === '' ? null : value)) // 空の入力をnullに変換する
        .required(t('form.specifyTime.required'))
        .typeError(t('form.specifyTime.typeError')) // 数値チェックを行う
        .min(3, t('form.specifyTime.range'))
        .max(100, t('form.specifyTime.range'))
});

export const Form = () => {
    const theme = useTheme();
    const { toggle, open, isOpen } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [httpStatus, setHttpStatus] = useState(0);
    const [playlistId, setPlaylistId] = useState("");
    const context = React.useContext(ResponseContext);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { minute: "25" },
    });

    useEffect(() => {
        if (!sessionStorage.getItem('tracksSaved')) {
            SaveTracks();
            sessionStorage.setItem('tracksSaved', 'true');
        }
    }, []);

    const onSubmit = async (data) => {
        const minute = data.minute;
        open();
        setIsLoading(true);

        const response = context.followedArtistIds && context.followedArtistIds.length > 0
            ? await CreatePlaylistWithSpecifyArtists(minute, context.followedArtistIds)
            : await CreatePlaylist(minute);

        if (response.httpStatus === 201) {
            setPlaylistId(response.playlistId);
            setTimeout(() => setIsLoading(false), 2000);
        } else {
            setIsLoading(false);
        }
        setHttpStatus(response.httpStatus);
    };

    return (
        <View style={{ alignItems: 'center' }}>
            <Controller
                control={control}
                name="minute"
                render={({ field: { onChange, value } }) => (
                    <Input
                        keyboardType='numeric'
                        containerStyle={{ maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}
                        inputContainerStyle={{ maxWidth: 400, marginLeft: 20, marginRight: 20 }}
                        errorMessage={errors.minute?.message}
                        inputStyle={{ color: theme.tertiary, marginRight: 5, textAlign: 'center' }}
                        leftIcon={<Icon name="clock-outline" size={20} />}
                        placeholder={t('form.specifyTime.placeholder')}
                        placeholderTextColor={'#454c5091'}
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={handleSubmit(onSubmit)}
                        rightIcon={<Text style={{ color: theme.tertiary, paddingRight: 10 }}>{t('form.specifyTime.minute')}</Text>}
                    />
                )}
            />
            <SelectFollowedArtists />
            <CreatePlaylistButton
                createPlaylist={handleSubmit(onSubmit)}
                createPlaylistWithSpecifyArtists={handleSubmit(onSubmit)}
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
