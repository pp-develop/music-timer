import React from "react";
import { Text, Header as HeaderComponent } from "@rneui/base";
import { Image, View } from 'react-native';
import { LogoutButton } from "../../features/auth";
import { t } from '../../locales/i18n';
import { router, usePathname } from 'expo-router';
import { useTheme } from '../../config/ThemeContext';
import { useAuth } from "../../../src/hooks/useAuth";

export const Header = () => {
    const theme = useTheme()
    const pathname = usePathname()
    const { loading, isAuthenticated } = useAuth();

    const handleTitlePress = () => {
        router.replace('/');
    };

    const renderCenterComponent = () => (
        <Text
            onPress={pathname == '/playlist' ? undefined : () => handleTitlePress()}
            style={{
                color: theme.tertiary,
                fontSize: 38,
                fontWeight: "800",
                marginTop: 'auto',
                marginBottom: 'auto',
            }}
            numberOfLines={2} // テキストの最大行数を設定
            ellipsizeMode="tail" // 末尾を省略する
        >
            {t('appName')}
        </Text>
    );
    return (
        <>
            {!loading && (
                <>
                    {
                        isAuthenticated ? (
                            <>
                                <HeaderComponent
                                    backgroundColor={theme.primaryColor}
                                    backgroundImageStyle={{
                                        backgroundColor: theme.primaryColor
                                    }}
                                    barStyle="default"
                                    centerComponent={
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Image
                                                source={require('../../../assets/icon.png')}
                                                style={{ width: 50, height: 50, marginRight: 10 }}
                                            />
                                            <Text
                                                onPress={pathname == '/playlist' ? undefined : () => handleTitlePress()}
                                                style={{
                                                    color: theme.tertiary,
                                                    fontSize: 18,
                                                    fontWeight: "600",
                                                    marginTop: 'auto',
                                                    marginBottom: 'auto',
                                                }}
                                                numberOfLines={2} // テキストの最大行数を設定
                                                ellipsizeMode="tail" // 末尾を省略する
                                            >
                                                {t('appName')}
                                            </Text>
                                        </View>
                                    }
                                    centerContainerStyle={{}}
                                    containerStyle={{
                                        paddingTop: 40,
                                        borderBottomWidth: 0,
                                        maxWidth: 600,
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        // width: '100%'
                                    }}
                                    placement="left"
                                    rightComponent={<LogoutButton />}
                                    rightContainerStyle={{
                                        justifyContent: 'center'
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <HeaderComponent
                                    backgroundColor={theme.primaryColor}
                                    backgroundImageStyle={{
                                        backgroundColor: theme.primaryColor
                                    }}
                                    barStyle="default"
                                    centerComponent={renderCenterComponent()}
                                    centerContainerStyle={{}}
                                    containerStyle={{
                                        paddingTop: 40,
                                        paddingBottom: 12,
                                        borderBottomWidth: 0,
                                        maxWidth: 600,
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        // width: '100%'
                                    }}
                                    leftComponent={
                                        <View style={{
                                        }}>
                                            <Image
                                                source={require('../../../assets/icon.png')}
                                                style={{ width: 50, height: 50, marginRight: 0 }}
                                            />
                                        </View>
                                    }
                                    leftContainerStyle={{
                                        justifyContent: 'center'
                                    }}
                                    placement="left"
                                />
                            </>
                        )}
                </>
            )}
        </>

    );
}