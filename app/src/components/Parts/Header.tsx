import React from "react";
import { Header as HeaderComponent } from "@rneui/base";
import { OAuthButton } from "../../features/auth/";

export const Header = () => {
    return (
        <HeaderComponent
            backgroundColor="black"
            backgroundImageStyle={{
                backgroundColor: "black"
            }}
            barStyle="default"
            centerComponent={{
                text: "Specify",
                style: {
                    color: "white",
                    fontSize: 35,
                    fontWeight: "bold"
                },
            }}
            centerContainerStyle={{}}
            containerStyle={{
                paddingTop: 30,
                paddingBottom: 12,
                paddingRight: 32,
                paddingLeft: 32,
                borderBottomWidth: 0,
                maxWidth: 1280,
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