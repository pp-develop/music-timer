import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CreatePlaylistButton } from "./CreatePlaylistButton"
import { SwitchFavoriteArtists } from "./SwitchFavoriteArtists"
import { useValidation } from 'react-native-form-validator';
import defaultRules from '../types/defaultRules';
import defaultMessages from '../types/defaultMessages';
import { t } from '../../../locales/i18n';

export const Form = () => {
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
        <>
            <Input
                keyboardType='numeric'
                containerStyle={{}}
                disabledInputStyle={{
                    backgroundColor: 'black',
                }}
                inputContainerStyle={{
                    backgroundColor: "white",
                    maxWidth: 1000,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%'
                }}
                errorMessage={getErrorsInField("minute")[0]}
                errorStyle={{
                    backgroundColor: "white",
                    maxWidth: 1000,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%'
                }}
                errorProps={{}}
                inputStyle={{
                    paddingLeft: 10,
                }}
                label={t('form.specifyTime')}
                labelStyle={{
                    paddingTop: 10,
                    backgroundColor: "white",
                    maxWidth: 1000,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%'
                }}
                labelProps={{}}
                leftIcon={<Icon name="clock-outline" size={20} />}
                leftIconContainerStyle={{}}
                rightIcon={<Icon name="close" size={20} />}
                rightIconContainerStyle={{}}
                placeholder={t('form.specifyTime.placeholder')}
                onChangeText={setMinute}
                value={minute}
            />
            <SwitchFavoriteArtists />
            <CreatePlaylistButton minute={minute} validate={formValidate} />
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});