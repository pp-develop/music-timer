import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CreatePlaylistButton } from "./CreatePlaylistButton"
import { SwitchFavoriteArtists } from "./SwitchFavoriteArtists"
import { useValidation } from 'react-native-form-validator';
import defaultRules from '../types/defaultRules';
import defaultMessages from '../types/defaultMessages';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';
import { getDefaultLanguage } from '../../../locales/i18n';
import { CreatePlaylist } from "../api/createPlaylist"
import { useDisclosure } from '../../../hooks/useDisclosure';
import { CreatePlaylistDialog } from "./CreatePlaylistDialog"

export const Form = () => {
    const theme = useTheme()
    const [minute, setMinute] = useState("");
    const { toggle, open, isOpen } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [httpStatus, setHttpStatus] = useState(0);
    const [playlistId, setPlaylistId] = useState("");
    const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
        useValidation({
            deviceLocale: getDefaultLanguage(),
            state: { minute },
            labels: { minute: t('form.specifyTime') },
            rules: defaultRules,
            messages: defaultMessages
        });

    const formValidate = () => {
        return validate({
            minute: { numbers: true, required: true, range: true },
        })
    };

    const createPlaylist = async (minute: string) => {
        if (!formValidate()) {
            return
        }
        open()
        setIsLoading(true)

        const response = await CreatePlaylist(minute)
        if (response.httpStatus == 201) {
            setPlaylistId(response.playlistId)
            // 本番環境だと、遅延を発生させないとコンテンツが正常に読み込めないため
            let timeoutId: NodeJS.Timeout
            timeoutId = setTimeout(() => {
                setIsLoading(false)
            }, 2000)
        } else {
            setIsLoading(false)
        }
        setHttpStatus(response.httpStatus)
    }

    return (
        <View style={{
            alignItems: 'center'
        }}>
            <Input
                keyboardType='numeric'
                containerStyle={{
                    maxWidth: 500,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
                disabledInputStyle={{
                }}
                inputContainerStyle={{
                    maxWidth: 500,
                    marginLeft: 20,
                    marginRight: 20,
                    // width: '100%'
                }}
                errorMessage={getErrorsInField("minute")[0]}
                errorStyle={{
                    maxWidth: 500,
                    marginLeft: 20,
                    marginRight: 20,
                    // width: '100%'
                }}
                errorProps={{}}
                inputStyle={{
                    color: theme.tertiary,
                    paddingLeft: 10,
                }}
                label={t('form.specifyTime')}
                labelStyle={{
                    paddingTop: 30,
                    color: theme.tertiary,
                    maxWidth: 500,
                    marginLeft: 20,
                    marginRight: 20,
                    // width: '100%'
                }}
                labelProps={{}}
                leftIcon={<Icon name="clock-outline" size={20} />}
                leftIconContainerStyle={{}}
                placeholder={t('form.specifyTime.placeholder')}
                placeholderTextColor={'#454c5091'}
                onChangeText={setMinute}
                value={minute}
                onSubmitEditing={() => createPlaylist(minute)}
            />
            <SwitchFavoriteArtists />
            <CreatePlaylistButton
                createPlaylist={createPlaylist}
                minute={minute}
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
