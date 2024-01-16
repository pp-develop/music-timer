import React from "react";
import { Header as HeaderComponent } from "@rneui/base";
import { LogoutButton } from "../../features/auth";
import { t } from '../../locales/i18n';
import { router, usePathname } from 'expo-router';

export const Header = () => {
    const handleTitlePress = () => {
        router.replace('/');
    };
    return (
        <HeaderComponent
            backgroundColor="#D7E6EF"
            backgroundImageStyle={{
                backgroundColor: "#D7E6EF"
            }}
            barStyle="default"
            centerComponent={{
                text: t('appName'),
                style: {
                    color: "#454C50",
                    fontSize: 38,
                    fontWeight: "800",
                    marginTop: 'auto',
                    marginBottom: 'auto',
                },
                onPress: usePathname() == '/playlist' ? undefined : () => handleTitlePress()
            }
            }
            centerContainerStyle={{}}
            containerStyle={{
                paddingTop: 40,
                paddingBottom: 12,
                borderBottomWidth: 0,
                maxWidth: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
            }}
            leftContainerStyle={{}}
            linearGradientProps={{}}
            placement="left"
            rightComponent={<LogoutButton />}
            rightContainerStyle={{
                justifyContent: 'center'
            }}
            statusBarProps={{}}
        />
    );
}