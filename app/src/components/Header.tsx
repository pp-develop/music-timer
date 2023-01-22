import React from "react";
import { Header as HeaderComponent } from "@rneui/base";
import { OAuthButton } from "./OAuthButton";

export const Header = () => {
    return (
        <HeaderComponent
            backgroundColor="black"
            backgroundImageStyle={{}}
            barStyle="default"
            centerComponent={{
                text: "Specify",
                style: {
                    color: "white",
                    fontSize: 30,
                    fontWeight: "bold"
                },
            }}
            centerContainerStyle={{}}
            containerStyle={{
                paddingTop: 12,
                paddingBottom: 12,
                paddingRight: 32,
                paddingLeft: 32,
                borderBottomWidth: 0
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