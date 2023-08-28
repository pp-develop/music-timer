import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CreatePlaylistButton } from "./CreatePlaylistButton"
import { SwitchFavoriteArtists } from "./SwitchFavoriteArtists"
import { useValidation } from 'react-native-form-validator';
import defaultRules from '../types/defaultRules';
import defaultMessages from '../types/defaultMessages';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../assets/ThemeContext';

export const Form = () => {
    const theme = useTheme()
    const [minute, setMinute] = useState("");
    const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
        useValidation({
            state: { minute },
            rules: defaultRules,
            messages: defaultMessages
        });

    const formValidate = () => {
        return validate({
            minute: { numbers: true, required: true, range: true },
        })
    };

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
                    paddingTop: 10,
                    color: theme.tertiary,
                    maxWidth: 500,
                    marginLeft: 20,
                    marginRight: 20,
                    // width: '100%'
                }}
                labelProps={{}}
                leftIcon={<Icon name="clock-outline" size={20} />}
                leftIconContainerStyle={{}}
                rightIcon={<Icon name="close" size={20} />}
                rightIconContainerStyle={{}}
                placeholder={t('form.specifyTime.placeholder')}
                placeholderTextColor={theme.tertiary}
                onChangeText={setMinute}
                value={minute}
            />
            <SwitchFavoriteArtists />
            <CreatePlaylistButton minute={minute} validate={formValidate} />
        </View>
    );
};
