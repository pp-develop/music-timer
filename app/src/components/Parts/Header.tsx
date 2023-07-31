import React from "react";
import { Header as HeaderComponent } from "@rneui/base";
import { OAuthButton } from "../../features/auth/";
import {t} from '../../locales/i18n';

export const Header = () => {
    return (
        <HeaderComponent
            backgroundColor="black"
            backgroundImageStyle={{
                backgroundColor: "black"
            }}
            barStyle="default"
            centerComponent={{
                text: t('appName'),
                style: {
                    color: "white",
                    fontSize: 32,
                    fontWeight: "bold",
                    marginTop: 'auto',
                    marginBottom: 'auto',
                },
            }}
            centerContainerStyle={{}}
            containerStyle={{
                paddingTop: 30,
                paddingBottom: 12,
                borderBottomWidth: 0,
                maxWidth: 1000,
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
            }}
            leftContainerStyle={{}}
            linearGradientProps={{}}
            placement="left"
            rightComponent={<OAuthButton />}
            rightContainerStyle={{}}
            statusBarProps={{}}
        />
    );
}