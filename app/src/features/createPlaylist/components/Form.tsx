import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CreatePlaylistButton } from "./CreatePlaylistButton"
import { SelectFollowedArtists } from "./SelectFollowedArtists"
import { useValidation } from 'react-native-form-validator';
import defaultRules from '../types/defaultRules';
import defaultMessages from '../types/defaultMessages';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';
import { getDefaultLanguage } from '../../../locales/i18n';
import { SaveTracks } from '../api/saveTracks';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { ResponseContext } from '../hooks/useContext';
import { CreatePlaylist } from "../api/createPlaylist"
import { CreatePlaylistWithSpecifyArtists } from "../api/createPlaylistWithSpecifyArtists"
import { CreatePlaylistDialog } from "./CreatePlaylistDialog"

export const Form = () => {
    const theme = useTheme()
    const [minute, setMinute] = useState("25");
    const { toggle, open, isOpen } = useDisclosure();
    const [isLoading, setIsLoding] = useState(true);
    const [httpStatus, setHttpStatus] = useState(0);
    const [playlistId, setPlaylistId] = useState("");
    const context = React.useContext(ResponseContext);
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

    useEffect(() => {
        if (!sessionStorage.getItem('tracksSaved')) {
            SaveTracks();
            sessionStorage.setItem('tracksSaved', 'true');
        }
    }, []); // 空の依存配列を指定して、コンポーネントのマウント時にのみ実行する

    const createPlaylist = async (minute: string) => {
        if (!formValidate()) {
            return
        }
        open()
        setIsLoding(true)

        const response = await CreatePlaylist(minute)
        if (response.httpStatus == 201) {
            setPlaylistId(response.playlistId)
            // 本番環境だと、遅延を発生させないとコンテンツが正常に読み込めないため
            let timeoutId: NodeJS.Timeout
            timeoutId = setTimeout(() => {
                setIsLoding(false)
            }, 2000)
        } else {
            setIsLoding(false)
        }
        setHttpStatus(response.httpStatus)
    }

    const createPlaylistWithSpecifyArtists = async (minute: string) => {
        if (!formValidate()) {
            return
        }
        open()
        setIsLoding(true)

        const artistIds = context.followedArtistIds.map((item: any) => (item));
        const response = await CreatePlaylistWithSpecifyArtists(minute, artistIds)
        if (response.httpStatus == 201) {
            setPlaylistId(response.playlistId)
            // 本番環境だと、遅延を発生させないとコンテンツが正常に読み込めないため
            let timeoutId: NodeJS.Timeout
            timeoutId = setTimeout(() => {
                setIsLoding(false)
            }, 2000)
        } else {
            setIsLoding(false)
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
                    maxWidth: 300,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
                disabledInputStyle={{
                }}
                inputContainerStyle={{
                    maxWidth: 300,
                    marginLeft: 20,
                    marginRight: 20,
                    // width: '100%'
                }}
                errorMessage={getErrorsInField("minute")[0]}
                errorStyle={{
                    maxWidth: 300,
                    marginLeft: 20,
                    marginRight: 20,
                    // width: '100%'
                }}
                errorProps={{}}
                inputStyle={{
                    color: theme.tertiary,
                    marginRight: 5,
                    textAlign: 'center'
                }}
                // label={t('form.specifyTime')}
                // labelStyle={{
                //     paddingTop: 30,
                //     color: theme.tertiary,
                //     maxWidth: 300,
                //     marginLeft: 20,
                //     marginRight: 20,
                //     // width: '100%'
                // }}
                labelProps={{}}
                leftIcon={<Icon name="clock-outline" size={20} />}
                leftIconContainerStyle={{}}
                rightIcon={<View style={{ paddingRight: 10 }}><Text style={{ color: theme.tertiary }}>分</Text></View>}
                placeholder={t('form.specifyTime.placeholder')}
                placeholderTextColor={'#454c5091'}
                onChangeText={setMinute}
                value={minute}
                onSubmitEditing={() => {
                    if (context.followedArtistIds && context.followedArtistIds.length > 0) {
                        createPlaylistWithSpecifyArtists(minute)
                    } else {
                        createPlaylist(minute)
                    }
                }
                }
            />
            <SelectFollowedArtists />
            <CreatePlaylistButton
                createPlaylist={createPlaylist}
                createPlaylistWithSpecifyArtists={createPlaylistWithSpecifyArtists}
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
